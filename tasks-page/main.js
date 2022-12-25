const modal = document.getElementById('modal')
const content = document.getElementById('content')
const form = document.getElementById('form')
const button = document.getElementById('submitButton')

let contraste = false
let currentTask = null
let currentUser = 7// carol Account

const NUM_EMPTY = 'Insira um número.'
const DESCRIPTION_EMPTY = 'Insira uma descrição.'
const DATE_EMPTY = 'Escolha uma data.'
const STATUS_EMPTY= 'Escolha um status.'

const numberField = document.getElementById('number')
const descriptionField = document.getElementById('description')
const dateField = document.getElementById('date')
const statusField = document.getElementById('status')

const modalNewTask = document.getElementById('modal-content')
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
