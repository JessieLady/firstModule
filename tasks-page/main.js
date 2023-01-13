/* GLOBAL CONSTS */

let ordering = true
let contrast = localStorage.getItem("contrast")
let currentTask = null
let currentPage = 1

let currentUser = JSON.parse(sessionStorage.getItem('user')).id
let currentOwner = JSON.parse(sessionStorage.getItem('user')).login

const NUM_EMPTY = 'Insira um número.'
const DESCRIPTION_EMPTY = 'Insira uma descrição.'
const DATE_EMPTY = 'Escolha uma data.'
const STATUS_EMPTY= 'Escolha um status.'

const footerHelp = document.getElementById('footerHelp')
const modalHelpUser = document.getElementById('modalHelpContent')

const modalNewTask = document.getElementById('modalNewTaskContent')
const modalEditUser = document.getElementById('modalEditContent')
const modalInfoConf = document.getElementById('modalInfoContent')

const modalErrorTxt = document.getElementById('modalErrorTxt')

const searchInput = document.getElementById('searchField')

const inDate = new Date()
const inDay = inDate.toLocaleDateString("pt-BR")
const inToday = `${inDate.getFullYear()}-${(inDate.getMonth())+1}-${inDate.getDate()}`

const formNewTask = document.getElementById('formNewTask')

/* LOAD BODY FUNCTION */

const loadBody = () => {
    getTasksRender(); 
    weatherInfo(); 
    tasksPagesTotal(); 
    currentPageNum(1); 
    contrastMode()
    minDateToday()
}

/* SESSION AND LOCAL STORAGE FUNCTIONS */
const contrastMode = () => {
    if(contrast) {
        lightMode()
    }else {
        darkMode()
    }
}

const userLogout = () => {
    sessionStorage.removeItem('user')
    window.location.href = '../login-page/index.html'
}

/* MODAL'S FUNCTIONS */

const openModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'block'
}

const closeModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'none'
}

const clearModalNewTask = () => {
    const numberField = document.getElementById('number')
    const descriptionField = document.getElementById('description')
    const dateField = document.getElementById('date')
    const select = document.querySelector('#selectStatus');

    numberField.value = ''
    descriptionField.value = ''
    dateField.value = ''

    select.options[0].selected = true
}

/* TASKS' FUNCTIONS */

const renderTasks = (tasks) => {
    const tasksContent = document.getElementById('tbody-content')
    tasksContent.innerHTML = ''
    tasks.forEach((task) => {
        const date = new Date(task.date)
        const dateFormated = date.toLocaleDateString("pt-BR", {timeZone: 'UTC'})
        if(task.status === 'Concluído'){
            task.description = `<del>${task.description}</del>`
        } else if(inDay > dateFormated && task.status !== 'Concluído'){
            task.status = 'Atrasado'
            warningLateTask()
        }
        tasksContent.innerHTML = tasksContent.innerHTML + `<tr class='text-center'>
        <td scope="row">${task.number}</td>
        <td>${task.description}</td>
        <td>${dateFormated}</td>
        <td class="${task.status.replace(" ", "-")}">${task.status}</td>
        <td>
          <span><i class="fa-solid fa-pen-to-square iconTable fa-xl" onclick="editTask(${task.id})"></i>
          </span>
          <span><i class="fa-solid fa-trash iconTable fa-xl" onclick="confirmDelete(${task.id})"></i>
          </span>
        </td>
      </tr>`
    })
}

