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

const DEFAULT_CATEGORIES = [
  { category: "Food", amount: 0 },
  { category: "Entertainment", amount: 0 },
  { category: "Travel", amount: 0 },
];

const normalizeCategory = (category) => {
  if (category === "Transport") return "Travel";
  return category;
};

const getColor = (category) => {
  switch (category) {
    case "Food":
      return "#f4a261";
    case "Entertainment":
      return "#f4d35e";
    case "Travel":
      return "#2a9d8f";
    default:
      return "#6c757d";
  }
};

function ExpenseTrends({ expenses = [] }) {
  const categoryData =
    expenses.length > 0
      ? expenses.reduce((acc, expense) => {
          const normalizedCategory = normalizeCategory(expense.category);

          const existing = acc.find(
            (item) => item.category === normalizedCategory
          );

          if (existing) {
            existing.amount += Number(expense.amount);
          } else {
            acc.push({
              category: normalizedCategory,
              amount: Number(expense.amount),
            });
          }

          return acc;
        }, [])
      : DEFAULT_CATEGORIES;

  return (
    <div className="expense-trends-container">
      <ResponsiveContainer width="100%" height={150}>
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
                fill={getColor(entry.category)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseTrends;
