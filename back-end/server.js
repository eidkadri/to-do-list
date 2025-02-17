const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb://localhost:27017/todo-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// إنشاء نموذج (Model) للمهام
const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);

// إنشاء API لإضافة مهمة جديدة
app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  const newTodo = new Todo({ task, completed: false });
  await newTodo.save();
  res.json(newTodo);
});

// إنشاء API لاسترجاع جميع المهام
app.get('/api/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// تشغيل الخادم على المنفذ 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});