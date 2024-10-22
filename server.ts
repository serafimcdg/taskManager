import express, { Application } from 'express';
import sequelize from './config/database';
import userRoutes from './routes/user';
import taskRoutes from './routes/task';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false })
  .then(() => {
    app.listen(Number(PORT), () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Erro:', err));

export default app;
