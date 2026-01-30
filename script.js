/*
 * Project: Evently - Ultimate Calendar & Event Manager
 * Author: Shubham Narware
 * License: MIT License
 * GitHub: https://github.com/shubhamnarware67-cmd/Evently
 * Description: Interactive JS calendar with event CRUD, search, import/export, and theme toggle.
 */

const daysTag = document.querySelector(".days");
const currentDate = document.querySelector(".current-date");
const yearSelect = document.getElementById("yearSelect");
const todayBtn = document.getElementById("todayBtn");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const themeToggle = document.getElementById("themeToggle");
const eventInput = document.getElementById("eventInput");
const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");
const selectedDateText = document.getElementById("selectedDate");
const searchEvent = document.getElementById("searchEvent");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
const printBtn = document.getElementById("printBtn");

let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();
let selectedDate = null;

const months = ["January","February","March","April","May","June","July",
"August","September","October","November","December"];

let events = JSON.parse(localStorage.getItem("events")) || {};

for(let y=2000;y<=2035;y++){
  yearSelect.innerHTML += `<option ${y===currYear?"selected":""}>${y}</option>`;
}

function save(){
  localStorage.setItem("events",JSON.stringify(events));
}

function renderCalendar(){
  daysTag.innerHTML="";
  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  yearSelect.value = currYear;

  let firstDay = new Date(currYear,currMonth,1).getDay();
  let lastDate = new Date(currYear,currMonth+1,0).getDate();

  for(let i=0;i<firstDay;i++){
    daysTag.innerHTML += `<li class="inactive"></li>`;
  }

  for(let i=1;i<=lastDate;i++){
    let key = `${currYear}-${currMonth}-${i}`;
    let dot = events[key] ? `<div class="event-dot"></div>` : "";
    daysTag.innerHTML += `<li data-date="${key}">${i}${dot}</li>`;
  }
}
renderCalendar();

prev.onclick=()=>{currMonth--;fixMonth();}
next.onclick=()=>{currMonth++;fixMonth();}
todayBtn.onclick=()=>{
  date=new Date();
  currYear=date.getFullYear();
  currMonth=date.getMonth();
  renderCalendar();
};

function fixMonth(){
  if(currMonth<0){currMonth=11;currYear--;}
  if(currMonth>11){currMonth=0;currYear++;}
  renderCalendar();
}

daysTag.onclick=e=>{
  if(!e.target.dataset.date) return;
  selectedDate=e.target.dataset.date;
  selectedDateText.innerText=selectedDate;
  showEvents();
};

addEventBtn.onclick=()=>{
  if(!eventInput.value||!selectedDate) return;
  events[selectedDate]=events[selectedDate]||[];
  events[selectedDate].push(eventInput.value);
  eventInput.value="";
  save();
  renderCalendar();
  showEvents();
};

function showEvents(){
  eventList.innerHTML="";
  (events[selectedDate]||[])
    .filter(e=>e.toLowerCase().includes(searchEvent.value.toLowerCase()))
    .forEach((e,i)=>{
      eventList.innerHTML+=`
        <li>
          ${e}
          <span>
            <button onclick="editEvent(${i})">✏️</button>
            <button onclick="deleteEvent(${i})">❌</button>
          </span>
        </li>`;
    });
}

window.deleteEvent=i=>{
  events[selectedDate].splice(i,1);
  save();
  showEvents();
  renderCalendar();
};

window.editEvent=i=>{
  let updated=prompt("Edit event",events[selectedDate][i]);
  if(updated){
    events[selectedDate][i]=updated;
    save();
    showEvents();
  }
};

searchEvent.oninput=showEvents;

themeToggle.onclick=()=>{
  document.body.classList.toggle("light");
};

exportBtn.onclick=()=>{
  const blob=new Blob([JSON.stringify(events,null,2)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="calendar-events.json";
  a.click();
};

importBtn.onclick=()=>fileInput.click();
fileInput.onchange=e=>{
  const reader=new FileReader();
  reader.onload=()=>{events=JSON.parse(reader.result);save();renderCalendar();};
  reader.readAsText(e.target.files[0]);
};

printBtn.onclick=()=>window.print();
