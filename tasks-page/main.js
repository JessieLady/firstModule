const modal = document.getElementById('modal')
const content = document.getElementById('content')
const form = document.getElementById('form')
const button = document.getElementById('submitButton')

let contraste = false
let currentTask = null
let currentUser = 1// carol Account

const NUM_EMPTY = 'Insira um número.'
const DESCRIPTION_EMPTY = 'Insira uma descrição.'
const DATE_EMPTY = 'Escolha uma data.'
const STATUS_EMPTY= 'Escolha um status.'

const numberField = document.getElementById('number')
const descriptionField = document.getElementById('description')
const dateField = document.getElementById('date')
const statusField = document.getElementById('status')

const modalNewTask = document.getElementById('modalNewTaskContent')
const modalHelpUser = document.getElementById('modalHelpContent')
const modalEditUser = document.getElementById('modalEditContent')
const modalInfoConf = document.getElementById('modalInfoContent')

const divPurple = document.getElementById('div-purple')
const divGray = document.getElementById('div-grey')
const divOrange = document.getElementById('div-orange')

const logoutButton = document.getElementById('logoutButton')
const btnToday = document.getElementById('btnToday')
const btnRunning = document.getElementById('btnRunning')
const btnPause = document.getElementById('btnPause')
const btnFinished = document.getElementById('btnFinished')
const btnLate = document.getElementById('btnLate')

const searchInput = document.getElementById('searchField')

const modalHelp = document.getElementById('footerHelp')

const trTable = document.getElementById('trTable')
const pageTitle = document.getElementById('page-title')
const tHead = document.getElementById('tHead')
const buttonsPaging = document.getElementById('buttonsPaging')

const weather = document.getElementById('weather')
const hello = document.getElementById('firstLine')

const iconButton = document.getElementById('iconMode')
const buttonBack = document.getElementById('darkModeContent')
const background = document.getElementById('div-white')
const logo = document.getElementById('logoArnia')

const tableBody = document.getElementById('tbody-content')

const newTaskButton = document.getElementById('newTaskButton')

const weatherName = document.getElementById('weatherName')
const weatherCity = document.getElementById('weatherCity')
const weatherTemp = document.getElementById('weatherTemp')
const weatherCond = document.getElementById('weatherCond')
const weatherHour = document.getElementById('weatherHour')
const weatherDate = document.getElementById('weatherDate')

const inDate = new Date()
const inDay = inDate.toLocaleDateString("pt-BR")
const inTime = inDate.toTimeString()

const buttons = document.querySelectorAll("button");

//diminuir a quantidade de variaveis globais

/* MODAL'S FUNCTIONS */

const openModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'block'
}

const closeModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'none'
}


const renderTasks = (tasks) => {
    const tasksContent = document.getElementById('tbody-content')
    tasksContent.innerHTML = ''
    tasks.forEach((task) => {
        const date = new Date(task.date)
        const dateFormated = date.toLocaleDateString("pt-BR", {timeZone: 'UTC'})

        if(task.status === 'Concluído'){
            task.description = `<del>${task.description}</del>`
        }
        
        tasksContent.innerHTML = tasksContent.innerHTML + `<tr class='text-purple' id='trTable'>
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

const confirmDelete = (idTask) =>{
    const modal = document.getElementById('modalConfirmation')
    modal.style.display = 'block'

    const deleteTask = async (id) => {
        await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    })
    }
    const button = document.getElementById('buttonYes')
    button.addEventListener('click', (event) => {
    event.preventDefault()
    deleteTask(idTask)
})
}

const getTasks = async () => {
    const tasksResponse = await fetch('http://localhost:3000/tasks?_limit=5')
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

const orderTasks = async () => {
    const tasksResponse = await fetch('http://localhost:3000/tasks?_limit=5')
    const tasks = await tasksResponse.json()
    renderTasks(tasks)
}

const getTask = async (id) => {
    const taskResponse = await fetch(`http://localhost:3000/tasks/${id}`)
    const task = await taskResponse.json()
    return task// It will return an object
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

const saveTask = async (task) => {
    if(currentTask === null){
        await newTask(task)
    } else {
        await updateTask(currentTask.id, task)
        currentTask = null
    }
    closeModal('modal')
}
const updateTask = async (id, task) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
}
const editTask = async (id) => {
    currentTask = await getTask(id) 

    openModal('modalNewTask')

    numberField.value = currentTask.number
    descriptionField.value = currentTask.description
    dateField.value = currentTask.date
    statusField.value = currentTask.status

    button.innerHTML = 'Alterar'
    button.onclick="updateTask()"
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    })
}

