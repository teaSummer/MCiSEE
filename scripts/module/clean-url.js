/**
 * MCiSEE Clean URL Module
 */
(function() {
    'use strict';
    $('.clean-url').click(function() {
        localStorage.setItem('clean-url', this.checked);
        if (this.checked) cleanUrlFunc(true);
    });

    const cleanUrlFunc = (always) => {
        if (localStorage.getItem('clean-url') == 'true' || always == true) {
            history.replaceState(null, null, location.href.split('#')[0].replace('index.html', ''));
        }
    }
    window.addEventListener('hashchange', cleanUrlFunc);
    cleanUrlFunc();
})();