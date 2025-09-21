// 初始化全局变量
let searchKeyword = '', searchableAbbr = '';

let hShake;
let notificationCount = '';

const downloadMirrorUrl = 'https://ghfast.top/<T>';
const fIconUrl = 'https://www.faviconextractor.com/favicon/<T>?larger=true';
const ghRepoMirrorUrl = '';

const checkDate = (date = new Date()) => (date.getDate() == 1 && date.getMonth() + 1 == 4) ? true : false;
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
al.setLangPropPath('locales/%%.json');
al.setDefaultCountry({
    en: 'en-US',
    zh: 'zh-CN',
});
const languages = [
    // Crowdin
    'en-UD',
    'en-US',
    'it-IT',
    'lzh',
    'pt-BR',
    'zh-CN',
    'zh-HK',
    'zh-TW',
    'en-UD',
];
let goingapf = false;
al.current(languages, {url: true});
const i18n = ((callback = () => {}) => {
    if (isapf) {
        const apflang = al.getUserLang().startsWith('zh-') ? 'lzh' : 'en-UD';
        if (!goingapf) {
            al.current(languages, {url: true}, apflang, () => {
                goingapf = true;
                al.load(al.mode.HTML, callback, apflang);
            });
            if (apflang == 'en-UD') {
                $('head').append('<style id="upside-down">main, .update-layer, footer {transform: rotate(180deg);}</style>');
            }
            if (apflang == 'lzh') {
                $('mdui-tooltip').attr('placement', 'right');
                $.ajax({
                    url: 'assets/lib/literary.css',
                    dataType: 'text',
                    success: (css) => {
                        $('head').append(`<style id="literary">${css}</style>`);
                    }
                });
            }
            return;
        }
        al.load(al.mode.HTML, callback, apflang);
        return;
    }
    al.load(al.mode.HTML, callback);
});


// 公告栏
const announcementInit = (() => {
    $('.announcement-bar li').removeAttr('class').each((i, e) => $(e).addClass(`announcement-${i + 1}`));
});
const announcementSwitch = (() => {
    setInterval(function() {
        for (let i = 1;; ++i) {
            if ($(`.announcement-${i}`).length) {
                let z = i - 1;
                if (z < 1) z = $(`.announcement-bar li`).length + 1;
                $(`.announcement-${i}`).removeClass(`announcement-${i}`).addClass(`announcement-${z}`);
            } else break;
        }
    }, 5000);
});


// 不记录历史滚动位置
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}