//how too put the last tasks on the top of the table?

form.addEventListener('submit', (event) => {
    event.preventDefault()//This controls the form' submiting

    const number = form.elements['number'].value
    const description = form.elements['description'].value
    const date = form.elements['date'].value
    const status = form.elements['status'].value
    const task = {// this will gather task' info to the function that will send to the api 
        number, description, date, status
    }
    saveTask(task)
})

 /* form.addEventListener('submit', (event) => {
    event.preventDefault()

    const number = form.elements['number']
    const description = form.elements['description']
    const date = form.elements['date']
    const status = form.elements['status']

    const task = {number, description, date, status}

    const numberValid = hasValue(number, NUM_EMPTY)
    const descriptionValid = hasValue(description, DESCRIPTION_EMPTY)
    const dateValid = hasValue(date, DATE_EMPTY)
    const statusValid = hasValue(status, STATUS_EMPTY) 

    if(numberValid && descriptionValid && dateValid && statusValid) {
        saveTask(task)
    }
})
 */

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

const orderDate = () => {
    const table = document.getElementById(`table`)
    modalInfo.style.display = 'block'
}

function OrderMaking() {

    let numeros = []
for (let i = 0;i<3;i++){
    let num = 0
    io.write("Digite um número...:")
    num = io.readInt();
    numeros.push(num)
}

//trocando um número de posição no vetor

let aux = 0
aux = numeros[2]
numeros[2] = numeros[1]
numeros[1] = aux
}

//super IMPORTANT! Create a class for tasks too.

const lightMode = () => {
    background.style.backgroundColor = 'var(--background)'
    iconButton.src = "../assets/moon.svg"
    buttonBack.style.backgroundColor = 'var(--purple)'
    document.body.style.color = 'var(--indigo)'
    table.style.color = 'var(--purple)'
    logo.src = '../assets/logo-purple.svg'
    
    tableBody.className = 'table-light text-purple'
    tHead.style.color = 'var(--darkpurple)'
    tHead.className = 'font-weight-bold table-light'
    logoutButton.className = 'light-button'
    weather.style.color = 'var(--purple)'
    hello.style.color = 'var(--purple)'
    newTaskButton.className = 'light-button mt-3'
    pageTitle.style.color = 'var(--purple)'
    divPurple.style.backgroundColor = 'var(--purple)'
    divGray.style.backgroundColor = 'var(--lightpurple)'
    divOrange.style.backgroundColor = 'var(--yellow)'
    btnToday.className = 'light-button'
    btnRunning.className = 'light-button'
    btnPause.className = 'light-button'
    btnFinished.className = 'light-button'
    btnLate.className = 'light-button'
    searchInput.style.backgroundColor = ''
    modalHelp.className = ''
    buttonsPaging.style.color = 'var(--indigo)'
    modalNewTask.className = 'modalBack-light downToUpAnimation'
    modalHelpUser.className = 'modalBack-light downToUpAnimation'
    modalEditUser.className = 'modalBack-light downToUpAnimation'
    modalInfoConf.className = 'modalBack-light downToUpAnimation'
}

