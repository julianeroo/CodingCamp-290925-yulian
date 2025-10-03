// js/script.js

// 1. Ambil Elemen DOM yang Dibutuhkan
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoTableBody = document.getElementById('todo-table-body');
const deleteAllButton = document.getElementById('delete-all-button');
const filterButton = document.getElementById('filter-button');

// Array untuk menyimpan data To-Do List
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filterMode = 'ALL'; // Mode filter default

// Fungsi untuk menyimpan data ke Local Storage
const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

// Fungsi untuk Menampilkan To-Do List (Fitur Wajib: Display To-Do List)
const renderTodos = () => {
    todoTableBody.innerHTML = ''; // Kosongkan tabel terlebih dahulu

    // Logika Filtering
    const filteredTodos = todos.filter(todo => {
        if (filterMode === 'ALL') return true;
        if (filterMode === 'COMPLETED') return todo.status === 'Completed';
        if (filterMode === 'PENDING') return todo.status === 'Pending';
        return true;
    });

    if (filteredTodos.length === 0) {
        // Tampilkan pesan 'No task found'
        const row = todoTableBody.insertRow();
        row.innerHTML = `<td colspan="4" class="no-task-found">No task found</td>`;
        return;
    }

    // Loop untuk menampilkan setiap task
    filteredTodos.forEach((todo, index) => {
        const row = todoTableBody.insertRow();
        row.classList.add(todo.status.toLowerCase()); // Tambahkan class untuk styling

        // Kolom TASK
        const taskCell = row.insertCell();
        taskCell.textContent = todo.task;

        // Kolom DUE DATE
        const dateCell = row.insertCell();
        dateCell.textContent = todo.dueDate;

        // Kolom STATUS
        const statusCell = row.insertCell();
        statusCell.textContent = todo.status;
        statusCell.style.color = todo.status === 'Completed' ? '#38c172' : '#f6993f'; // Warna status

        // Kolom ACTIONS (Fitur Wajib: Add/Delete/Filter - implementasi Delete per item di sini)
        const actionsCell = row.insertCell();
        actionsCell.classList.add('action-buttons');
        
        // Tombol Toggle Status (Tandai Selesai/Belum)
        const statusButton = document.createElement('button');
        statusButton.textContent = todo.status === 'Pending' ? 'Mark Done' : 'Undo Done';
        statusButton.onclick = () => toggleStatus(todo.id);
        
        // Tombol Delete Task
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.color = '#dc3545'; // Warna merah untuk Delete
        deleteButton.onclick = () => deleteTodo(todo.id);

        actionsCell.appendChild(statusButton);
        actionsCell.appendChild(deleteButton);
    });
};

// Fungsi untuk Validasi Input Form (Fitur Wajib)
const validateInput = (task, date) => {
    if (task.trim() === '') {
        alert('Task description cannot be empty!');
        return false;
    }
    // Validasi Tanggal: pastikan tanggal tidak kurang dari hari ini
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
        alert('Due date cannot be in the past!');
        return false;
    }
    return true;
};

// Fungsi untuk Menambah To-Do (Fitur Wajib: Add)
const addTodo = (e) => {
    e.preventDefault();

    const task = todoInput.value.trim();
    const dueDate = dateInput.value;

    // Lakukan Validasi
    if (!validateInput(task, dueDate)) {
        return;
    }

    // Buat objek To-Do baru
    const newTodo = {
        id: Date.now(), // ID unik
        task,
        dueDate,
        status: 'Pending' // Status default
    };

    // Tambahkan ke array dan simpan
    todos.push(newTodo);
    saveTodos();

    // Reset formulir dan update tampilan
    todoInput.value = '';
    dateInput.value = '';
    renderTodos();
};

// Fungsi untuk Menghapus To-Do per item
const deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
};

// Fungsi untuk Toggle Status
const toggleStatus = (id) => {
    todos = todos.map(todo => {
        if (todo.id === id) {
            todo.status = todo.status === 'Pending' ? 'Completed' : 'Pending';
        }
        return todo;
    });
    saveTodos();
    renderTodos();
};

// Fungsi untuk Menghapus Semua To-Do (Fitur Wajib: Delete)
const deleteAllTodos = () => {
    if (todos.length === 0) {
        alert("There are no tasks to delete.");
        return;
    }
    if (confirm('Are you sure you want to delete all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
};

// Fungsi untuk Mengubah Mode Filter (Fitur Wajib: Filter)
const toggleFilter = () => {
    if (filterMode === 'ALL') {
        filterMode = 'PENDING';
        filterButton.textContent = 'PENDING';
    } else if (filterMode === 'PENDING') {
        filterMode = 'COMPLETED';
        filterButton.textContent = 'COMPLETED';
    } else {
        filterMode = 'ALL';
        filterButton.textContent = 'FILTER'; // Kembali ke default
    }
    renderTodos();
};

// 2. Event Listeners
todoForm.addEventListener('submit', addTodo);
deleteAllButton.addEventListener('click', deleteAllTodos);
filterButton.addEventListener('click', toggleFilter);

// 3. Muat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderTodos);