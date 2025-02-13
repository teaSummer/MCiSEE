const addClass = (target = new Element()) => {
	target.classList.add("apf");
}
const style = "<style>.apf:hover {transform: none;} body {transform: none;}</style>",
	  giveUpBtn = "<style>main, footer {transform: rotate(180deg);}</style><a id=\"gub\" class=\"button download\" herf=\"#\" onclick=\"apf.giveUp();\" style=\"position: fixed; bottom: 0; right: 0;\">你干嘛~</a>"
const main = (eles = document.querySelectorAll(".page-content *")) => {
	if(checkDate() || cfg.testMode) eles.forEach(ele => addClass(ele)),
	document.body.appendChild(document.createRange().createContextualFragment(giveUpBtn));
}
const giveUp = () => {
	document.querySelector("[al=\"startDownloading\"]").innerText = "哎哟~~";
	document.querySelector("html").appendChild(document.createRange().createContextualFragment(style));
	document.body.removeChild(document.querySelector("#gub"));
    checkDate = () => false;
	setTimeout(i18n, 5500);
}

export {main, giveUp}
