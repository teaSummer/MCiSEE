import main from '../assets/main.css' with {type: 'css'};
import light from '../assets/light.css' with {type: 'css'};
import dark from '../assets/dark.css' with {type: 'css'};
let system = light;

const themeChanged = (() => {
    const value = $('.theme').val();
    if (!value) {
        $('.theme').find('mdui-segmented-button[value="system"]').click();
        $('.theme').val('system');
        return;
    };
    switch (value) {
        case 'light':
            document.adoptedStyleSheets = [main, light];
            break;
        case 'dark':
            document.adoptedStyleSheets = [main, dark];
            break;
        case 'system':
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) system = dark;
            document.adoptedStyleSheets = [main, system];
            break;
    };
});
$('.theme').change(themeChanged);
themeChanged();

// 监听变化
$(window.matchMedia('(prefers-color-scheme: dark)')).change((event) => {
    system = light;
    if (event.matches) system = dark;
    if ($('.theme').val() == 'system') themeChanged();
});
