const addClass = (target = new Element()) => {
    target.classList.add('apf');
}
const style = '<style id="neverapf">.apf:hover {transform: none;} main, footer {transform: none;} body {writing-mode: horizontal-tb;;}</style>',
giveUpBtn = '<a id="gub" class="button download" herf="#" onclick="apf.giveUp();" style="position: fixed; bottom: 0; right: 0;">你干嘛~</a>'
const main = (eles = document.querySelectorAll(".page-content *")) => {
    if (isapf) {
        eles.forEach(ele => addClass(ele));
        $("body").append('<mdui-snackbar placement="bottom" class="aiyoo" closeable>哎哟~~</mdui-snackbar>')
        document.body.appendChild(document.createRange().createContextualFragment(giveUpBtn));
    }
}
const giveUp = () => {
    $('.aiyoo').attr('open', true);
    $('#gub').remove();
    document.querySelector('html').appendChild(document.createRange().createContextualFragment(style));
    checkDate = () => false;
    isapf = false;
    setTimeout(i18n);
}

export {main, giveUp}
