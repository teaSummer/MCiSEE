const cfg = read("scripts/cfg/apf.cfg.json5", true);

const addClass = (target = new Element()) => {
	target.classList.add("apf");
}
const checkDate = (date = new Date()) => (date.getDate() === 1 && date.getMonth() + 1 === 4)? true: false;
const style = "<style>.apf:hover {transform: none;}</style>",
	  giveUpBtn = "<a id=\"gub\" class=\"button download\" herf=\"#\" onclick=\"apf.giveUp();\" style=\"position: fixed; bottom: 0; right: 0;\">你干嘛~</a>"
const main = (eles = document.querySelectorAll(".page-content *")) => {
	if(checkDate() || cfg.testMode) eles.forEach(ele => addClass(ele)),
	document.body.appendChild(document.createRange().createContextualFragment(giveUpBtn));
}
const giveUp = () => {
	let text = document.querySelector("[al=\"startDownloading\"]").innerText;
	document.querySelector("[al=\"startDownloading\"]").innerText = "哎哟~~";
	document.querySelector("html").appendChild(document.createRange().createContextualFragment(style));
	document.body.removeChild(document.querySelector("#gub"));
	setTimeout(() => {document.querySelector("[al=\"startDownloading\"]").innerText = text}, 5500);
}

export {main, giveUp}
