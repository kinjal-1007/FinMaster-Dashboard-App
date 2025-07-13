from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json

app = Flask(__name__)
CORS(app)

# Create folder for file uploads if it doesn't exist
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def format_currency(value):
    """ Format number as currency with $ symbol and commas. """
    return f"${value:.2f}"

@app.route('/upload', methods=['POST'])
def upload_file():
    print("=== Starting File Upload Process ===")
    
    # Check if the file part exists in the request
    if 'file' not in request.files:
        print("ERROR: No file part in the request.")
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    year = request.form.get('year')
    category_expenses = json.loads(request.form.get('categoryExpenses', '{}'))

    if not file or not year:
        print("ERROR: File and year are required.")
        return jsonify({"error": "File and year are required"}), 400

    # Save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    print(f"File saved at: {file_path}")

    # Debug: Check file contents
    print("=== File Content Preview ===")
    with open(file_path, 'r') as f:
        print(f.read(500))  # Read first 500 characters to confirm content

    # Read CSV with error handling
    try:
        df = pd.read_csv(file_path, encoding="utf-8")
        
    except Exception as e:
        print(f"ERROR: Could not read CSV file: {str(e)}")
        return jsonify({"error": "Could not read CSV file", "message": str(e)}), 500

    print("=== CSV Loaded Successfully ===")
    
    # Required columns check
    required_columns = ["Order Date", "Ship Date", "Quantity", "Price", "Cost", "Profit", "Product ID", "Order ID", "Customer ID", "Customer Name", "State"]
    missing_columns = [col for col in required_columns if col not in df.columns]
    
    if missing_columns:
        print(f"ERROR: Missing columns: {missing_columns}")
        return jsonify({"error": f"Missing columns: {missing_columns}"}), 400

    # Parse dates safely
    print("=== Parsing Dates ===")
    try:
        df["date"] = pd.to_datetime(df["Order Date"])
        df["Ship Date"] = pd.to_datetime(df["Ship Date"])
    except Exception as e:
        print(f"ERROR: Date parsing failed: {str(e)}")
        return jsonify({"error": "Date parsing failed", "message": str(e)}), 500

    if df["date"].isnull().all():
        print("ERROR: All dates failed to parse. Check date format.")
        return jsonify({"error": "Date parsing error. All dates are NaT."}), 500

    df_full=df.copy()

    # Filter data for the specified year
    print(f"=== Filtering data for the year: {year} ===")
    df = df[df["date"].dt.year == int(year)]

    prev_year = int(year) - 1
    df_prev = df_full[df_full["date"].dt.year == prev_year]
    # Calculate total revenue, expense, and profit
    print("=== Calculating KPIs ===")
    try:
        total_revenue = (df["Quantity"] * df["Price"]).sum()
        total_expense = (df["Quantity"] * df["Cost"]).sum()
        total_profit = (df["Quantity"] * df["Profit"]).sum()
    except KeyError as e:
        print(f"ERROR: Calculation failed. Missing column: {str(e)}")
        return jsonify({"error": f"Missing column for calculation: {str(e)}"}), 500

    # Calculate total revenue for previous year
    print("=== Calculating KPIs for previous year ===")
    try:
        total_revenue_prev = (df_prev["Quantity"] * df_prev["Price"]).sum()
    except KeyError as e:
        print(f"ERROR: Calculation failed for previous year. Missing column: {str(e)}")
        return jsonify({"error": f"Missing column for prev year calculation: {str(e)}"}), 500

    # Calculate YoY Revenue Growth
    if total_revenue_prev > 0:
        yoy_revenue_growth = ((total_revenue - total_revenue_prev) / total_revenue_prev) * 100
    else:
        yoy_revenue_growth = None
    # Sum category expenses
    print("=== Calculating Category Expenses ===")
    category_expenses_total = sum(int(value.replace("$", "")) for value in category_expenses.values())
    total_expense += category_expenses_total

    # Monthly summary
    print("=== Generating Monthly Summary ===")
    df["month"] = df["date"].dt.strftime("%B-%y")
    df["month_sort"] = df["date"].dt.strftime("%Y-%m")
    
    monthly_data = df.groupby("month").agg(
        revenue=("Price", lambda x: round((x * df.loc[x.index, "Quantity"]).sum(), 2)),
        expenses=("Cost", lambda x: round((x * df.loc[x.index, "Quantity"]).sum(), 2)),
        profit=("Profit", lambda x: round((x * df.loc[x.index, "Quantity"]).sum(), 2))
    ).reset_index()

    monthly_data = monthly_data.merge(df[["month", "month_sort"]].drop_duplicates(), on="month")
    monthly_data = monthly_data.sort_values(by="month_sort").drop(columns=["month_sort"])

    # Daily summary
    print("=== Generating Daily Summary ===")
    daily_data = df.groupby(df["date"].dt.strftime("%Y-%m-%d")).agg(
        revenue=("Price", lambda x: round((x * df.loc[x.index, "Quantity"]).sum(), 2)),
        expenses=("Cost", lambda x: round((x * df.loc[x.index, "Quantity"]).sum(), 2)),
        profit=("Profit", lambda x: round((x * df.loc[x.index, "Quantity"]).sum(), 2))
    ).reset_index()
    daily_data = daily_data.sort_values(by="date")

    # KPI JSON
    kpi_data = [{
        "year": int(year),
        "totalProfit": round(total_profit,2),
        "totalRevenue": round(total_revenue,2),
        "totalExpenses": round(total_expense, 2),
        "monthlyData": monthly_data.to_dict(orient="records"),
        "dailyData": daily_data.to_dict(orient="records"),
        "expensesByCategory": category_expenses,
        "yoyRevenueGrowth": f"{yoy_revenue_growth:.2f}%" if yoy_revenue_growth is not None else "N/A",
    }]

    # Products JSON
    print("=== Generating Product Data ===")
    products_data = df.groupby("Product ID").agg(
        price=("Price", "first"),
        expense=("Cost", "first"),
        totalQuantity=("Quantity", "sum"),
        product_name=("Product Name", "first"),
        category=("Category", "first"),
        sub_category=("Sub-Category", "first"),
        transactions=("Order ID", list),
    ).reset_index()

    products_data["totalSales"] = products_data["totalQuantity"] * products_data["price"]
    products_data["price"] = products_data["price"].apply(format_currency)
    products_data["expense"] = products_data["expense"].apply(format_currency)
    products_data["totalSales"] = products_data["totalSales"].apply(format_currency)
    products_data = products_data.rename(columns={"Product ID": "id"}).copy()
    products_data = products_data.to_dict(orient="records")

    # Transactions JSON
    print("=== Generating Transaction Data ===")
    transactions_data = df.groupby("Order ID").agg(
        transaction_date=("date", "first"),
        customer_id=("Customer ID", "first"),
        buyer_name=("Customer Name", "first"),
        amount=("Quantity", lambda x: (x * df.loc[x.index, "Price"]).sum()),
        productIds=("Product ID", list)
    ).reset_index()
    transactions_data = transactions_data.rename(columns={"Order ID": "id"})
    transactions_data["transaction_date"] = transactions_data["transaction_date"].astype(str)
    transactions_data["amount"] = transactions_data["amount"].apply(format_currency)
    transactions_data = transactions_data.to_dict(orient="records")

    # State revenue
    print("=== Calculating State Revenue ===")
    df["Revenue"] = df["Quantity"] * df["Price"]
    state_revenue_data = df.groupby("State")["Revenue"].sum().reset_index()
    state_revenue_data["Revenue"] = state_revenue_data["Revenue"].apply(lambda x: format_currency(x))
    state_revenue_data = state_revenue_data.sort_values(by="Revenue", ascending=False).to_dict(orient="records")


    # customer data
    print("=== Generating Customer Analysis ===")
    customer_data = df.groupby("Customer ID").agg(
        customer_name=("Customer Name", "first"),
        segment=("Segment", "first"),
        region=("State", "first"),
        last_purchase=("date", "max"),
        purchase_frequency=("Order ID", "nunique"),
        revenue_generated=("Sales", "sum"),
        average_order_value=("Sales", "mean"),
        product_ids=("Product ID", list)
    ).reset_index()

    customer_data["last_purchase"] = customer_data["last_purchase"].astype(str)
    customer_data["revenue_generated"] = customer_data["revenue_generated"].apply(format_currency)
    customer_data["average_order_value"] = customer_data["average_order_value"].apply(format_currency)

    # Convert to dictionary for JSON response
    customer_data = customer_data.rename(columns={"Customer ID": "id"}).to_dict(orient="records")

    print("=== Generating Suggestions ===")

    suggestions = []

    def safe_divide(numerator, denominator):
        return numerator / denominator if denominator != 0 else 0

    # 1. Profit Margin
    try:
        profit_margin = safe_divide(total_profit, total_revenue)

        if profit_margin > 0.3:
            suggestions.append({
                "type": "profit_margin",
                "title": "High Profit Margin",
                "description": f"Your profit margin is {profit_margin:.2%}. Consider reinvesting to expand operations or explore new markets."
            })
        elif profit_margin < 0.1:
            suggestions.append({
                "type": "profit_margin",
                "title": "Low Profit Margin",
                "description": f"Your profit margin is just {profit_margin:.2%}. Review pricing, cost, or focus on more profitable products."
            })
    except Exception as e:
        print("Error in Profit Margin Analysis:", e)

    # 2. Best/Worst Performing Categories
    try:
        category_profit = df.groupby("Category").apply(lambda x: (x["Profit"] * x["Quantity"]).sum()).sort_values()

        for cat in category_profit.head(1).index:
            suggestions.append({
                "type": "low_category",
                "title": f"Underperforming Category: {cat}",
                "description": f"{cat} has generated low profit. Investigate pricing, demand, or inventory issues."
            })

        for cat in category_profit.tail(1).index:
            suggestions.append({
                "type": "top_category",
                "title": f"Top Performing Category: {cat}",
                "description": f"{cat} category is performing well. Consider allocating more resources or marketing budget here."
            })
    except Exception as e:
        print("Error in Category Performance Analysis:", e)

    # 3. Delivery Time Analysis
    try:
        df["delivery_time"] = (df["Ship Date"] - df["date"]).dt.days
        avg_delivery_time = df["delivery_time"].mean()

        if avg_delivery_time > 6:
            suggestions.append({
                "type": "delivery",
                "title": "Slow Deliveries",
                "description": f"Average delivery time is {avg_delivery_time:.1f} days. Try optimizing logistics or changing shipping partners."
            })
        else:
            suggestions.append({
                "type": "delivery",
                "title": "Good Delivery Performance",
                "description": f"Average delivery time is {avg_delivery_time:.1f} days. Delivery performance is within acceptable range."
            })
    except Exception as e:
        print("Error in Delivery Time Analysis:", e)

    # 4. Top Customers
    try:
        top_customers = df.groupby("Customer Name").apply(lambda x: (x["Price"] * x["Quantity"]).sum()).sort_values(ascending=False).head(3)

        for customer, sales in top_customers.items():
            suggestions.append({
                "type": "top_customer",
                "title": f"Top Customer: {customer}",
                "description": f"{customer} contributed ${sales:,.2f} in sales. Consider rewarding their loyalty with exclusive deals."
            })
    except Exception as e:
        print("Error in Top Customers Analysis:", e)

    # 5. Customer Segments
    try:
        customer_stats = df.groupby("Customer Name").agg({
            "Quantity": "sum",
            "Price": lambda x: (x * df.loc[x.index, "Quantity"]).sum()
        }).rename(columns={"Price": "Total Revenue"})

        quantity_threshold = customer_stats["Quantity"].median()
        revenue_threshold = customer_stats["Total Revenue"].median()

        high_buyers_low_revenue = customer_stats[
            (customer_stats["Quantity"] > quantity_threshold) & 
            (customer_stats["Total Revenue"] < revenue_threshold)
        ].sort_values(by="Quantity", ascending=False).head(3)

        for customer in high_buyers_low_revenue.index:
            suggestions.append({
                "type": "high_buyers_low_revenue",
                "title": f"High Buyers, Low Revenue Customer: {customer}",
                "description": f"{customer} buys frequently but generates relatively low revenue. Consider upselling or personalized promotions."
            })

        low_buyers_high_revenue = customer_stats[
            (customer_stats["Quantity"] <= quantity_threshold) & 
            (customer_stats["Total Revenue"] >= revenue_threshold)
        ].sort_values(by="Total Revenue", ascending=False).head(3)

        for customer in low_buyers_high_revenue.index:
            suggestions.append({
                "type": "low_buyers_high_revenue",
                "title": f"Low Buyers, High Revenue Customer: {customer}",
                "description": f"{customer} buys infrequently but generates high revenue. Engage with premium offers or loyalty rewards."
            })
    except Exception as e:
        print("Error in Customer Segmentation:", e)

    # 6. State Performance
    try:
        state_profit = df.groupby("State").apply(lambda x: (x["Profit"] * x["Quantity"]).sum()).sort_values()
        best_state = state_profit.idxmax()
        worst_state = state_profit.idxmin()

        suggestions.append({
            "type": "top_state",
            "title": f"Top State: {best_state}",
            "description": f"{best_state} contributed the highest profit. Explore opportunities to scale in this region."
        })

        suggestions.append({
            "type": "low_state",
            "title": f"Underperforming State: {worst_state}",
            "description": f"{worst_state} yielded the lowest profit. Investigate causes or consider adjusting your strategy."
        })
    except Exception as e:
        print("Error in State Performance Analysis:", e)

    # 7. Products with High Sales but Low Profit
    try:
        product_stats = df.groupby("Product Name").agg({
            "Quantity": "sum",
            "Profit": lambda x: (x * df.loc[x.index, "Quantity"]).sum()
        })

        low_profit_but_high_sales = product_stats[
            (product_stats["Quantity"] > 10) & 
            (product_stats["Profit"] < 100)
        ].sort_values(by="Quantity", ascending=False).head(3)

        for product in low_profit_but_high_sales.index:
            suggestions.append({
                "type": "low_profit_high_sale",
                "title": f"Low Profit Product: {product}",
                "description": f"{product} is frequently sold but earns very low profit. Consider cost optimization or price adjustment."
            })
    except Exception as e:
        print("Error in Low Profit High Sales Analysis:", e)

    # 8. Seasonal Sales Trends
    try:
        monthly_sales = df.groupby("month_sort").apply(lambda x: (x["Price"] * x["Quantity"]).sum())

        if not monthly_sales.empty:
            peak_month = monthly_sales.idxmax()
            low_month = monthly_sales.idxmin()

            suggestions.append({
                "type": "peak_month",
                "title": f"Peak Sales Period: {peak_month}",
                "description": "Leverage this high-demand period with more advertising, offers or new launches."
            })
            suggestions.append({
                "type": "low_month",
                "title": f"Low Sales Period: {low_month}",
                "description": "Sales are slow during this period. You could offer discounts or run promotions to boost revenue."
            })
    except Exception as e:
        print("Error in Seasonal Sales Trends Analysis:", e)


    response = {
        "kpis": kpi_data,
        "transactions": transactions_data,
        "products": products_data,
        "stateRevenue": state_revenue_data,
        "customers": customer_data,
        "suggestions": suggestions
    }

    print("=== Upload Complete! ===")
    return jsonify(response)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)