import { lessons } from './data/lessons.js';
import { exercises as defaultExercises } from './data/exercises.js';
import { playgroundExercises as defaultPlaygroundExercises } from './data/playgroundExercises.js';
import { executeSQL, getSchema, resetDatabase, getDBState, importSQLSchema, restoreDefaultSchema, getFullDBState, setFullDBState, VIEWS, PROCEDURES, FUNCTIONS, TRIGGERS, SEQUENCES, CONSTRAINTS, INDEXES, DIAGRAMS } from './sqlEngine.js';

let exercises = [...defaultExercises];
let playgroundExercises = [...defaultPlaygroundExercises];
let userPlaygrounds = [];
let activePlaygroundId = 'system';

// ===== LOAD FROM DATABASE =====
async function loadDataFromDatabase() {
  try {
    const quizRes = await fetch('/api/quizzes');
    if (quizRes.ok) {
      const dbQuizzes = await quizRes.json();
      if (dbQuizzes && dbQuizzes.length > 0) {
        exercises = dbQuizzes;
        showQuizSelect();
        renderDashboard();
      }
    }
  } catch (e) {
    console.warn('Không tải được trắc nghiệm từ database, sử dụng dữ liệu mặc định.');
  }

  try {
    const pgRes = await fetch('/api/playground');
    if (pgRes.ok) {
      const dbPg = await pgRes.json();
      if (dbPg && dbPg.length > 0) {
        playgroundExercises = dbPg;
        initPgExercises();
        renderDashboard();
      }
    }
  } catch (e) {
    console.warn('Không tải được bài tập SQL từ database, sử dụng dữ liệu mặc định.');
  }

  try {
    const token = localStorage.getItem('sqllab_token');
    if (token) {
      const userPgRes = await fetch('/api/user-playgrounds', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userPgRes.ok) {
        userPlaygrounds = await userPgRes.json();
      }
    }
  } catch (e) {
    console.warn('Không tải được danh sách playground tùy chỉnh:', e);
  }

  renderPlaygroundSelector();
  updatePlaygroundActionButtons();
}


// ===== STATE =====
let currentPage = 'dashboard';
let quizState = { chapter: null, idx: 0, answers: [], answered: false };
let currentPgEx = null; // Current active playground exercise
let activePgTab = 'schema'; // 'schema' or 'exercises'

// ===== STORAGE =====
// ===== STORAGE =====
let userProgressCache = null;

async function syncProgressWithServer() {
  const token = localStorage.getItem('sqllab_token');
  if (!token) return;
  try {
    const res = await fetch('/api/progress', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      userProgressCache = await res.json();
      renderDashboard();
      
      const select = document.getElementById('pg-chapter-select');
      if (currentPage === 'playground' && select) {
        renderPgExerciseList(parseInt(select.value));
      }
    }
  } catch (e) {
    console.warn('Lỗi khi đồng bộ tiến độ từ server:', e);
  }
}

function getProgress() {
  if (userProgressCache) {
    return userProgressCache;
  }
  try {
    const p = JSON.parse(localStorage.getItem('sqllab_progress')) || {};
    if (!p.lessonsRead) p.lessonsRead = [];
    if (!p.quizScores) p.quizScores = {};
    if (!p.passedExercises) p.passedExercises = [];
    return p;
  } catch {
    return { lessonsRead: [], quizScores: {}, passedExercises: [] };
  }
}

function saveProgress(p) {
  localStorage.setItem('sqllab_progress', JSON.stringify(p));
}

async function saveLessonRead(lessonId) {
  const p = getProgress();
  if (!p.lessonsRead.includes(lessonId)) {
    p.lessonsRead.push(lessonId);
  }
  saveProgress(p);

  const token = localStorage.getItem('sqllab_token');
  if (token) {
    try {
      await fetch('/api/progress/lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId })
      });
    } catch (e) {
      console.error('Không thể lưu tiến độ bài học lên server:', e);
    }
  }
  renderDashboard();
}

async function saveQuizScore(chapterId, score) {
  const p = getProgress();
  const prev = p.quizScores[chapterId] || 0;
  if (score > prev) {
    p.quizScores[chapterId] = score;
  }
  saveProgress(p);

  const token = localStorage.getItem('sqllab_token');
  if (token) {
    try {
      await fetch('/api/progress/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chapterId, score })
      });
    } catch (e) {
      console.error('Không thể lưu điểm trắc nghiệm lên server:', e);
    }
  }
  renderDashboard();
}

async function saveExercisePassed(exerciseId) {
  const p = getProgress();
  if (!p.passedExercises.includes(exerciseId)) {
    p.passedExercises.push(exerciseId);
  }
  saveProgress(p);

  const token = localStorage.getItem('sqllab_token');
  if (token) {
    try {
      await fetch('/api/progress/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ exerciseId })
      });
    } catch (e) {
      console.error('Không thể lưu tiến độ thực hành lên server:', e);
    }
  }
  renderDashboard();
}

// ===== AUTHENTICATION =====
function setupAuth() {
  const authScreen = document.getElementById('auth-screen');
  const appLayout = document.getElementById('app-layout');
  const authForm = document.getElementById('auth-form');
  const tabLoginBtn = document.getElementById('tab-login-btn');
  const tabRegisterBtn = document.getElementById('tab-register-btn');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authSwitchLink = document.getElementById('auth-switch-link');
  const authSwitchText = document.getElementById('auth-switch-text');
  const authOfflineBtn = document.getElementById('auth-offline-btn');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const sidebarUserCard = document.getElementById('sidebar-user-card');
  const userNameSpan = document.getElementById('user-name-span');
  const logoutBtn = document.getElementById('logout-btn');

  let mode = 'login'; // 'login' or 'register'

  function setMode(newMode) {
    mode = newMode;
    authErrorMsg.style.display = 'none';
    if (mode === 'login') {
      tabLoginBtn.classList.add('active');
      tabRegisterBtn.classList.remove('active');
      authSubmitBtn.textContent = 'Đăng Nhập';
      authSwitchText.innerHTML = 'Chưa có tài khoản? <span id="auth-switch-link" style="color:var(--accent-purple-light);font-weight:600;cursor:pointer;">Đăng ký ngay</span>';
    } else {
      tabRegisterBtn.classList.add('active');
      tabLoginBtn.classList.remove('active');
      authSubmitBtn.textContent = 'Đăng Ký';
      authSwitchText.innerHTML = 'Đã có tài khoản? <span id="auth-switch-link" style="color:var(--accent-purple-light);font-weight:600;cursor:pointer;">Đăng nhập ngay</span>';
    }
    // Re-bind the switch link
    const newLink = document.getElementById('auth-switch-link');
    if (newLink) {
      newLink.addEventListener('click', () => {
        setMode(mode === 'login' ? 'register' : 'login');
      });
    }
  }

  // Tab events
  tabLoginBtn.addEventListener('click', () => setMode('login'));
  tabRegisterBtn.addEventListener('click', () => setMode('register'));

  // Switch link initial event
  if (authSwitchLink) {
    authSwitchLink.addEventListener('click', () => {
      setMode(mode === 'login' ? 'register' : 'login');
    });
  }

  // Form submit
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authErrorMsg.style.display = 'none';
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;

    if (!username || !password) return;

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra.');
      }

      // Login success
      localStorage.setItem('sqllab_token', data.token);
      localStorage.setItem('sqllab_username', data.user.username);
      
      authScreen.style.display = 'none';
      appLayout.style.display = 'flex';
      userNameSpan.textContent = data.user.username;
      sidebarUserCard.style.display = 'flex';

      // Clear fields
      document.getElementById('auth-username').value = '';
      document.getElementById('auth-password').value = '';

      // Sync and reload
      await syncProgressWithServer();
      await loadDataFromDatabase();

    } catch (err) {
      authErrorMsg.textContent = err.message;
      authErrorMsg.style.display = 'block';
    }
  });

  // Offline mode
  authOfflineBtn.addEventListener('click', () => {
    localStorage.removeItem('sqllab_token');
    localStorage.removeItem('sqllab_username');
    userProgressCache = null;

    authScreen.style.display = 'none';
    appLayout.style.display = 'flex';
    userNameSpan.textContent = 'Guest (Offline)';
    sidebarUserCard.style.display = 'flex';
    
    // Clear and reload
    renderDashboard();
    initPgExercises();
    showQuizSelect();
  });

  // Logout button
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('sqllab_token');
    localStorage.removeItem('sqllab_username');
    userProgressCache = null;

    authScreen.style.display = 'flex';
    appLayout.style.display = 'none';
    sidebarUserCard.style.display = 'none';

    // Clear form
    document.getElementById('auth-username').value = '';
    document.getElementById('auth-password').value = '';
    setMode('login');
  });

  // Check initial state
  const token = localStorage.getItem('sqllab_token');
  const username = localStorage.getItem('sqllab_username');
  if (token && username) {
    authScreen.style.display = 'none';
    appLayout.style.display = 'flex';
    userNameSpan.textContent = username;
    sidebarUserCard.style.display = 'flex';
    syncProgressWithServer();
  } else {
    authScreen.style.display = 'flex';
    appLayout.style.display = 'none';
    sidebarUserCard.style.display = 'none';
  }
}

