const express = require('express');
const sequelize = require('./config/database');
const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Rodando ${PORT}`);
    });
  })
  .catch(err => console.error('Erro:', err));
