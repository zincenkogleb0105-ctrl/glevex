import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

// Хранилище пользователей в памяти
const users: Record<string, string> = {};

interface Game {
  id: number;
  title: string;
  rating: string;
  online: string;
  icon: string;
  category: string;
  isHot?: boolean;
}

const gamesData: Game[] = [
  { id: 1, title: "Mega Obby 1000+", rating: "92%", online: "12.4K", icon: "🧗‍♂️", category: "obby", isHot: true },
  { id: 2, title: "Adopt Me! Clone", rating: "88%", online: "25.1K", icon: "🐶", category: "sim", isHot: true },
  { id: 3, title: "Murder Mystery X", rating: "95%", online: "8.7K", icon: "🔪", category: "action", isHot: true },
  { id: 4, title: "Tycoon Simulator", rating: "84%", online: "5.2K", icon: "🏗️", category: "sim" },
  { id: 5, title: "Hide and Seek Extreme", rating: "90%", online: "3.9K", icon: "🙈", category: "action" },
  { id: 6, title: "Speed Run 5", rating: "91%", online: "7.1K", icon: "⚡", category: "obby" },
  { id: 7, title: "Tower of Hell 2", rating: "89%", online: "15.3K", icon: "🏰", category: "obby" },
  { id: 8, title: "Anime Battle Arena", rating: "96%", online: "18.9K", icon: "⚔️", category: "action", isHot: true }
];

// API Регистрации
app.post('/api/register', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Заполните все поля!" });
  }
  if (users[username]) {
    return res.status(400).json({ success: false, message: "Этот никнейм уже занят!" });
  }
  users[username] = password;
  res.json({ success: true, message: "Аккаунт успешно создан!" });
});

// API Входа
app.post('/api/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ success: true, message: "С возвращением!", username });
  } else {
    res.status(400).json({ success: false, message: "Неверный логин или пароль!" });
  }
});

// API Получения списка игр
app.get('/api/games', (_req: Request, res: Response) => {
  res.json(gamesData);
});

