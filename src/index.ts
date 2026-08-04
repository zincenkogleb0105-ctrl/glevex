import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());

// Описание структуры данных для игры
interface Game {
  id: number;
  title: string;
  rating: string;
  online: string;
  icon: string;
}

// Имитация базы данных популярных игр GLEVEX
const gamesData: Game[] = [
  { id: 1, title: "Mega Obby 1000+", rating: "92%", online: "12.4K", icon: "🧗‍♂️" },
  { id: 2, title: "Adopt Me! Clone", rating: "88%", online: "25.1K", icon: "🐶" },
  { id: 3, title: "Murder Mystery X", rating: "95%", online: "8.7K", icon: "🔪" },
  { id: 4, title: "Tycoon Simulator", rating: "84%", online: "5.2K", icon: "🏗️" },
  { id: 5, title: "Hide and Seek Extreme", rating: "90%", online: "3.9K", icon: "🙈" },
  { id: 6, title: "Speed Run 5", rating: "91%", online: "7.1K", icon: "⚡" }
];

// Главная HTML-страница платформы
app.get('/', (req: Request, res: Response) => {
  const gameCards: string = gamesData.map((game: Game) => `
    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer" onclick="playGame(${game.id})">
      <div class="aspect-square bg-gray-700 flex items-center justify-center text-5xl">${game.icon}</div>
      <div class="p-3">
        <h3 class="font-bold truncate text-sm">${game.title}</h3>
        <p class="text-xs text-gray-400 mt-1">👍 ${game.rating} • 👥 ${game.online}</p>
      </div>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GLEVEX — Игровая платформа</title>
      <script src="https://tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 text-white min-h-screen font-sans">
      <header class="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div class="text-2xl font-black text-red-500 tracking-wider">GLEVEX</div>
        <input type="text" placeholder="Поиск игр..." class="bg-gray-700 text-sm rounded px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-red-500">
        <div class="flex gap-4">
          <button onclick="auth('login')" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-medium text-sm">Войти</button>
          <button onclick="auth('reg')" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-medium text-sm">Регистрация</button>
        </div>
      </header>

      <main class="p-8 max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Популярные игры</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          ${gameCards}
        </div>
      </main>

      <script>
        function playGame(id) {
          alert("Запуск игры с ID: " + id + ". Здесь будет подключаться лаунчер GLEVEX!");
        }
        function auth(type) {
          const action = type === 'login' ? 'входа' : 'регистрации';
          alert("Окно " + action + " в разработке. Скоро подключим базу данных!");
        }
      </script>
    </body>
    </html>
  `);
});

// API эндпоинт для отдачи данных в формате JSON
app.get('/api/games', (req: Request, res: Response) => {
  res.json(gamesData);
});

export default app;
