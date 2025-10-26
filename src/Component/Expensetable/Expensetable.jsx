import React, { useState } from "react";
import "../../Component/Expensetable/Expensetable.css"

function ExpenseForm({ onSave, onCancel, balance }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Health",
    "Bills",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const value = Number(amount);
    if (!title || !category || !date || value <= 0) {
      alert("Please fill all fields with valid values!");
      return;
    }
    if (value > balance) {
      alert("You cannot spend more than your wallet balance!");
      return;
    }

    // Send data to parent (Header)
    onSave({ title, amount: value, category, date });

    // Reset fields
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Add/Edit Expense</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter expense title"
      />

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter expense amount"
      />
      <select className="selectoption" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select category</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="modal-buttons">
        <button type="submit" className="pop-button">
          Save
        </button>
        <button type="button" className="pop-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