// ===== NAVIGATION =====
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigateTo(item.dataset.page));
});

document.getElementById('sidebar-logo')?.addEventListener('click', () => {
  navigateTo('dashboard');
});

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === page));
  // Reset sub-views
  if (page === 'lessons') { showLessonsList(); }
  if (page === 'quiz') { showQuizSelect(); }
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

// Mobile
document.getElementById('hamburger-btn')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
});
document.getElementById('sidebar-overlay')?.addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
});

// Desktop Sidebar Collapse Toggle
document.getElementById('sidebar-toggle-btn')?.addEventListener('click', () => {
  const layout = document.querySelector('.app-layout');
  layout.classList.toggle('sidebar-collapsed');
  const collapsed = layout.classList.contains('sidebar-collapsed');
  localStorage.setItem('sidebar_collapsed', collapsed ? 'true' : 'false');
});

// Restore sidebar collapse state on load
(function() {
  const collapsed = localStorage.getItem('sidebar_collapsed') === 'true';
  if (collapsed) {
    document.querySelector('.app-layout')?.classList.add('sidebar-collapsed');
  }
})();

// ===== DASHBOARD =====
function renderDashboard() {
  const p = getProgress();
  const totalLessons = lessons.length;
  const readCount = p.lessonsRead.length;
  const totalQuizzes = exercises.length;
  const quizDone = Object.keys(p.quizScores).length;
  const bestScores = Object.values(p.quizScores);
  const avgScore = bestScores.length ? Math.round(bestScores.reduce((a, b) => a + b, 0) / bestScores.length) : 0;
  
  const totalPgEx = playgroundExercises.reduce((sum, ch) => sum + ch.exercises.length, 0);
  const passedPgCount = p.passedExercises ? p.passedExercises.length : 0;
  
  const overallPct = Math.round(((readCount + quizDone + passedPgCount) / (totalLessons + totalQuizzes + totalPgEx)) * 100);

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card"><div class="stat-icon purple"><i class="fas fa-book-open"></i></div>
      <div class="stat-info"><h3>${readCount}/${totalLessons}</h3><p>Bài học đã đọc</p></div></div>
    <div class="stat-card"><div class="stat-icon cyan"><i class="fas fa-question-circle"></i></div>
      <div class="stat-info"><h3>${quizDone}/${totalQuizzes}</h3><p>Bài trắc nghiệm</p></div></div>
    <div class="stat-card"><div class="stat-icon green"><i class="fas fa-terminal"></i></div>
      <div class="stat-info"><h3>${passedPgCount}/${totalPgEx}</h3><p>Bài tập SQL</p></div></div>
    <div class="stat-card"><div class="stat-icon amber"><i class="fas fa-trophy"></i></div>
      <div class="stat-info"><h3>${overallPct}%</h3><p>Tiến độ tổng</p></div></div>`;

  document.getElementById('progress-fill').style.width = overallPct + '%';
  document.getElementById('progress-text').textContent = overallPct + '%';

  document.getElementById('dashboard-chapters').innerHTML = lessons.map(l => {
    const read = p.lessonsRead.includes(l.id);
    const score = p.quizScores[l.id];
    // Count passed exercises for this chapter
    const chExs = playgroundExercises.find(c => c.chapter === l.id)?.exercises || [];
    const chPassedCount = chExs.filter(e => p.passedExercises.includes(e.id)).length;
    
    return `<div class="card lesson-card" onclick="window._openLesson(${l.id})">
      <div class="lesson-number">${l.id}</div>
      <h3>Chương ${l.id}: ${l.title}</h3>
      <p>${l.summary}</p>
      <span class="lesson-tag">${l.tag}</span>
      <div style="margin-top:12px; display:flex; flex-direction:column; gap:4px; font-size:12px;">
        ${read ? '<div class="lesson-status" style="margin:0;"><i class="fas fa-check-circle"></i> Đã đọc</div>' : ''}
        ${score !== undefined ? `<div class="lesson-status" style="margin:0;color:var(--accent-cyan)"><i class="fas fa-chart-bar"></i> Quiz: ${score}%</div>` : ''}
        ${chExs.length > 0 ? `<div class="lesson-status" style="margin:0;color:var(--accent-purple-light)"><i class="fas fa-terminal"></i> Bài tập: ${chPassedCount}/${chExs.length}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ===== LESSONS =====
function showLessonsList() {
  document.getElementById('lessons-list-view').style.display = '';
  document.getElementById('lesson-detail-view').style.display = 'none';
  const p = getProgress();
  document.getElementById('lessons-grid').innerHTML = lessons.map(l => {
    const read = p.lessonsRead.includes(l.id);
    return `<div class="card lesson-card" onclick="window._openLesson(${l.id})">
      <div class="lesson-number">${l.id}</div>
      <h3>Chương ${l.id}: ${l.title}</h3>
      <p>${l.summary}</p>
      <span class="lesson-tag">${l.tag}</span>
      ${read ? '<div class="lesson-status"><i class="fas fa-check-circle"></i> Đã đọc</div>' : ''}
    </div>`;
  }).join('');
}

window._openLesson = function(id) {
  navigateTo('lessons');
  const lesson = lessons.find(l => l.id === id);
  if (!lesson) return;
  document.getElementById('lessons-list-view').style.display = 'none';
  document.getElementById('lesson-detail-view').style.display = '';
  document.getElementById('lesson-content').innerHTML =
    `<h1 style="font-size:24px;margin-bottom:4px">Chương ${lesson.id}: ${lesson.title}</h1>
     <span class="badge badge-purple" style="margin-bottom:24px;display:inline-block">${lesson.tag}</span>
     ${lesson.content}`;
  // Mark as read
  saveLessonRead(id);
  // Add copy buttons to code blocks
  document.querySelectorAll('#lesson-content pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn'; btn.textContent = 'Copy';
    btn.onclick = () => { navigator.clipboard.writeText(pre.textContent.replace('Copy','')); btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = 'Copy', 1500); };
    pre.style.position = 'relative'; pre.appendChild(btn);
  });
};

document.getElementById('lesson-back-btn')?.addEventListener('click', showLessonsList);

// ===== QUIZ =====
function showQuizSelect() {
  document.getElementById('quiz-select-view').style.display = '';
  document.getElementById('quiz-play-view').style.display = 'none';
  const p = getProgress();
  
  const filterVal = document.getElementById('quiz-filter-select')?.value || 'all';
  let filtered = exercises;
  if (filterVal === 'system') {
    filtered = exercises.filter(ex => ex.chapter <= 8);
  } else if (filterVal === 'user') {
    filtered = exercises.filter(ex => ex.chapter > 8);
  }

  // Sort exercises by chapter number
  filtered.sort((a, b) => a.chapter - b.chapter);

  if (filtered.length === 0) {
    document.getElementById('quiz-chapters').innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); width: 100%;">
        <i class="fas fa-question-circle" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-purple); opacity: 0.5;"></i>
        <p>Không có bài trắc nghiệm nào trong mục này.</p>
      </div>
    `;
    return;
  }

  document.getElementById('quiz-chapters').innerHTML = filtered.map(ex => {
    const ch = ex.chapter;
    const lesson = lessons.find(l => l.id === ch);
    const score = p.quizScores[ch];
    
    // User added chapters (> 8) get a delete and edit/rename button
    const deleteBtn = ch > 8 ? `<button class="delete-btn" onclick="window._deleteQuiz(${ch}, event)" title="Xóa bài trắc nghiệm này"><i class="fas fa-trash-alt"></i></button>` : '';
    const editBtn = ch > 8 ? `<button class="edit-btn" onclick="window._renameQuiz(${ch}, event)" title="Đổi tên bài trắc nghiệm"><i class="fas fa-pencil-alt"></i></button>` : '';
    
    return `<div class="card quiz-chapter-card" onclick="window._startQuiz(${ch})">
      ${deleteBtn}
      ${editBtn}
      <div class="chapter-num">${ch}</div>
      <h3>${ex.title || (lesson ? lesson.title : 'Chương ' + ch)}</h3>
      <p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${ex.questions.length} câu hỏi</p>
      ${score !== undefined ? `<div class="quiz-score"><i class="fas fa-trophy"></i> Điểm cao nhất: ${score}%</div>` : '<span class="badge badge-cyan">Chưa làm</span>'}
    </div>`;
  }).join('');
}

window._deleteQuiz = function(chapter, event) {
  if (event) {
    event.stopPropagation();
  }
  if (!confirm(`Bạn có chắc chắn muốn xóa bài trắc nghiệm Chương ${chapter} cùng tất cả câu hỏi của nó?`)) {
    return;
  }
  
  exercises = exercises.filter(ex => ex.chapter !== chapter);
  saveQuizzesToServer();
  showQuizSelect();
  renderDashboard();
};

window._renameQuiz = function(chapter, event) {
  if (event) {
    event.stopPropagation();
  }
  const ex = exercises.find(e => e.chapter === chapter);
  if (!ex) return;

  const currentTitle = ex.title || `Chương ${chapter}`;
  const newTitle = prompt('Nhập tên mới cho bài trắc nghiệm:', currentTitle);
  if (newTitle === null) return;
  const trimmed = newTitle.trim();
  if (!trimmed) {
    alert('Tên bài trắc nghiệm không được để trống.');
    return;
  }

  ex.title = trimmed;
  saveQuizzesToServer();
  showQuizSelect();
};