// 读取 jsonc 文件
const read = ((file, isPath = false) => {
    return JSONC.parse($.ajax({
        url: isPath ? file : `data/${file}.jsonc`,
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
            if (selector == 'pre') {
                selector = $(selector).parent();
            }
            $(selector).find('.to-fold, .to-unfold').hide();
            $(selector).find(open ? '.to-fold' : '.to-unfold').show();
        } else {
            $(selector).attr('open', open);
        }
    }
    let hash = decodeURI(location.hash).replace('/', '\\/').replace(/ \(.*/, '');
    const slicedHash = hash.slice(0, -3);
    // 自动展开/收起：<details> 元素
    try {
        // 通过检测哈希属性
        if (hash == '#全部展开') toggleDetails('pre, footer', true);
        if (hash == '#全部收起') toggleDetails('pre, footer', false);
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
const cfg = read("scripts/config/apf.cfg.jsonc", true);
let isapf = checkDate() || cfg.testMode;
import("./module/apf.js").then(apf => (globalThis.apf = apf, apf.main()));

// 版本
const getVersion = ((content, type) => {
    const s = '| ' + type + ' = ';
    if (content.indexOf(s) == -1) return '';
    return content.split(s)[1].split('\n')[0].replace(/^ *= */, '');
});
$.ajax({
    url: 'https://zh.minecraft.wiki/index.php?title=Template:Version&action=raw', // Chinese Minecraft Wiki, CC BY-NC-SA 3.0
    async: true,
    success: (r => {
        const result = r.split('-->')[1].split('}}\n}}')[0].trim();
        const version = {
            java: getVersion(result, 'java'),
            javaSnap: getVersion(result, 'java-snap'),
            bedrock: getVersion(result, 'bedrock'),
            bedrockBeta: getVersion(result, 'bedrock-beta')
        };
        let w = 'minecraft.wiki';
        let l = al.getUserLang().split('-')[0];
        const wiki = {
            cs: {},
            de: {java: '$', javaSnap: '$', bedrock: 'Bedrock_Edition_$', bedrockBeta: 'Bedrock_Edition_beta_$'},
            en: {java: 'Java_Edition_$', javaSnap: 'Java_Edition_$', bedrock: 'Bedrock_Edition_$', bedrockBeta: 'Bedrock_Edition_beta_$'},
            el: {},
            es: {java: 'Java_Edition_$', javaSnap: 'Java_Edition_$', bedrock: 'Bedrock_Edition_$', bedrockBeta: 'Bedrock_Edition_beta_$'},
            fr: {java: 'Édition_Java_$', javaSnap: 'Édition_Java_$', bedrock: 'Édition_Bedrock_$', bedrockBeta: 'Édition_Bedrock_bêta_$'},
            hu: {},
            id: {},
            it: {java: 'Java_Edition_$', javaSnap: 'Java_Edition_$', bedrock: 'Bedrock_Edition_$', bedrockBeta: 'Bedrock_Edition_beta_$'},
            ja: {java: 'Java_Edition_$', javaSnap: 'Java_Edition_$', bedrock: 'Bedrock_Edition_$', bedrockBeta: 'Bedrock_Edition_beta_$'},
            ko: {java: 'Java_Edition_$', javaSnap: 'Java_Edition_$', bedrock: 'Bedrock_Edition_$', bedrockBeta: 'Bedrock_Edition_베타_$'},
            lzh: {},
            nl: {java: '$', javaSnap: '$', bedrock: 'Bedrockeditie_$', bedrockBeta: 'Bedrockeditie_$'},
            pl: {},
            pt: {java: 'Edição_Java_$', javaSnap: 'Edição_Java_$', bedrock: 'Edição_Bedrock_$', bedrockBeta: 'Edição_Bedrock_beta_$'},
            ru: {java: '$_(Java_Edition)', javaSnap: '$_(Java_Edition)', bedrock: '$_(Bedrock_Edition)', bedrockBeta: 'Beta_$_(Bedrock_Edition)'},
            th: {java: 'รุ่น_Java_$', javaSnap: 'รุ่น_Java_$', bedrock: 'รุ่น_Bedrock_$', bedrockBeta: 'รุ่น_Bedrock_beta_$'},
            tr: {},
            uk: {java: '$_(Java_Edition)', javaSnap: '$_(Java_Edition)', bedrock: '$_(Bedrock_Edition)', bedrockBeta: 'Beta_$_(Bedrock_Edition)'},
            zh: {java: 'Java版$', javaSnap: '$', bedrock: '基岩版$', bedrockBeta: '基岩版$'}
        };
        if (Object.keys(wiki).indexOf(l) != -1 && l != 'en') w = l + '.minecraft.wiki';
        else l = 'en';
        const link = ((v) => {
            if (!wiki[l] || !wiki[l][v]) return '';
            return `<a href="https://${w}/w/` + wiki[l][v].replace('$', version[v]) + `" target="_blank">${version[v]}</a>`;
        });
        if (version.javaSnap) {
            version.javaSnap = '&nbsp;&nbsp;<text al="news.development"></text>' + link("javaSnap");
        }
        if (version.bedrockBeta) {
            version.bedrockBeta = '&nbsp;&nbsp;<text al="news.beta"></text>' + link("bedrockBeta");
        }
        version.java = '<text al="news.release"></text>' + link("java") + version.javaSnap;
        version.bedrock = '<text al="news.release"></text>' + link("bedrock") + version.bedrockBeta;
        const news = `<li><text al="news.java"></text>${version.java}</li><li><text al="news.bedrock"></text>${version.bedrock}</li>`;
        $('.announcement-bar li:nth-child(2)').after(news);
        i18n(announcementInit);
    }),
    error: () => {
        i18n(announcementInit);
    }
});
