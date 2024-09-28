const express = require('express');
const Task = require('../models/task');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Criar nova tarefa
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const task = await Task.create({ title, description, deadline, userId: req.userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
});

// Lista as tarefas do usuario
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar tarefa' });
  }
});

module.exports = router;