window._startQuiz = function(chapter) {
  const ex = exercises.find(e => e.chapter === chapter);
  if (!ex) return;
  quizState = { chapter, idx: 0, answers: new Array(ex.questions.length).fill(null), answered: false };
  document.getElementById('quiz-select-view').style.display = 'none';
  document.getElementById('quiz-play-view').style.display = '';
  renderQuestion();
};

function renderQuestion() {
  const ex = exercises.find(e => e.chapter === quizState.chapter);
  const q = ex.questions[quizState.idx];
  const total = ex.questions.length;
  const pct = ((quizState.idx) / total) * 100;
  document.getElementById('quiz-progress-text').textContent = `Câu ${quizState.idx + 1}/${total}`;
  document.getElementById('quiz-progress-fill').style.width = pct + '%';

  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('quiz-question-area').innerHTML = `
    <div class="quiz-question-card">
      <h3><span class="badge badge-purple" style="margin-right:8px">Câu ${quizState.idx + 1}</span> ${q.q}</h3>
      <div id="quiz-options">
        ${q.o.map((opt, i) => `<div class="quiz-option" data-idx="${i}" onclick="window._selectOption(${i})">
          <div class="option-letter">${letters[i]}</div><span>${opt}</span>
        </div>`).join('')}
      </div>
      <div class="quiz-explanation" id="quiz-explanation"><strong>💡 Giải thích:</strong> ${q.e}</div>
    </div>`;

  quizState.answered = false;
  document.getElementById('quiz-check-btn').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'none';
}

window._selectOption = function(idx) {
  if (quizState.answered) return;
  quizState.answers[quizState.idx] = idx;
  document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
  document.querySelector(`.quiz-option[data-idx="${idx}"]`)?.classList.add('selected');
  document.getElementById('quiz-check-btn').style.display = '';
};

document.getElementById('quiz-check-btn')?.addEventListener('click', () => {
  const ex = exercises.find(e => e.chapter === quizState.chapter);
  const q = ex.questions[quizState.idx];
  const selected = quizState.answers[quizState.idx];
  quizState.answered = true;

  document.querySelectorAll('.quiz-option').forEach(o => {
    const i = parseInt(o.dataset.idx);
    o.classList.remove('selected');
    if (i === q.a) o.classList.add('correct');
    else if (i === selected) o.classList.add('wrong');
    o.style.pointerEvents = 'none';
  });

  document.getElementById('quiz-explanation').classList.add('show');
  document.getElementById('quiz-check-btn').style.display = 'none';
  const isLast = quizState.idx >= ex.questions.length - 1;
  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.style.display = '';
  nextBtn.innerHTML = isLast ? '<i class="fas fa-flag-checkered"></i> Xem Kết Quả' : 'Câu Tiếp <i class="fas fa-arrow-right"></i>';
});

document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
  const ex = exercises.find(e => e.chapter === quizState.chapter);
  if (quizState.idx >= ex.questions.length - 1) {
    showQuizResult();
  } else {
    quizState.idx++;
    renderQuestion();
  }
});

function showQuizResult() {
  const ex = exercises.find(e => e.chapter === quizState.chapter);
  let correct = 0;
  ex.questions.forEach((q, i) => { if (quizState.answers[i] === q.a) correct++; });
  const pct = Math.round((correct / ex.questions.length) * 100);

  // Save best score
  saveQuizScore(quizState.chapter, pct);

  const icon = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
  const title = pct >= 80 ? 'Xuất Sắc!' : pct >= 50 ? 'Khá Tốt!' : 'Cần Cố Gắng Thêm!';

  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-subtitle').textContent = `Chương ${quizState.chapter}`;
  document.getElementById('modal-correct').textContent = correct;
  document.getElementById('modal-total').textContent = ex.questions.length;
  document.getElementById('modal-percent').textContent = `Tỷ lệ đúng: ${pct}%`;
  document.getElementById('quiz-modal').classList.add('show');
}

document.getElementById('modal-close-btn')?.addEventListener('click', () => {
  document.getElementById('quiz-modal').classList.remove('show');
  showQuizSelect();
  renderDashboard();
});
document.getElementById('modal-retry-btn')?.addEventListener('click', () => {
  document.getElementById('quiz-modal').classList.remove('show');
  window._startQuiz(quizState.chapter);
});
document.getElementById('quiz-back-btn')?.addEventListener('click', showQuizSelect);

// ===== SQL PLAYGROUND =====
window.toggleSchemaFolder = function(header) {
  header.classList.toggle('expanded');
  const content = header.nextElementSibling;
  content.classList.toggle('show');
  
  const icon = header.querySelector('.folder-icon');
  
  if (header.classList.contains('expanded')) {
    if (icon) {
      if (icon.classList.contains('fa-folder')) {
        icon.className = icon.className.replace('fa-folder', 'fa-folder-open');
      }
    }
  } else {
    if (icon) {
      if (icon.classList.contains('fa-folder-open')) {
        icon.className = icon.className.replace('fa-folder-open', 'fa-folder');
      }
    }
  }
};

