# 📊 FinMaster - Financial Insights Dashboard

FinMaster is an interactive web-based financial dashboard designed for Small and Medium Enterprises (SMEs) to visualize, analyze, and forecast key business metrics. It enables business owners to make data-driven decisions by simplifying complex financial data into intuitive visualizations and actionable insights.

---

## 🌟 Features

- Upload and process financial datasets (CSV format)
- Dynamic visualizations for revenue, expenses, and profit
- Product and customer performance dashboards
- Revenue forecasting using regression
- Business Intelligence suggestions for strategic decisions
- Download-ready dashboards and report generation

---

## 📸 Screenshots

### 🏠 Home Dashboard
_Overall business health through various KPIs and trends._

![Home Dashboard](./assets/dashboard_home.png)

### 📦 Product & Transaction Insights
_Top products, category analysis, and significant transactions._

![Product Dashboard](./assets/product_transaction.png)

### 👥 Customer Insights
_Customer segmentation, LTV, purchase frequency, and recency._

![Customer Insights](./assets/cutomer_insights.png)

### 📈 Revenue Forecasting
_Predict future revenue trends using regression analysis._

![Revenue Forecast](./assets/revenue_forecasting.png)

### 🧠 Business Intelligence Suggestions
_AI-generated strategic tips based on processed financial data._

![Suggestions Tab](./assets/business_suggestions.png)

---

## 🛠️ Tech Stack

| Frontend          | Backend        | ML/Analytics     | Deployment       |
|-------------------|----------------|------------------|------------------|
| HTML/CSS/Bootstrap| Flask (Python) | Pandas, NumPy, Matplotlib, Seaborn, regression.js | Render          |

---

## 🧪 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/finmaster-dashboard.git
cd finmaster-dashboard

# Create and activate virtual environment
conda create --name finmaster python=3.9
conda activate finmaster

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
