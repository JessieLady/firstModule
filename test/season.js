const toggle = document.getElementById("toggle");
const refresh = document.getElementById("refresh");
const theme = window.localStorage.getItem("theme");

/* verifica se o tema armazenado no localStorage é escuro
se sim aplica o tema escuro ao body */
if (theme === "dark") document.body.classList.add("dark");

// event listener para quando o botão de alterar o tema for clicado
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (theme === "dark") {
    window.localStorage.setItem("theme", "light");
  } else window.localStorage.setItem("theme", "dark");
});

refresh.addEventListener("click", () => {
  window.location.reload();
});

const numberSugestion = async () => {
  const numberSugestion = document.getElementById('numberSugestion')
  const tasks = []
  let numbers = []
  
  const numTasks = tasks.map((obj) => obj.number)

  for(let counter = 1; counter < numTasks.length; counter++){
    if(!numTasks.includes(counter)) numbers.push(counter)
  }
  numberSugestion.innerHTML = numbers[0]

//note to the future Me: The problem of this function is that 
//it's limited by the array.length, but for my needs 
//right now it will fit =/

}
