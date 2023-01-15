/* GLOBAL CONSTS */

let ordering = true;
let contrast = localStorage.getItem("contrast");
let currentTask = null;
let currentPage = 1;

let currentUser = JSON.parse(sessionStorage.getItem("user")).id;
let currentOwner = JSON.parse(sessionStorage.getItem("user")).login;

const NUM_EMPTY = "Insira um número.";
const DESCRIPTION_EMPTY = "Insira uma descrição.";
const DATE_EMPTY = "Escolha uma data.";
const STATUS_EMPTY = "Escolha um status.";

const NAME_REQUIRED = 'Por favor, insira o seu nome'
const CITY_REQUIRED = 'Por favor, insira o sua cidade'
const CITY_INVALID = 'Cidade inválida'
const LOGIN_WARNING = 'Não é possivel alterar o login'
const EMAIL_REQUIRED = 'Por favor, insira um email'
const EMAIL_INVALID = 'Email inválido'
const PASS_REQUIRED = 'Por favor, insira sua senha'
const PASS_LENGTH = 'Senha menor que 6 caracteres'

const modalHelpUser = document.getElementById("modalHelpContent");

const modalNewTask = document.getElementById("modalNewTaskContent");
const modalEditUser = document.getElementById("modalEditContent");
const modalInfoConf = document.getElementById("modalInfoContent");
const modalErrorTxt = document.getElementById("modalErrorTxt");

const searchInput = document.getElementById("searchField");

const inDate = new Date();
const inDay = inDate.toLocaleDateString("pt-BR");
const inToday = `${inDate.getFullYear()}-${
  inDate.getMonth() + 1
}-${inDate.getDate()}`;

const formNewTask = document.getElementById("formNewTask");
const formEdit = document.getElementById("formEdit");

/* LOAD BODY FUNCTION */

const loadBody = () => {
  getTasksRender();
  weatherInfo();
  tasksPagesTotal();
  currentPageNum(1);
  contrastMode();
  minDateToday();
};

const minDateToday = () => {
  let day = inDate.getDate();
  let month = inDate.getMonth() + 1;
  let year = inDate.getFullYear();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let today = year + "-" + month + "-" + day;
  document.getElementById("date").setAttribute("min", today);
};

/* SESSION AND LOCAL STORAGE FUNCTIONS */

const contrastMode = () => {
  if (contrast) {
    lightMode();
  } else {
    darkMode();
  }
};

const userLogout = () => {
  sessionStorage.removeItem("user");
  window.location.href = "index.html";
};

const userReset = async () =>{
    const user = await getUser(currentUser)
    sessionStorage.removeItem("user")
    sessionStorage.setItem("user", JSON.stringify(user))
}

/* MODAL'S FUNCTIONS */

const openModal = (idModal) => {
  const modal = document.getElementById(idModal);
  modal.style.display = "block";
};

const closeModal = (idModal) => {
  const modal = document.getElementById(idModal);
  modal.style.display = "none";
};

const clearModalNewTask = () => {
  const numberField = document.getElementById("number");
  const descriptionField = document.getElementById("description");
  const dateField = document.getElementById("date");
  const select = document.querySelector("#selectStatus");
  const button = document.getElementById("submitButton");
  const title = document.getElementById('taskModalTitle');
  const inputs = document.querySelectorAll('input')
  const smalls = document.querySelectorAll('small')
  
  numberField.value = "";
  descriptionField.value = "";
  dateField.value = "";

  select.options[0].selected = true;
  select.className = ''
  
  for (let counter = 0; counter < 4; counter++) {
    inputs[counter].className = ''
  }

  for (let counter = 0; counter < 4; counter++) {
    smalls[counter].innerHTML = ''
  }

  currentTask = null

  button.classList.replace("enabled", "disabled");
  button.innerHTML = "Salvar";
  title.innerHTML = 'Adicionar nova tarefa'
};

/* TASKS' FUNCTIONS */

