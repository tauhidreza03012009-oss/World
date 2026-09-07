export function joyStick(){
const jc = document.getElementById("jc")??document.createElement("div")
const jb = document.getElementById("jb")??document.createElement("div")
const mine = document.getElementById("myCanvas")
jc.className="jc"
jc.id="jc"
jc.style.zIndex="100"
jb.className="jb"
jb.id="jb"
jc.appendChild(jb)
mine.appendChild(jc)

return [jb,jc]
}