const darkMode = () => {//pay attention because the darkmode resets
    background.style.backgroundColor = 'var(--darkBackground)'
    iconButton.src = "../assets/sun.svg"
    buttonBack.style.backgroundColor = 'var(--darkorange)'
    logo.src = '../assets/logo.png'//get an svg to this version of Arnia's Logo
    tableBody.className = 'table-dark text-white'
    tHead.style.color = 'var(--purple)'
    tHead.className = 'font-weight-bold table-dark'
    logoutButton.className = 'dark-button'
    weather.style.color = 'var(--background)'
    hello.style.color = 'var(--background)'
    newTaskButton.className = 'dark-button mt-3'
    
    pageTitle.style.color = 'var(--background)'
    divPurple.style.backgroundColor = 'var(--darkpurple)'
    divGray.style.backgroundColor = 'var(--purpleple)'
    divOrange.style.backgroundColor = 'var(--darkorange)'
    btnToday.className = 'dark-button'
    btnRunning.className = 'dark-button'
    btnPause.className = 'dark-button'
    btnFinished.className = 'dark-button'
    btnLate.className = 'dark-button'
    searchInput.style.backgroundColor = 'var(--darkpurple)'
    modalHelp.className = 'dark-footer'
    buttonsPaging.style.color = 'var(--background)'
    modalNewTask.className = 'modalBack-dark text-purple downToUpAnimation'
    modalHelpUser.className = 'modalBack-dark text-purple downToUpAnimation'
    modalEditUser.className = 'modalBack-dark text-purple downToUpAnimation'
    modalInfoConf.className = 'modalBack-dark text-purple downToUpAnimation'

    for(let iterador = 0; iterador < buttons.length; iterador++){
        buttons[iterador].style.backgroundColor = 'red'
    }
}

const switchMode = () =>{
    if (contraste) {
        lightMode()
        contraste = false
    } else {
        darkMode()
        contraste = true
    }
}

//DON'T FORGET TO STUDY THIS!

/* https://developer.mozilla.org/pt-BR/docs/Web/API/Window/sessionStorage

function doLogin() {
  const keepMeConnected = document.getElementById("keepMeConnected").value

  sessionStorage.setItem("keepMeConnected", keepMeConnected)
}

function checkSession() {
  if (sessionStorage.getItem("keepMeConnected")) {
    // redireciona para a página logada
  }
  //deixa na página de login
}
checkSession está no onload do body da página de login */

/* --------------------------------------------------------- */

const getUsers = async () => {//put this function in the main.html
    const users = await fetch(`http://localhost:3000/users`)
    const usersResponse = await users.json()
    return usersResponse
}

//Preciso aprender a usar o google translator API

const weatherSearch = async (user) => {
    const locals = []
    const conditions = []

    locals.push(...(await (await fetch(`http://dataservice.accuweather.com/locations/v1/search?q=${user}&apikey=RTILAUMEASKAhXMGkVLeNniVv3gNmk0k`)).json()))

    const key = locals[0].Key
    conditions.push(...(await (await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${key}?apikey=RTILAUMEASKAhXMGkVLeNniVv3gNmk0k`)).json()))
    return conditions
}

const weatherInfo = async () => {//use the id as a parameter

    const user = await getUsers()
    const userIndex = user.findIndex((valor) => {
        if(valor.id === currentUser) return true//tá funcionando certinhoooooo!
    })    
    const userCity = user[userIndex].city
    const userInfoWeather = await weatherSearch(userCity)

    weatherName.innerHTML = `${user[userIndex].name}`
    weatherCity.innerHTML = `${userCity}`
    weatherTemp.innerHTML = `${userInfoWeather[0].Temperature.Metric.Value}°C`
    weatherCond.innerHTML = `${userInfoWeather[0].WeatherText}`
    //weatherHour.innerHTML = `${inTime.getHours().toLocaleDateString('pt-BR')}`
    //weatherDate.innerHTML = `${inTime.getDate().toLocaleDateString('pt-BR')}`

}

const filterTasks = async (status) => {
    const tasksResponse = await fetch('http://localhost:3000/tasks')
    const tasks = await tasksResponse.json()
    const filterTasks = tasks.filter((valor) => {
        if(valor.status === status) return true
        return false
    })
    renderTasks(filterTasks)
}

const lateTask = async () => {
    const dateNumber = inDay
    const tasksResponse = await fetch('http://localhost:3000/tasks')
    const tasks = await tasksResponse.json()

    const filterLateTasks = tasks.filter((valor) => {
        let dateD = valor.date
        if(valor.date) console.log(dateD.toLocaleDateString("pt-BR"), inDay)//acertar o atrasado
        return false
        
    })
    console.log(filterLateTasks)
}


//para fazer o editUser
//function onclinck com parametro "opção clicada pelo user"
// um modal para tudo
//mudar dinamicamente com js
//input simples talvez?
//verificação de senha para fazer a alteração
//modal info para avisar se as alterações foram concretizadas

//TIVE UMA IDEIA PARA DIMINUIR O DARK E LIGHT MODE!
// maybe we should put a class in the body with all the configs
//for each way
//Doable?