const renderTasks = (tasks) => {
  const tasksContent = document.getElementById("tbody-content");
  tasksContent.innerHTML = "";
  tasks.forEach((task) => {
    const date = new Date(task.date);
    const dateFormated = date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    if (task.status === "Concluído") {
      task.description = `<del>${task.description}</del>`;
    } else if (inDay > dateFormated && task.status !== "Concluído") {
      task.status = "Atrasado";
      warningLateTask();
    }
    tasksContent.innerHTML =
      tasksContent.innerHTML +
      `<tr class='text-center'>
        <td scope="row">${task.number}</td>
        <td>${task.description}</td>
        <td>${dateFormated}</td>
        <td class="${task.status.replace(" ", "-")}">${task.status}</td>
        <td>
          <span><i class="fa-solid fa-pen-to-square iconTable fa-xl" onclick="editTask(${
            task.id
          })"></i>
          </span>
          <span><i class="fa-solid fa-trash iconTable trashIcon fa-xl" onclick="confirmDelete(${
            task.id
          })"></i>
          </span>
        </td>
      </tr>`;
  });
};

const getTasksRender = async () => {
  const tasksResponse = await fetch(
    `https://json-server-first-module-production.up.railway.app/tasks?_limit=10&owner_like=${currentOwner}`
  );
  const tasks = await tasksResponse.json();
  renderTasks(tasks);
};
const getTasksReturn = async () => {
  const tasksResponse = await fetch(
    `https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}`
  );
  const tasks = await tasksResponse.json();
  return tasks;
};
const getTask = async (id) => {
  const taskResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks/${id}`);
  const task = await taskResponse.json();
  return task;
};
const saveTask = async (task) => {
  if (currentTask === null) {
    await newTask(task);
  } else {
    await updateTask(currentTask.id, task);
    currentTask = null;
  }
  closeModal("modalNewTask");
};
const newTask = async (task) => {
  await fetch("https://json-server-first-module-production.up.railway.app/tasks", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
};
const updateTask = async (id, task) => {
  await fetch(`https://json-server-first-module-production.up.railway.app/tasks/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
};
const editTask = async (id) => {

  const numberField = document.getElementById("number");
  const descriptionField = document.getElementById("description");
  const dateField = document.getElementById("date");
  const button = document.getElementById("submitButton");
  const title = document.getElementById('taskModalTitle')
  
  title.innerHTML = 'Editar tarefa'
  currentTask = await getTask(id);

  openModal("modalNewTask");

  numberField.value = currentTask.number;
  descriptionField.value = currentTask.description;
  dateField.value = currentTask.date;

  let text = currentTask.status;
  let select = document.querySelector("#selectStatus");

  for (let counter = 0; counter < select.options.length; counter++) {
    if (select.options[counter].text === text) {
      select.options[counter].selected = true;
    }
  }

  button.classList.replace("disabled", "enabled");
  button.innerHTML = "Alterar";
};
class Task {
  number;
  description;
  date;
  status;
  owner;
  constructor(number, description, date, status, owner) {
    this.number = number;
    this.description = description;
    this.date = date;
    this.status = status;
    this.owner = owner;
  }
}

const newTaskFields = () => {
  const number = document.getElementById("number");
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const status = document.querySelector("#selectStatus");
  const button = document.getElementById("submitButton");

  let numberValid = hasValue(number, NUM_EMPTY);
  let descriptionValid = hasValue(description, DESCRIPTION_EMPTY);
  let dateValid = hasValue(date, DATE_EMPTY);
  let statusValid = validateStatus(status, STATUS_EMPTY);

  if (numberValid && descriptionValid && dateValid && statusValid) {
    button.disabled = false;
    button.classList.replace("disabled", "enabled");
  } else {
    button.disabled = true;
    button.classList.add("disabled");
  }
};

