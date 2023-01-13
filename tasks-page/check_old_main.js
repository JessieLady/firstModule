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

const loginInput = document.getElementById('nameLogin')
const passwordInput = document.getElementById('passwordLogin')

const formNewTask = document.getElementById('formNewTask')

/* LOAD BODY FUNCTION */

const loadBody = () => {
    getTasksRender(); 
    weatherInfo(); 
    tasksPagesTotal(); 
    currentPageNum(1); 
    contrastMode()
}

/* MODALS FUNCTIONS */

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

/* TASKS FUNCTIONS*/

const renderTasks = (tasks) => {
    const tasksContent = document.getElementById('tbody-content')
    tasksContent.innerHTML = ''
    tasks.forEach((task) => {
        const date = new Date(task.date)
        const dateFormated = date.toLocaleDateString("pt-BR", {timeZone: 'UTC'})
        if(task.status === 'Concluído'){
            task.description = `<del>${task.description}</del>`
        } else if(inDay > dateFormated && task.status !== 'Concluído'){//make a function that filter all tha tasks and put the warning in the screen
            task.status = 'Atrasado'
            warningLateTask()
        }
        tasksContent.innerHTML = tasksContent.innerHTML + `<tr>
        <td>${task.number}</td>
        <td>${task.description}</td>
        <td>${dateFormated}</td>
        <td class="${(task.status).replace(" ", "-")}">${task.status}</td>
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
    const tasksResponse = await fetch(`http://localhost:3000/tasks?owner_like=${currentOwner}&_limit=10`)//
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

const getTasksReturn = async () => {//try to change all this functions to api fetchs if possible
    const tasksResponse = await fetch(`http://localhost:3000/tasks?owner_like=${currentOwner}`)
    const tasks = await tasksResponse.json()
    return tasks
}

const getTask = async (id) => {
    const taskResponse = await fetch(`http://localhost:3000/tasks/${id}`)
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
    await fetch('http://localhost:3000/tasks', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
}

const updateTask = async (id, task) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, x',
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

    let text = currentTask.status//change the text var name
    let select = document.querySelector('#selectStatus');

    for (let counter = 0; counter < select.options.length; counter++) {
        if (select.options[counter].text === text) {
            select.options[counter].selected = true
        }
    }

    const button = document.getElementById('submitButton')
    button.innerHTML = 'Alterar'
}

const confirmDelete = (idTask) =>{
    openModal('modalConfirmation')

    const deleteTask = async (id) => { //remove this extra delete function
        await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    })
    }
    const button = document.getElementById('buttonYes')
    button.addEventListener('click', () => {
    deleteTask(idTask)
})
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
    method: 'DELETE'
})
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

/* It`s missing a function that enables the submit form button */

/* get based on this */

 /* formNewTask.addEventListener('onchange', (event) => {
    event.preventDefault()

    const button = document.getElementById('submitButton')

    const number = formNewTask.elements['number']
    const description = formNewTask.elements['description']
    const date = formNewTask.elements['date']
    const status = formNewTask.elements['status']

    const task = new Task(number, description, date, status)

    const numberValid = hasValue(number, NUM_EMPTY)
    const descriptionValid = hasValue(description, DESCRIPTION_EMPTY)
    const dateValid = hasValue(date, DATE_EMPTY)
    const statusValid = hasValue(status, STATUS_EMPTY) 

    if(numberValid && descriptionValid && dateValid && statusValid) {
        button.disabled = false
        button.className = 'enabled'
        saveTask(task)
    }
}) */

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

/* USERS FUNCTIONS */

const getUsers = async () => {
    const users = await fetch(`http://localhost:3000/users`)
    const usersResponse = await users.json()
    return usersResponse
}

const getUser = async () => {
    const userResponse = await fetch(`http://localhost:3000/users/${currentUser}`)
    const user = await userResponse.json()
    return user
}

