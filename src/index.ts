import express, { Request, Response } from 'express';
const app = express();

app.use(express.json());

// База данных пользователей в оперативной памяти сервера
const users: Record<string, string> = {};

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

// API для регистрации
app.post('/api/register', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Заполните все поля!" });
  }
  if (users[username]) {
    return res.status(400).json({ success: false, message: "Этот никнейм уже занят!" });
  }
  users[username] = password; // Сохраняем аккаунт
  res.json({ success: true, message: "Аккаунт успешно создан!" });
});

// API для входа
app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ success: true, message: "Успешный вход!", username });
  } else {
    res.status(400).json({ success: false, message: "Неверный логин или пароль!" });
  }
});

app.get('/', (req: Request, res: Response) => {
  const gameCards = gamesData.map(game => `
    <div class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer" onclick="playGame('${game.title}')">
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
    <body class="bg-gray-900 text-white min-h-screen font-sans relative">
      <header class="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <div class="text-2xl font-black text-red-500 tracking-wider">GLEVEX</div>
        <div class="flex gap-4" id="auth-buttons">
          <button onclick="openModal('login')" class="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-medium text-sm">Войти</button>
          <button onclick="openModal('reg')" class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded font-medium text-sm">Создать аккаунт</button>
        </div>
        <div id="user-profile" class="hidden font-bold text-green-400"></div>
      </header>

      <main class="p-8 max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Популярные игры</h1>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          ${gameCards}
        </div>
      </main>

      <!-- Окно авторизации как в Roblox -->
      <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4">
        <div class="bg-gray-800 border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-2xl relative">
          <button onclick="closeModal()" class="absolute top-3 right-4 text-gray-400 hover:text-white text-xl">&times;</button>
          <div class="text-3xl font-black text-red-500 tracking-wider text-center mb-6" id="modal-title">GLEVEX</div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Никнейм</label>
              <input type="text" id="auth-username" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-500 text-white">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Пароль</label>
              <input type="password" id="auth-password" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-red-500 text-white">
            </div>
            <button onclick="submitAuth()" id="modal-submit-btn" class="w-full bg-red-600 hover:bg-red-500 py-3 rounded font-bold transition mt-2">Создать аккаунт</button>
          </div>
        </div>
      </div>

      <script>
        let currentMode = 'reg';

        function openModal(mode) {
          currentMode = mode;
          document.getElementById('auth-modal').classList.remove('hidden');
          document.getElementById('modal-submit-btn').innerText = mode === 'reg' ? 'Создать аккаунт' : 'Войти';
        }

        function closeModal() {
          document.getElementById('auth-modal').classList.add('hidden');
        }

        async function submitAuth() {
          const username = document.getElementById('auth-username').value;
          const password = document.getElementById('auth-password').value;
          const url = currentMode === 'reg' ? '/api/register' : '/api/login';

          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();

          alert(data.message);
          if (data.success) {
            closeModal();
            if (currentMode === 'login' || currentMode === 'reg') {
              document.getElementById('auth-buttons').classList.add('hidden');
              const profile = document.getElementById('user-profile');
              profile.innerText = "Привет, " + username + "!";
              profile.classList.remove('hidden');
            }
          }
        }

        function playGame(title) {
          alert("Запуск игры: " + title + ". Здесь будет подключаться лаунчер GLEVEX!");
        }
      </script>
    </body>
    </html>
  `);
});

export default app;
