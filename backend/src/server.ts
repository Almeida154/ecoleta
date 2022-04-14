import express from 'express';

const app = express();

app.get('/users', (req, res) => {
  res.json(['Davod', 'Kauê cabeça de alicate', 'Paulo']);
});

app.listen(3333, () => console.log('🔥 Running'));
