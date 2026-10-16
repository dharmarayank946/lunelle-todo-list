/**
 * Lunelle ✧ - Aesthetic Editorial Productivity Application
 * Tagline: "Make space for what matters."
 * Features:
 *  - 4 Dynamic Views: Dashboard, My Tasks, Calendar, and Settings
 *  - Desktop Sidebar & Mobile Bottom Navigation
 *  - Demo Authentication & Registration (stored in LocalStorage)
 *  - User-Isolated Task Persistence (`taskflow_tasks_${userId}`)
 *  - Backward-compatible task schema with optional Due Dates
 *  - Monthly interactive calendar with date selection and task scheduling
 *  - Aesthetic pastel theme customizer (Lavender, Sage, Peach)
 *  - Vanilla HTML5, CSS3, and JavaScript (ES6+)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Storage Keys & Pre-configured Demo Accounts
  // ---------------------------------------------------------------------------
  const STORAGE_USERS_KEY = 'taskflow_demo_users';
  const STORAGE_SESSION_KEY = 'taskflow_current_session';
  const STORAGE_THEME_KEY = 'taskflow_theme_preference';
  const TASK_STORAGE_PREFIX = 'taskflow_tasks_';

  // Utility to get YYYY-MM-DD for today or offset days
  function getISOOffsetDate(offsetDays = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // Starter Demo Accounts with individual tasks and dates
  const SEED_USERS = [
    {
      id: 'demo_user_student',
      name: 'Emma Watson',
      username: 'student',
      password: 'password123',
      starterTasks: [
        { id: 't1', text: 'Review Biology Chapter 4 and take notes ✧', completed: true, dueDate: getISOOffsetDate(0) },
        { id: 't2', text: 'Organize weekly intentions & study plan ✧', completed: false, dueDate: getISOOffsetDate(1) },
        { id: 't3', text: 'Take a peaceful 15-minute tea break ☕', completed: false, dueDate: getISOOffsetDate(0) }
      ]
    },
    {
      id: 'demo_user_alex',
      name: 'Alex Chen',
      username: 'alex',
      password: 'password123',
      starterTasks: [
        { id: 't4', text: 'Complete Calculus Problem Set 3 questions ✧', completed: false, dueDate: getISOOffsetDate(0) },
        { id: 't5', text: 'Submit Chemistry Lab Report and data review ✧', completed: true, dueDate: getISOOffsetDate(2) }
      ]
    }
  ];

  // ---------------------------------------------------------------------------
  // 2. DOM Elements Selection
  // ---------------------------------------------------------------------------
  // Main Application Shells
  const authContainer = document.getElementById('auth-container');
  const appContainer = document.getElementById('app-container');

  // Auth Tabs & Forms
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginFormView = document.getElementById('login-form-view');
  const registerFormView = document.getElementById('register-form-view');
  const authAlert = document.getElementById('auth-alert');

  const loginForm = document.getElementById('login-form');
  const loginUsernameInput = document.getElementById('login-username');
  const loginPasswordInput = document.getElementById('login-password');
  const switchToRegisterBtn = document.getElementById('switch-to-register');

  const registerForm = document.getElementById('register-form');
  const registerNameInput = document.getElementById('register-name');
  const registerUsernameInput = document.getElementById('register-username');
  const registerPasswordInput = document.getElementById('register-password');
  const registerConfirmInput = document.getElementById('register-confirm');
  const switchToLoginBtn = document.getElementById('switch-to-login');

  // Top App Bar & Sidebar Header/Footer
  const currentViewTitle = document.getElementById('current-view-title');
  const currentDateBadge = document.getElementById('current-date-badge');
  const userDisplayName = document.getElementById('user-display-name');
  const userDisplayHandle = document.getElementById('user-display-handle');

  // Logout Buttons
  const btnSidebarLogout = document.getElementById('btn-sidebar-logout');
  const btnTopLogout = document.getElementById('btn-top-logout');
  const settingsLogoutBtn = document.getElementById('settings-logout-btn');

  // Navigation Buttons
  const desktopNavBtns = document.querySelectorAll('.nav-item-btn');
  const mobileNavBtns = document.querySelectorAll('.mobile-nav-btn');

  // Content Views
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    tasks: document.getElementById('view-tasks'),
    calendar: document.getElementById('view-calendar'),
    settings: document.getElementById('view-settings')
  };

  // Dashboard View Elements
  const heroUserGreeting = document.getElementById('hero-user-greeting');
  const greetingText = document.getElementById('greeting-text');
  const dashTotalCount = document.getElementById('dash-total-count');
  const dashCompletedCount = document.getElementById('dash-completed-count');
  const dashRemainingCount = document.getElementById('dash-remaining-count');
  const dashProgressPercentage = document.getElementById('dash-progress-percentage');
  const dashProgressBar = document.getElementById('dash-progress-bar');
  const dashProgressTrack = document.getElementById('dash-progress-track');
  const dashProgressCaption = document.getElementById('dash-progress-caption');
  const dashRecentList = document.getElementById('dash-recent-list');
  const dashRecentEmpty = document.getElementById('dash-recent-empty');
  const btnGoToTasks = document.getElementById('btn-go-to-tasks');

  // My Tasks View Elements
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskDueDate = document.getElementById('task-due-date');
  const inputError = document.getElementById('input-error');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const countAll = document.getElementById('count-all');
  const countActive = document.getElementById('count-active');
  const countCompleted = document.getElementById('count-completed');
  const tasksProgressText = document.getElementById('tasks-progress-text');
  const tasksProgressFill = document.getElementById('tasks-progress-fill');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const emptyEmoji = document.getElementById('empty-emoji');
  const emptyTitle = document.getElementById('empty-title');
  const emptyText = document.getElementById('empty-text');

  // Calendar View Elements
  const calMonthTitle = document.getElementById('cal-month-title');
  const calPrevBtn = document.getElementById('cal-prev-btn');
  const calNextBtn = document.getElementById('cal-next-btn');
  const calTodayBtn = document.getElementById('cal-today-btn');
  const calDaysGrid = document.getElementById('cal-days-grid');
  const calSelectedDateHeading = document.getElementById('cal-selected-date-heading');
  const calSelectedCount = document.getElementById('cal-selected-count');
  const calTasksList = document.getElementById('cal-tasks-list');
  const calEmptyState = document.getElementById('cal-empty-state');
  const calQuickAddForm = document.getElementById('cal-quick-add-form');
  const calQuickInput = document.getElementById('cal-quick-input');

  // Settings View Elements
  const settingsUserName = document.getElementById('settings-user-name');
  const settingsUserUsername = document.getElementById('settings-user-username');
  const settingsUserId = document.getElementById('settings-user-id');
  const settingsStorageKey = document.getElementById('settings-storage-key');
  const themeOptionBtns = document.querySelectorAll('.theme-option-btn');
  const settingsTaskCountText = document.getElementById('settings-task-count-text');
  const btnResetStarterTasks = document.getElementById('btn-reset-starter-tasks');

  // ---------------------------------------------------------------------------
  // 3. Application State
  // ---------------------------------------------------------------------------
  let currentUser = null;
  let currentTasks = [];
  let currentFilter = 'all';
  let activeViewName = 'dashboard';

  // Calendar Navigation State
  let calCurrentYear = new Date().getFullYear();
  let calCurrentMonth = new Date().getMonth(); // 0-indexed
  let calSelectedDate = getISOOffsetDate(0);   // Defaults to today's YYYY-MM-DD

  // ---------------------------------------------------------------------------
  // 4. Storage Helpers & Initialization
  // ---------------------------------------------------------------------------
  function initializeUsersStorage() {
    try {
      const users = getUsers();
      if (users.length === 0) {
        const usersToSave = SEED_USERS.map(({ starterTasks, ...user }) => user);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usersToSave));

        SEED_USERS.forEach(seed => {
          const taskKey = `${TASK_STORAGE_PREFIX}${seed.id}`;
          let needsSeed = true;
          try {
            const existingTasks = localStorage.getItem(taskKey);
            if (existingTasks && Array.isArray(JSON.parse(existingTasks))) {
              needsSeed = false;
            }
          } catch {
            needsSeed = true;
          }
          if (needsSeed) {
            localStorage.setItem(taskKey, JSON.stringify(seed.starterTasks));
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage error during user initialization:', e);
    }
  }

  function getUsers() {
    try {
      const stored = localStorage.getItem(STORAGE_USERS_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('Error reading users from localStorage:', e);
      return [];
    }
  }

  function saveUser(newUser) {
    if (!newUser || typeof newUser !== 'object') return;
    let users = getUsers();
    if (!Array.isArray(users)) users = [];
    users.push(newUser);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving user to localStorage:', e);
    }
  }

  function getSession() {
    try {
      const session = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!session) return null;
      const parsed = JSON.parse(session);
      if (parsed && typeof parsed === 'object' && typeof parsed.id === 'string' && typeof parsed.name === 'string') {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function setSession(user) {
    if (!user || typeof user !== 'object' || !user.id) return;
    const sessionData = {
      id: String(user.id),
      name: String(user.name || user.username || 'User'),
      username: String(user.username || '')
    };
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Error saving session to localStorage:', e);
    }
    currentUser = sessionData;
  }

  function clearSession() {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {
      console.warn('Error clearing session from localStorage:', e);
    }
    currentUser = null;
  }

  /**
   * Loads tasks for current user.
   * Backward-compatible: guarantees dueDate is a string even for legacy data.
   */
  function loadUserTasks() {
    if (!currentUser || !currentUser.id) return [];
    const taskKey = `${TASK_STORAGE_PREFIX}${currentUser.id}`;
    try {
      const stored = localStorage.getItem(taskKey);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(t => t && typeof t === 'object' && t.id && t.text).map(t => ({
            id: String(t.id),
            text: String(t.text),
            completed: Boolean(t.completed),
            dueDate: typeof t.dueDate === 'string' ? t.dueDate : ''
          }));
        }
      }
    } catch (e) {
      console.warn('Error reading user tasks:', e);
    }
    return [];
  }

  function saveUserTasks() {
    if (!currentUser || !currentUser.id) return;
    const taskKey = `${TASK_STORAGE_PREFIX}${currentUser.id}`;
    try {
      localStorage.setItem(taskKey, JSON.stringify(currentTasks));
    } catch (e) {
      console.warn('Error saving user tasks:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // 5. Aesthetic Theme Preference
  // ---------------------------------------------------------------------------
  function initializeTheme() {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'lavender';
      applyTheme(savedTheme);
    } catch (e) {
      applyTheme('lavender');
    }
  }

  function applyTheme(themeName) {
    const validThemes = ['lavender', 'sage', 'peach'];
    const activeTheme = validThemes.includes(themeName) ? themeName : 'lavender';

    if (activeTheme === 'lavender') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', activeTheme);
    }

    try {
      localStorage.setItem(STORAGE_THEME_KEY, activeTheme);
    } catch (e) {
      console.warn('Theme storage failed:', e);
    }

    themeOptionBtns.forEach(btn => {
      const matches = btn.dataset.theme === activeTheme;
      btn.classList.toggle('active', matches);
      btn.setAttribute('aria-pressed', matches ? 'true' : 'false');
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Navigation & View Routing
  // ---------------------------------------------------------------------------
  function switchView(targetView) {
    if (!views[targetView]) return;
    activeViewName = targetView;

    // Update Title
    const viewTitles = {
      dashboard: 'Dashboard',
      tasks: 'My Tasks',
      calendar: 'Calendar & Schedule',
      settings: 'Settings'
    };
    if (currentViewTitle) {
      currentViewTitle.textContent = viewTitles[targetView] || 'Lunelle';
    }

    // Toggle Content Views
    Object.keys(views).forEach(key => {
      const section = views[key];
      if (!section) return;
      if (key === targetView) {
        section.classList.remove('hidden');
        section.classList.add('active');
      } else {
        section.classList.add('hidden');
        section.classList.remove('active');
      }
    });

    // Update Desktop Sidebar active states
    desktopNavBtns.forEach(btn => {
      const isSelected = btn.dataset.view === targetView;
      btn.classList.toggle('active', isSelected);
      if (isSelected) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    // Update Mobile Nav active states
    mobileNavBtns.forEach(btn => {
      const isSelected = btn.dataset.view === targetView;
      btn.classList.toggle('active', isSelected);
      if (isSelected) {
        btn.setAttribute('aria-current', 'page');
      } else {
        btn.removeAttribute('aria-current');
      }
    });

    // Render corresponding view contents
    if (targetView === 'dashboard') {
      renderDashboard();
    } else if (targetView === 'tasks') {
      renderTasksAndProgress();
    } else if (targetView === 'calendar') {
      renderCalendar();
      renderSelectedDateTasks();
    } else if (targetView === 'settings') {
      renderSettings();
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Auth Logic & UI Transitions
  // ---------------------------------------------------------------------------
  function setupPasswordToggle(toggleBtnId, inputId) {
    const btn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-pressed', isPassword ? 'true' : 'false');
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.title = isPassword ? 'Hide password' : 'Show password';
      const icon = btn.querySelector('.toggle-icon');
      if (icon) {
        icon.textContent = isPassword ? '🙈' : '👁️';
      }
      input.focus();
    });
  }

  function showLoginTab() {
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabRegister.classList.remove('active');
    tabRegister.setAttribute('aria-selected', 'false');

    loginFormView.classList.remove('hidden');
    registerFormView.classList.add('hidden');
    clearAuthAlert();
    loginUsernameInput.focus();
  }

  function showRegisterTab() {
    tabRegister.classList.add('active');
    tabRegister.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'false');

    registerFormView.classList.remove('hidden');
    loginFormView.classList.add('hidden');
    clearAuthAlert();
    registerNameInput.focus();
  }

  function showAuthAlert(msg, type = 'error') {
    authAlert.textContent = msg;
    authAlert.className = `auth-alert ${type}`;
    authAlert.classList.remove('hidden');
  }

  function clearAuthAlert() {
    authAlert.textContent = '';
    authAlert.className = 'auth-alert hidden';
  }

  function showAuthenticatedApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');

    // Populate user in sidebar
    if (userDisplayName) userDisplayName.textContent = currentUser.name;
    if (userDisplayHandle) userDisplayHandle.textContent = `@${currentUser.username}`;

    updateHeaderDate();

    // Load active user's tasks
    currentTasks = loadUserTasks();
    currentFilter = 'all';

    // Set today's date on calendar selector
    calSelectedDate = getISOOffsetDate(0);
    calCurrentYear = new Date().getFullYear();
    calCurrentMonth = new Date().getMonth();

    // Default to Dashboard view
    switchView('dashboard');
  }

  function showAuthView() {
    appContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    showLoginTab();
  }

  function handleLogin(e) {
    e.preventDefault();
    clearAuthAlert();

    const username = loginUsernameInput.value.trim().toLowerCase();
    const password = loginPasswordInput.value.trim();

    if (!username || !password) {
      showAuthAlert('Please enter both your username/email and password.', 'error');
      return;
    }

    const users = getUsers();
    const match = users.find(u => u.username.toLowerCase() === username && u.password === password);

    if (!match) {
      showAuthAlert('Invalid username or password. Please check your credentials and try again.', 'error');
      loginPasswordInput.value = '';
      loginPasswordInput.focus();
      return;
    }

    setSession(match);
    loginUsernameInput.value = '';
    loginPasswordInput.value = '';
    showAuthenticatedApp();
  }

  function handleRegister(e) {
    e.preventDefault();
    clearAuthAlert();

    const name = registerNameInput.value.trim();
    const username = registerUsernameInput.value.trim().toLowerCase();
    const password = registerPasswordInput.value.trim();
    const confirm = registerConfirmInput.value.trim();

    if (!name || !username || !password || !confirm) {
      showAuthAlert('Please fill in all registration fields.', 'error');
      return;
    }

    if (password.length < 4) {
      showAuthAlert('Password should be at least 4 characters long.', 'error');
      registerPasswordInput.focus();
      return;
    }

    if (password !== confirm) {
      showAuthAlert('Passwords do not match. Please check and re-type.', 'error');
      registerConfirmInput.focus();
      return;
    }

    const users = getUsers();
    const exists = users.some(u => u.username.toLowerCase() === username);

    if (exists) {
      showAuthAlert('That username or email is already taken. Please choose another.', 'error');
      registerUsernameInput.focus();
      return;
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name,
      username: username,
      password: password
    };

    saveUser(newUser);

    // Starter tasks with today's date
    const userStarterTasks = [
      { id: `t_${Date.now()}_1`, text: `Welcome to Lunelle, ${name}! ✧`, completed: false, dueDate: getISOOffsetDate(0) },
      { id: `t_${Date.now()}_2`, text: 'Set your first intention or study goal ✦', completed: false, dueDate: getISOOffsetDate(1) }
    ];
    localStorage.setItem(`${TASK_STORAGE_PREFIX}${newUser.id}`, JSON.stringify(userStarterTasks));

    registerNameInput.value = '';
    registerUsernameInput.value = '';
    registerPasswordInput.value = '';
    registerConfirmInput.value = '';

    setSession(newUser);
    showAuthenticatedApp();
  }

  function handleLogout() {
    clearSession();
    currentTasks = [];
    if (taskList) taskList.innerHTML = '';
    showAuthView();
    showAuthAlert('You have logged out successfully. See you soon ✧', 'success');
  }

  function updateHeaderDate() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    if (currentDateBadge) {
      currentDateBadge.textContent = now.toLocaleDateString(undefined, options);
    }
  }

  // ---------------------------------------------------------------------------
  // 8. Task CRUD Operations
  // ---------------------------------------------------------------------------
  function addTask(text, dueDateVal = '') {
    if (!currentUser) return;
    const trimmed = text.trim();

    if (!trimmed) {
      showTaskError('Please write a task or intention before adding ✧');
      taskInput.classList.add('error');
      taskInput.focus();
      return;
    }

    clearTaskError();

    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: trimmed,
      completed: false,
      dueDate: dueDateVal || ''
    };

    currentTasks.unshift(newTask);
    saveUserTasks();

    // Re-render currently active view
    if (activeViewName === 'tasks') {
      renderTasksAndProgress();
    } else if (activeViewName === 'dashboard') {
      renderDashboard();
    } else if (activeViewName === 'calendar') {
      renderCalendar();
      renderSelectedDateTasks();
    }

    if (taskInput) {
      taskInput.value = '';
      if (taskDueDate) taskDueDate.value = '';
      taskInput.focus();
    }
  }

  function toggleTask(id) {
    if (!currentUser) return;
    currentTasks = currentTasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveUserTasks();
    refreshAllViews();
  }

  function deleteTask(id) {
    if (!currentUser) return;
    currentTasks = currentTasks.filter(task => task.id !== id);
    saveUserTasks();
    refreshAllViews();
  }

  /**
   * Updates an existing task's due date while strictly preserving all other task fields and list data.
   */
  function updateTaskDueDate(id, newDueDate) {
    if (!currentUser) return;
    currentTasks = currentTasks.map(task => {
      if (task.id === id) {
        return { ...task, dueDate: newDueDate ? String(newDueDate).trim() : '' };
      }
      return task;
    });
    saveUserTasks();
    refreshAllViews();
  }

  function refreshAllViews() {
    if (activeViewName === 'dashboard') renderDashboard();
    if (activeViewName === 'tasks') renderTasksAndProgress();
    if (activeViewName === 'calendar') {
      renderCalendar();
      renderSelectedDateTasks();
    }
    if (activeViewName === 'settings') renderSettings();
  }

  function showTaskError(msg) {
    if (inputError) {
      inputError.textContent = msg;
      inputError.classList.add('visible');
    }
  }

  function clearTaskError() {
    if (inputError) {
      inputError.textContent = '';
      inputError.classList.remove('visible');
    }
    if (taskInput) {
      taskInput.classList.remove('error');
    }
  }

  // Format YYYY-MM-DD for readable badge
  function formatDueDate(isoStr) {
    if (!isoStr) return '';
    try {
      const parts = isoStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const todayStr = getISOOffsetDate(0);
        if (isoStr === todayStr) {
          return { text: 'Today', isToday: true, isOverdue: false };
        } else if (isoStr < todayStr) {
          return { text: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), isToday: false, isOverdue: true };
        } else {
          return { text: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), isToday: false, isOverdue: false };
        }
      }
    } catch {
      return '';
    }
    return '';
  }

  // ---------------------------------------------------------------------------
  // 9. View 1: DASHBOARD Controller
  // ---------------------------------------------------------------------------
  function renderDashboard() {
    if (!currentUser) return;

    // Greeting
    if (heroUserGreeting) {
      heroUserGreeting.textContent = `Welcome back, ${currentUser.name} ✧`;
    }

    const hour = new Date().getHours();
    let greeting = 'A serene moment to begin ✧';
    if (hour < 12) greeting = 'Good morning ✧ Make space for what matters.';
    else if (hour < 17) greeting = 'Good afternoon ✧ Keep up your gentle rhythm.';
    else greeting = 'Good evening ✧ A peaceful close to today’s goals.';
    if (greetingText) greetingText.textContent = greeting;

    // Stats
    const total = currentTasks.length;
    const completed = currentTasks.filter(t => t.completed).length;
    const remaining = Math.max(0, total - completed);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (dashTotalCount) dashTotalCount.textContent = total;
    if (dashCompletedCount) dashCompletedCount.textContent = completed;
    if (dashRemainingCount) dashRemainingCount.textContent = remaining;

    if (dashProgressPercentage) dashProgressPercentage.textContent = `${percentage}%`;
    if (dashProgressBar) dashProgressBar.style.width = `${percentage}%`;
    if (dashProgressTrack) dashProgressTrack.setAttribute('aria-valuenow', percentage);

    if (dashProgressCaption) {
      if (total === 0) {
        dashProgressCaption.textContent = 'Ready to start your day? Add your first task!';
      } else if (percentage === 100) {
        dashProgressCaption.textContent = 'Outstanding work! All goals completed! 🎉';
      } else if (percentage >= 50) {
        dashProgressCaption.textContent = 'Great momentum! You’re more than halfway there! ✨';
      } else {
        dashProgressCaption.textContent = 'Small steps lead to big achievements 🌸';
      }
    }

    // Recent Tasks List (First 4 items)
    if (dashRecentList) {
      dashRecentList.innerHTML = '';
      const recents = currentTasks.slice(0, 4);

      if (recents.length === 0) {
        if (dashRecentEmpty) dashRecentEmpty.classList.remove('hidden');
      } else {
        if (dashRecentEmpty) dashRecentEmpty.classList.add('hidden');
        recents.forEach(task => {
          const li = document.createElement('li');
          li.className = `dash-recent-item ${task.completed ? 'completed' : ''}`;

          const checkBtn = document.createElement('button');
          checkBtn.type = 'button';
          checkBtn.className = `task-checkbox-btn ${task.completed ? 'checked' : ''}`;
          checkBtn.setAttribute('aria-label', `Toggle task: ${task.text}`);
          checkBtn.innerHTML = task.completed ? '<span class="check-icon">✓</span>' : '';
          checkBtn.addEventListener('click', () => toggleTask(task.id));

          const textSpan = document.createElement('span');
          textSpan.className = 'dash-recent-text';
          textSpan.textContent = task.text;

          li.appendChild(checkBtn);
          li.appendChild(textSpan);

          if (task.dueDate) {
            const dueInfo = formatDueDate(task.dueDate);
            if (dueInfo) {
              const dueBadge = document.createElement('span');
              let badgeClass = 'dash-recent-due';
              if (dueInfo.isToday) badgeClass += ' today';
              else if (dueInfo.isOverdue) badgeClass += ' overdue';
              dueBadge.className = badgeClass;
              dueBadge.textContent = `📅 ${dueInfo.text}`;
              li.appendChild(dueBadge);
            }
          }

          dashRecentList.appendChild(li);
        });
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 10. View 2: MY TASKS Controller
  // ---------------------------------------------------------------------------
  function renderTasksAndProgress() {
    const total = currentTasks.length;
    const completed = currentTasks.filter(t => t.completed).length;
    const remaining = Math.max(0, total - completed);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (countAll) countAll.textContent = total;
    if (countActive) countActive.textContent = remaining;
    if (countCompleted) countCompleted.textContent = completed;

    if (tasksProgressText) tasksProgressText.textContent = `${percentage}% completed`;
    if (tasksProgressFill) tasksProgressFill.style.width = `${percentage}%`;

    const filtered = currentTasks.filter(task => {
      if (!task) return false;
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    if (!taskList) return;
    taskList.innerHTML = '';

    if (filtered.length === 0) {
      if (emptyState) emptyState.classList.remove('hidden');

      if (currentTasks.length === 0) {
        if (emptyEmoji) emptyEmoji.textContent = '✧';
        if (emptyTitle) emptyTitle.textContent = 'No tasks in your flow yet ✧';
        if (emptyText) emptyText.textContent = 'Add your first intention above and gently begin.';
      } else if (currentFilter === 'active') {
        if (emptyEmoji) emptyEmoji.textContent = '✧';
        if (emptyTitle) emptyTitle.textContent = 'All clear and complete ✧';
        if (emptyText) emptyText.textContent = 'You have accomplished all active tasks. Enjoy your peaceful space.';
      } else if (currentFilter === 'completed') {
        if (emptyEmoji) emptyEmoji.textContent = '✦';
        if (emptyTitle) emptyTitle.textContent = 'No finished tasks yet ✧';
        if (emptyText) emptyText.textContent = 'Check off goals as you complete them to see your progress here.';
      }
    } else {
      if (emptyState) emptyState.classList.add('hidden');

      filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        // Checkbox button
        const checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = `task-checkbox-btn ${task.completed ? 'checked' : ''}`;
        checkBtn.setAttribute('aria-label', `Mark task as ${task.completed ? 'incomplete' : 'complete'}`);
        checkBtn.innerHTML = task.completed ? '<span class="check-icon">✓</span>' : '';
        checkBtn.addEventListener('click', () => toggleTask(task.id));

        // Task Body (Text & Due Badge)
        const taskBody = document.createElement('div');
        taskBody.className = 'task-body';

        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        taskBody.appendChild(textSpan);

        if (task.dueDate) {
          const dueInfo = formatDueDate(task.dueDate);
          if (dueInfo) {
            const dueBadge = document.createElement('span');
            let badgeClass = 'task-due-badge';
            if (dueInfo.isToday) badgeClass += ' today';
            else if (dueInfo.isOverdue) badgeClass += ' overdue';
            dueBadge.className = badgeClass;
            dueBadge.textContent = `📅 ${dueInfo.text}`;
            dueBadge.title = 'Click to change due date';
            dueBadge.style.cursor = 'pointer';
            dueBadge.setAttribute('role', 'button');
            dueBadge.setAttribute('tabindex', '0');
            dueBadge.setAttribute('aria-label', `Change due date for: ${task.text}`);

            const promptNewDate = () => {
              const entered = prompt('Update due date (YYYY-MM-DD) or leave blank to clear:', task.dueDate);
              if (entered !== null) {
                updateTaskDueDate(task.id, entered.trim());
              }
            };

            dueBadge.addEventListener('click', (e) => {
              e.stopPropagation();
              promptNewDate();
            });

            dueBadge.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                promptNewDate();
              }
            });

            taskBody.appendChild(dueBadge);
          }
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete-task';
        deleteBtn.setAttribute('aria-label', `Delete task: "${task.text}"`);
        deleteBtn.title = 'Delete task';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteTask(task.id);
        });

        li.appendChild(checkBtn);
        li.appendChild(taskBody);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 11. View 3: CALENDAR Controller
  // ---------------------------------------------------------------------------
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function renderCalendar() {
    if (!calDaysGrid || !calMonthTitle) return;

    calMonthTitle.textContent = `${MONTH_NAMES[calCurrentMonth]} ${calCurrentYear}`;

    calDaysGrid.innerHTML = '';

    // First day of current month (0: Sun, 1: Mon, ...)
    const firstDayIndex = new Date(calCurrentYear, calCurrentMonth, 1).getDay();
    // Number of days in current month
    const totalDays = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
    // Number of days in previous month
    const prevMonthDays = new Date(calCurrentYear, calCurrentMonth, 0).getDate();

    const todayStr = getISOOffsetDate(0);

    // 1. Previous month trailing days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayNum = prevMonthDays - x + 1;
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.textContent = dayNum;
      calDaysGrid.appendChild(cell);
    }

    // 2. Current month days
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day-cell';

      const mStr = String(calCurrentMonth + 1).padStart(2, '0');
      const dStr = String(day).padStart(2, '0');
      const dateStr = `${calCurrentYear}-${mStr}-${dStr}`;

      cell.textContent = day;
      cell.setAttribute('data-date', dateStr);
      cell.setAttribute('aria-label', `${MONTH_NAMES[calCurrentMonth]} ${day}, ${calCurrentYear}`);

      if (dateStr === todayStr) {
        cell.classList.add('is-today');
      }

      if (dateStr === calSelectedDate) {
        cell.classList.add('is-selected');
      }

      // Check if this date has any user tasks
      const hasTasks = currentTasks.some(t => t.dueDate === dateStr);
      if (hasTasks) {
        cell.classList.add('has-tasks');
        const dot = document.createElement('span');
        dot.className = 'cal-task-dot';
        cell.appendChild(dot);
      }

      cell.addEventListener('click', () => {
        calSelectedDate = dateStr;
        renderCalendar();
        renderSelectedDateTasks();
      });

      calDaysGrid.appendChild(cell);
    }

    // 3. Next month trailing days to complete 35 or 42 grid cells
    const renderedCells = firstDayIndex + totalDays;
    const remainingCells = (renderedCells % 7 === 0) ? 0 : 7 - (renderedCells % 7);
    for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell other-month';
      cell.textContent = nextDay;
      calDaysGrid.appendChild(cell);
    }
  }

  function renderSelectedDateTasks() {
    if (!calSelectedDateHeading || !calTasksList) return;

    // Format selected date heading
    const parts = calSelectedDate.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      const todayStr = getISOOffsetDate(0);
      const isToday = calSelectedDate === todayStr;
      const dateFormatted = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      calSelectedDateHeading.textContent = isToday ? `Schedule for Today (${dateFormatted})` : `Schedule for ${dateFormatted}`;
    }

    // Filter tasks for this date
    const dateTasks = currentTasks.filter(t => t.dueDate === calSelectedDate);

    if (calSelectedCount) {
      calSelectedCount.textContent = `${dateTasks.length} task${dateTasks.length === 1 ? '' : 's'} scheduled`;
    }

    calTasksList.innerHTML = '';

    if (dateTasks.length === 0) {
      if (calEmptyState) calEmptyState.classList.remove('hidden');
    } else {
      if (calEmptyState) calEmptyState.classList.add('hidden');

      dateTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `cal-task-item ${task.completed ? 'completed' : ''}`;

        const checkBtn = document.createElement('button');
        checkBtn.type = 'button';
        checkBtn.className = `task-checkbox-btn ${task.completed ? 'checked' : ''}`;
        checkBtn.setAttribute('aria-label', `Toggle task: ${task.text}`);
        checkBtn.innerHTML = task.completed ? '<span class="check-icon">✓</span>' : '';
        checkBtn.addEventListener('click', () => {
          toggleTask(task.id);
          renderSelectedDateTasks();
        });

        const textSpan = document.createElement('span');
        textSpan.className = 'cal-task-text';
        textSpan.textContent = task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete-task';
        deleteBtn.setAttribute('aria-label', `Delete task: "${task.text}"`);
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.addEventListener('click', () => {
          deleteTask(task.id);
          renderSelectedDateTasks();
        });

        li.appendChild(checkBtn);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        calTasksList.appendChild(li);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 12. View 4: SETTINGS Controller
  // ---------------------------------------------------------------------------
  function renderSettings() {
    if (!currentUser) return;

    if (settingsUserName) settingsUserName.textContent = currentUser.name;
    if (settingsUserUsername) settingsUserUsername.textContent = `@${currentUser.username}`;
    if (settingsUserId) settingsUserId.textContent = currentUser.id;
    if (settingsStorageKey) settingsStorageKey.textContent = `${TASK_STORAGE_PREFIX}${currentUser.id}`;

    if (settingsTaskCountText) {
      const count = currentTasks.length;
      settingsTaskCountText.textContent = `You have ${count} task${count === 1 ? '' : 's'} stored in this browser.`;
    }
  }

  function handleResetStarterTasks() {
    if (!currentUser) return;
    const seed = SEED_USERS.find(s => s.id === currentUser.id);
    const starter = seed ? seed.starterTasks : [
      { id: `t_${Date.now()}_1`, text: 'Organize daily study priorities 📚', completed: false, dueDate: getISOOffsetDate(0) },
      { id: `t_${Date.now()}_2`, text: 'Review lecture notes and summaries ✍️', completed: false, dueDate: getISOOffsetDate(1) }
    ];

    currentTasks = starter.map(t => ({ ...t }));
    saveUserTasks();
    refreshAllViews();
    alert('Starter goals have been restored successfully ✧');
  }

  // ---------------------------------------------------------------------------
  // 13. Event Listeners Attachment
  // ---------------------------------------------------------------------------
  // Auth Tab Toggles
  if (tabLogin) tabLogin.addEventListener('click', showLoginTab);
  if (tabRegister) tabRegister.addEventListener('click', showRegisterTab);
  if (switchToRegisterBtn) switchToRegisterBtn.addEventListener('click', showRegisterTab);
  if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', showLoginTab);

  // Password Visibility Toggles
  setupPasswordToggle('toggle-login-password', 'login-password');
  setupPasswordToggle('toggle-register-password', 'register-password');
  setupPasswordToggle('toggle-register-confirm', 'register-confirm');

  // Auth Forms submission
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);

  // Logout Buttons
  if (btnSidebarLogout) btnSidebarLogout.addEventListener('click', handleLogout);
  if (btnTopLogout) btnTopLogout.addEventListener('click', handleLogout);
  if (settingsLogoutBtn) settingsLogoutBtn.addEventListener('click', handleLogout);

  // Desktop Navigation Buttons
  desktopNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view) switchView(view);
    });
  });

  // Mobile Navigation Buttons
  mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view) switchView(view);
    });
  });

  // Dashboard "View My Tasks" Link Button
  if (btnGoToTasks) {
    btnGoToTasks.addEventListener('click', () => {
      switchView('tasks');
    });
  }

  // My Tasks: Add Task Form
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = taskInput ? taskInput.value : '';
      const date = taskDueDate ? taskDueDate.value : '';
      addTask(text, date);
    });
  }

  if (taskInput) {
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const text = taskInput.value;
        const date = taskDueDate ? taskDueDate.value : '';
        addTask(text, date);
      }
    });
    taskInput.addEventListener('input', () => {
      clearTaskError();
    });
  }

  // My Tasks: Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      currentFilter = this.dataset.filter;
      renderTasksAndProgress();
    });
  });

  // Calendar Navigation Controls
  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', () => {
      calCurrentMonth--;
      if (calCurrentMonth < 0) {
        calCurrentMonth = 11;
        calCurrentYear--;
      }
      renderCalendar();
    });
  }

  if (calNextBtn) {
    calNextBtn.addEventListener('click', () => {
      calCurrentMonth++;
      if (calCurrentMonth > 11) {
        calCurrentMonth = 0;
        calCurrentYear++;
      }
      renderCalendar();
    });
  }

  if (calTodayBtn) {
    calTodayBtn.addEventListener('click', () => {
      calCurrentYear = new Date().getFullYear();
      calCurrentMonth = new Date().getMonth();
      calSelectedDate = getISOOffsetDate(0);
      renderCalendar();
      renderSelectedDateTasks();
    });
  }

  // Calendar Quick Add Form
  if (calQuickAddForm) {
    calQuickAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = calQuickInput ? calQuickInput.value.trim() : '';
      if (!text) return;
      addTask(text, calSelectedDate);
      if (calQuickInput) calQuickInput.value = '';
      renderSelectedDateTasks();
    });
  }

  if (calQuickInput) {
    calQuickInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const text = calQuickInput.value.trim();
        if (!text) return;
        addTask(text, calSelectedDate);
        calQuickInput.value = '';
        renderSelectedDateTasks();
      }
    });
  }

  // Settings: Theme Switcher Buttons
  themeOptionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      if (theme) applyTheme(theme);
    });
  });

  // Settings: Reset Starter Tasks
  if (btnResetStarterTasks) {
    btnResetStarterTasks.addEventListener('click', handleResetStarterTasks);
  }

  // ---------------------------------------------------------------------------
  // 14. Application Initialization
  // ---------------------------------------------------------------------------
  initializeTheme();
  initializeUsersStorage();

  const savedSession = getSession();
  if (savedSession) {
    const users = getUsers();
    const userStillExists = users.some(u => u.id === savedSession.id);
    if (userStillExists) {
      currentUser = savedSession;
      showAuthenticatedApp();
    } else {
      clearSession();
      showAuthView();
    }
  } else {
    showAuthView();
  }

  // ---------------------------------------------------------------------------
  // 15. Global Lunelle & TaskFlow API for Automated Testing & Verification
  // ---------------------------------------------------------------------------
  window.Lunelle = window.TaskFlow = {
    switchView,
    addTask,
    toggleTask,
    deleteTask,
    updateTaskDueDate,
    loadUserTasks,
    saveUserTasks,
    applyTheme,
    handleLogout,
    handleLogin,
    handleRegister,
    getCurrentUser: () => currentUser,
    getCurrentTasks: () => [...currentTasks],
    getActiveView: () => activeViewName,
    getCalendarState: () => ({ year: calCurrentYear, month: calCurrentMonth, selectedDate: calSelectedDate })
  };

})();
