const tasks_fixed = [
  {
    id: 1,
    title: "Implementar tela de listagem de tarefas",
    description: "frontend",
    dt_insercao: "21/08/2024",
    checked: false,
  },
  {
    id: 2,
    title: "Criar endpoint para cadastro de tarefas",
    description: "backend",
    dt_insercao: "21/08/2024",
    checked: false,
  },
  {
    id: 3,
    title: "Implementar protótipo da listagem de tarefas",
    description: "ux",
    dt_insercao: "21/08/2024",
    checked: false,
  },
];

/**************************************************/
/* get task in localStorage */
const getTasksFromLocalStorage = () =>
  JSON.parse(window.localStorage.getItem("tasks")) || [];

/**************************************************/
/* set task in localStorage */
const setTasksInLocalStorage = (tasks) =>
  window.localStorage.setItem("tasks", JSON.stringify(tasks));

/**************************************************/
/* include id */
const getNewTaskId = () => {
  const tasks = getTasksFromLocalStorage();
  const lastId = tasks[tasks.length - 1]?.id; // optional chaining
  return lastId ? lastId + 1 : 1;
};

/**************************************************/
/* clear the inputs */
const clearInputs = () => {
  document.getElementById("title").value = "";
  document.getElementById("activity").value = "";
  document.getElementById("title").focus();
};

/**************************************************/
/* render task(html) */
const renderTask = (task) => {
  const div = document.createElement("div");
  div.className = "task";
  div.innerHTML = `
      <ul>
        <li>
          <h2 class="taskTitle">${task.title}</h2>
        </li>
        <li class="innerTaskActivityDate">
          <p class="taskActivity">${task.description}</p>
          <span class="taskDate">Criado em: ${task.dt_insercao}</span>
        </li>
      </ul>
      <button
        class="doneBtn"
        data-id="${task.id}" ${task.checked ? 'style="display:none;"' : ""}
        aria-label="Concluir tarefa">
        Concluir
      </button>
      <img
        src="./assets/checked.svg"
        alt="checked"
        class="checked"
        ${task.checked ? 'style="display:inline;"' : ""}>
  `;

  // Adiciona a div(item) a seção correspondente:
  const section = document.querySelectorAll("main section")[1];
  section.appendChild(div);
};

/**************************************************/
/* create a new task on the screen */
const createTask = (event) => {
  event.preventDefault(); // Impede reload da página!

  const title = document.getElementById("title").value.trim();
  const activity = document.getElementById("activity").value.trim();
  const registre = new Date().toLocaleDateString("pt-BR"); // captura data atual

  if (title && activity) {
    // 1. Busca as tarefas do localStorage
    const tasksLocalStorage = getTasksFromLocalStorage();
    const id = getNewTaskId();

    // 2. Cria nova task
    const newTask = {
      id: id,
      title: title,
      description: activity,
      dt_insercao: registre,
      checked: false,
    };

    // 3. Atualiza localStorage
    const setAllTasks = [...tasksLocalStorage, newTask];
    setTasksInLocalStorage(setAllTasks);

    // 4. Limpa inputs
    clearInputs();

    // 5. Renderiza apenas a nova task
    renderTask(newTask);

    // 6. Atualizar contador
    getCountDoneTask();
  }
};

/**************************************************/
/* update status in localStorage */
const setDoneTask = (id) => {
  const tasks = getTasksFromLocalStorage();
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index].checked = true;
    setTasksInLocalStorage(tasks);
  }
};

/**************************************************/
/* function to mark the task as completed */

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("doneBtn")) {
    const button = e.target;
    const img = button.nextElementSibling; // pega a imagem que está depois do botão

    button.style.display = "none"; // esconde o botão
    img.style.display = "inline"; // mostra a imagem

    // pega o <h2> do título desta task
    const taskTitleMarkup = button.closest(".task").querySelector(".taskTitle");
    // chama a função passando o elemento
    setTaskTitleMarkup(taskTitleMarkup);

    // Atualiza no localStorage que está concluída
    const id = parseInt(button.dataset.id);
    setDoneTask(id);
    getCountDoneTask(); // atualiza contador
  }
});

/**************************************************/
/* fucntion to markup the title tasks done */
const setTaskTitleMarkup = (taskTitleElement) => {
  taskTitleElement.style.textDecoration = "line-through";
  taskTitleElement.style.color = "#8F98A8";
};

/**************************************************/
/* fucntion to count the task in real time */
getCountDoneTask = () => {
  const p = document.getElementById("footerCount");
  const tasks = getTasksFromLocalStorage();

  //const doneTasks = tasks.reduce((a, b) => (b.status === "pendente" ? a++ : a), 0);

  const doneTasks = tasks.filter((t) => t.checked).length;
  //const totalTasks = tasks.length;

  p.textContent = `${doneTasks} tarefa concluída`;
};

/**************************************************/
window.onload = () => {
  const tasks = getTasksFromLocalStorage();
  //setTasksInLocalStorage(tasks_fixed);
  setTasksInLocalStorage(tasks);

  const form = document.querySelector("form");
  form.addEventListener("submit", createTask);

  tasks.forEach((task) => {
    renderTask(task);
    // se a tarefa já está checked, estiliza o título:
    if (task.checked) {
      const lastTaskTitle = document.querySelectorAll(".taskTitle");
      setTaskTitleMarkup(lastTaskTitle[lastTaskTitle.length - 1]);
    }
  });
  getCountDoneTask();
};
