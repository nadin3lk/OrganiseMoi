/******* Toggle DarkMode *******/ 
document.addEventListener('DOMContentLoaded', () => { 
  const darkModeButton = document.querySelector('.dark-btn'); 
  darkModeButton.addEventListener('click', () => { 
    document.body.classList.toggle('dark'); 
    darkModeButton.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙'; 
  }); 
}); 

/********** CALENDAR **********/ 
let selectedDate = null;
let tasksWithDates = {}; // { "2026-1-10": [{id, text}] }

const monthYearElement = document.getElementById('monthYear'); 
const datesElement = document.getElementById('dates'); 
const prevBtn = document.getElementById('prevBtn'); 
const nextBtn = document.getElementById('nextBtn'); 

let currentDate = new Date(); 

const updateCalendar = () => { 
  const year = currentDate.getFullYear(); 
  const month = currentDate.getMonth(); 

  monthYearElement.textContent = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const firstDayIndex = new Date(year, month, 1).getDay(); 
  const lastDay = new Date(year, month + 1, 0).getDate(); 

  let html = '';

  for (let i = 0; i < firstDayIndex; i++) {
    html += `<div class="date inactive"></div>`;
  }

  for (let i = 1; i <= lastDay; i++) {
    
    const dateKey = `${year}-${month + 1}-${i}`;
    html += `<div class="date" data-date="${dateKey}">${i}</div>`;
  }

  datesElement.innerHTML = html;

  document.querySelectorAll('.date:not(.inactive)').forEach(d => {
    d.addEventListener('click', () => {
      document.querySelectorAll('.date').forEach(x => x.classList.remove('active'));
      d.classList.add('active');
      selectedDate = d.dataset.date;
      showTasksForDate(selectedDate);
    });
  });
};

prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); updateCalendar(); };
nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); updateCalendar(); };
updateCalendar();

/********** CALENDAR DISPLAY **********/
function showTasksForDate(date) {
  const list = document.getElementById('calendar-task-list');
  list.innerHTML = '';

  if (!tasksWithDates[date]) return;


  tasksWithDates[date].forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.text;
    list.appendChild(li);
  });
}

/******** TO-DO LIST *********/ 
document.addEventListener('DOMContentLoaded', () => { 
  const taskInput = document.getElementById('task-input'); 
  const addTaskBtn = document.getElementById('add-task-btn'); 
  const addCalendarBtn = document.getElementById('add-calendar-task-btn'); 
  const taskList = document.getElementById('task-list'); 
  const progressBar = document.getElementById('progress'); 
  const progressNumbers = document.getElementById('numbers'); 

  function updateProgress(check = true) {
    const total = taskList.children.length;
    const done = taskList.querySelectorAll('.checkbox:checked').length;
    progressBar.style.width = total ? `${(done / total) * 100}%` : '0%';
    progressNumbers.textContent = `${done} / ${total}`;
    if (check && total && done === total) Confetti();
  }

  function addTask(text, id = Date.now()) {
    const li = document.createElement('li');
    li.dataset.id = id;

    li.innerHTML = `
      <input type="checkbox" class="checkbox">
      <span>${text}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    const checkbox = li.querySelector('.checkbox');
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    checkbox.onchange = () => updateProgress();

    editBtn.onclick = () => {
      taskInput.value = li.querySelector('span').textContent;
      removeTaskEverywhere(li.dataset.id);
      li.remove();
      updateProgress(false);
    };

    deleteBtn.onclick = () => {
      removeTaskEverywhere(li.dataset.id);
      li.remove();
      updateProgress();
    };

    taskList.appendChild(li);
    updateProgress();
  }

  function removeTaskEverywhere(id) {
    for (const date in tasksWithDates) {
      tasksWithDates[date] = tasksWithDates[date].filter(t => t.id != id);
    }
    if (selectedDate) showTasksForDate(selectedDate);
  }

  addTaskBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) return;
    addTask(text);
    taskInput.value = '';
  };

  addCalendarBtn.onclick = () => {
    if (!selectedDate) {
      alert("Choisis une date dans le calendrier");
      return;
    }

    const text = taskInput.value.trim();
    if (!text) return;

    const id = Date.now();

    if (!tasksWithDates[selectedDate]) {
      tasksWithDates[selectedDate] = [];
    }


    tasksWithDates[selectedDate].push({ id, text });
    addTask(text, id);
    taskInput.value = '';
    showTasksForDate(selectedDate);
  };

  taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTaskBtn.click();
    }
  });
});

/******** CONFETTI *********/ 
const Confetti = () => { 
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
};

/********** POMODORO **********/ 
const start = document.getElementById("start"); 
const stop = document.getElementById("stop"); 
const reset = document.getElementById("reset"); 
const timer = document.getElementById("timer"); 

let timeLeft = 1500; 
let interval; 

const updateTimer = () => { 
  const m = Math.floor(timeLeft / 60); 
  const s = timeLeft % 60; 
  timer.textContent = `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
}; 

start.onclick = () => {
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      clearInterval(interval);
      alert("Le temps est terminé!");
      timeLeft = 1500;
      updateTimer();
    }
  }, 1000);
};

stop.onclick = () => clearInterval(interval);
reset.onclick = () => { clearInterval(interval); timeLeft = 1500; updateTimer(); };

