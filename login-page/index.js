/* Global Consts */

const modalLogin = document.getElementById('modalLogin')
const modalRegistration = document.getElementById('modalRegistration')
const modalInfo = document.getElementById('modalInfo')

const loginInput = document.getElementById('nameLogin')
const passwordInput = document.getElementById('passwordLogin')

const modalError = document.getElementById('modalError')

const formReg = document.getElementById('formReg')
const formLogin = document.getElementById('formLogin')

const modalErrorTxt = document.getElementById('modalErrorTxt')

/* ------------------------------- */

/* Functions Modals */

const openModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'block'
}

const closeModal = (idModal) => {
    const modal = document.getElementById(idModal)
    modal.style.display = 'none'
}

/* Creating a new User */

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
        modalError.style.display = 'block'
        modalErrorTxt.innerHTML = "Erro:" + error
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

formReg.addEventListener("submit", (event) => {
    event.preventDefault()

    let name = formReg.elements['name'].value
    let city = formReg.elements['city'].value
    let login = formReg.elements['login'].value
    let email = formReg.elements['email'].value
    let password = formReg.elements['password'].value
    
    let user = new User(name, city, login, email, password)
    newUser(user)
})

/* Making Login Possible */

const getUsers = async () => {//put this function in the main.html
    const users = await fetch(`http://localhost:3000/users`)
    const usersResponse = await users.json()
    return usersResponse
}

const loginUser = async (login, password) => {
    const users = await getUsers()
    const findUserLogin = await users.find(element => {
        return login.value == element.login
    })  
    const findUserPass = await users.find(element => {
        return password.value == element.password
    })
    if (findUserLogin && findUserPass){
        window.location.href = '../tasks-page/main.html'
    } else{
        modalError.style.display = 'block'
    }
}

formLogin.addEventListener('submit', (event) => {
    event.preventDefault()
    let login = formLogin.elements['nameLogin']
    let password = formLogin.elements['passwordLogin']
    loginUser(login, password)
})

/* Fields Verification */

const NAME_REQUIRED = 'Por favor, insira o seu nome'
const CITY_REQUIRED = 'Por favor, insira o sua cidade'
const LOGIN_REQUIRED = 'Por favor, insira um login'
const EMAIL_REQUIRED = 'Por favor, insira um email'
const PASS_REQUIRED = 'Por favor insira sua senha'

//requisitions that i will need in the main.html

const deleteUser = async (id) => {//also put this function in the modal help 'delete my account'
    await fetch(`http://localhost:3000/users/${id}`, {//how could i know which user is logged? Maybe sessionStorage?
    method: 'DELETE'
})
}

//Can I send to the json tasks an array --- post inside the index 0 all the tasks from user number one?

//keep working on this

const signIn = () => {
    const loginInput = document.getElementById('nameLogin').value
    sessionStorage.setItem("loginInput", loginInput)
}

const checkUser = () => {
    if(sessionStorage.getItem("loginInput")){
        window.location.href = '../tasks-page/main.html'
    }
    
}

loginInput.addEventListener('change', (event) => {
    sessionStorage.setItem("autosave", loginInput.value)
})