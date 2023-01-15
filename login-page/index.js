/* GLOBAL CONSTS */

const modalLogin = document.getElementById('modalLogin')
const modalRegistration = document.getElementById('modalRegistration')
const modalInfo = document.getElementById('modalInfo')
const modalInfoTxt = document.getElementById('modalInfoContent')
const formNewUser = document.getElementById('formNewUser')
const formLogin = document.getElementById('formLogin')
const inputLogin = document.getElementById('nameLogin')
const buttonLogin = document.getElementById('buttonLogin')

const NAME_REQUIRED = 'Por favor, insira o seu nome'
const CITY_REQUIRED = 'Por favor, insira o sua cidade'
const CITY_INVALID = 'Cidade inválida'
const LOGIN_REQUIRED = 'Por favor, insira um login'
const LOGIN_INVALID = 'Login não disponível'
const EMAIL_REQUIRED = 'Por favor, insira um email'
const EMAIL_INVALID = 'Email inválido'
const PASS_REQUIRED = 'Por favor, insira sua senha'
const PASS_LENGTH = 'Senha menor que 6 caracteres'
const PASS_WRONG = 'Senha incorreta'

/* MODAL'S FUNCTIONS */

const openModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'block'
}

const closeModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'none'
}

/* VERIFICATION FUNCTIONS */

function showMessage(input, message, type) {
    const msg = input.parentNode.querySelector('small')
    msg.innerText = message
    msg.className = `${type ? 'successSmall' : 'errorSmall'}`
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

/* VALIDATION FUNCTIONS */

const validateEmail = (input, required, invalid) => {
    if (!hasValue(input, required)) return false

      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const email = input.value.trim()

      if (!emailRegex.test(email)){
        input.classList.replace('success', 'error')
        return showError(input, invalid)
      }
    
    return true
}

const validatePassword = (input, required, invalid) => {
    const password = input.value.trim()
    
    if (!hasValue(input, required)) return false 
     
    if (password.length < 6){
        input.classList.replace('success', 'error')
        return showError(input, invalid)
    } 

    return true 
}

const validateCity = async (input, required, invalid) => {
    const city = input.value.trim()
    const locals = []
    
    if (!hasValue(input, required)) return false
    
    locals.push(...(await (await fetch(`https://dataservice.accuweather.com/locations/v1/search?q=${city}&apikey=rr95vjK55BycimP4YZNYXb93GkuaDEAH`)).json()))

    const cityFound = locals[0]
    
    if(!cityFound) {
        input.classList.replace('success', 'error')
        return showError(input, invalid)
    }
    return true
}

const validateLogin = async (input, required, invalid) => {
    const login = input.value.trim()
    const users = await getUsers()

    if (!hasValue(input, required)) return false

    let loginFound = users.find((user) => {
        if(user.login === login) return true
        return false
    })

    if(loginFound){
        input.classList.replace('success', 'error')
        return showError(input, invalid)
    } else{
        const msg = input.parentNode.querySelector('small')
        msg.className = 'successSmall'
        msg.innerText = 'Login disponível'
        input.className = 'success'
    }
    return true
}
/* USER'S FUNCTIONS */

const getUsers = async () => {
    const users = await fetch(`http://localhost:3000/users`)
    const usersResponse = await users.json()
    return usersResponse
}

const newUser = async (user) => {
    await fetch('http://localhost:3000/users', {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then( () => {
        modalInfo.style.display = 'block'
        modalRegistration.style.display = 'none'
    })
    .catch(
        (error) => {
        modalRegistration.style.display = 'none'
        modalInfo.style.display = 'block'
        modalInfoTxt.innerHTML = "Erro:" + error
    })
}

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

const deleteUser = async (id) => {
    await fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE'
})
}

/* REGISTER NEW USER  */ 

const newUserFields = () => {
    const name = document.getElementById('nameUser')
    const city = document.getElementById('cityUser')
    const login = document.getElementById('loginUser')
    const email = document.getElementById('emailUser')
    const password = document.getElementById('passwordUser')
    const button = document.getElementById('submitButton')

    let nameValid = hasValue(name, NAME_REQUIRED)
    let cityValid = validateCity(city, CITY_REQUIRED, CITY_INVALID)
    let loginValid = validateLogin(login, LOGIN_REQUIRED, LOGIN_INVALID)
    let emailValid = validateEmail(email, EMAIL_REQUIRED, EMAIL_INVALID)
    let passwordValid = validatePassword(password, PASS_REQUIRED, PASS_LENGTH)

    if(nameValid && cityValid && loginValid && emailValid && passwordValid){
        button.disabled = false
        button.classList.replace('disabled', 'enabled')
    } else{
        button.disabled = true
        button.classList.replace('enabled', 'disabled')
    }
}

formNewUser.addEventListener("submit", (event) => {
    event.preventDefault()

    let name = formNewUser.elements['nameUser'].value
    let city = formNewUser.elements['cityUser'].value
    let login = formNewUser.elements['loginUser'].value
    let email = formNewUser.elements['emailUser'].value
    let password = formNewUser.elements['passwordUser'].value

    let user = new User(name, city, login, email, password)
    newUser(user)
})

/* LOGIN USER */

formLogin.addEventListener('input', async (event) => {
    event.preventDefault()

    let login = formLogin.elements['nameLogin']
    let password = formLogin.elements['passwordLogin']
    let button = document.getElementById('buttonLogin')

    const userFound = await searchUser(login)

    if(password.value.trim() !== '') {
        if(userFound.password !== password.value){
            button.disabled = true
            button.classList.replace('enabled', 'disabled')
            showError(password, PASS_WRONG)
        } else{
            button.disabled = false
            button.classList.replace('disabled', 'enabled')
            showSuccess(password)
        }
    } else{
        showError(password, PASS_REQUIRED)
    }
})

buttonLogin.addEventListener('click', async (event) => {
    event.preventDefault()
    let login = document.getElementById('nameLogin')
    const userFound = await searchUser(login)
    sessionStorage.setItem('user', JSON.stringify(userFound))
    window.location.href = 'main.html'
})

/* LOGIN FUNCTIONS */

const searchUser = async (login) => {
    const users = await getUsers()
    const findUser = await users.filter((user) => {
        if(login.value === user.login) return true
        return false
    })
    return findUser[0]
}

function userFoundSuccess(input) {
    const msg = input.parentNode.querySelector('small')
    msg.className = 'successSmall'
    msg.innerText = 'Usuário encontrado'
    input.className = 'success'
}

function userNotFound(input) {
    const msg = input.parentNode.querySelector('small')
    msg.className = 'errorSmall'
    msg.innerText = 'Usuário não encontrado'
    input.className = 'error'
}

const loginField = async () => {
    if(inputLogin.value.trim() === '') return showError(login, LOGIN_REQUIRED)
    const userFound = await searchUser(inputLogin)
    if(userFound) {
       userFoundSuccess(inputLogin)    
     }else {
        userNotFound(inputLogin)
     }
}