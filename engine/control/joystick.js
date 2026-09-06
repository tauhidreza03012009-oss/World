export function joyStick(){
const jc = document.createElement("div")
const jb = document.createElement("div")
jc.className="jc"
jb.className="jb"
jc.appendChild(jb)
document.body.appendChild(jc)

return [jb,jc]
}