const getTasksRender = async () => {

    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?_limit=10&owner_like=${currentOwner}`)
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}
const getTasksReturn = async () => {
    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}`)
    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&_limit=10`)//
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

const getTasksReturn = async () => {//try to change all this functions to api fetchs if possible
    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}`)
    const tasks = await tasksResponse.json()
    return tasks
}
const getTask = async (id) => {
    const taskResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks/${id}`)
    const task = await taskResponse.json()
    return task
}
const saveTask = async (task) => {
    if(currentTask === null){
        await newTask(task)
    } else {
        await updateTask(currentTask.id, task)
        currentTask = null
    }
    closeModal('modalNewTask')
}
const newTask = async (task) => {
    await fetch('https://json-server-first-module-production.up.railway.app/tasks', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
}
const updateTask = async (id, task) => {
    await fetch(`https://json-server-first-module-production.up.railway.app/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
}
const editTask = async (id) => {

    const numberField = document.getElementById('number')
    const descriptionField = document.getElementById('description')
    const dateField = document.getElementById('date')

    currentTask = await getTask(id) 

    openModal('modalNewTask')

    numberField.value = currentTask.number
    descriptionField.value = currentTask.description
    dateField.value = currentTask.date

    let text = currentTask.status
    let select = document.querySelector('#selectStatus');

    for (let counter = 0; counter < select.options.length; counter++) {
        if (select.options[counter].text === text) {
            select.options[counter].selected = true
        }
    }

    const button = document.getElementById('submitButton')
    button.innerHTML = 'Alterar'
}
class Task {
    number
    description
    date
    status
    owner
    constructor(number, description, date, status, owner) {
        this.number = number
        this.description = description
        this.date = date
        this.status = status
        this.owner = owner
    }
}

const newTaskFields = () => {
    const number = document.getElementById('number')
    const description = document.getElementById('description')
    const date = document.getElementById('date')
    const status = document.querySelector('#selectStatus')
    const button = document.getElementById('submitButton')

    let numberValid = hasValue(number, NUM_EMPTY)
    let descriptionValid = hasValue(description, DESCRIPTION_EMPTY)
    let dateValid = hasValue(date, DATE_EMPTY)
    let statusValid = validateStatus(status, STATUS_EMPTY)

    if(numberValid && descriptionValid && dateValid && statusValid){
        button.disabled = false
        button.classList.remove('disabled')
        button.classList.add('enabled')
    } else{
        button.disabled = true
        button.classList.add('disabled')
    }
}

formNewTask.addEventListener('submit', (event) => {
    event.preventDefault()

    const number = formNewTask.elements['number'].value
    const description = formNewTask.elements['description'].value
    const date = formNewTask.elements['date'].value
    const status = formNewTask.elements['status'].value
    const owner = currentOwner

    const num = Number(number)

    const task = new Task(num, description, date, status, owner)
    saveTask(task)
})

const confirmDelete = (idTask) =>{
    openModal('modalConfirmation')
    const button = document.getElementById('buttonYes')
    button.addEventListener('click', () => {
    deleteTask(idTask)
})
}
const deleteTask = async (id) => {
    await fetch(`https://json-server-first-module-production.up.railway.app/tasks/${id}`, {
    method: 'DELETE'
})
}

/* USERS FUNCTIONS */


