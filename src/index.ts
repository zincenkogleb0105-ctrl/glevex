import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());

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

// Оставляем только выдачу данных для фронтенда
app.get('/api/games', (req: Request, res: Response) => {
  res.json(gamesData);
});

export default app;
