import express, { Request, Response } from 'express';
import path from 'path';
const app = express();

app.use(express.json());

// Открываем доступ к папке public, чтобы загружался наш красивый HTML
app.use(express.static(path.join(__dirname, '../public')));

interface Game {
  id: number;
  title: string;
  rating: string;
  online: string;
  icon: string;
}

const gamesData: Game[] = [
  { id: 1, title: "Mega Obby 1000+", rating: "92%", online: "12.4K", icon: "🧗‍♂️" },
  { id: 2, title: "Adopt Me! Clone", rating: "88%", online: "25.1K", icon: "🐶" },
  { id: 3, title: "Murder Mystery X", rating: "95%", online: "8.7K", icon: "🔪" },
  { id: 4, title: "Tycoon Simulator", rating: "84%", online: "5.2K", icon: "🏗️" },
  { id: 5, title: "Hide and Seek Extreme", rating: "90%", online: "3.9K", icon: "🙈" },
  { id: 6, title: "Speed Run 5", rating: "91%", online: "7.1K", icon: "⚡" }
];

// Главная страница теперь просто отдает созданный HTML-файл
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API эндпоинт, откуда фронтенд забирает данные об играх
app.get('/api/games', (req: Request, res: Response) => {
  res.json(gamesData);
});

export default app;