formNewTask.addEventListener("submit", (event) => {
  event.preventDefault();

  const number = formNewTask.elements["number"].value;
  const description = formNewTask.elements["description"].value;
  const date = formNewTask.elements["date"].value;
  const status = formNewTask.elements["status"].value;
  const owner = currentOwner;

  const num = Number(number);

  const task = new Task(num, description, date, status, owner);
  saveTask(task);
});

const confirmDelete = (idTask) => {
  openModal("modalConfirmation");
  const button = document.getElementById("buttonYes");
  button.addEventListener("click", () => {
    deleteTask(idTask);
  });
};
const deleteTask = async (id) => {
  await fetch(`https://json-server-first-module-production.up.railway.app/tasks/${id}`, {
    method: "DELETE",
  });
};

const deleteAllTasks = async () => {
    const tasks = await getTasksReturn();
    tasks.forEach((task) => {
      deleteTask(task.id);
    });
  };

/* USERS FUNCTIONS */

const getUsers = async () => {
  const users = await fetch(`https://json-server-first-module-production.up.railway.app/users`);
  const usersResponse = await users.json();
  return usersResponse;
};

const getUser = async () => {
  const userResponse = await fetch(
    `https://json-server-first-module-production.up.railway.app/users/${currentUser}`
  );
  const user = await userResponse.json();
  return user;
};

const confirmEditUser = async () => {
  openModal("modalEditConfirm");
  const input = document.getElementById("passwordConfirm");
  const button = document.getElementById("editButton");
  const msg = input.parentNode.querySelector("small");

  const user = JSON.parse(sessionStorage.getItem("user"));
  
  input.addEventListener("input", () => {
    if (input.value !== user.password) {
      input.classList.add('error');
      msg.innerHTML = "Senha incorreta";
      msg.className = 'errorSmall'
      button.disabled = true
      button.classList.replace('enabled', 'disabled')
    } else {
      button.disabled = false
      msg.innerHTML = 'Senha correta';
      msg.className = 'successSmall'
      button.classList.replace('disabled', 'enabled')
      input.classList.replace('error', 'success')
    }
  });
};

const saveUser = async (user) => {
    await updateUser(currentUser, user);
    await userReset()
    openModal("modalInfo");
    closeModal("modalEditInfo");
  };

const updateUser = async (id, user) => {
    await fetch(`https://json-server-first-module-production.up.railway.app/users/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
};

const editUser = async () => {
    openModal("modalEditInfo")
    const user = await getUser();
  
    const name = document.getElementById("name");
    const city = document.getElementById("city");
    const login = document.getElementById("login");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    
    name.value = user.name;
    city.value = user.city;
    login.value = user.login;
    email.value = user.email;
    password.value = user.password;
};

class User {
    name
    city
    login
    email
    password
    constructor(name, city, login, email, password) {
        this.name = name
        this.city = city
        this.login = login
        this.email = email
        this.password = password
    }
}

const editUserFields = () => {
    const name = document.getElementById('name')
    const city = document.getElementById('city')
    const login = document.getElementById('login')
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const button = document.getElementById("editUserBtn")

    showLoginInfo(login, LOGIN_WARNING)
    let nameValid = hasValue(name, NAME_REQUIRED)
    let cityValid = validateCity(city, CITY_REQUIRED, CITY_INVALID)
    let emailValid = validateEmail(email, EMAIL_REQUIRED, EMAIL_INVALID)
    let passwordValid = validatePassword(password, PASS_REQUIRED, PASS_LENGTH)

    if(nameValid && cityValid && emailValid && passwordValid){
        button.disabled = false
        button.classList.replace('disabled', 'enabled')
    } else{
        button.disabled = true
        button.classList.replace('enabled', 'disabled')
    }
}

formEdit.addEventListener("submit", (event) => {
    event.preventDefault();
  
    let name = formEdit.elements['name'].value
    let city = formEdit.elements['city'].value
    let login = formEdit.elements['login'].value
    let email = formEdit.elements['email'].value
    let password = formEdit.elements['password'].value

    let user = {name, city, login, email, password}
    saveUser(user)
});


const confirmDeleteUser = async () => {
  closeModal("modalHelp");
  openModal("modalDeleteConfirm");

  const button = document.getElementById("deleteButton");
  const passwordInput = document.getElementById("passConfirmDelete");
  const msg = passwordInput.parentNode.querySelector("small");

  const currentUserObj = await getUser(currentUser);

  const deleteUser = async (id) => {
    await fetch(`https://json-server-first-module-production.up.railway.app/users/${id}`, {
      method: "DELETE",
    });
  };

  passwordInput.addEventListener("input", () => {
    if (passwordInput.value.trim() !== currentUserObj.password) {
      msg.innerHTML = "Senha incorreta";
      msg.classList.replace("successSmall", "errorSmall")
      passwordInput.className = "error";
      button.classList.replace('enabled','disabled')
      button.disabled = true
    } else {
      msg.innerHTML = "Senha correta";
      msg.classList.remove("errorSmall")
      msg.classList.add('successSmall')
      passwordInput.className = "success";
      button.classList.replace('disabled', 'enabled')
      button.disabled = false
    }
    button.addEventListener("click", () => {
      if (passwordInput.value.trim() === currentUserObj.password) {
        deleteUser(currentUser);
        deleteAllTasks();
        window.location.href = "index.html";
      } else {
        msg.innerHTML = "Preencha esse campo corretamente";
        passwordInput.classList.add("error")
      }
    });
  });
};