const updateUser = async (id, user) => {
    await fetch(`http://localhost:3000/users/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
}

const confirmEditUser = async () => {//how i'm going to make this function work?

    const editButton = document.getElementById('editButton')
    const msgModalInfo = document.getElementById('textModalInfo') 

    const currentUserObj = await getUser(currentUser)
    editButton.addEventListener('click', () => {
        if(confirmInput.value !== currentUserObj.password){
            openModal('modalInfo')
            msgModalInfo.innerHTML = 'Ocorreu um erro'
        }else{
            closeModal('modalEditConfirm')
            editUser(currentUser)//put the function editUser in here!
            editInput.value = ''
        }
    })
}

//vou parar isso um pouquinho. Cabeça on fire

const editUser = async (id) => {
    openModal('modalEditInfo')
    const currentUserObj = await getUser(id)

    const name = document.getElementById('nameEdit')
    const city = document.getElementById('cityEdit')
    const login = document.getElementById('loginEdit')
    const email = document.getElementById('emailEdit')
    const password = document.getElementById('passwordEdit')

    name.value = currentUserObj.name
    city.value = currentUserObj.city
    login.value = currentUserObj.login
    email.value = currentUserObj.email
    password.value = currentUserObj.password

    await updateUser(id, currentUserObj)
    openModal('modalInfo')
    closeModal('modalEditInfo')
}

const confirmDeleteUser = async () =>{
    closeModal('modalHelp')
    openModal('modalDeleteConfirm')

    const button = document.getElementById('deleteButton')
    const passwordInput = document.getElementById('passConfirmDelete')
    const msg = passwordInput.parentNode.querySelector('small')
    
    const currentUserObj = await getUser(currentUser)

    const deleteUser = async (id) => {
        await fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE'
    })
    }

    passwordInput.addEventListener('blur', () => {
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
            window.location.href = '../login-page/index.html'
        }else{
            msg.innerHTML = 'Preencha esse campo corretamente'
            passwordInput.className = 'error'
        }
    })
    //how to delete all the tasks from the user account?
})
}

/* create a function that deletes all the tasks from the user when the user is deleted */

/* FILTER FUNCTIONS */

const filterTasks = async (status) => { // change this
    const tasks = await getTasksReturn()
    const filterTasks = tasks.filter((valor) => {
        if(valor.status === status) return true
        return false
    })
    renderTasks(filterTasks)
}

const lateTasks = async () => { // You can try change this one too but i dunno how to...
    const tasks = await getTasksReturn()

    const tasksLate = tasks.filter((task) => { 
        const date = new Date(task.date)
        const dateFormated = date.toLocaleDateString("pt-BR", {timeZone: 'UTC'})     
        if(inDay > dateFormated && task.status !== 'Concluído') return true
        return false
    })
    renderTasks(tasksLate)
}

const warningLateTask = () => {// Try to implement more this one. Only if the task is in the screen that this button appears. Good, but not enough.
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

searchInput.addEventListener('input', async () => { //Maybe this one too, but i love the way that this search input works...
    const tasks = await getTasksReturn()
    const input = searchInput.value.toUpperCase();

    let taskSearch = tasks.filter((task) => {
        let search = task.description.toUpperCase()
    if(search.includes(input)) return true
        return false
    })
    renderTasks(taskSearch)
})

const findTasks = async () => { //try to make this function with the api function

}

/* PAGING FUNCTIONS */

const loadPage = async (pageNum) => {
    const tasksResponse = await fetch(`http://localhost:3000/tasks?_limit=10&_page=${pageNum}&owner_like=${currentOwner}`)
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
    if(input.value.trim() === '' || input.value === 'Escolha uma opção') {
        return showError(input, message)
    } else{
        return showSuccess(input)
    }
}

/* SORTING FUNCTION */

const orderingTable = async (key) => {

    if(ordering) {
        const ascMode = await fetch(`http://localhost:3000/tasks?_limit=10&_sort=${key}&_order=asc`)
        const ascTasks = await ascMode.json()
        renderTasks(ascTasks)
        ordering = false
    }else{
        const descMode = await fetch(`http://localhost:3000/tasks?_limit=10&_sort=${key}&_order=desc`)
        const descTasks = await descMode.json()
        renderTasks(descTasks)
        ordering = true
    }
}

/* WEATHER FUNCTIONS */

const weatherSearch = async (user) => {
    const locals = []
    const conditions = []

    locals.push(...(await (await fetch(`http://dataservice.accuweather.com/locations/v1/search?q=${user}&apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))

    const key = locals[0].Key
    conditions.push(...(await (await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))
    return conditions
}

const weatherInfo = async () => {//This function needs to be redone

    const weatherName = document.getElementById('weatherName')
    const weatherCity = document.getElementById('weatherCity')
    //const weatherTemp = document.getElementById('weatherTemp')

    const user = await getUsers()
    const userIndex = user.findIndex((valor) => {
        if(valor.id === currentUser) return true
    })    
    const userCity = user[userIndex].city
    //const userInfoWeather = await weatherSearch(userCity)

    weatherName.innerHTML = `${user[userIndex].name}`
    weatherCity.innerHTML = `${userCity}`
    //weatherTemp.innerHTML = `${userInfoWeather[0].Temperature.Metric.Value}°C`
}

/* SESSION AND LOCAL STORAGE FUNCTIONS */

const contrastMode = () => {
    if(contrast) {
        lightMode()
    }else {
        darkMode()
    }
}

/* LIGHT THEME AND DARK THEME */

/* easy, but you must redo this logic. It's too messy. */

const background = document.getElementById('div-white')
const iconButton = document.getElementById('iconMode')
const buttonBack = document.getElementById('darkModeContent')
const logo = document.getElementById('logoArnia')
const tableBody = document.getElementById('tbody-content')
const header = document.getElementById('headerSection')
const divPurple = document.getElementById('div-purple')
const divGray = document.getElementById('div-grey')
const divOrange = document.getElementById('div-orange')
const buttonsPaging = document.getElementById('buttonsPaging')
const selectStatus = document.getElementById('selectStatus')
const buttons = document.querySelectorAll("button")
const modals = document.getElementsByClassName('classModal')
const inputs = document.querySelectorAll("input")
const trs = document.querySelectorAll("tr")// this is not working...
const helpTitle = document.getElementById('helpTitle')
const searchField = document.getElementById('searchField')
const deleteAccountBtn = document.getElementById('deleteAccountButton')

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
        contrast = light
    }
}

contrast = localStorage.getItem("contrast")

//This is double clicking the switchMode!!! Fix this...

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

    buttonsPaging.style.color = 'var(--indigo)'
    
    footerHelp.className = ''
    
    for(let counter = 0; counter < buttons.length; counter++){
        buttons[counter].className = 'light-button'
    }

    for (let counter = 0; counter < modals.length; counter++) {
        modals[counter].className = 'classModal modalBack-light downToUpAnimation'  
    }

    for (let counter = 0; counter < inputs.length; counter++) {
        inputs[counter].style.backgroundColor = 'var(--background)'  
    }

    for (let counter = 0; counter < trs.length; counter++) {
        trs[counter].className = 'light-tr'  
    }

    selectStatus.style.backgroundColor = 'var(--background)'

    searchField.style.backgroundColor = ''

    helpTitle.style.color = 'var(--purple)'

    deleteAccountBtn.className = 'deleteAccount'
}

const darkMode = () => {
    background.style.backgroundColor = 'var(--darkBackground)'

    iconButton.src = "../assets/sun.svg"
    buttonBack.style.backgroundColor = 'var(--darkorange)'
    
    logo.src = '../assets/logo-white.svg'
    
    tableBody.className = 'table-dark text-white'
    
    tHead.style.color = 'white'
    tHead.className = 'font-weight-bold table-dark'
    
    header.style.color = 'var(--darkWhite)'
    
    divPurple.style.backgroundColor = 'var(--darkpurple)'
    divGray.style.backgroundColor = 'var(--purpleple)'
    divOrange.style.backgroundColor = 'var(--darkorange)'

    buttonsPaging.style.color = 'var(--darkWhite)'

    footerHelp.className = 'dark-footer'
    
    for(let counter = 0; counter < buttons.length; counter++){
        buttons[counter].className = 'dark-button'
    }

    for (let counter = 0; counter < modals.length; counter++) {
        modals[counter].className = 'classModal modalBack-dark text-purple downToUpAnimation'  
    }

    for (let counter = 0; counter < modals.length; counter++) {
        inputs[counter].style.backgroundColor = 'var(--greypurple)'
    }

    for (let counter = 0; counter < trs.length; counter++) {
        trs[counter].className = 'dark-tr'  
    }

    selectStatus.style.backgroundColor = 'var(--greypurple)'

    searchField.style.backgroundColor = 'var(--darkpurple)'

    helpTitle.style.color = 'var(--yellow)'

    deleteAccountBtn.className = 'deleteAccount'
    deleteAccountBtn.style.backgroundColor = 'var(--darkblue)'
}

