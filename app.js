// Simple To‑Do app with localStorage persistence
(function(){
  const STORAGE_KEY = 'todo.tasks.v1';
  const THEME_KEY = 'todo.theme';

  /** @typedef {{id:string, text:string, done:boolean, createdAt:number}} Task */

  /** @type {Task[]} */
  let tasks = load();
  let currentFilter = 'all'; // all | active | completed

  // Elements
  const form = document.getElementById('new-task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const remainingEl = document.getElementById('remaining');
  const clearBtn = document.getElementById('clear-completed');
  const filterBar = document.querySelector('.filters');
  const themeToggle = document.getElementById('theme-toggle');
  const emptyState = document.getElementById('empty-state');

  // Init
  initTheme();
  render();
  input.focus();

  // Event: add new task
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    tasks.unshift(createTask(text));
    save();
    render();
    form.reset();
    input.focus();
  });

  // Event: list actions via event delegation
  list.addEventListener('click', (e)=>{
    const target = /** @type {HTMLElement} */(e.target);
    const li = target.closest('li.task');
    if(!li) return;
    const id = li.dataset.id;

    if(target.closest('button.edit')){
      startEdit(li, id);
    } else if(target.closest('button.delete')){
      tasks = tasks.filter(t => t.id !== id);
      save();
      render();
    }
  });

  // Checkbox toggle via change event (delegated)
  list.addEventListener('change', (e)=>{
    const target = /** @type {HTMLElement} */(e.target);
    if(target instanceof HTMLInputElement && target.type === 'checkbox'){
      const li = target.closest('li.task');
      if(!li) return;
      const id = li.dataset.id;
      const t = tasks.find(t=>t.id===id);
      if(t){
        t.done = target.checked;
        save();
        render();
      }
    }
  });

  // Filters
  filterBar.addEventListener('click', (e)=>{
    const btn = /** @type {HTMLElement} */(e.target);
    if(!(btn instanceof HTMLButtonElement)) return;
    const f = btn.dataset.filter;
    if(!f) return;
    currentFilter = f;
    for(const b of filterBar.querySelectorAll('.chip')){
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    }
    render();
  });

  // Clear completed
  clearBtn.addEventListener('click', ()=>{
    const before = tasks.length;
    tasks = tasks.filter(t => !t.done);
    if(tasks.length !== before){
      save();
      render();
    }
  });

  // Theme toggle
  themeToggle && themeToggle.addEventListener('click', ()=>{
    const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });

  function createTask(text){
    return { id: String(Date.now())+Math.random().toString(36).slice(2,6), text, done:false, createdAt: Date.now() };
  }

  function load(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }catch{
      return [];
    }
  }

  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render(){
    list.innerHTML = '';
    const filtered = tasks.filter(t =>
      currentFilter === 'all' ? true : currentFilter === 'active' ? !t.done : t.done
    );

    for(const t of filtered){
      const li = document.createElement('li');
      li.className = 'task pop' + (t.done ? ' completed' : '');
      li.dataset.id = t.id;
      li.innerHTML = `
        <label class="task__label">
          <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="Mark as done" />
        </label>
        <div class="task__text" title="Double‑click to edit">${escapeHtml(t.text)}</div>
        <div class="actions">
          ${t.done ? '<span class="badge success" aria-label="Task is completed">Completed</span>' : ''}
          <button class="btn text edit" title="Edit task" aria-label="Edit">Edit</button>
          <button class="btn text delete" title="Delete task" aria-label="Delete">Delete</button>
        </div>`;

      // Enable double-click to edit
      li.querySelector('.task__text').addEventListener('dblclick', ()=> startEdit(li, t.id));

      list.appendChild(li);
    }

    const remaining = tasks.filter(t=>!t.done).length;
    remainingEl.textContent = `${remaining} item${remaining===1?'':'s'} left`;

    // Empty state visibility
    if(emptyState){
      emptyState.hidden = filtered.length !== 0;
    }
  }

  function startEdit(li, id){
    const t = tasks.find(x=>x.id===id);
    if(!t) return;
    const textEl = li.querySelector('.task__text');
    const input = document.createElement('input');
    input.className = 'edit-input';
    input.type = 'text';
    input.value = t.text;
    input.maxLength = 200;
    input.setAttribute('aria-label','Edit task');
    textEl.replaceWith(input);
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;

    const finish = (commit)=>{
      const newText = input.value.trim();
      if(commit && newText){
        t.text = newText;
      }
      save();
      render();
    };

    input.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') finish(true);
      if(e.key === 'Escape') finish(false);
    });
    input.addEventListener('blur', ()=> finish(true));
  }

  function escapeHtml(s){
    return s.replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function initTheme(){
    let theme = localStorage.getItem(THEME_KEY);
    if(!theme){
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    setTheme(theme);
  }

  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if(themeToggle){
      const pressed = theme === 'light';
      themeToggle.setAttribute('aria-pressed', String(pressed));
      themeToggle.innerHTML = pressed ? '<span class="icon-moon" aria-hidden="true">🌙</span>' : '<span class="icon-sun" aria-hidden="true">☀️</span>';
    }
  }
})();