/* FILTER FUNCTIONS */

const filterTasks = async (status) => {
  const tasksResponse = await fetch(
    `https://json-server-first-module-production.up.railway.app/tasks?status_like=${status}&owner_like=${currentOwner}`
  );
  const tasks = await tasksResponse.json();
  renderTasks(tasks);
};

const lateTasks = async () => {
  const tasks = await getTasksReturn();

  const tasksLate = tasks.filter((task) => {
    const date = new Date(task.date);
    const dateFormated = date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    if (inDay > dateFormated && task.status !== "Concluído") return true;
    return false;
  });
  renderTasks(tasksLate);
};

const warningLateTask = () => {
  const button = document.getElementById("btnLate");
  button.className = "lateTask";
};

const todayTasks = async () => {
  const tasks = await getTasksReturn();

  const tasksToday = tasks.filter((task) => {
    const date = new Date(task.date);
    const dateFormated = date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    if (dateFormated === inDay && task.status !== "Concluído") return true;
    return false;
  });
  renderTasks(tasksToday);
};

const findTasks = async (search) => {
  const tasksResponse = await fetch(
    `https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&description_like=${search}&_limit=10`
  );
  const tasks = await tasksResponse.json();
  renderTasks(tasks);
};

searchInput.addEventListener("input", async () => {
  let input = searchInput.value;
  let tasks = findTasks(input);
  renderTasks(tasks);
});

/* PAGINATE FUNCTIONS */

const loadPage = async (pageNum) => {
  const tasksResponse = await fetch(
    `https://json-server-first-module-production.up.railway.app/tasks?_limit=10&_page=${pageNum}&owner_like=${currentOwner}`
  );
  const tasks = await tasksResponse.json();
  renderTasks(tasks);
};

const nextPage = async () => {
  const tasks = await getTasksReturn();
  let pagesTotal = Math.ceil(tasks.length / 10);

  currentPage = currentPage + 1 > pagesTotal ? currentPage : currentPage + 1;

  currentPageNum(currentPage);
  loadPage(currentPage);
};

const previousPage = async () => {
  currentPage = currentPage - 1 < 1 ? currentPage : currentPage - 1;

  currentPageNum(currentPage);
  loadPage(currentPage);
};

const currentPageNum = (page) => {
  const spanPage = document.getElementById("currentPage");
  spanPage.innerHTML = `${page}`;
};

const tasksPagesTotal = async () => {
  const pagesLength = document.getElementById("pagesLength");

  const tasks = await getTasksReturn();
  let pagesTotal = Math.ceil(tasks.length / 10);

  pagesLength.innerHTML = pagesTotal;
};