// Главная страница
app.get('/', (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GLEVEX — Игровая Платформа</title>
      
      <!-- Исправленный Tailwind CDN -->
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                brand: { red: '#ff2a4b', dark: '#0d1117', card: '#161b22' }
              }
            }
          }
        }
      </script>
      <style>
        body { background-color: #0d1117; color: #f0f6fc; font-family: system-ui, -apple-system, sans-serif; }
        .glass { background: rgba(22, 27, 34, 0.85); backdrop-filter: blur(12px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      </style>
    </head>
    <body class="min-h-screen flex flex-col justify-between selection:bg-red-500 selection:text-white">
      
      <!-- Контейнер для всплывающих уведомлений -->
      <div id="toast-container" class="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"></div>

      <!-- Шапка -->
      <header class="sticky top-0 z-40 border-b border-gray-800 glass">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          <div class="flex items-center gap-3 cursor-pointer" onclick="resetFilters()">
            <span class="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-orange-500">
              GLEVEX
            </span>
          </div>

          <!-- Поиск -->
          <div class="flex-1 max-w-md hidden sm:block">
            <div class="relative">
              <input type="text" id="search-input" oninput="filterGames()" placeholder="Поиск игр (Obby, Murder, Speed)..." 
                class="w-full bg-gray-900 border border-gray-700/80 rounded-xl px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition">
              <span class="absolute left-3 top-2.5 text-gray-500 text-sm">🔍</span>
            </div>
          </div>

          <!-- Кнопки Авторизации / Профиль -->
          <div id="auth-buttons" class="flex items-center gap-3">
            <button onclick="openModal('login')" class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition">
              Войти
            </button>
            <button onclick="openModal('reg')" class="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition">
              Регистрация
            </button>
          </div>

          <div id="user-profile" class="hidden items-center gap-3">
            <div class="flex items-center gap-2 bg-gray-800 border border-gray-700/80 px-3 py-1.5 rounded-xl">
              <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span id="user-name-display" class="font-bold text-sm text-gray-200"></span>
            </div>
            <button onclick="logout()" class="text-xs text-gray-400 hover:text-red-400 transition underline">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <!-- Главный Контент -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-10">
        
        <!-- Hero Баннер Главной Игры -->
        <section class="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-950/60 via-purple-950/30 to-gray-900 border border-gray-800 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div class="space-y-4 max-w-xl text-center md:text-left">
            <span class="inline-block px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider">
              🔥 Топ игры недели
            </span>
            <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight">Mega Obby 1000+</h1>
            <p class="text-gray-400 text-sm sm:text-base leading-relaxed">
              Пройдите более 1000 полос препятствий вместе с друзьями! Новые чекпоинты и скины уже доступны.
            </p>
            <div class="flex items-center justify-center md:justify-start gap-4 pt-2">
              <button onclick="playGame('Mega Obby 1000+')" class="px-6 py-3 bg-red-600 hover:bg-red-500 font-bold rounded-xl shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5 flex items-center gap-2">
                <span>▶ Запустить игру</span>
              </button>
              <div class="text-xs text-gray-400 text-left">
                <p class="font-bold text-gray-200">👥 12.4K онлайн</p>
                <p>👍 92% рейтинг</p>
              </div>
            </div>
          </div>
          <div class="text-8xl sm:text-9xl filter drop-shadow-[0_10px_25px_rgba(239,68,68,0.35)] animate-bounce duration-1000">
            🧗‍♂️
          </div>
        </section>

        <!-- Фильтры по категориям -->
        <section class="space-y-4">
          <div class="sm:hidden">
            <input type="text" id="search-input-mobile" oninput="filterGamesMobile()" placeholder="Поиск игр..." 
              class="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500">
          </div>

          <div class="flex items-center justify-between flex-wrap gap-4 border-b border-gray-800/80 pb-4">
            <h2 class="text-2xl font-bold tracking-tight">Каталог игр</h2>
            
            <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar" id="category-buttons">
              <button onclick="setCategory('all')" data-cat="all" class="cat-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white transition">Все</button>
              <button onclick="setCategory('obby')" data-cat="obby" class="cat-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition">🧗 Obby</button>
              <button onclick="setCategory('action')" data-cat="action" class="cat-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition">⚔️ Экшен</button>
              <button onclick="setCategory('sim')" data-cat="sim" class="cat-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition">🏗️ Симуляторы</button>
            </div>
          </div>
        </section>

        <!-- Сетка игр -->
        <section id="games-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          <!-- Карточки загружаются через JS -->
        </section>

      </main>

      <!-- Подвал -->
      <footer class="border-t border-gray-800/60 bg-gray-950 py-8 mt-12">
        <div class="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div class="text-xl font-black text-red-500">GLEVEX</div>
          <p class="text-xs text-gray-500">© ${new Date().getFullYear()} GLEVEX Gaming Platform. Все права защищены.</p>
        </div>
      </footer>

      <!-- Модальное окно авторизации -->
      <div id="auth-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
          <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white text-2xl font-bold">&times;</button>
          
          <div class="text-center space-y-2 mb-6">
            <div class="text-3xl font-black text-red-500 tracking-wider">GLEVEX</div>
            <p id="modal-subtitle" class="text-xs text-gray-400">Войдите в аккаунт для сохранения прогресса</p>
          </div>
          
          <form onsubmit="handleAuthSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Никнейм</label>
              <input type="text" id="auth-username" required placeholder="Ваш ник" 
                class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 text-sm text-white">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Пароль</label>
              <input type="password" id="auth-password" required placeholder="••••••••" 
                class="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-500 text-sm text-white">
            </div>
            <button type="submit" id="modal-submit-btn" class="w-full bg-red-600 hover:bg-red-500 py-3 rounded-xl font-bold transition shadow-lg shadow-red-600/30 text-white mt-2">
              Продолжить
            </button>
          </form>
        </div>
      </div>

      <!-- Клиентский скрипт -->
      <script>
        let allGames = [];
        let currentCategory = 'all';
        let currentAuthMode = 'reg';

        // Инициализация при загрузке
        document.addEventListener('DOMContentLoaded', () => {
          loadGames();
          checkSession();
        });

        // Загрузка списка игр с сервера
        async function loadGames() {
          try {
            const res = await fetch('/api/games');
            allGames = await res.json();
            renderGames(allGames);
          } catch (e) {
            showToast('Ошибка загрузки каталога игр', 'error');
          }
        }

        // Отрисовка сетки игр
        function renderGames(games) {
          const grid = document.getElementById('games-grid');
          if (!games || games.length === 0) {
            grid.innerHTML = \`<div class="col-span-full text-center py-12 text-gray-500">Игры не найдены</div>\`;
            return;
          }

          grid.innerHTML = games.map(game => \`
            <div onclick="playGame('\${game.title}')" class="group bg-gray-900 border border-gray-800/80 hover:border-red-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between">
              <div class="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-5xl relative group-hover:scale-105 transition-transform duration-300">
                \${game.isHot ? '<span class="absolute top-2 right-2 bg-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-md">HOT</span>' : ''}
                \${game.icon}
              </div>
              <div class="p-3.5 space-y-1 bg-gray-900">
                <h3 class="font-bold text-sm text-gray-100 truncate group-hover:text-red-400 transition-colors">\${game.title}</h3>
                <div class="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                  <span>👍 \${game.rating}</span>
                  <span class="text-green-400">👥 \${game.online}</span>
                </div>
              </div>
            </div>
          \`).join('');
        }

        // Фильтрация игр
        function filterGames() {
          const query = (document.getElementById('search-input')?.value || '').toLowerCase();
          const filtered = allGames.filter(g => {
            const matchesCategory = currentCategory === 'all' || g.category === currentCategory;
            const matchesQuery = g.title.toLowerCase().includes(query);
            return matchesCategory && matchesQuery;
          });
          renderGames(filtered);
        }

        function filterGamesMobile() {
          const query = (document.getElementById('search-input-mobile')?.value || '').toLowerCase();
          const filtered = allGames.filter(g => g.title.toLowerCase().includes(query));
          renderGames(filtered);
        }

        function setCategory(cat) {
          currentCategory = cat;
          document.querySelectorAll('.cat-btn').forEach(btn => {
            if (btn.dataset.cat === cat) {
              btn.className = 'cat-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white transition';
            } else {
              btn.className = 'cat-btn px-4 py-1.5 rounded-lg text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-300 transition';
            }
          });
          filterGames();
        }

        function resetFilters() {
          currentCategory = 'all';
          if(document.getElementById('search-input')) document.getElementById('search-input').value = '';
          setCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Модальное окно
        function openModal(mode) {
          currentAuthMode = mode;
          document.getElementById('auth-modal').classList.remove('hidden');
          document.getElementById('modal-subtitle').innerText = mode === 'reg' ? 'Создайте аккаунт GLEVEX за 10 секунд' : 'Войдите в свой профиль GLEVEX';
          document.getElementById('modal-submit-btn').innerText = mode === 'reg' ? 'Создать аккаунт' : 'Войти';
        }

        function closeModal() {
          document.getElementById('auth-modal').classList.add('hidden');
        }

        // Авторизация
        async function handleAuthSubmit(event) {
          event.preventDefault();
          const username = document.getElementById('auth-username').value;
          const password = document.getElementById('auth-password').value;
          const endpoint = currentAuthMode === 'reg' ? '/api/register' : '/api/login';

          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (data.success) {
              showToast(data.message, 'success');
              localStorage.setItem('glevex_user', username);
              updateUserUI(username);
              closeModal();
            } else {
              showToast(data.message, 'error');
            }
          } catch (e) {
            showToast('Ошибка сети. Попробуйте еще раз.', 'error');
          }
        }

        function checkSession() {
          const user = localStorage.getItem('glevex_user');
          if (user) {
            updateUserUI(user);
          }
        }

        function updateUserUI(username) {
          document.getElementById('auth-buttons').classList.add('hidden');
          const profile = document.getElementById('user-profile');
          document.getElementById('user-name-display').innerText = username;
          profile.classList.remove('hidden');
          profile.classList.add('flex');
        }

        function logout() {
          localStorage.removeItem('glevex_user');
          document.getElementById('user-profile').classList.add('hidden');
          document.getElementById('user-profile').classList.remove('flex');
          document.getElementById('auth-buttons').classList.remove('hidden');
          showToast('Вы вышли из системы', 'info');
        }

        function playGame(title) {
          showToast('🎮 Запуск лаунчера GLEVEX: ' + title, 'info');
        }

        // Уведомления (Toast)
        function showToast(message, type = 'info') {
          const container = document.getElementById('toast-container');
          const toast = document.createElement('div');
          
          const bgColors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            info: 'bg-gray-800 border border-gray-700'
          };

          toast.className = \`\${bgColors[type] || bgColors.info} text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl transition-all duration-300 pointer-events-auto flex items-center gap-2 animate-bounce\`;
          toast.innerHTML = \`<span>\${message}</span>\`;

          container.appendChild(toast);
          setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
          }, 3000);
        }
      </script>
    </body>
    </html>
  `);
});

export default app;
