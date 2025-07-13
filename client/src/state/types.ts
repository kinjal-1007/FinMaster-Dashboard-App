export interface ExpensesByCategory {
  salaries: number;
  supplies: number;
  services: number;
}

export interface Month {
  id: string;
  month: string;
  revenue: number;
  expenses: number;
  nonOperationalExpenses: number;
  operationalExpenses: number;
}

export interface Day {
  id: string;
  date: string;
  revenue: number;
  expenses: number;
}

export interface GetKpisResponse {
  id: string;
  _id: string;
  __v: number;
  year: number;
  yoyRevenueGrowth: string; // Year-over-year revenue growth percentage
  totalProfit: number;
  totalRevenue: number;
  totalExpenses: number;
  expensesByCategory: ExpensesByCategory;
  monthlyData: Array<Month>;
  dailyData: Array<Day>;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsResponse {
  id: string;
  _id: string;
  product_name: string;
  category: string;
  sub_category: string;
  price: number; // Stored in dollars after conversion
  expense: number; // Stored in dollars after conversion
  totalQuantity: number;
  totalSales: number; // ✅ No /100 needed, remains a decimal
  transactions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetTransactionsResponse {
  id: string;
  _id: string;
  __v: number;
  buyer: string;
  amount: number;
  productIds: Array<string>;
  createdAt: string;
  updatedAt: string;
}
export interface GetStateRevenueResponse {  
  state: string;
  totalRevenue: number;
}

export interface GetCustomersResponse {
  id: string;                         
  _id: string;                        
  __v: number;                        
  customer_name: string;              
  segment: string;                    
  region: string;                     
  last_purchase: string;              
  purchase_frequency: number;         
  revenue_generated: number;          
  average_order_value: number;
  estimated_ltv: number;        
  product_ids: Array<string>;         
  createdAt: string;                  
  updatedAt: string;                  
}

export interface GetSuggestionsResponse {
  id?: string;        // Optional in case it's generated later on the backend
  _id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}