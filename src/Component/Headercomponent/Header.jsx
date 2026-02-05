import "../../Component/Headercomponent/Header.css";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import ExpenseForm from "../../Component/Expensetable/Expensetable";
import ExpenseList from "../../Component/Expenselistcomponent/Expenselist";

Modal.setAppElement("#root");

const DEFAULT_CATEGORIES = [
  { label: "Food", color: "#f4a261" },
  { label: "Entertainment", color: "#f4d35e" },
  { label: "Travel", color: "#2a9d8f" },
];

function Header() {
  useEffect(() => {
    localStorage.setItem("balance", 5000);
    localStorage.setItem("expense", 0);
    localStorage.setItem("expenses", JSON.stringify([]));

    setBalance(5000);
    setExpense(0);
    setExpenses([]);
  }, []);

 const [balance, setBalance] = useState(() =>
    Number(localStorage.getItem("balance")) || 5000
  );

  const [expense, setExpense] = useState(() =>
    Number(localStorage.getItem("expense")) || 0
  );

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [amount, setAmount] = useState("");
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

 useEffect(() => {
    localStorage.setItem("balance", balance);
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("expense", expense);
  }, [expense]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddIncome = () => {
    const value = Number(amount);
    if (value > 0) {
      setBalance(balance + value);
      setAmount("");
      setIsIncomeModalOpen(false);
    } else {
      alert("Please enter a valid income amount!");
    }
  };

  const handleExpenseSave = (data) => {
    const value = Number(data.amount);
    if (value <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    if (editIndex !== null) {
      const updated = [...expenses];
      const oldExpense = updated[editIndex];
      const diff = value - oldExpense.amount;

      if (diff > balance) {
        alert("You cannot exceed your wallet balance!");
        return;
      }

      updated[editIndex] = { ...data, id: oldExpense.id };
      setExpenses(updated);
      setExpense(updated.reduce((sum, e) => sum + e.amount, 0));
      setBalance(balance - diff);
      setEditIndex(null);
    } else {
      if (value > balance) {
        alert("You cannot spend more than your wallet balance!");
        return;
      }

      const newExpense = { ...data, id: Date.now() };
      setExpenses([...expenses, newExpense]);
      setExpense(expense + value);
      setBalance(balance - value);
    }

    setIsExpenseModalOpen(false);
  };

  const handleDeleteExpense = (id) => {
    const deletedExpense = expenses.find((e) => e.id === id);
    if (!deletedExpense) return;

    const updatedExpenses = expenses.filter((e) => e.id !== id);
    setExpenses(updatedExpenses);
    setExpense(updatedExpenses.reduce((sum, e) => sum + e.amount, 0));
    setBalance(balance + deletedExpense.amount);
  };

  // Pie chart data (used ONLY when expenses exist)
  const chartData = [
    {
      id: "balance",
      value: balance,
      label: "Balance",
      color: "#82ca9d",
    },
    ...expenses.reduce((acc, exp) => {
      const existing = acc.find((i) => i.label === exp.category);
      if (existing) {
        existing.value += exp.amount;
      } else {
        const color =
          DEFAULT_CATEGORIES.find((c) => c.label === exp.category)?.color ||
          "#6c757d";

        acc.push({
          id: exp.category,
          value: exp.amount,
          label: exp.category,
          color,
        });
      }
      return acc;
    }, []),
  ];

  const legendData =
    expenses.length > 0
      ? [...new Set(expenses.map((e) => e.category))].map((label) => ({
          label,
          color:
            DEFAULT_CATEGORIES.find((c) => c.label === label)?.color ||
            "#6c757d",
        }))
      : DEFAULT_CATEGORIES;

  return (
    <div className="blackbackground">
      <h1 style={{ color: "white", textAlign: "center" }}>
        Expense Tracker
      </h1>

      <div className="greybackground">
        <div className="lightgreybrackground">
          <p>Wallet Balance: ₹{balance}</p>
          <button
            type="submit"
            className="incomebutton"
            onClick={() => setIsIncomeModalOpen(true)}
          >
            + Add Income
          </button>
        </div>

        <div className="lightgreybrackground">
          <p>Expenses: ₹{expense}</p>
          <button
            className="expense-button"
            onClick={() => setIsExpenseModalOpen(true)}
          >
            + Add Expense
          </button>
        </div>

        {/* PieChart ONLY if expenses exist + Legend always */}
        <div className="piechart">
          {expenses.length > 0 && (
            <PieChart
              series={[
                {
                  data: chartData,
                  innerRadius: 20,
                  outerRadius: 75,
                },
              ]}
              width={205}
              height={200}
            />
          )}

          <div className="chart-legend">
            {legendData.map((item) => (
              <p key={item.label}>
                <span style={{ color: item.color }}>●</span> {item.label}
              </p>
            ))}
          </div>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses}
        balance={balance}
        setBalance={setBalance}
        expense={expense}
        setExpense={setExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onRequestClose={() => setIsIncomeModalOpen(false)}
        className="modal"
      >
        <h2>Add Balance</h2>
        <input
          className="addbalanceinput"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Income Amount"

        />
        <div className="modal-buttons">
          <button type="submit" className="pop-button" onClick={handleAddIncome}>
            Add Balance
          </button>
          <button
            className="pop-button"
            onClick={() => setIsIncomeModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onRequestClose={() => setIsExpenseModalOpen(false)}
        className="modal"
      >
        <ExpenseForm
          onSave={handleExpenseSave}
          editData={editIndex !== null ? expenses[editIndex] : null}
        />
      </Modal>
    </div>
  );
}

export default Header;
