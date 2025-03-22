import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('p3');
  const [reminder, setReminder] = useState('');
  const [editTodo, setEditTodo] = useState(null);

  // استرجاع المهام من الخادم
  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then(response => setTodos(response.data))
      .catch(error => console.error(error));
  }, []);

  // إضافة مهمة جديدة
  const addTodo = () => {
    if (editTodo) {
      // تعديل المهمة
      axios.put(`http://localhost:5000/api/todos/${editTodo._id}`, { task, dueDate, priority, reminder })
        .then(response => {
          setTodos(todos.map(todo => todo._id === editTodo._id ? response.data : todo));
          setEditTodo(null);
        })
        .catch(error => console.error(error));
    } else {
      // إضافة مهمة جديدة
      axios.post('http://localhost:5000/api/todos', { task, dueDate, priority, reminder })
        .then(response => setTodos([...todos, response.data]))
        .catch(error => console.error(error));
    }
    setTask('');
    setDueDate('');
    setPriority('p3');
    setReminder('');
  };

  // حذف مهمة
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo._id !== id)))
      .catch(error => console.error(error));
  };

  // تعديل مهمة
  const startEdit = (todo) => {
    setEditTodo(todo);
    setTask(todo.task);
    setDueDate(todo.dueDate);
    setPriority(todo.priority);
    setReminder(todo.reminder);
  };

  // الحصول على تاريخ اليوم
  const today = new Date().toLocaleDateString();

  return (
    <div className="App">
      <div className="header">
        <h1>my-task</h1>
        <p>{today}</p>
      </div>
      <div className="task-form">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="Due Date"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="p1">Priority 1</option>
          <option value="p2">Priority 2</option>
          <option value="p3">Priority 3</option>
        </select>
        <input
          type="datetime-local"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          placeholder="Reminder"
        />
        <button onClick={addTodo}>{editTodo ? 'Update Task' : 'Add Task'}</button>
      </div>
      <div className="task-list">
        {todos.map(todo => (
          <div key={todo._id} className="task-item">
            <span>{todo.task}</span>
            <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
            <span>Priority: {todo.priority}</span>
            <span>Reminder: {new Date(todo.reminder).toLocaleString()}</span>
            <div className="task-actions">
              <button onClick={() => startEdit(todo)}>Edit</button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;