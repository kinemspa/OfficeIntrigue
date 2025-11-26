import app from './server';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3978;

app.listen(port, () => {
  console.log(`🎮 Hidden Agenda running at http://localhost:${port}`);
  console.log(`📖 Mode: ${process.env.APP_MODE || 'web'}`);
  console.log(`🌐 Open your browser to start playing!`);
});
