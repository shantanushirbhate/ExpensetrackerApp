import "./Header.css";
import { Pie, PieChart, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import ExpenseForm from "../../Component/Expensetable/Expensetable";
import ExpenseList from "../../Component/Expenselistcomponent/Expenselist";

Modal.setAppElement("#root");

function Header() {
  // Load data from localStorage if available
  const [balance, setBalance] = useState(() => {
    return Number(localStorage.getItem("balance")) || 5000;
  });
  const [expense, setExpense] = useState(() => {
    return Number(localStorage.getItem("expense")) || 0;
  });
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [amount, setAmount] = useState("");
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Persist to localStorage whenever balance changes
  useEffect(() => {
    localStorage.setItem("balance", balance);
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("expense", expense);
  }, [expense]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // Add income
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

  // Save (add or update) expense
  const handleExpenseSave = (data) => {
    const value = Number(data.amount);

    if (value <= 0) {
      alert("Please enter a valid amount!");
      return;
    }

    if (editIndex !== null) {
      // Edit mode
      const updated = [...expenses];
      const oldExpense = updated[editIndex];
      const diff = value - oldExpense.amount;

      if (diff > balance) {
        alert("You cannot exceed your wallet balance!");
        return;
      }

      updated[editIndex] = data;
      setExpenses(updated);
      setExpense(updated.reduce((sum, e) => sum + e.amount, 0));
      setBalance(balance - diff);
      setEditIndex(null);
    } else {
      // Add mode
      if (value > balance) {
        alert("You cannot spend more than your wallet balance!");
        return;
      }

      setExpenses([...expenses, data]);
      setExpense(expense + value);
      setBalance(balance - value);
    }

    setIsExpenseModalOpen(false);
  };

  // Edit expense
  // const handleEditExpense = (exp, index) => {
  //   setEditIndex(index);
  //   setIsExpenseModalOpen(true);
  // };

  // Delete expense
  const handleDeleteExpense = (index) => {
    const deleted = expenses[index];
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
    setExpense(updatedExpenses.reduce((sum, e) => sum + e.amount, 0));
    setBalance(balance + deleted.amount);
  };

  return (
    <div className="blackbackground">
      <h1 style={{ color: "white", textAlign: "center" }}>Expense Tracker</h1>

      <div className="greybackground">
        {/* Wallet Balance */}
        <div className="lightgreybrackground">
          <p>Wallet Balance: ₹{balance}</p>
          <button className="incomebutton" onClick={() => setIsIncomeModalOpen(true)}>
            + Add Balance
          </button>
        </div>

        {/* Expense */}
        <div className="lightgreybrackground">
          <p>Expense: ₹{expense}</p>
          <button className="expense-button" onClick={() => setIsExpenseModalOpen(true)}>
            + Add Expense
          </button>
        </div>

        {/* Pie Chart */}
        <div className="piechart">
          <PieChart width={350} height={300}>
            <Pie
              data={[
                { name: "Balance", value: balance, fill: "#82ca9d" },
                ...expenses.reduce((acc, exp) => {
                  const existing = acc.find((item) => item.name === exp.category);
                  if (existing) existing.value += exp.amount;
                  else {
                    let color;
                    switch (exp.category) {
                      case "Food":
                        color = "#f4a261";
                        break;
                      case "Transport":
                        color = "#2a9d8f";
                        break;
                      case "Shopping":
                        color = "#e76f51";
                        break;
                      case "Entertainment":
                        color = "#f4d35e";
                        break;
                      case "Health":
                        color = "#8ac926";
                        break;
                      case "Bills":
                        color = "#264653";
                        break;
                      default:
                        color = "#6c757d";
                    }
                    acc.push({ name: exp.category, value: exp.amount, fill: color });
                  }
                  return acc;
                }, []),
              ]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            />
            <Tooltip />
          </PieChart>

          {/* Dynamic Legend */}
          <div className="chart-legend">
            {expenses
              .reduce((acc, e) => {
                if (!acc.find((item) => item.name === e.category))
                  acc.push({ name: e.category, color: e.category });
                return acc;
              }, [])
              .map((item) => {
                let color;
                switch (item.name) {
                  case "Food":
                    color = "#f4a261";
                    break;
                  case "Transport":
                    color = "#2a9d8f";
                    break;
                  case "Shopping":
                    color = "#e76f51";
                    break;
                  case "Entertainment":
                    color = "#f4d35e";
                    break;
                  case "Health":
                    color = "#8ac926";
                    break;
                  case "Bills":
                    color = "#264653";
                    break;
                  default:
                    color = "#6c757d";
                }
                return (
                  <p key={item.name}>
                    <span style={{ color }}>{`●`}</span> {item.name}
                  </p>
                );
              })}
          </div>
        </div>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses} // pass setter to persist edits
        onDelete={handleDeleteExpense}
      />

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onRequestClose={() => setIsIncomeModalOpen(false)}
        className="modal"
        shouldCloseOnOverlayClick={true}
      >
        <h2>Add Balance</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter income amount"
        />
        <div className="modal-buttons">
          <button className="pop-button" onClick={handleAddIncome}>
            Add
          </button>
          <button className="pop-button" onClick={() => setIsIncomeModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onRequestClose={() => setIsExpenseModalOpen(false)}
        className="modal"
        shouldCloseOnOverlayClick={true}
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