/* FIELDS VERIFICATION FUNCTIONS */

function showMessage(input, message, type) {
  const msg = input.parentNode.querySelector("small");
  msg.innerHTML = message;
  input.className = `${input.className} ${type ? "success" : "error"}`;
  return type;
}

function showError(input, message) {
  return showMessage(input, message, false);
}

function showSuccess(input) {
  return showMessage(input, "", true);
}

function hasValue(input, message) {
  if (input.value.trim() === "") {
    input.classList.replace('success', 'error')
    return showError(input, message);
  } else {
    input.classList.remove('error')
    return showSuccess(input);
  }
}

const showLoginInfo = (input, message) => {
  const msg = input.parentNode.querySelector('small')
  msg.innerHTML = message
  msg.className = 'unchangebleSmall'
  input.className = 'unchangeble'
}

const validateStatus = (input, message) => {
  if (input.options[0].selected) {
    input.classList.replace('success', 'error')
    return showError(input, message);
  } else {
    input.classList.replace('error', 'success')
    return showSuccess(input);
  }
};

const validateEmail = (input, required, invalid) => {
    if (!hasValue(input, required)) return false

      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const email = input.value.trim()

      if (!emailRegex.test(email)) return showError(input, invalid)
    
    return true
}

const validatePassword = (input, required, invalid) => {
    const password = input.value.trim()
    
    if (!hasValue(input, required)) return false 
     
    if (password.length < 6) return showError(input, invalid)

    return true 
}