const getUsers = async () => {//put this function in the main.html
    const users = await fetch(`https://json-server-first-module-production.up.railway.app/users`)

const getUsers = async () => {
    const users = await fetch(`https://json-server-first-module-production.up.railway.app/users`)

    const usersResponse = await users.json()
    return usersResponse
}

const getUser = async () => {
    const userResponse = await fetch(`https://json-server-first-module-production.up.railway.app/users/${currentUser}`)
    const user = await userResponse.json()
    return user
}

const updateUser = async (id, user) => {
    await fetch(`https://json-server-first-module-production.up.railway.app/users/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
}

const confirmEditUser = async () => {//how i'm going to make this function work?
    openModal('modalEditConfirm')
    console.log('aqui')
    const editButton = document.getElementById('editButton')
    const msgModalInfo = document.getElementById('textModalInfo')
    const confirmInput = document.getElementById('passwordConfirm') 

    const user = JSON.parse(sessionStorage.getItem('user'))
    console.log(user.password)
    editButton.addEventListener('click', () => {
        if(confirmInput.value !== user.password){
            openModal('modalInfo')
            confirmInput.className = 'error'
            msgModalInfo.innerHTML = 'Senha incorreta'
        }else{
            closeModal('modalEditConfirm')
            openModal('modalEditInfo')
            confirmInput.value = ''
        }
    })
}

const confirmDeleteUser = async () =>{
    closeModal('modalHelp')
    openModal('modalDeleteConfirm')

    const button = document.getElementById('deleteButton')
    const passwordInput = document.getElementById('passConfirmDelete')
    const msg = passwordInput.parentNode.querySelector('small')
    
    const currentUserObj = await getUser(currentUser)

    const deleteUser = async (id) => {
        await fetch(`https://json-server-first-module-production.up.railway.app/users/${id}`, {
        method: 'DELETE'
    })
    }

    passwordInput.addEventListener('input', () => {
    if(passwordInput.value.trim() !== currentUserObj.password){
        msg.innerHTML = 'Senha incorreta'
        passwordInput.className = 'error'
    }else{
        passwordInput.className = 'success'
        msg.innerHTML = ''
    }
    button.addEventListener('click', () => {
        if(passwordInput.value.trim() === currentUserObj.password){
            deleteUser(currentUser)

            deleteAllTasks()
            window.location.href = 'index.html'
            window.location.href = 'index.html'

        }else{
            msg.innerHTML = 'Preencha esse campo corretamente'
            passwordInput.className = 'error'
        }
    })
})
}
/* FILTER FUNCTIONS */

const filterTasks = async (status) => {
    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?status_like=${status}`)
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

const lateTasks = async () => {
    const tasks = await getTasksReturn()

    const tasksLate = tasks.filter((task) => { 
        const date = new Date(task.date)
        const dateFormated = date.toLocaleDateString("pt-BR", {timeZone: 'UTC'})     
        if(inDay > dateFormated && task.status !== 'Concluído') return true
        return false
    })
    renderTasks(tasksLate)
}

const warningLateTask = () => {
    const button = document.getElementById('btnLate')
    button.className = 'lateTask'
}

const todayTasks = async () => { // and this one too.
    const tasks = await getTasksReturn()

    const tasksToday = tasks.filter((task) => { 
        const date = new Date(task.date)
        const dateFormated = date.toLocaleDateString("pt-BR", {timeZone: 'UTC'})     
        if(dateFormated === inDay && task.status !== 'Concluído') return true
        return false
    })
    renderTasks(tasksToday)
}
searchInput.addEventListener('input', async () => {
    const tasks = await getTasksReturn()
    const input = searchInput.value.toUpperCase();

    let taskSearch = tasks.filter((task) => {
        let search = task.description.toUpperCase()
    if(search.includes(input)) return true
        return false
    })
    renderTasks(taskSearch)
})

const findTasks = async (search) => {
    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&q=${search}&_limit=10`)
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

searchInput.addEventListener('input', async () => {
    let input = searchInput.value
    let tasks = findTasks(input)
    renderTasks(tasks)
})

/* PAGINATE FUNCTIONS */

