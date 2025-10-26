import React, { useState } from "react";
import "../../Component/Expenselistcomponent/Expenselist.css";
import Modal from "react-modal";
import ExpenseTrends from "../../Component/Expensetrends/Expensetrends";
import {
  MdEdit,
  MdDelete,
  MdFastfood,
  MdDirectionsCar,
  MdShoppingCart,
  MdMovie,
  MdHealthAndSafety,
  MdReceipt,
  MdCategory,
} from "react-icons/md";

Modal.setAppElement("#root");

function ExpenseList({ expenses, setExpenses, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(expenses.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = expenses.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) setCurrentPage(currentPage - 1);
    if (direction === "next" && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const categoryIcons = {
    Food: <MdFastfood color="#f4a261" />,
    Transport: <MdDirectionsCar color="#2a9d8f" />,
    Shopping: <MdShoppingCart color="#e76f51" />,
    Entertainment: <MdMovie color="#f4d35e" />,
    Health: <MdHealthAndSafety color="#8ac926" />,
    Bills: <MdReceipt color="#264653" />,
    Other: <MdCategory color="#6c757d" />,
  };

  // Open Edit Modal
  const handleEditClick = (expenseId) => {
    const existingExpense = expenses.find((e) => e.id === expenseId);
    if (existingExpense) {
      setEditExpense({ ...existingExpense });
      setIsEditModalOpen(true);
    }
  };

  // Save Edited Expense dynamically
  const handleSaveEdit = () => {
    if (
      !editExpense.title ||
      !editExpense.amount ||
      !editExpense.category ||
      !editExpense.date
    ) {
      alert("Please fill all fields before saving!");
      return;
    }

    const updatedExpenses = expenses.map((exp) =>
      exp.id === editExpense.id ? editExpense : exp
    );

    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setIsEditModalOpen(false);
  };

  return (
    <div className="dashboard-container">
      <div className="expense-list-container">
        <h2 className="expense-title">Expense List</h2>

        {currentExpenses.length === 0 ? (
          <p className="no-expenses">No expenses yet</p>
        ) : (
          currentExpenses.map((expense) => (
            <div className="expense-item" key={expense.id}>
              <div className="expense-info">
                <span className="expense-title-text">{expense.title}</span>
                <span className="expense-date">{expense.date}</span>
              </div>

              <div className="expense-right">
                <span className="expense-amount">₹{expense.amount}</span>
                <span className="expense-category-icon">
                  {categoryIcons[expense.category] || categoryIcons["Other"]}
                </span>
                <button className="edit-btn" onClick={() => handleEditClick(expense.id)}>
                  <MdEdit size={20} />
                </button>
                <button className="delete-btn" onClick={() => onDelete(expense.id)}>
                  <MdDelete size={20} />
                </button>
              </div>
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => handlePageChange("prev")} disabled={currentPage === 1}>
              Previous
            </button>
            <span className="page-label">Page {currentPage}</span>
            <button onClick={() => handlePageChange("next")} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}
      </div>

      <div className="expense-chart-container">
        <ExpenseTrends expenses={expenses} />
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="modal"
        shouldCloseOnOverlayClick={true}
      >
        <h2>Edit Expense</h2>
        {editExpense && (
          <div className="modal-content">
            <label>Title</label>
            <input
              type="text"
              value={editExpense.title}
              onChange={(e) => setEditExpense({ ...editExpense, title: e.target.value })}
            />

            <label>Amount</label>
            <input
              type="number"
              value={editExpense.amount}
              onChange={(e) =>
                setEditExpense({ ...editExpense, amount: Number(e.target.value) })
              }
            />

            <label>Category</label>
            <select
              value={editExpense.category}
              onChange={(e) => setEditExpense({ ...editExpense, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </select>

            <label>Date</label>
            <input
              type="date"
              value={editExpense.date}
              onChange={(e) => setEditExpense({ ...editExpense, date: e.target.value })}
            />
          </div>
        )}

        <div className="modal-buttons">
          <button className="pop-button" onClick={handleSaveEdit}>
            Save
          </button>
          <button className="pop-button" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ExpenseList;
