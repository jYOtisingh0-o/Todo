import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const inputFld = document.querySelector("#input-field");
const saveBtn = document.getElementById("add-button");
const todoUl = document.querySelector("#todo-list");
const appSettings = {
    databaseURL: "https://todo-a2e6c-default-rtdb.asia-southeast1.firebasedatabase.app/"
}
const app = initializeApp(appSettings);
const database = getDatabase(app) 
const todoListInDB = ref(database, "to-do")

saveBtn.addEventListener("click", function(){
    let inputValue = inputFld.value;
    if(inputValue != ""){
        push(todoListInDB, inputValue)
    } 
    inputFld.value = ""
})

onValue(todoListInDB, function(snapshot){
    if(snapshot.exists()){
        let tasksArray = Object.entries(snapshot.val())
        clearTaskList()
        for(let i = 0; i <tasksArray.length ; i++){
        let currentTask = tasksArray[i]
        let currentTaskID = currentTask[0]
        let currentTaskValue = currentTask[1]
        renderTasks(currentTask)
        }
    } else{
        todoUl.innerHTML = `<li>No item exists</li>`
    }
})

function renderTasks(item){
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li");
    newEl.textContent = itemValue
    todoUl.append(newEl)
    newEl.addEventListener("dblclick", function(){
        let exactLocationOfTaskInDB = ref(database, `to-do/${itemID}`)
        remove(exactLocationOfTaskInDB)
    })
}

function clearTaskList(){
    todoUl.innerHTML = ""
}