const validateCity = async (input, required, invalid) => {
    const city = input.value.trim()
    const locals = []
    
    if (!hasValue(input, required)) return false
    
    locals.push(...(await (await fetch(`https://dataservice.accuweather.com/locations/v1/search?q=${city}&apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))

    const cityFound = locals[0]
    
    if(!cityFound) return showError(input, invalid)

    return true
}

/* SORTING FUNCTION */

const orderingTable = async (key, iconOrder) => {
  const icon = document.getElementById(iconOrder)
  if (ordering) {
    const ascMode = await fetch(
      `https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&_sort=${key}&_order=asc`
    );
    const ascTasks = await ascMode.json();
    renderTasks(ascTasks);
    ordering = false;
    icon.classList.remove('rotateDown')
    icon.classList.add('rotateUp')
  } else {
    const descMode = await fetch(
      `https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&_sort=${key}&_order=desc`
    );
    const descTasks = await descMode.json();
    renderTasks(descTasks);
    ordering = true;
    icon.classList.remove('rotateUp')
    icon.classList.add('rotateDown')
  }
};

/* WEATHER FUNCTIONS */

const weatherSearch = async (user) => {
    const locals = []
    const conditions = []
    locals.push(...(await (await fetch(`http://dataservice.accuweather.com/locations/v1/search?q=${user}&apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))
    const key = locals[0].Key
    conditions.push(...(await (await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))
    return conditions
}

const weatherInfo = async () => {
  const weatherName = document.getElementById("weatherName");
  const weatherCity = document.getElementById("weatherCity");
  const weatherTemp = document.getElementById('weatherTemp')

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userCity = user.city;
  const userInfoWeather = await weatherSearch(userCity)

  weatherName.innerHTML = `${user.name}`;
  weatherCity.innerHTML = `${userCity}`;
  weatherTemp.innerHTML = `${userInfoWeather[0].Temperature.Metric.Value}°C`
};

/* LIGHT THEME AND DARK THEME */

const background = document.getElementById("div-white");
const iconButton = document.getElementById("iconMode");
const buttonBack = document.getElementById("darkModeContent");
const logo = document.getElementById("logoArnia");
const tableBody = document.getElementById("tbody-content");
const header = document.getElementById("header");
const divPurple = document.getElementById("div-purple");
const divGray = document.getElementById("div-grey");
const divOrange = document.getElementById("div-orange");
const buttonsPaginate = document.getElementById("buttonsPaginate");
const selectStatus = document.getElementById("selectStatus");
const buttons = document.querySelectorAll("button");
const modals = document.getElementsByClassName("classModal");
const inputs = document.querySelectorAll("input");
const titleModalTask = document.getElementById('taskModalTitle')
const labels = document.querySelectorAll("label");
const helpTitle = document.getElementById('helpTitle')
const searchField = document.getElementById('searchField')
const deleteAccountBtn = document.getElementById('deleteAccountBtn')

const switchMode = () => {
  let dark = "";
  let light = "light";

  if (contrast) {
    lightMode();
    contrast = dark;
    localStorage.setItem("contrast", light);
  } else {
    darkMode();
    localStorage.setItem("contrast", dark);
    console.log("escuro");
    contrast = light;
  }
};

contrast = localStorage.getItem("contrast");

const lightMode = () => {
  background.style.backgroundColor = "white";

  iconButton.src = "../assets/moon.svg";
  buttonBack.style.backgroundColor = "var(--lightpurple)";

  logo.src = "../assets/logo-purple.svg";

  tableBody.className = "table-light";

  tHead.style.color = "var(--darkpurple)";
  tHead.className = "font-weight-bold table-light";

  header.style.color = "var(--purple)";

  divPurple.style.backgroundColor = "var(--purple)";
  divGray.style.backgroundColor = "var(--lightpurple)";
  divOrange.style.backgroundColor = "var(--yellow)";

  buttonsPaginate.style.color = "var(--indigo)";

  for (let counter = 0; counter < buttons.length; counter++) {
    buttons[counter].classList.remove("dark-button");
    buttons[counter].classList.add("light-button");
  }

  for (let counter = 0; counter < modals.length; counter++) {
    modals[counter].className = "classModal modalBack-light downToUpAnimation";
  }

  for (let counter = 0; counter < inputs.length; counter++) {
    inputs[counter].style.backgroundColor = "white";
  }

  for (let counter = 0; counter < labels.length; counter++) {
    labels[counter].style.color = 'var(--purple)';
  }

  selectStatus.style.backgroundColor = "white";

  searchField.style.backgroundColor = "";

  titleModalTask.style.color = 'var(--purple)'
  
  helpTitle.style.color = 'var(--purple)'

  deleteAccountBtn.className = 'deleteAccount'
};

const darkMode = () => {
  background.style.backgroundColor = "var(--darkArnia)";

  iconButton.src = "../assets/sun.svg";
  buttonBack.style.backgroundColor = "var(--orange)";

  logo.src = "../assets/logo-white.svg";

  tableBody.className = "table-dark text-white";

  tHead.style.color = "white";
  tHead.className = "font-weight-bold table-dark";

  header.style.color = "var(--darkWhite)";

  divPurple.style.backgroundColor = "var(--purple)";
  divGray.style.backgroundColor = "var(--lightpurple)";
  divOrange.style.backgroundColor = "var(--orange)";

  buttonsPaginate.style.color = "var(--darkWhite)";

  for (let counter = 0; counter < buttons.length; counter++) {
    buttons[counter].classList.remove("light-button");
    buttons[counter].classList.add("dark-button");
  }

  for (let counter = 0; counter < modals.length; counter++) {
    modals[counter].className =
      "classModal modalBack-dark text-white downToUpAnimation";
  }

  for (let counter = 0; counter < inputs.length; counter++) {
    inputs[counter].style.backgroundColor = "var(--ice)";
  }

  for (let counter = 0; counter < labels.length; counter++) {
    labels[counter].style.color = 'var(--orange)';
  }

  selectStatus.style.backgroundColor = "var(--ice)";

  searchField.style.backgroundColor = "var(--darkpurple)";

  titleModalTask.style.color = 'var(--orange)'

  helpTitle.style.color = 'var(--yellow)'
    deleteAccountBtn.className = 'deleteAccount'
    deleteAccountBtn.style.backgroundColor = 'var(--darkblue)'
};
