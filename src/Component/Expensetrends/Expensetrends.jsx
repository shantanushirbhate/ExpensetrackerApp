import React from "react";
import "../../Component/Expensetrends/Expensetrends.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function ExpenseTrends({ expenses }) {
  // Group by category
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.category === expense.category);
    if (existing) {
      existing.amount += Number(expense.amount);
    } else {
      acc.push({
        category: expense.category,
        amount: Number(expense.amount),
      });
    }
    return acc;
  }, []);

  // Category colors
  const colors = [
    "#FF6B6B",
    "#FFD93D",
    "#6BCB77",
    "#4D96FF",
    "#FF8C00",
    "#A66DD4",
    "#00C9A7",
  ];

  return (
    <div className="expense-trends-container">
      <h2>Spending by Category</h2>

      {categoryData.length === 0 ? (
        <p className="no-data">No expenses added yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={categoryData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" width={100} />
            <Tooltip />
            <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpenseTrends;
