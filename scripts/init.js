// 初始化全局变量
let searchKeyword = '', searchableAbbr = '';

let hShake;
let notificationCount = '';
let checkDate = (date = new Date()) => (date.getDate() == 1 && date.getMonth() + 1 == 4) ? true : false;

const downloadMirrorUrl = 'https://ghfast.top/<T>';
const fIconUrl = 'https://www.faviconextractor.com/favicon/<T>?larger=true';
const ghRepoMirrorUrl = '';

const fIconGet = ((url, p) => '<img src="' + (p ? p : fIconUrl.replace('<T>', url.replace(/https?:\/\//, '').replace(/\/.*/, ''))) + '" width="16" height="16" loading="lazy"/> ')
const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';
const downloadMirror = ((url) => $('.github-proxy').is(':checked') && String(url).startsWith('https://github.com/') ? downloadMirrorUrl.replace('<T>', url) : url); // 针对中国大陆地区 | for Chinese Mainland
const downloadClick = (() => $('.download').click(function() {
    const filename = decodeURI(this.href.split('/').slice(-1)[0]);
    $('.start-download a').remove();
    $('.start-download br').after(`<a href="${this.href}">${filename}</a>`);
    $('.start-download').attr('open', true);
}));
const faviconGH = fIconGet('github.com');

// 国际化 (internationalization)
al.setLangPropPath('locales');
al.setDefaultCountry({
    en: 'en-US',
    zh: 'zh-CN',
});
const i18n = ((callback = () => {}) => {
    al.setLangProp([
        'zh-TW.yml',
        'zh-HK.yml',
        'zh-CN.yml',
        'lzh.yml',
        'en-US.yml',
        'en-UD.yml',
    ], () => {
        if ((checkDate() || cfg.testMode)) {
            al.load(navigator.language.startsWith('zh') ? 'lzh' : 'en-UD', al.mode.HTML, callback);
            return;
        }
        al.load(void 0, al.mode.HTML, callback);
    }, {url: true, yaml: true});
});


// 不记录历史滚动位置
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}


// 读取 JSON5 文件
const read = ((file, isPath = false) => {
    return JSON5.parse($.ajax({
        url: isPath? file: `data/${file}.json5`,
        dataType: 'json',
        async: false
    }).responseText);
});


// URL哈希属性监听
const hashChanged = (() => {
    if (location.hash == '') return;
    function toggleDetails(selector, open) {
        if ($(selector).find('details').length) {
            $(selector).find('details').attr('open', open);
            $('.to-fold, .to-unfold').hide();
            $(open ? '.to-fold' : '.to-unfold').show();
        } else {
            $(selector).attr('open', open);
        }
    }
    let hash = decodeURI(location.hash).replace('/', '\\/').replace(/ \(.*/, '');
    const slicedHash = hash.slice(0, -3);
    // 自动展开/收起：<details> 元素
    try {
        // 通过检测哈希属性
        if (hash == '#全部展开') toggleDetails('pre', true);
        if (hash == '#全部收起') toggleDetails('pre', false);
        if (hash.endsWith('-展开')) {
            toggleDetails(slicedHash, true);
            location.hash = slicedHash;
        }
        if (hash.endsWith('-收起')) {
            toggleDetails(slicedHash, false);
        }
        // 通过检测 <summary> 元素
        if ($(hash).html().startsWith('<summary>')) $(hash).attr('open', true);
        else $(`${hash}>*:first-child`).addClass('hash');
    } catch {}
});
$(window).on('hashchange', () => {
    $('.hash').removeClass('hash');
    hashChanged();
});


// 启动器数据
const launcherData = read('launcher');
// 各平台启动器数据
const AndroidLauncher = launcherData['AndroidLauncher'];
const iOSLauncher = launcherData['iOSLauncher'];
const WindowsLauncher = launcherData['WindowsLauncher'];
const macOSLauncher = launcherData['macOSLauncher'];
const LinuxLauncher = launcherData['LinuxLauncher'];

// 各类与搜索有关的站点数据
const searchable = read('searchable');

// 各类网站数据
const utilityWebsite = read('utilityWebsite');
const forum = read('forum');

// 愚人节彩蛋
const cfg = read("scripts/cfg/apf.cfg.json5", true);
import("./apf.js").then(apf => (globalThis.apf = apf, apf.main()));