function renderSchema() {
  const schema = getSchema();
  const tables = {};
  const tempTables = {};
  
  for (const [tblName, cols] of Object.entries(schema)) {
    if (tblName.startsWith('#')) {
      tempTables[tblName] = cols;
    } else {
      tables[tblName] = cols;
    }
  }

  let html = '';

  // 1. TABLES FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: var(--accent-cyan-light)"></i>
        <span class="folder-name">Tables (Bảng)</span>
        <span class="badge badge-cyan">${Object.keys(tables).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(tables).length === 0 ? '<div class="schema-empty-msg">Chưa có bảng nào.</div>' : 
          Object.entries(tables).map(([tbl, cols]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${tbl}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-table" style="color:var(--accent-cyan)"></i> ${tbl}
              </div>
              <div class="schema-columns">
                ${cols.map((c, i) => `<div class="schema-col" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${c.name}')">${i === 0 ? '<span class="col-key" title="Primary Key">🔑</span>' : '<span style="width:14px;display:inline-block"></span>'} ${c.name}</div>`).join('')}
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 2. VIEWS FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: var(--accent-green)"></i>
        <span class="folder-name">Views (Khung nhìn)</span>
        <span class="badge badge-green">${Object.keys(VIEWS).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(VIEWS).length === 0 ? '<div class="schema-empty-msg">Chưa có view nào.</div>' : 
          Object.entries(VIEWS).map(([viewName, query]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${viewName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-eye" style="color:var(--accent-green)"></i> ${viewName}
              </div>
              <div class="schema-columns">
                <div class="schema-col-view-query" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${query}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 3. PROCEDURES FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: var(--accent-purple-light)"></i>
        <span class="folder-name">Procedures (Thủ tục)</span>
        <span class="badge badge-purple">${Object.keys(PROCEDURES).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(PROCEDURES).length === 0 ? '<div class="schema-empty-msg">Chưa có thủ tục nào.</div>' : 
          Object.entries(PROCEDURES).map(([procName, procObj]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${procName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-project-diagram" style="color:var(--accent-purple-light)"></i> ${procName}
              </div>
              <div class="schema-columns">
                <div style="padding: 4px 12px; font-size: 11px; color: var(--text-muted); font-style: italic;">
                  Tham số: ${procObj.params && procObj.params.length > 0 ? procObj.params.join(', ') : 'Không có'}
                </div>
                <div class="schema-col-proc-body" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${procObj.body}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 4. FUNCTIONS FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: #f59e0b"></i>
        <span class="folder-name">Functions (Hàm)</span>
        <span class="badge" style="background: rgba(245,158,11,0.15); color: #f59e0b;">${Object.keys(FUNCTIONS).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(FUNCTIONS).length === 0 ? '<div class="schema-empty-msg">Chưa có hàm nào.</div>' : 
          Object.entries(FUNCTIONS).map(([fnName, fnObj]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${fnName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-code" style="color:#f59e0b"></i> ${fnName}
              </div>
              <div class="schema-columns">
                <div class="schema-col-proc-body" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${fnObj.body}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 5. TRIGGERS FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: #ec4899"></i>
        <span class="folder-name">Triggers (Bộ kích hoạt)</span>
        <span class="badge" style="background: rgba(236,72,153,0.15); color: #ec4899;">${Object.keys(TRIGGERS).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(TRIGGERS).length === 0 ? '<div class="schema-empty-msg">Chưa có trigger nào.</div>' : 
          Object.entries(TRIGGERS).map(([trName, trObj]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${trName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-bolt" style="color:#ec4899"></i> ${trName}
              </div>
              <div class="schema-columns">
                <div class="schema-col-proc-body" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${trObj.body}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 6. TEMP TABLES FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: var(--accent-red)"></i>
        <span class="folder-name">Temp Tables (Bảng tạm)</span>
        <span class="badge badge-red">${Object.keys(tempTables).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(tempTables).length === 0 ? '<div class="schema-empty-msg">Chưa có bảng tạm nào.</div>' : 
          Object.entries(tempTables).map(([tbl, cols]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${tbl}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-hashtag" style="color:var(--accent-red)"></i> ${tbl}
              </div>
              <div class="schema-columns">
                ${cols.map((c, i) => `<div class="schema-col" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${c.name}')">${i === 0 ? '<span class="col-key" title="Primary Key">🔑</span>' : '<span style="width:14px;display:inline-block"></span>'} ${c.name}</div>`).join('')}
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 7. SEQUENCES FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: #a855f7"></i>
        <span class="folder-name">Sequences (Chuỗi)</span>
        <span class="badge" style="background: rgba(168,85,247,0.15); color: #a855f7;">${Object.keys(SEQUENCES).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(SEQUENCES).length === 0 ? '<div class="schema-empty-msg">Chưa có chuỗi nào.</div>' : 
          Object.entries(SEQUENCES).map(([seqName, seqObj]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${seqName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-sort-numeric-up" style="color:#a855f7"></i> ${seqName}
              </div>
              <div class="schema-columns">
                <div class="schema-col-proc-body" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${seqObj.body}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 8. CONSTRAINTS FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: #14b8a6"></i>
        <span class="folder-name">Constraints (Ràng buộc)</span>
        <span class="badge" style="background: rgba(20,184,166,0.15); color: #14b8a6;">${Object.keys(CONSTRAINTS).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(CONSTRAINTS).length === 0 ? '<div class="schema-empty-msg">Chưa có ràng buộc nào.</div>' : 
          Object.entries(CONSTRAINTS).map(([consName, consObj]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${consName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-key" style="color:#14b8a6"></i> ${consName}
              </div>
              <div class="schema-columns">
                <div style="padding: 4px 12px; font-size: 11px; color: var(--text-muted);">
                  Bảng: <strong style="color:var(--text-primary)">${consObj.tableName}</strong>
                </div>
                <div class="schema-col-proc-body" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${consObj.body}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 9. INDEXES FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: #6366f1"></i>
        <span class="folder-name">Indexes (Chỉ mục)</span>
        <span class="badge" style="background: rgba(99,102,241,0.15); color: #6366f1;">${Object.keys(INDEXES).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.keys(INDEXES).length === 0 ? '<div class="schema-empty-msg">Chưa có chỉ mục nào.</div>' : 
          Object.entries(INDEXES).map(([idxName, idxObj]) =>
            `<div class="schema-table">
              <div class="schema-table-name" onclick="this.classList.toggle('expanded');this.nextElementSibling.classList.toggle('show')" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${idxName}')">
                <i class="fas fa-chevron-right"></i> <i class="fas fa-search" style="color:#6366f1"></i> ${idxName}
              </div>
              <div class="schema-columns">
                <div style="padding: 4px 12px; font-size: 11px; color: var(--text-muted);">
                  Bảng: <strong style="color:var(--text-primary)">${idxObj.tableName}</strong>
                </div>
                <div class="schema-col-proc-body" style="padding: 6px 12px; font-family: monospace; font-size: 11px; color: var(--text-muted); background: rgba(255,255,255,0.03); border-radius: 4px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">${idxObj.body}</div>
              </div>
            </div>`
          ).join('')
        }
      </div>
    </div>
  `;

  // 10. DIAGRAMS FOLDER
  html += `
    <div class="schema-folder">
      <div class="schema-folder-header" onclick="toggleSchemaFolder(this)">
        <i class="fas fa-chevron-right folder-chevron"></i>
        <i class="fas fa-folder folder-icon" style="color: #f43f5e"></i>
        <span class="folder-name">Diagrams (Sơ đồ)</span>
        <span class="badge" style="background: rgba(244,63,94,0.15); color: #f43f5e;">${Object.keys(DIAGRAMS).length}</span>
      </div>
      <div class="schema-folder-content">
        ${Object.entries(DIAGRAMS).map(([diagKey, diagObj]) =>
          `<div class="schema-table">
            <div class="schema-table-name" onclick="window.showDiagramModal()" style="color: var(--accent-rose-light); cursor: pointer;">
              <i class="fas fa-sitemap" style="color:#f43f5e"></i> ${diagObj.name}
            </div>
          </div>`
        ).join('')}
      </div>
    </div>
  `;

  document.getElementById('schema-list').innerHTML = html;
}

function getCaretIndexFromCoords(editor, clientX, clientY) {
  const rect = editor.getBoundingClientRect();
  const styles = getComputedStyle(editor);
  const paddingLeft = parseFloat(styles.paddingLeft) || 0;
  const paddingTop = parseFloat(styles.paddingTop) || 0;
  
  const x = clientX - rect.left - paddingLeft;
  const y = clientY - rect.top - paddingTop + editor.scrollTop;
  
  const charSpan = document.createElement('span');
  charSpan.style.fontFamily = styles.fontFamily;
  charSpan.style.fontSize = styles.fontSize;
  charSpan.style.fontWeight = styles.fontWeight;
  charSpan.style.visibility = 'hidden';
  charSpan.style.position = 'absolute';
  charSpan.textContent = 'A';
  document.body.appendChild(charSpan);
  const charWidth = charSpan.getBoundingClientRect().width || 8.4;
  document.body.removeChild(charSpan);
  
  const lineHeight = parseFloat(styles.lineHeight) || (parseFloat(styles.fontSize) * 1.7) || 24;
  
  const targetLine = Math.max(0, Math.floor(y / lineHeight));
  const targetCol = Math.max(0, Math.round(x / charWidth));
  
  const lines = editor.value.split('\n');
  let index = 0;
  for (let i = 0; i < targetLine && i < lines.length; i++) {
    index += lines[i].length + 1;
  }
  
  if (targetLine < lines.length) {
    index += Math.min(targetCol, lines[targetLine].length);
  } else {
    index = editor.value.length;
  }
  
  return index;
}

function setupDragAndDrop() {
  const editor = document.getElementById('sql-editor');
  const wrapper = document.querySelector('.sql-editor-wrapper');
  if (!editor || !wrapper) return;

  wrapper.addEventListener('dragenter', (e) => {
    e.preventDefault();
    wrapper.classList.add('dragover');
    editor.focus();
  });

  wrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    wrapper.classList.add('dragover');
    editor.focus();
    const idx = getCaretIndexFromCoords(editor, e.clientX, e.clientY);
    editor.selectionStart = editor.selectionEnd = idx;
  });

  wrapper.addEventListener('dragleave', () => {
    wrapper.classList.remove('dragover');
  });

  wrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    wrapper.classList.remove('dragover');
    const text = e.dataTransfer.getData('text/plain');
    if (!text) return;

    const startPos = editor.selectionStart;
    const endPos = editor.selectionEnd;
    const oldVal = editor.value;
    editor.value = oldVal.substring(0, startPos) + text + oldVal.substring(endPos);

    editor.selectionStart = editor.selectionEnd = startPos + text.length;
    if (window.triggerEditorHighlight) window.triggerEditorHighlight();
    editor.focus();
  });
}

window.togglePlaygroundCard = function(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.classList.toggle('collapsed');
  
  // Update chevron icon inside the toggle button
  const btnIcon = card.querySelector('.card-toggle-btn i');
  if (btnIcon) {
    if (card.classList.contains('collapsed')) {
      btnIcon.className = 'fas fa-chevron-right';
      card.querySelector('.card-toggle-btn').title = "Mở rộng panel";
    } else {
      btnIcon.className = 'fas fa-chevron-left';
      card.querySelector('.card-toggle-btn').title = "Thu gọn panel";
    }
  }
  
  updatePlaygroundLayoutColumns();
};

function updatePlaygroundLayoutColumns() {
  const layout = document.querySelector('.playground-layout');
  if (!layout) return;
  
  const exCard = document.getElementById('pg-exercises-card');
  const scCard = document.getElementById('pg-schema-card');
  
  let exWidth = '300px';
  if (exCard && exCard.classList.contains('collapsed')) {
    exWidth = '50px';
  }
  
  let scWidth = '280px';
  if (scCard && scCard.classList.contains('collapsed')) {
    scWidth = '50px';
  }
  
  // Only apply custom grid template columns on wide screens
  if (window.innerWidth > 1200) {
    layout.style.gridTemplateColumns = `${exWidth} ${scWidth} 1fr`;
  } else {
    layout.style.gridTemplateColumns = '';
  }
}

// Re-adjust columns when resizing window
window.addEventListener('resize', updatePlaygroundLayoutColumns);

function initPgExercises() {
  const select = document.getElementById('pg-chapter-select');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = playgroundExercises.map(ch => 
    `<option value="${ch.chapter}">Chương ${ch.chapter}: ${ch.title}</option>`
  ).join('');
  
  if (!select.dataset.hasListener) {
    select.addEventListener('change', () => renderPgExerciseList(parseInt(select.value)));
    select.dataset.hasListener = "true";
  }
  
  if (currentVal && playgroundExercises.some(ch => ch.chapter == currentVal)) {
    select.value = currentVal;
  }
  renderPgExerciseList(parseInt(select.value || (playgroundExercises[0]?.chapter || 1)));
}

function renderPgExerciseList(chapterId) {
  const chData = playgroundExercises.find(c => c.chapter === chapterId);
  const listContainer = document.getElementById('pg-exercise-list');
  if (!chData) {
    listContainer.innerHTML = '';
    return;
  }

  const p = getProgress();
  listContainer.innerHTML = chData.exercises.map(ex => {
    const isPassed = p.passedExercises.includes(ex.id);
    const activeClass = currentPgEx && currentPgEx.id === ex.id ? 'active' : '';
    const passedClass = isPassed ? 'passed' : '';
    const diffClass = ex.difficulty === 'Dễ' ? 'easy' : ex.difficulty === 'Trung bình' ? 'medium' : 'hard';
    
    return `<div class="pg-ex-item ${activeClass} ${passedClass}" data-id="${ex.id}" onclick="window._selectPgExercise(${ex.id})">
      <div class="title-wrapper">
        <span class="status-icon ${isPassed ? 'passed' : 'pending'}">
          <i class="${isPassed ? 'fas fa-check-circle' : 'far fa-circle'}"></i>
        </span>
        <span style="font-weight:500;">${ex.title}</span>
      </div>
      <span class="pg-ex-badge ${diffClass}">${ex.difficulty}</span>
    </div>`;
  }).join('');
}

window._selectPgExercise = function(id) {
  let foundEx = null;
  for (const ch of playgroundExercises) {
    foundEx = ch.exercises.find(e => e.id === id);
    if (foundEx) break;
  }
  if (!foundEx) return;

  currentPgEx = foundEx;
  
  // Highlight active
  document.querySelectorAll('.pg-ex-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.id) === id);
  });

  // Show action buttons in header
  const closeBtn = document.getElementById('pg-close-exercise-btn');
  const submitBtn = document.getElementById('submit-sql-btn');
  const hintBtn = document.getElementById('pg-hint-btn');
  
  if (closeBtn) closeBtn.style.display = 'inline-flex';
  if (submitBtn) submitBtn.style.display = 'inline-flex';
  if (hintBtn) hintBtn.style.display = 'inline-flex';

  // Hide hint banner initially
  const hintBanner = document.getElementById('pg-editor-hint-banner');
  if (hintBanner) hintBanner.style.display = 'none';

  // Populate basic comment in editor
  const chapterNum = Math.floor(foundEx.id / 100);
  const commentText = `-- CHƯƠNG ${chapterNum} - BÀI TẬP: ${foundEx.title} (${foundEx.difficulty})
-- ĐỀ BÀI: ${foundEx.desc}
-- Viết câu lệnh SQL của bạn dưới đây:
`;
  const editor = document.getElementById('sql-editor');
  editor.value = commentText;
  if (window.triggerEditorHighlight) window.triggerEditorHighlight();
  editor.focus();
};

// Close/Clear Active Exercise
document.getElementById('pg-close-exercise-btn')?.addEventListener('click', () => {
  currentPgEx = null;
  const closeBtn = document.getElementById('pg-close-exercise-btn');
  const submitBtn = document.getElementById('submit-sql-btn');
  const hintBtn = document.getElementById('pg-hint-btn');
  const hintBanner = document.getElementById('pg-editor-hint-banner');
  
  if (closeBtn) closeBtn.style.display = 'none';
  if (submitBtn) submitBtn.style.display = 'none';
  if (hintBtn) hintBtn.style.display = 'none';
  if (hintBanner) hintBanner.style.display = 'none';
  
  document.querySelectorAll('.pg-ex-item').forEach(item => item.classList.remove('active'));
  const editor = document.getElementById('sql-editor');
  editor.value = '';
  if (window.triggerEditorHighlight) window.triggerEditorHighlight();
});

// Toggle Hint Banner Click Handler
document.getElementById('pg-hint-btn')?.addEventListener('click', () => {
  if (!currentPgEx) return;
  const hintBanner = document.getElementById('pg-editor-hint-banner');
  const hintText = document.getElementById('pg-editor-hint-text');
  if (hintBanner && hintText) {
    if (hintBanner.style.display === 'none' || hintBanner.style.display === '') {
      hintText.textContent = currentPgEx.hint;
      hintBanner.style.display = 'flex';
    } else {
      hintBanner.style.display = 'none';
    }
  }
});

document.getElementById('run-sql-btn')?.addEventListener('click', runPlaygroundSQL);
document.getElementById('sql-editor')?.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key === 'Enter') { 
    e.preventDefault(); 
    if (currentPgEx) {
      submitPlaygroundSQL();
    } else {
      runPlaygroundSQL(); 
    }
  }
});

function runPlaygroundSQL() {
  const sql = document.getElementById('sql-editor').value.trim();
  if (!sql) return;
  const result = executeSQL(sql);
  const timeStr = `${result.time.toFixed(1)} ms`;
  document.getElementById('result-time').textContent = timeStr;

  if (result.type === 'result') {
    if (result.rows.length === 0) {
      document.getElementById('result-body').innerHTML = '<p class="result-message">Không có dữ liệu phù hợp. (0 dòng)</p>';
    } else {
      document.getElementById('result-body').innerHTML = `
        <table class="result-table">
          <thead><tr>${result.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${result.rows.map(r => `<tr>${r.map(v => `<td>${v === null ? '<em style="color:var(--text-muted)">NULL</em>' : v}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        <p style="margin-top:12px;font-size:12px;color:var(--text-muted)">${result.rows.length} dòng được trả về</p>`;
    }
  } else {
    document.getElementById('result-body').innerHTML =
      `<p class="result-message ${result.success ? 'success' : 'error'}">${result.message}</p>`;
  }

  if (result.success !== false && result.type !== 'result') {
    if (activePlaygroundId !== 'system') {
      saveUserPlaygroundsToServer();
      renderSchema();
    } else {
      renderSchema();
    }
  }
}

// Submit and Verify SQL
document.getElementById('submit-sql-btn')?.addEventListener('click', submitPlaygroundSQL);

function submitPlaygroundSQL() {
  if (!currentPgEx) return;
  const userSql = document.getElementById('sql-editor').value.trim();
  if (!userSql) {
    alert('Vui lòng viết câu truy vấn trước khi nộp bài!');
    return;
  }

  const resultTimeStart = performance.now();

  // 1. Run expected query to obtain correct output and DB state
  resetDatabase();
  const expectedRes = executeSQL(currentPgEx.expectedQuery);
  const expectedDBState = getDBState();

  // 2. Run user query
  resetDatabase();
  const userRes = executeSQL(userSql);
  const userDBState = getDBState();

  const timeStr = `${(performance.now() - resultTimeStart).toFixed(1)} ms`;
  document.getElementById('result-time').textContent = timeStr;

  // 3. Verification logic
  if (!userRes.success && userRes.type === 'message') {
    // Syntax error or query failed
    document.getElementById('result-body').innerHTML = `
      <p class="result-message error">${userRes.message}</p>`;
    return;
  }

  // Compare results
  let isCorrect = false;
  
  if (expectedRes.type === 'result' && userRes.type === 'result') {
    // SELECT Query: Compare columns, row counts and row data
    isCorrect = compareQueryResults(userRes, expectedRes);
  } else if (expectedRes.type === 'message' && userRes.type === 'message') {
    // DML Query (INSERT, UPDATE, DELETE): Compare table row count / DB state
    isCorrect = compareDBStates(userDBState, expectedDBState);
  }

  if (isCorrect) {
    // Save progress
    saveExercisePassed(currentPgEx.id);

    // Display correct output
    if (userRes.type === 'result') {
      document.getElementById('result-body').innerHTML = `
        <div class="result-message success" style="margin-bottom:16px; padding:12px; border-radius:6px; background:rgba(34,197,94,0.1); border-left:4px solid var(--accent-green);">
          🎉 <strong>CHÍNH XÁC!</strong> Bạn đã giải quyết thành công bài tập này.
        </div>
        <table class="result-table">
          <thead><tr>${userRes.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${userRes.rows.map(r => `<tr>${r.map(v => `<td>${v === null ? '<em style="color:var(--text-muted)">NULL</em>' : v}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
        <p style="margin-top:12px;font-size:12px;color:var(--text-muted)">${userRes.rows.length} dòng được trả về</p>`;
    } else {
      document.getElementById('result-body').innerHTML = `
        <div class="result-message success" style="padding:12px; border-radius:6px; background:rgba(34,197,94,0.1); border-left:4px solid var(--accent-green);">
          🎉 <strong>CHÍNH XÁC!</strong> Câu lệnh đã thay đổi cơ sở dữ liệu đúng như mong đợi.<br>
          <span style="font-size:13px; margin-top:6px; display:inline-block; color:var(--text-secondary);">${userRes.message}</span>
        </div>`;
    }

    // Re-render UI list & dashboard to reflect completion
    const select = document.getElementById('pg-chapter-select');
    renderPgExerciseList(parseInt(select.value || 1));
    renderDashboard();
  } else {
    // Incorrect answer
    if (userRes.type === 'result') {
      document.getElementById('result-body').innerHTML = `
        <div class="result-message error" style="margin-bottom:16px; padding:12px; border-radius:6px; background:rgba(239,68,68,0.1); border-left:4px solid var(--accent-red);">
          ❌ <strong>CHƯA CHÍNH XÁC!</strong> Dữ liệu trả về hoặc số dòng chưa khớp với kết quả chuẩn.<br>
          <small style="color:var(--text-muted)">Hãy kiểm tra lại thứ tự các cột, tên cột, hoặc điều kiện lọc trong truy vấn của bạn.</small>
        </div>
        <h4 style="font-size:13px; color:var(--text-secondary); margin-bottom:8px;">Kết quả hiện tại của bạn:</h4>
        <table class="result-table">
          <thead><tr>${userRes.columns.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${userRes.rows.map(r => `<tr>${r.map(v => `<td>${v === null ? '<em style="color:var(--text-muted)">NULL</em>' : v}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>`;
    } else {
      document.getElementById('result-body').innerHTML = `
        <div class="result-message error" style="padding:12px; border-radius:6px; background:rgba(239,68,68,0.1); border-left:4px solid var(--accent-red);">
          ❌ <strong>CHƯA CHÍNH XÁC!</strong> Trạng thái cơ sở dữ liệu sau câu lệnh của bạn chưa đúng.<br>
          <small style="color:var(--text-muted)">Kiểm tra lại khóa, các trường và giá trị bạn vừa INSERT/UPDATE/DELETE.</small>
        </div>`;
    }
  }

  // Restore DB state to current workspace state so they can keep trying
  resetDatabase();
}

function compareQueryResults(res1, res2) {
  if (res1.columns.length !== res2.columns.length) return false;
  
  // Column names comparison (case insensitive)
  const cols1 = res1.columns.map(c => c.toUpperCase());
  const cols2 = res2.columns.map(c => c.toUpperCase());
  for (let i = 0; i < cols1.length; i++) {
    if (cols1[i] !== cols2[i]) return false;
  }

  if (res1.rows.length !== res2.rows.length) return false;

  // Sort rows for order-insensitive comparison (unless it is ORDER BY, but to be safe we sort copies)
  const rows1 = deepCopyRows(res1.rows);
  const rows2 = deepCopyRows(res2.rows);

  const sortFn = (a, b) => {
    return JSON.stringify(a).localeCompare(JSON.stringify(b));
  };
  rows1.sort(sortFn);
  rows2.sort(sortFn);

  for (let i = 0; i < rows1.length; i++) {
    for (let j = 0; j < rows1[i].length; j++) {
      if (String(rows1[i][j]) !== String(rows2[i][j])) return false;
    }
  }
  return true;
}

function deepCopyRows(rows) {
  return rows.map(r => [...r]);
}

function compareDBStates(state1, state2) {
  // Simple check for tables & rows equivalence
  for (const tbl in state1) {
    if (state1[tbl].rows.length !== state2[tbl].rows.length) return false;
    
    // Check if rows match
    const rows1 = state1[tbl].rows.map(r => r.join('|||'));
    const rows2 = state2[tbl].rows.map(r => r.join('|||'));
    
    rows1.sort();
    rows2.sort();
    
    for (let i = 0; i < rows1.length; i++) {
      if (rows1[i] !== rows2[i]) return false;
    }
  }
  return true;
}

// ===== CHEAT SHEET =====
function renderCheatSheet() {
  const sheets = [
    { title: '📦 CREATE DATABASE', code: `CREATE DATABASE QLVT\nON PRIMARY (\n  Name = Qlvt1,\n  Filename = 'c:\\\\data\\\\qlvt1.mdf',\n  Size = 10MB, MaxSize = 100MB,\n  FileGrowth = 10MB\n)` },
    { title: '📋 CREATE TABLE', code: `CREATE TABLE Nhanvien (\n  MANV int PRIMARY KEY,\n  HO nVarChar(40) NOT NULL,\n  TEN nVarChar(10) NOT NULL,\n  LUONG Money DEFAULT 800000\n    CHECK (Luong >= 800000)\n)` },
    { title: '🔍 SELECT', code: `SELECT [DISTINCT] [TOP n] cols\nFROM table\n[WHERE condition]\n[GROUP BY col [HAVING cond]]\n[ORDER BY col [DESC]]` },
    { title: '➕ INSERT', code: `INSERT INTO table (col1, col2)\nVALUES ('val1', 'val2')\n\n-- Insert from SELECT:\nINSERT INTO tbl (cols)\nSELECT cols FROM other_tbl` },
    { title: '✏️ UPDATE / DELETE', code: `UPDATE table SET col = value\nWHERE condition\n\nDELETE FROM table\nWHERE condition\n\nTRUNCATE TABLE table` },
    { title: '🔗 JOIN', code: `SELECT * FROM A\nINNER JOIN B ON A.id = B.id\nLEFT JOIN C ON A.id = C.id` },
    { title: '👤 LOGIN & USER', code: `EXEC sp_addlogin 'name','pass','DB'\nEXEC sp_grantdbaccess 'name'\nEXEC sp_addrole 'role_name'\nEXEC sp_addrolemember 'role','user'` },
    { title: '🔒 GRANT / REVOKE', code: `GRANT SELECT, INSERT ON table\n  TO username\nREVOKE UPDATE ON table\n  TO username` },
    { title: '💾 BACKUP / RESTORE', code: `BACKUP DATABASE DB\n  TO DISK = 'path.bak'\n\nRESTORE DATABASE DB\n  FROM DISK = 'path.bak'` },
    { title: '⚡ STORED PROCEDURE', code: `CREATE PROC sp_name\n  @param INT, @out INT OUTPUT\nAS\nBEGIN\n  SELECT @out = COUNT(*) FROM tbl\n  RETURN 0\nEND\n\nEXEC sp_name 1, @val OUTPUT` },
    { title: '🔥 TRIGGER', code: `CREATE TRIGGER trg ON table\nAFTER INSERT, UPDATE, DELETE\nAS\nBEGIN\n  -- inserted: new data\n  -- deleted: old data\nEND` },
    { title: '🔧 UDF (Function)', code: `-- Scalar\nCREATE FUNCTION fn(@p INT)\nRETURNS INT AS\nBEGIN RETURN @p * 2 END\n\n-- Table-valued (Inline)\nCREATE FUNCTION fn(@p INT)\nRETURNS TABLE AS\nRETURN (SELECT * FROM tbl\n  WHERE id = @p)` }
  ];
  document.getElementById('cheat-grid').innerHTML = sheets.map(s =>
    `<div class="card cheat-card"><h3><span>${s.title}</span></h3><pre><code>${s.code}</code></pre></div>`
  ).join('');
}

// ===== SQL SYNTAX HIGHLIGHTING =====
function highlightSQL(text) {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'DROP', 'ALTER', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON',
    'GROUP', 'BY', 'ORDER', 'HAVING', 'GO', 'USE', 'CONSTRAINT', 'PRIMARY', 'KEY', 'CLUSTERED',
    'ADD', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'AS', 'IN', 'LIKE', 'BETWEEN', 'EXISTS',
    'PROCEDURE', 'PROC', 'EXEC', 'EXECUTE', 'TRIGGER', 'FUNCTION', 'RETURNS', 'DECLARE',
    'BEGIN', 'END', 'IF', 'ELSE', 'WHILE', 'RETURN', 'TOP', 'DISTINCT', 'UNION', 'ALL',
    'ASC', 'DESC', 'WITH', 'PAD_INDEX', 'STATISTICS_NORECOMPUTE', 'IGNORE_DUP_KEY',
    'ALLOW_ROW_LOCKS', 'ALLOW_PAGE_LOCKS', 'ON', 'OFF', 'ANSI_NULLS', 'QUOTED_IDENTIFIER',
    'INT', 'FLOAT', 'BIT', 'NCHAR', 'NVARCHAR', 'VARCHAR', 'CHAR', 'DATETIME', 'DATABASE'
  ];

  const comments = [];
  const strings = [];

  html = html.replace(/(\/\*[\s\S]*?\*\/|--.*)/g, (match) => {
    comments.push(match);
    return `___COMMENT_${comments.length - 1}___`;
  });

  html = html.replace(/('[^']*')/g, (match) => {
    strings.push(match);
    return `___STRING_${strings.length - 1}___`;
  });

  html = html.replace(/(@@[a-zA-Z_0-9]+)/gi, '<span class="sql-sys-var">$1</span>');
  html = html.replace(/(@[a-zA-Z_0-9]+)/gi, '<span class="sql-var">$1</span>');

  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
  html = html.replace(keywordRegex, '<span class="sql-keyword">$1</span>');

  html = html.replace(/___STRING_(\d+)___/g, (match, index) => {
    return `<span class="sql-string">${strings[parseInt(index)]}</span>`;
  });

  html = html.replace(/___COMMENT_(\d+)___/g, (match, index) => {
    return `<span class="sql-comment">${comments[parseInt(index)]}</span>`;
  });

  return html;
}

function initEditorHighlighting() {
  const editor = document.getElementById('sql-editor');
  const codeEl = document.getElementById('sql-highlight-code');
  const preEl = document.getElementById('sql-highlight-pre');
  if (!editor || !codeEl || !preEl) return;

  const update = () => {
    codeEl.innerHTML = highlightSQL(editor.value + (editor.value.endsWith('\n') ? ' ' : ''));
  };

  editor.addEventListener('input', update);
  editor.addEventListener('scroll', () => {
    preEl.scrollTop = editor.scrollTop;
    preEl.scrollLeft = editor.scrollLeft;
  });

  update();
  window.triggerEditorHighlight = update;
}

// ===== CSV IMPORT =====
function parseCSV(text) {
  const lines = [];
  let row = [""];
  lines.push(row);
  let i = 0, c = 0;
  
  while (i < text.length) {
    const char = text[i];
    const next = text[i+1];
    
    if (char === '"') {
      let quoteCount = 1;
      let j = i + 1;
      while (j < text.length) {
        if (text[j] === '"') {
          if (text[j+1] === '"') {
            j += 2;
          } else {
            quoteCount++;
            j++;
            break;
          }
        } else {
          j++;
        }
      }
      const val = text.substring(i + 1, j - 1).replace(/""/g, '"');
      row[c] = val;
      i = j;
      continue;
    }
    
    if (char === ',') {
      c++;
      row[c] = "";
      i++;
      continue;
    }
    
    if (char === '\r' || char === '\n') {
      if (char === '\r' && next === '\n') {
        i += 2;
      } else {
        i++;
      }
      if (i < text.length) {
        row = [""];
        lines.push(row);
        c = 0;
      }
      continue;
    }
    
    row[c] += char;
    i++;
  }
  
  return lines.filter(r => r.length > 1 || (r[0] && r[0].trim() !== ""));
}

function savePlaygroundToServer() {
  fetch('/api/save-playground', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playgroundExercises)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Đã lưu bài tập thực hành vào hệ thống.');
    } else {
      console.error('Không thể lưu bài tập vào hệ thống:', data.error);
    }
  })
  .catch(err => {
    console.warn('Không kết nối được với backend, bài tập chỉ được lưu tạm thời trong bộ nhớ.');
  });
}

function saveQuizzesToServer() {
  fetch('/api/save-quizzes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exercises)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('Đã lưu câu hỏi trắc nghiệm vào hệ thống.');
    } else {
      console.error('Không thể lưu câu hỏi trắc nghiệm vào hệ thống:', data.error);
    }
  })
  .catch(err => {
    console.warn('Không kết nối được với backend, câu hỏi chỉ được lưu tạm thời trong bộ nhớ.');
  });
}

function renderPlaygroundSelector() {
  const selector = document.getElementById('playground-selector');
  if (!selector) return;
  
  let html = `<option value="system">Playground Hệ thống</option>`;
  for (const pg of userPlaygrounds) {
    html += `<option value="${pg.id}">👤 ${pg.name}</option>`;
  }
  selector.innerHTML = html;
  selector.value = activePlaygroundId;
}

function updatePlaygroundActionButtons() {
  const renameBtn = document.getElementById('playground-rename-btn');
  const deleteBtn = document.getElementById('playground-delete-btn');
  const csvBtn = document.getElementById('pg-import-csv-btn');
  const sqlBtn = document.getElementById('schema-import-sql-btn');

  if (activePlaygroundId === 'system') {
    if (renameBtn) renameBtn.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';
    if (csvBtn) csvBtn.style.display = 'none';
    if (sqlBtn) sqlBtn.style.display = 'none';
  } else {
    if (renameBtn) renameBtn.style.display = 'inline-flex';
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    if (csvBtn) csvBtn.style.display = 'inline-flex';
    if (sqlBtn) sqlBtn.style.display = 'inline-flex';
  }
}

async function saveUserPlaygroundsToServer() {
  const token = localStorage.getItem('sqllab_token');
  if (!token) return;

  if (activePlaygroundId !== 'system') {
    const currentPg = userPlaygrounds.find(p => p.id === activePlaygroundId);
    if (currentPg) {
      currentPg.exercises = JSON.parse(JSON.stringify(playgroundExercises));
      currentPg.dbState = getFullDBState();
    }
  }

  try {
    await fetch('/api/save-user-playgrounds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userPlaygrounds)
    });
  } catch (err) {
    console.error('Lỗi khi lưu danh sách playground:', err);
  }
}

async function switchPlayground(targetId) {
  // 1. Save current custom playground state before switching
  if (activePlaygroundId !== 'system') {
    const currentPg = userPlaygrounds.find(p => p.id === activePlaygroundId);
    if (currentPg) {
      currentPg.exercises = JSON.parse(JSON.stringify(playgroundExercises));
      currentPg.dbState = getFullDBState();
    }
  }

  activePlaygroundId = targetId;

  // 2. Load target playground state
  if (targetId === 'system') {
    // Load system exercises
    try {
      const res = await fetch('/api/playground');
      if (res.ok) {
        const dbPg = await res.json();
        if (dbPg && dbPg.length > 0) {
          playgroundExercises = dbPg;
        } else {
          playgroundExercises = JSON.parse(JSON.stringify(defaultPlaygroundExercises));
        }
      } else {
        playgroundExercises = JSON.parse(JSON.stringify(defaultPlaygroundExercises));
      }
    } catch (e) {
      playgroundExercises = JSON.parse(JSON.stringify(defaultPlaygroundExercises));
    }
    
    // Restore default schema QLDSV_HTC
    restoreDefaultSchema();
  } else {
    // Custom playground
    const pg = userPlaygrounds.find(p => p.id === targetId);
    if (pg) {
      playgroundExercises = pg.exercises || [];
      if (pg.dbState) {
        setFullDBState(pg.dbState);
      } else {
        setFullDBState({ DB: {}, VIEWS: {}, PROCEDURES: {} });
      }
    } else {
      playgroundExercises = [];
      setFullDBState({ DB: {}, VIEWS: {}, PROCEDURES: {} });
    }
  }

  // 3. Update UI
  updatePlaygroundActionButtons();
  initPgExercises();
  renderSchema();
  renderDashboard();
}

function addCustomPlayground() {
  const token = localStorage.getItem('sqllab_token');
  if (!token) {
    alert('Vui lòng đăng nhập để tạo SQL Playground của riêng bạn!');
    return;
  }
  
  const nameInput = prompt('Nhập tên cho SQL Playground mới:');
  if (!nameInput || !nameInput.trim()) return;

  const newId = 'pg_' + Date.now();
  const newPg = {
    id: newId,
    name: nameInput.trim(),
    exercises: [],
    dbState: {
      DB: {},
      VIEWS: {},
      PROCEDURES: {}
    }
  };

  userPlaygrounds.push(newPg);
  saveUserPlaygroundsToServer().then(() => {
    renderPlaygroundSelector();
    document.getElementById('playground-selector').value = newId;
    switchPlayground(newId);
  });
}

function renameCustomPlayground() {
  if (activePlaygroundId === 'system') {
    alert('Không thể đổi tên Playground Hệ thống!');
    return;
  }

  const pg = userPlaygrounds.find(p => p.id === activePlaygroundId);
  if (!pg) return;

  const newName = prompt('Nhập tên mới cho SQL Playground:', pg.name);
  if (!newName || !newName.trim()) return;

  pg.name = newName.trim();
  saveUserPlaygroundsToServer().then(() => {
    renderPlaygroundSelector();
  });
}

function deleteCustomPlayground() {
  if (activePlaygroundId === 'system') {
    alert('Không thể xóa Playground Hệ thống!');
    return;
  }

  if (confirm(`Bạn có chắc chắn muốn xóa SQL Playground "${userPlaygrounds.find(p => p.id === activePlaygroundId)?.name}"?`)) {
    userPlaygrounds = userPlaygrounds.filter(p => p.id !== activePlaygroundId);
    saveUserPlaygroundsToServer().then(() => {
      renderPlaygroundSelector();
      document.getElementById('playground-selector').value = 'system';
      switchPlayground('system');
    });
  }
}

function setupPlaygroundManagement() {
  const selector = document.getElementById('playground-selector');
  const addBtn = document.getElementById('playground-add-btn');
  const renameBtn = document.getElementById('playground-rename-btn');
  const deleteBtn = document.getElementById('playground-delete-btn');

  if (selector) {
    selector.addEventListener('change', (e) => {
      switchPlayground(e.target.value);
    });
  }
  if (addBtn) {
    addBtn.addEventListener('click', addCustomPlayground);
  }
  if (renameBtn) {
    renameBtn.addEventListener('click', renameCustomPlayground);
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteCustomPlayground);
  }
}

function setupPlaygroundReset() {
  const resetBtn = document.getElementById('pg-reset-btn');
  if (!resetBtn) return;
  
  resetBtn.addEventListener('click', () => {
    if (activePlaygroundId === 'system') {
      if (confirm('Bạn có chắc chắn muốn khôi phục danh sách bài tập luyện tập mặc định?')) {
        playgroundExercises = JSON.parse(JSON.stringify(defaultPlaygroundExercises));
        savePlaygroundToServer();
        initPgExercises();
        renderDashboard();
        alert('Đã khôi phục danh sách bài tập luyện tập mặc định thành công.');
      }
    } else {
      if (confirm('Bạn có chắc chắn muốn xóa toàn bộ bài tập trong Playground này?')) {
        playgroundExercises = [];
        saveUserPlaygroundsToServer();
        initPgExercises();
        renderDashboard();
        alert('Đã xóa toàn bộ bài tập thành công.');
      }
    }
  });
}

function setupCSVImport() {
  const importBtn = document.getElementById('pg-import-csv-btn');
  const fileInput = document.getElementById('pg-csv-file-input');
  if (!importBtn || !fileInput) return;

  importBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const text = evt.target.result;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('File CSV trống hoặc không đúng định dạng!');
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const chapterIdx = headers.indexOf('chapter');
        const titleIdx = headers.indexOf('title');
        const descIdx = headers.indexOf('description');
        const diffIdx = headers.indexOf('difficulty');
        const queryIdx = headers.indexOf('expectedquery');
        const hintIdx = headers.indexOf('hint');

        if (titleIdx === -1 || queryIdx === -1) {
          alert('File CSV phải chứa ít nhất các cột: "Title" và "ExpectedQuery"!');
          return;
        }

        let importedCount = 0;
        let nextId = 90001; 

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 2) continue;

          const title = row[titleIdx];
          const query = row[queryIdx];
          if (!title || !query) continue;

          const chapter = chapterIdx !== -1 && row[chapterIdx] ? parseInt(row[chapterIdx]) : 9;
          const desc = descIdx !== -1 && row[descIdx] ? row[descIdx] : title;
          const diff = diffIdx !== -1 && row[diffIdx] ? row[diffIdx] : 'Dễ';
          const hint = hintIdx !== -1 && row[hintIdx] ? row[hintIdx] : '';

          let chObj = playgroundExercises.find(ch => ch.chapter === chapter);
          if (!chObj) {
            chObj = {
              chapter: chapter,
              title: `Import từ CSV (Chương ${chapter})`,
              exercises: []
            };
            playgroundExercises.push(chObj);
          }

          chObj.exercises.push({
            id: nextId++,
            title: title,
            desc: desc,
            difficulty: diff,
            expectedQuery: query,
            hint: hint
          });
          importedCount++;
        }

        if (importedCount > 0) {
          alert(`Đã import thành công ${importedCount} bài tập!`);
          if (activePlaygroundId === 'system') {
            savePlaygroundToServer();
          } else {
            saveUserPlaygroundsToServer();
          }
          
          const select = document.getElementById('pg-chapter-select');
          if (select) {
            playgroundExercises.sort((a, b) => a.chapter - b.chapter);
            
            select.innerHTML = playgroundExercises.map(ch => 
              `<option value="${ch.chapter}">Chương ${ch.chapter}: ${ch.title}</option>`
            ).join('');
            
            // Select the last imported chapter
            const lastImportedChapter = playgroundExercises[playgroundExercises.length - 1].chapter;
            select.value = lastImportedChapter;
            renderPgExerciseList(lastImportedChapter);
          }

          // Expand exercise panel if collapsed
          const exCard = document.getElementById('pg-exercises-card');
          if (exCard && exCard.classList.contains('collapsed')) {
            exCard.classList.remove('collapsed');
            const btnIcon = exCard.querySelector('.card-toggle-btn i');
            if (btnIcon) btnIcon.className = 'fas fa-chevron-left';
            updatePlaygroundLayoutColumns();
          }
        } else {
          alert('Không tìm thấy bài tập hợp lệ trong file CSV!');
        }

      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đọc file CSV: ' + err.message);
      }
    };
    reader.readAsText(file, 'UTF-8');
  });
}

function setupQuizCSVImport() {
  const importBtn = document.getElementById('quiz-import-csv-btn');
  const fileInput = document.getElementById('quiz-csv-file-input');
  if (!importBtn || !fileInput) return;

  importBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const text = evt.target.result;
        const rows = parseCSV(text);
        if (rows.length < 2) {
          alert('File CSV trống hoặc không đúng định dạng!');
          return;
        }

        const headers = rows[0].map(h => h.trim().toLowerCase());
        const chapterIdx = headers.indexOf('chapter');
        const qIdx = headers.indexOf('question');
        const o1Idx = headers.indexOf('option1');
        const o2Idx = headers.indexOf('option2');
        const o3Idx = headers.indexOf('option3');
        const o4Idx = headers.indexOf('option4');
        const ansIdx = headers.indexOf('answerindex');
        const expIdx = headers.indexOf('explanation');

        if (qIdx === -1 || o1Idx === -1 || o2Idx === -1 || o3Idx === -1 || o4Idx === -1 || ansIdx === -1) {
          alert('File CSV phải chứa các cột: "Question", "Option1", "Option2", "Option3", "Option4", "AnswerIndex"!');
          return;
        }

        let importedCount = 0;

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (row.length < 6) continue;

          const qText = row[qIdx];
          const o1 = row[o1Idx];
          const o2 = row[o2Idx];
          const o3 = row[o3Idx];
          const o4 = row[o4Idx];
          const ansVal = row[ansIdx];

          if (!qText || !o1 || !o2 || !o3 || !o4 || ansVal === undefined || ansVal === null || ansVal === '') continue;

          const chapterNum = chapterIdx !== -1 && row[chapterIdx] ? parseInt(row[chapterIdx]) : 9;
          const expText = expIdx !== -1 && row[expIdx] ? row[expIdx] : 'Không có giải thích.';
          
          let ansInt = parseInt(ansVal);
          if (ansInt >= 1 && ansInt <= 4) {
            ansInt = ansInt - 1;
          } else if (ansInt < 0 || ansInt > 3) {
            ansInt = 0;
          }

          let chObj = exercises.find(ch => ch.chapter === chapterNum);
          if (!chObj) {
            chObj = { chapter: chapterNum, questions: [] };
            exercises.push(chObj);
          }

          chObj.questions.push({
            q: qText,
            o: [o1, o2, o3, o4],
            a: ansInt,
            e: expText
          });
          importedCount++;
        }

        if (importedCount > 0) {
          // Prompt user to name new quiz chapters (chapter > 8) that do not have a title yet
          const newChapters = exercises.filter(ex => ex.chapter > 8 && !ex.title);
          for (const ch of newChapters) {
            const defaultName = `Chương ${ch.chapter}`;
            const titleInput = prompt(`Vui lòng nhập tên cho bài trắc nghiệm mới (Chương ${ch.chapter}):`, defaultName);
            ch.title = titleInput && titleInput.trim() ? titleInput.trim() : defaultName;
          }

          alert(`Đã import thành công ${importedCount} câu hỏi trắc nghiệm!`);
          saveQuizzesToServer();
          exercises.sort((a, b) => a.chapter - b.chapter);
          showQuizSelect();
          // Navigate to quiz page so user can see the imported questions
          navigateTo('quiz');
        } else {
          alert('Không tìm thấy câu hỏi hợp lệ trong file CSV!');
        }

      } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi đọc file CSV: ' + err.message);
      }
      fileInput.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  });
}

function setupSchemaImport() {
  const importBtn = document.getElementById('schema-import-sql-btn');
  const fileInput = document.getElementById('schema-sql-file-input');
  const resetBtn = document.getElementById('schema-reset-btn');
  if (!importBtn || !fileInput) return;

  importBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const text = evt.target.result;
        const res = importSQLSchema(text);
        if (res.success) {
          alert(`Đã nạp thành công ${res.tableCount} bảng từ tệp SQL!`);
          renderSchema();
          if (activePlaygroundId !== 'system') {
            saveUserPlaygroundsToServer();
          }
        }
      } catch (err) {
        console.error(err);
        alert('Lỗi nạp cấu trúc Schema: ' + err.message);
      }
      fileInput.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (activePlaygroundId === 'system') {
        if (confirm('Bạn có chắc chắn muốn khôi phục cấu trúc bảng mặc định (QLDSV_HTC)?')) {
          restoreDefaultSchema();
          renderSchema();
          alert('Đã khôi phục cấu trúc bảng mặc định thành công.');
        }
      } else {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả bảng và cấu trúc trong Playground này?')) {
          setFullDBState({ DB: {}, VIEWS: {}, PROCEDURES: {} });
          renderSchema();
          saveUserPlaygroundsToServer();
          alert('Đã xóa cấu trúc bảng thành công.');
        }
      }
    });
  }
}

function setupQuizFilter() {
  const select = document.getElementById('quiz-filter-select');
  if (select) {
    select.addEventListener('change', () => {
      showQuizSelect();
    });
  }
}

function setupDiagramModal() {
  window.showDiagramModal = function() {
    const modal = document.getElementById('diagram-modal');
    if (modal) modal.classList.add('show');
  };

  window.hideDiagramModal = function() {
    const modal = document.getElementById('diagram-modal');
    if (modal) modal.classList.remove('show');
  };

  document.getElementById('diagram-close-btn')?.addEventListener('click', window.hideDiagramModal);
  document.getElementById('diagram-ok-btn')?.addEventListener('click', window.hideDiagramModal);
  
  // Also close modal when clicking outside the content area
  document.getElementById('diagram-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'diagram-modal') {
      window.hideDiagramModal();
    }
  });
}

// ===== INIT =====
setupAuth();
renderDashboard();
showLessonsList();
showQuizSelect();
renderSchema();
initPgExercises();
setupDragAndDrop();
renderCheatSheet();
initEditorHighlighting();
setupCSVImport();
setupPlaygroundReset();
setupPlaygroundManagement();
setupQuizCSVImport();
setupSchemaImport();
setupQuizFilter();
setupDiagramModal();
loadDataFromDatabase();