const loadPage = async (pageNum) => {
    const tasksResponse = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?_limit=10&_page=${pageNum}&owner_like=${currentOwner}`)
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

const nextPage = async () => {
    const tasks = await getTasksReturn()
    let pagesTotal = Math.ceil(tasks.length / 10)

    currentPage = currentPage + 1 > pagesTotal ? currentPage : currentPage + 1
    
    currentPageNum(currentPage)
    loadPage(currentPage)
}

const previousPage = async () => {
    currentPage = currentPage - 1 < 1 ? currentPage : currentPage - 1
    
    currentPageNum(currentPage)
    loadPage(currentPage)
}

const currentPageNum = (page) => {
    const spanPage = document.getElementById('currentPage')
    spanPage.innerHTML = `${page}`
}

const tasksPagesTotal = async () => {
    const pagesLength = document.getElementById('pagesLength')

    const tasks = await getTasksReturn()
    let pagesTotal = Math.ceil(tasks.length / 10)
    
    pagesLength.innerHTML = pagesTotal
}

/* FIELDS VERIFICATION FUNCTIONS */

function showMessage(input, message, type) {
    const msg = input.parentNode.querySelector('small')
    msg.innerText = message
    input.className = `${input.className} ${type ? 'success' : 'error'}`
    return type
}

function showError(input, message) {
    return showMessage(input, message, false)
}

function showSuccess(input) {
    return showMessage(input, '', true)
}

function hasValue(input, message) {
    if(input.value.trim() === '') {
        return showError(input, message)
    } else{
        return showSuccess(input)
    }
}

const validateStatus = (input, message) => {
    if(input.options[0].selected) {
        return showError(input, message)
    } else{
        return showSuccess(input)
    }
}

/* SORTING FUNCTION */

const orderingTable = async (key) => {

    if(ordering) {

        const ascMode = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&_sort=${key}&_order=asc`)

        const ascMode = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?_limit=10&_sort=${key}&_order=asc`)

        const ascTasks = await ascMode.json()
        renderTasks(ascTasks)
        ordering = false
    }else{

        const descMode = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?owner_like=${currentOwner}&_sort=${key}&_order=desc`)

        const descMode = await fetch(`https://json-server-first-module-production.up.railway.app/tasks?_limit=10&_sort=${key}&_order=desc`)

        const descTasks = await descMode.json()
        renderTasks(descTasks)
        ordering = true
    }
}

/* WEATHER FUNCTIONS */

/* const weatherSearch = async (user) => {
    const locals = []
    const conditions = []

    locals.push(...(await (await fetch(`https://dataservice.accuweather.com/locations/v1/search?q=${user}&apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))

    const key = locals[0].Key
    conditions.push(...(await (await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))
    return conditions
} */

const weatherInfo = async () => {

    const weatherName = document.getElementById('weatherName')
    const weatherCity = document.getElementById('weatherCity')
    //const weatherTemp = document.getElementById('weatherTemp')

    const user = JSON.parse(sessionStorage.getItem('user'))
    const userCity = user.city
    //const userInfoWeather = await weatherSearch(userCity)

    weatherName.innerHTML = `${user.name}`
    weatherCity.innerHTML = `${userCity}`
    /* weatherTemp.innerHTML = `${userInfoWeather[0].Temperature.Metric.Value}°C` */
}

/* LIGHT THEME AND DARK THEME */

/* easy, but you must redo this logic. It's too messy. */

const background = document.getElementById('div-white')
const iconButton = document.getElementById('iconMode')
const buttonBack = document.getElementById('darkModeContent')
const logo = document.getElementById('logoArnia')
const tableBody = document.getElementById('tbody-content')
const header = document.getElementById('header')//NAME CHANGED
const divPurple = document.getElementById('div-purple')
const divGray = document.getElementById('div-grey')
const divOrange = document.getElementById('div-orange')
const buttonsPaginate = document.getElementById('buttonsPaginate')
const selectStatus = document.getElementById('selectStatus')
const buttons = document.querySelectorAll("button")
const modals = document.getElementsByClassName('classModal')
const inputs = document.querySelectorAll("input")

/* const trs = document.querySelectorAll("tr")// this is not working...
const helpTitle = document.getElementById('helpTitle')
const searchField = document.getElementById('searchField')
const deleteAccountBtn = document.getElementById('deleteAccountButton') */

const switchMode = () => {
    let dark = ''
    let light = 'light'
    
    if(contrast) {
        lightMode()
        contrast = dark
        localStorage.setItem("contrast", light)
    }else {
        darkMode()
        localStorage.setItem("contrast", dark)
        console.log('escuro')
        contrast = light
    }
}

contrast = localStorage.getItem("contrast")

/* buttonBack.addEventListener('click', () => {
    switchMode()
}) *///This is double clicking the switchMode!!! Fix this...

