import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../services/emailService';
import dotenv from 'dotenv';
import { IUserRequest } from '../Interfaces/userRequest';
import User from '../models/user';

dotenv.config();

const router = express.Router();

const verificationCodes: { [key: string]: { code: number; expires: number } } = {};
const generateVerificationCode = (): number => Math.floor(100000 + Math.random() * 900000);

router.post('/send-verification-code', async (req: IUserRequest, res: Response): Promise<void> => {
  const { email } = req.body;
  const verificationCode = generateVerificationCode();

  verificationCodes[email] = { code: verificationCode, expires: Date.now() + 10 * 60 * 1000 };

  try {
    await sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: 'Código de verificação enviado para o email' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ message: 'Erro ao enviar o código de verificação', error: (error as Error).message });
  }
});

router.post('/register', async (req: IUserRequest, res: Response): Promise<void> => {
  const { name, email, password, verificationCode } = req.body;

  
  if (!name || !email || !password || !verificationCode) {
    res.status(400).json({ message: 'Por favor, preencha todos os campos obrigatórios' });
    return;
  }

 
  const storedCode = verificationCodes[email];
  if (!storedCode || storedCode.code !== Number(verificationCode) || storedCode.expires < Date.now()) {
    res.status(400).json({ message: 'Código de verificação inválido ou expirado' });
    return;  
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    delete verificationCodes[email]; 
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

router.post('/login', async (req: IUserRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      res.status(401).json({ message: 'Usuário ou senha invalidos' });
      return;  
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('');
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login' });
  }
});

export default router;
