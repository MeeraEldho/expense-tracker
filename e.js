// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalExpense = document.getElementById('totalExpense');
const categoryFilter = document.getElementById('categoryFilter');
const resetFilter = document.getElementById('resetFilter');
const themeSwitcher = document.getElementById('themeSwitcher');
const ctx = document.getElementById('expenseChart').getContext('2d');

let expenses = [];
let expenseChart;
let darkMode = false;

// Handle Form Submission
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('expenseName').value;
  const amount = parseFloat(document.getElementById('expenseAmount').value);
  const category = document.getElementById('expenseCategory').value;

  if (!name || isNaN(amount) || !category) return;

  const expense = { name, amount, category, date: new Date() };
  expenses.push(expense);

  updateExpenseList();
  updateTotalExpense();
  updateChart();

  expenseForm.reset();
});

// Update Expense List
function updateExpenseList() {
  expenseList.innerHTML = '';
  const filteredExpenses = expenses.filter(expense => {
    return categoryFilter.value === 'All' || expense.category === categoryFilter.value;
  });

  filteredExpenses.forEach((expense, index) => {
    const expenseItem = document.createElement('div');
    expenseItem.className = 'expense-item';
    expenseItem.innerHTML = `
      <span>${expense.name} (${expense.category})</span>
      <span>$${expense.amount.toFixed(2)}</span>
      <button class="edit-btn" onclick="editExpense(${index})">Edit</button>
      <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
    `;
    expenseList.appendChild(expenseItem);
  });
}

// Update Total Expense
function updateTotalExpense() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpense.textContent = `Total: $${total.toFixed(2)}`;
}

// Delete Expense
function deleteExpense(index) {
  expenses.splice(index, 1);
  updateExpenseList();
  updateTotalExpense();
  updateChart();
}

// Edit Expense
function editExpense(index) {
  const expense = expenses[index];
  document.getElementById('expenseName').value = expense.name;
  document.getElementById('expenseAmount').value = expense.amount;
  document.getElementById('expenseCategory').value = expense.category;

  // Remove the expense from the list before editing
  deleteExpense(index);
}

// Initialize and Update Chart
function updateChart() {
  if (expenseChart) expenseChart.destroy();

  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  expenseChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff']
      }]
    }
  });
}

// Theme Switcher
themeSwitcher.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
});

// Filter Reset
resetFilter.addEventListener('click', () => {
  categoryFilter.value = 'All';
  updateExpenseList();
});