const lightMode = () => {   
    background.style.backgroundColor = 'var(--background)'

    iconButton.src = "../assets/moon.svg"
    buttonBack.style.backgroundColor = 'var(--purple)'
    
    logo.src = '../assets/logo-purple.svg'
    
    tableBody.className = 'table-light text-purple'
    
    tHead.style.color = 'var(--darkpurple)'
    tHead.className = 'font-weight-bold table-light'    
    
    header.style.color = 'var(--purple)'

    divPurple.style.backgroundColor = 'var(--purple)'
    divGray.style.backgroundColor = 'var(--lightpurple)'
    divOrange.style.backgroundColor = 'var(--yellow)'

    buttonsPaginate.style.color = 'var(--indigo)'
    
    footerHelp.className = ''
    
    for(let counter = 0; counter < buttons.length; counter++){
        buttons[counter].classList.remove('dark-button')
        buttons[counter].classList.add('light-button')
    }

    for (let counter = 0; counter < modals.length; counter++) {
        modals[counter].className = 'classModal modalBack-light downToUpAnimation'  
    }

    for (let counter = 0; counter < inputs.length; counter++) {
        inputs[counter].style.backgroundColor = 'var(--background)'  
    }

    selectStatus.style.backgroundColor = 'var(--background)'

    searchInput.style.backgroundColor = ''/* searchField */

    /* helpTitle.style.color = 'var(--purple)'

    deleteAccountBtn.className = 'deleteAccount' */
}

const darkMode = () => {
    background.style.backgroundColor = 'var(--purpleBackground)'

    iconButton.src = "../assets/sun.svg"
    buttonBack.style.backgroundColor = 'var(--darkorange)'
    
    logo.src = '../assets/logo-white.svg'
    
    tableBody.className = 'table-dark text-white'
    
    tHead.style.color = 'white'
    tHead.className = 'font-weight-bold table-dark'
    
    header.style.color = 'var(--background)'/* darkWhite */
    
    divPurple.style.backgroundColor = 'var(--darkpurple)'
    divGray.style.backgroundColor = 'var(--purpleple)'
    divOrange.style.backgroundColor = 'var(--darkorange)'

    buttonsPaginate.style.color = 'var(--background)'/* darkWhite */

    footerHelp.className = 'dark-footer'
    
    for(let counter = 0; counter < buttons.length; counter++){
        buttons[counter].classList.remove('light-button')
        buttons[counter].classList.add('dark-button')
    }

    for (let counter = 0; counter < modals.length; counter++) {
        modals[counter].className = 'classModal modalBack-dark text-purple downToUpAnimation'  
    }

    for (let counter = 0; counter < modals.length; counter++) {
        inputs[counter].style.backgroundColor = 'var(--greypurple)'
    }

    selectStatus.style.backgroundColor = 'var(--greypurple)'

    searchInput.style.backgroundColor = 'var(--darkpurple)'/* searchField */

    /* helpTitle.style.color = 'var(--yellow)'

    deleteAccountBtn.className = 'deleteAccount'
    deleteAccountBtn.style.backgroundColor = 'var(--darkblue)' */
}

/* STAGING AREA */

const minDateToday = () => {
    let day = inDate.getDate();
    let month = inDate.getMonth() + 1;
    let year = inDate.getFullYear();
    if (day < 10) {
        day = '0' + day;
    }
    if (month < 10) {
        month = '0' + month;
    }    
    let today = year + '-' + month + '-' + day;
    document.getElementById("date").setAttribute("min", today);
}

const deleteAllTasks = async () => {
    const tasks = await getTasksReturn()
    tasks.forEach((task) => {
        deleteTask(task.id)
    })
}

const editUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))

    console.log(user)

    const name = document.getElementById('name')
    const city = document.getElementById('city')
    const login = document.getElementById('login')
    const email = document.getElementById('email')
    const password = document.getElementById('password')

    name.value = user.name
    city.value = user.city
    login.value = user.login
    email.value = user.email
    password.value = user.password
    
    updateUser(user.id, user)
    openModal('modalInfo')
    closeModal('modalEditInfo')
}
// editUser()

const editUserBtn = document.getElementById('editUserBtn')
const formEdit = document.getElementById('formEdit')

formEdit.addEventListener('submit', (event) => {
    event.preventDefault()

})

