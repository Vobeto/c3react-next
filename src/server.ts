import express from 'express';
import path from 'path';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

const app = express();
app.use(express.json());

// Servir a pasta 'public' como frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Rota raiz
//app.get('/', (req, res) => {
// res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
//});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


app.get('/', (req, res) => {
  res.json({ message: '🚀 API do Pedro rodando com sucesso!' });
});
