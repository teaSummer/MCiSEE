// 初始化全局变量
let searchKeyword = '', searchableAbbr = '';

let notificationCount = '';
let visibility = true;

const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';
const downloadMirror = ((url) => `https://ghproxy.cn/${url}`); // 针对大陆地区 | for Chinese Mainland


// 国际化 (internationalization)
al.setLangPropPath('locales');
al.setDefaultCountry({
    en: 'en',
    zh: 'zh-CN'
});
const i18n = ((callback = () => {}) => {
    al.setLangProp(['zh-CN.yml','en.yml'], () => {
        al.load(void 0, al.mode.HTML, callback);
    }, {url: true, yaml: true});
});


// 读取 JSON5 文件
const read = ((file) => {
    return JSON5.parse($.ajax({
        url: `data/${file}.json5`,
        dataType: 'json',
        async: false
    }).responseText);
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
const otherForum = read('otherForum');


// 不记录历史滚动位置
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
};


// 调试模式 (Debug Mode)
let debug = false;
const debugChange = (e = $('[visibleInDebugMode]')) => {for (const t of e) t.style.display = (debug ? 'block': 'none')};
debugChange(); /* 监听变更我就先咕咕咕了 ＜（＾－＾）＞ --xs */
