import {data} from "../../Info/yourself.js"


export function change(){
const saver=document.getElementById("namesave")
const box =document.getElementById("namebox")
console.log(data)
saver.addEventListener("click",()=>{
  let name=box.value;
  data.name=name
  console.log(data)
  localStorage.setItem("pl",JSON.stringify(data))
})


}