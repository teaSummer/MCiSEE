const giveUpBtn = '<a id="give-up" class="button noicon">你干嘛~</a>'
const main = (e = $('.page-content *')) => {
    if (isapf) {
        $(e).addClass('apf');
        $('body').append('<mdui-snackbar placement="bottom" class="aiyoo" closeable>哎哟~~</mdui-snackbar>' + giveUpBtn);
        $('#give-up').click(giveUp);
    }
}
const giveUp = () => {
    $('.page-content *').removeClass('apf');
    $('.aiyoo').attr('open', true);
    $('#give-up, #upside-down, #literary').remove();
    $('mdui-tooltip').attr('placement', 'top');
    isapf = false;
    i18n();
}

export {main, giveUp}
