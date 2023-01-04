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

const setSeason = async (login, password) => {
    //let checkbox = document.getElementById('signIn').checked

    const users = await getUsers()
    let userLogged = users.filter((user) => {
        if(login === user.login && password === user.password) return user
    })
    console.log(JSON.stringify(userLogged))
    /* if(checkbox){
        localStorage.setItem("userLogged", JSON.stringify(userLogged))
    } */
}

formLogin.addEventListener('submit', (event) => {
    event.preventDefault()
    let login = formLogin.elements['nameLogin']
    let password = formLogin.elements['passwordLogin']
    loginUser(login, password)
    setSeason(login, password)
})

/* Fields Verification */

const NAME_REQUIRED = 'Por favor, insira o seu nome'
const CITY_REQUIRED = 'Por favor, insira o sua cidade'
const LOGIN_REQUIRED = 'Por favor, insira um login'
const EMAIL_REQUIRED = 'Por favor, insira um email'
const PASS_REQUIRED = 'Por favor insira sua senha'

const deleteUser = async (id) => {
    await fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE'
})
}