let searchKeyword = '', searchableAbbr = '';

let notificationCount = '';
let visibility = true;

const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';
const downloadMirror = ((url) => `https://ghproxy.cn/${url}`); // 针对大陆地区 | for Chinese Mainland

// 列出所有已支持的设备
const supportedDevices = [
    // |   最早名称   |       显示名称       |
    [      'Android',  'Android/HarmonyOS' ],
    [          'iOS',  'iOS/iPad'          ],
    [      'Windows',  'Windows'           ],
    [        'macOS',  'macOS'             ],
    [        'Linux',  'Linux'             ],
];
DOMDeviceList.show();


// 不记录历史滚动位置
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
};


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



// 创建超文本标签（并点击）
const createSuperLabel = ((url, id) => {
    const a = `<a href="" target="_blank" id="${id}">`;
    $('body').after(a);
    const aElement = $('#' + id);
    aElement.attr('href', url);
    aElement[0].click();
    aElement.remove();
});

// 更新提示 创建
let updateLayerNumber = 0;
const createUpdateLayer = ((abbr, lastVersion, latestVersion, download, device, deviceInfo, flag) => {
    ++updateLayerNumber;
    const stableOrDev = ((flag == 'release') ? 'stable' : 'dev');
    const dom = `
      <div class="update-layer update-layer-${updateLayerNumber}">
        <div al="downloadedLauncherUpdate"></div>
        <div>
          <text class="abbr">${abbr}</text>
          <text al="updatedTo"></text>
          <text al="${flag}"></text>
          <text class="latest-version">${latestVersion}</text><text al="exclamationMark"></text>
        </div><div>
          <text class="last-version">${lastVersion}</text>
          <text al="updateArrow"></text>
          <text class="latest-version">${latestVersion}</text>
        </div>
        <div>(${deviceInfo})</div>
        <a class="download" href="${download}" target="_blank" al="download" ondragstart="event.dataTransfer.effectAllowed = 'none';"></a>
      </div>`;
    $('sidebar').before(dom);
    $(`.update-layer-${updateLayerNumber} .download`).click(() => {
        const set = ((version, stableOrDev) => {
            localStorage.setItem(`last-${device}-${abbr}-${stableOrDev}-download`, version);
        });
        set(latestVersion, stableOrDev);
    });
    if (updateLayerNumber) notificationCount = `(${updateLayerNumber})`;
});

// 更新提示 删除
const deleteUpdateLayer = function() {
    --updateLayerNumber;
    notificationCount = '';
    if (updateLayerNumber) notificationCount = `(${updateLayerNumber})`;
    i18n();

    const number = Number($(this).attr('class').split('update-layer-')[1]);
    $(`.update-layer-${number}`).remove();
    for (let i = number + 1; i < 1000; ++i) {
        if ($(`.update-layer-${i}`).length) {
            $(`.update-layer-${i}`).removeClass(`update-layer-${i}`).addClass(`update-layer-${i - 1}`);
        } else break;
    };
};


// 获取下拉菜单选中项
const checkedOption = ((selectElement) => {
    const selectInclude = (str) => ( $(selectElement).html().indexOf(str) != -1 );
    if (selectElement.value) {
        if (selectInclude('Wiki') || selectInclude('Launcher')) {
            return $(selectElement).find(`mdui-menu-item[data-abbr="${selectElement.value}"]`);
        };
    };
    return $( $(selectElement)[0][$(selectElement)[0].selectedIndex] );
});


const deviceChanged = (() => {
    $('div.launcher-list mdui-select').each((i, e) => {
        $(e).hide();
        try {
            const select = $('.' + $('.device-list').val());
            select.val('?');
            select.show();
        } catch {
            $('.app-container').hide();
        };
    });
    try { launcherChanged(); } catch {};
});


// 应用启动器
$('div.launcher-list').html(DOMLauncherList.deviceList());


// 监听启动器选择项
const launcherChanged = ((event = {target: $('mdui-select.launcher-list')}) => {
    const checked = checkedOption(event.target);
    const title = checked.attr('data-title');
    const abbr = checked.attr('data-abbr');
    const device = checked.attr('data-device');
    let version, devVersion;
    $('.launcher-title').text('');
    if (title && title != checked.val()) {
        $('.launcher-title').text(title);
    };
    for (const attribute of ['data-download', 'data-dev-download', 'data-url']) {
        const button = $(`.${attribute}-launcher`);
        let url = checked.attr(attribute);
        if (attribute.endsWith('download')) {
            if ($('.github-proxy').is(':checked') && String(url).startsWith('https://github.com/')) {
                url = downloadMirror(url);
            };
            const removeEmpty = ((version) => {
                if (version === void 0) {
                    button.removeAttr('href').removeAttr('title').removeAttr('data-backup-href');
                    button.html('')
                    button.parent().removeAttr('al');
                };
            });
            if (attribute == 'data-download') {
                version = checked.attr('data-version');
                window.linkVersion  = version;
                window.linkUrl      = url;
                window.linkDownload = checked.attr('data-backup-download');
                button.parent().attr('al', 'launcher.release.latest');
                if (version != 'latest') {
                    button.parent().attr('al', 'launcher.release');
                };
                removeEmpty(version);
            } else {
                devVersion = checked.attr('data-dev-version');
                window.linkDevVersion  = devVersion;
                window.linkDevUrl      = url;
                window.linkDevDownload = checked.attr('data-backup-dev-download');
                button.parent().attr('al', 'launcher.preRelease.latest');
                if (devVersion != 'latest') {
                    button.parent().attr('al', 'launcher.preRelease');
                };
                removeEmpty(devVersion);
            };
        };
        button.hide();
        if (url) {
            button.attr('href', url).show();
        };
    };
    i18n(() => {
        // 监听启动器下载
        $('.launcher-download .download').click(() => {
            const set = ((version, stableOrDev) => {
                localStorage.setItem(`last-${device}-${abbr}-${stableOrDev}-download`, version);
            });
            // 判断稳定版与开发版
            if (version && version != 'latest') set(version, 'stable');
            if (devVersion && devVersion != 'latest') set(devVersion, 'dev');
        });
    });
});


// 监听代理是否勾选
const proxyChanged = (() => {
    localStorage.setItem('github-proxy', $('.github-proxy').is(':checked'));
    try {
        if ($('.github-proxy').is(':checked')) {
            $('.launcher-download>a.button').each((i, e) => {
                const url = $(e).attr('href');
                if (url.startsWith('https://github.com/')) $(e).attr('href', downloadMirror(url));
            });
        } else {
            $('.launcher-download>a.button').each((i, e) => {
                $(e).attr('href', $(e).attr('data-backup-href'));
            });
        };
    } catch {};
});
$('.github-proxy').change(proxyChanged);


// 应用快速查询
$('.searchable-list').html(DOMSearchableList.list(searchable));

// 监听快速查询选择项
let countSearchable = 0;
const searchableChanged = ((event = {target: $('.searchable-list')}) => {
    // 处理“跳转”链接与输入框占位文本
    const checked = checkedOption(event.target);
    searchKeyword = checked.attr('data-search');
    const abbr = checked.attr('data-abbr');
    window.linkSearchFrom = searchableAbbr = abbr;
    const note = checked.attr('data-note');
    $('.searchable-label').html(`<a class="searchable-goto gravity-inline" href="${checked.attr('data-url')}" title="${note}" target="_blank"><p al="goto"></p> <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></svg></a>`);
    localStorage.setItem('searchable-checked', event.target.value);
    // 计数器
    ++countSearchable;
    if (countSearchable > 2) $('.searchable-list').click();
    // 显示 Modrinth 专用项
    $('.Modrinth').hide();
    if (abbr == 'Modrinth') $('.Modrinth').show();
    i18n();
});
$('.searchable-list').change(searchableChanged);


// 快速查询 表单提交处理
$('.searchable-form').submit((event) => {
    event.preventDefault();
    const input = $('.searchable-input').val().trim();
    const search = encodeURI(input);
    let url;
    if (searchableAbbr == 'Modrinth') {
        const ver = $('.Modrinth-versions').val();
        let versions = '';
        if (ver != 'all' && ver != '?') {
            versions = '&v=';
            for (const v of ver) versions += `${v}&v=`;
            versions = versions.slice(0, -3);
        };
        url = `https://modrinth.com/${$('.Modrinth-projectType').val()}s?q=${search}${versions}`;
        if ($('.Modrinth-projectType').val() == '') return;
    } else {
        url = searchKeyword.replace(encodeURI('<T>'), search);
        if ($('.searchable-direct').is(':checked') && url.indexOf('&fulltext=') != -1) {
            url = url.replace(/&[^&]*$/, '');
        };
    };
    if (input) createSuperLabel(url, 'searchable-search');
});

// 快速查询 拼写完成校验
let searchableComposition = true;
$('.searchable-input').on('compositionstart', () => {searchableComposition = false});
$('.searchable-input').on('compositionend'  , () => {searchableComposition = true });
// 快速查询 监听输入框内容
$('.searchable-input').on('input', () => {
    setTimeout(() => {
        $('.searchable-button, .searchable-clear').attr('disabled', true);
        if (!searchableComposition) return;
        $('.searchable-button, .searchable-clear').attr('disabled', false);
        if ($('.searchable-input').val().trim() == '') {
            $('.searchable-button').attr('disabled', true);
            $('.searchable-clear' ).attr('hidden'  , true);
        } else $('.searchable-clear').removeAttr('hidden');
    }, 0);
});

// 快速查询 清空搜索框
$('.searchable-clear').click(() => {
    $('.searchable-input').trigger('input').focus();
});

// 监听快速查询是否勾选
$('.searchable-direct').change(() => {
    localStorage.setItem('searchable-direct', $('.searchable-direct').is(':checked'));
});

// 监听快速查询侯选词数修改
$('.searchable-prompt-length').change(() => {
    localStorage.setItem('searchable-prompt-length', $('.searchable-prompt-length').val());
});


// 监听版本列表变化
$('.Modrinth-versions').change(function() {
    const val = $(this).val();
    if (val.length == 0) $(this).val(['all']);
    if (val.length >= 2 && val[val.length - 1] == 'all') $(this).val(val.slice(0, -1));
});

// 获取版本列表
$('.acquire-versions').click(function() {
    $(this).attr('loading', true).attr('disabled', true);
    const releaseVersions = [];
    $.ajax({
        url: 'https://piston-meta.mojang.com/mc/game/version_manifest.json',
        type: 'get',
        cache: true,
        dataType: 'json',
        success: ((result) => {
            for (const v of result.versions) if (v.type == 'release') releaseVersions.push(v.id);
            let dom = '';
            for (const rv of releaseVersions) {
                dom += `<mdui-menu-item class="version-item" value="${rv}"><div slot="custom" class="custom-item"><div>${rv}</div></div></mdui-menu-item>`;
            };
            dom += '<mdui-menu-item value="all" hidden><div slot="custom" class="custom-item"><div al="all"></div></div></mdui-menu-item>';
            $('.Modrinth-versions').html(dom);
            $('.Modrinth-versions').click();
            i18n(() => $('.acquire-versions').removeAttr('loading'));
        })
    }, 0);
});


// 配置初始化
const config = ((settings) => {
    for (const [option, defaultVal] of Object.entries(settings)) {
        if (localStorage.getItem(option) == null) localStorage.setItem(option, defaultVal);
        if (localStorage.getItem(option) == 'true' ) $('.' + option).attr('checked', true );
        else if (localStorage.getItem(option) == 'false') $('.' + option).attr('checked', false);
        else $('.' + option).val(localStorage.getItem(option));
    };
});
config({
    'theme': 'system',
    'github-proxy': (navigator.language == 'zh-CN' ? true : false),
    'searchable-direct': true,
    'searchable-prompt-length': 10
});


// 获取候选词
$('.searchable-input').typeahead(
    {
        hint: false,
        highlight: true,
        minLength: 1
    },
    {
        name: 'searchable-prompt',
        async: true,
        limit: 100,  // 当前实际限制为 30
        source: ((query, syncResults, asyncResults) => {
            setTimeout(() => {
                if (!searchableComposition) return;
                let abbr = searchableAbbr;
                let search = encodeURI($('.searchable-input').val().trim());
                let facets;
                if (abbr == 'Modrinth') {
                    let projectType = $('.Modrinth-projectType').val();
                    const ver = $('.Modrinth-versions').val();
                    let versions = '';
                    if (ver == '?') return;
                    if (ver != 'all') {
                        versions = ',["versions:';
                        for (const v of ver) versions += `${v}","versions:`;
                        versions = versions.slice(0, -12) + '"]';
                    };
                    switch (projectType) {
                        case 'mod':
                            facets = encodeURI(`[["categories:'forge'","categories:'fabric'","categories:'quilt'","categories:'liteloader'","categories:'modloader'","categories:'rift'","categories:'neoforge'"],["project_type:mod"]${versions}]`);
                            break;
                        case 'plugin':
                            facets = encodeURI(`[["categories:'bukkit'","categories:'spigot'","categories:'paper'","categories:'purpur'","categories:'sponge'","categories:'bungeecord'","categories:'waterfall'","categories:'velocity'","categories:'folia'"],["project_type:mod"]${versions}]`);
                            break;
                        case 'datapack':
                            facets = encodeURI(`[["categories:'datapack'"],["project_type:mod"]${versions}]`);
                            break;
                        default:
                            facets = encodeURI(`[["project_type:${projectType}"]${versions}]`);
                    };
                };
                // API
                const api = {
                    Wiki: `https://zh.minecraft.wiki/api.php?action=opensearch&search=${search}&limit=30`,
                    BWiki: `https://wiki.biligame.com/mc/api.php?action=opensearch&search=${search}&limit=30`,
                    Modrinth: `https://api.modrinth.com/v2/search?limit=30&index=relevance&query=${search}&facets=${facets}`,
                    BEDW: `https://wiki.mcbe-dev.net/w/api.php?action=opensearch&search=${search}&namespace=0%7C3000%7C3002%7C3004%7C3008%7C3010&limit=30`,
                    MinePlugin: `https://mineplugin.org/api.php?action=opensearch&search=${search}&limit=30`
                };
                const url = api[abbr];
                if (url) {
                    // 获取候选词
                    $('.searchable-clear').attr('loading', true);  // 在获取候选词时显示加载动画（进行中）
                    return $.ajax({
                        url: url,
                        type: 'get',
                        cache: true,
                        dataType: (() => {
                            if (abbr == 'Modrinth') return 'json';
                            else return 'jsonp';
                        })(),
                        success: ((result) => {
                            if (result.length > 1 && Array.isArray(result[1])) {
                                result = result[1];
                            };
                            if (abbr == 'Modrinth') {
                                let arr = [];
                                result.hits.map((item) => arr.push(item.title));
                                result = arr;
                            };
                            result = result.slice(0, $('.searchable-prompt-length').val());
                            $('.searchable-clear').removeAttr('loading');  // 在获取候选词时显示加载动画（已完成）
                            return asyncResults(result);
                        }),
                        error: (() => {
                            $('.searchable-clear').removeAttr('loading');  // 在获取候选词时显示加载动画（已完成）
                        })
                    }, 0);
                }
            });
        })
    }
);


// 网站板块生成
const pre_list = ((e) => {
    const lineBlocks = [];
    let blocks = JSON.parse($(e).html());
    let dom = '';
    const importantPattern = /((半价|免费|公益|折扣|限时|特惠|热门|新品|热销|推荐|礼品|[一二两三四五六七八九]折|打折|促销|超值|全新|便宜|披风)|\b(free|off|new|hot|recommend|top|discount|limit|cheap|present|gift|cape)\b)/gi;
    for (const block of blocks) {
        // 获取分类并处理
        const category = Object.keys(block)[0];
        if (category.endsWith('[open]')) {
            dom += `<details class="keep" id="${category.replace('[open]', '').replace(/ .+/, '')}" open><summary>${category.replace('[open]', '')}</summary>`;
        }
        else dom += `<details id="${category.replace(/ .+/, '')}"><summary>${category}</summary>`;
        // 生成元素
        for (const [title, url] of block[category]) {
            // 判断是否不为外部链接
            if (url.startsWith('#')) {
                dom += `<a class="button noicon" href="${url}" onclick="hashChanged();">${title}</a>`;
            } else {
                if (importantPattern.test(title)) {
                    dom += `<a class="button important" href="${url}" target="_blank">${title.replace(importantPattern, '<text class="bold">$1</text>')}</a>`;
                } else dom += `<a class="button" href="${url}" target="_blank">${title}</a>`;
            };
        };
        dom += '</details><hr>';
    };
    dom = dom.replace(/<hr>$/, '');
    $(e).html(dom);
});


// URL哈希属性监听
const hashChanged = (() => {
    if (location.hash == '') return;
    let hash = decodeURI(location.hash).replace('/', '\\/');
    const slicedHash = hash.slice(0, -3);
    // 自动展开/收起：<details> 元素
    try {
        // 通过检测哈希属性
        if (hash == '#全部展开') $('.page-content').find('details:not(.keep)').attr('open', true);
        if (hash == '#全部收起') $('.page-content').find('details:not(.keep)').attr('open', false);
        if (hash.endsWith('-展开')) {
            $(slicedHash).find('details').attr('open', true);
            $(slicedHash).find('.to-fold').show();
            $(slicedHash).find('.to-unfold').hide();
            location.hash = slicedHash;
        };
        if (hash.endsWith('-收起')) {
            $(slicedHash).find('details:not(.keep)').attr('open', false);
            $(slicedHash).find('.to-unfold').show();
            $(slicedHash).find('.to-fold').hide();
            hash = slicedHash;
        };
        // 通过检测 <summary> 元素
        if ($(hash).html().startsWith('<summary>')) $(hash).attr('open', true);
        else $(`${hash}>*:first-child`).addClass('hash');
    } catch {};
});
$(window).on('hashchange', () => {
    $('.hash').removeClass('hash');
    hashChanged();
});



// 获取正常状态的简体中文论坛
const CSForum = [{"简体中文论坛": []}];
for (const forum of db_forums) {
    if (forum.state == 'up') {
        CSForum[0]['简体中文论坛'].push([forum.title, forum.url]);
    };
};



// 页面加载完成事件
$(document).ready(() => {
    // 网站列表
    $('.utility-website-list').text(JSON.stringify(utilityWebsite));
    $('.forum-list').text(JSON.stringify([].concat.apply(CSForum, otherForum)));
    // 缓存处理
    const searchableChecked = localStorage.getItem('searchable-checked');
    if (searchableChecked == 'undefined' || searchableChecked == void 0) $('.searchable-list').val('Wiki');
    else $('.searchable-list').val(searchableChecked);
    // 设备
    deviceChanged();
    supportedDevices.forEach((deviceInfo) => {
        if (deviceInfo[0] == $('.device-list').val()) $('.device-list').val((deviceInfo[1]));
    });
    $('.device-list').each((i, e) => {
        $(e).children().click(function() {
            const value = $(this).attr('label');
            $('.device-list').val(value);
            deviceChanged();
            $('.device-list').val($(this).find('div div:first-child').text());
            $(e).click();
        });
    });
    // 启动器 初始化
    $('mdui-select.launcher-list').each((i, e) => {
        $(e).val('');
        $(e).children().click(function() {
            const value = $(this).attr('label');
            $('mdui-select.launcher-list').val(value);
            launcherChanged({target: e});
            $('mdui-select.launcher-list').val($(this).find('div div:first-child').text());
            $(e).click();
        });
    });
    let checkedUpdates = false;
    // 快速查询
    searchableChanged();
    $('.pre-flex').each((i, e) => pre_list(e));
    $('.searchable-args .arg:not([multiple])').each((i, e) => {
        $(e).children().click(() => $(e).click());
    });
    // 国际化 (internationalization) 准备进行
    i18n(() => {
        // 启动器 初始化
        $('mdui-select.launcher-list').each((i, e) => $(e).val('?'));
        // 启动器 检查更新
        if (!checkedUpdates) {
            checkedUpdates = true;
            for (const [device, deviceInfo] of supportedDevices) {
                for (const launcher of eval(device + 'Launcher')) {
                    const abbr = (launcher.abbr ? launcher.abbr : launcher.title);
                    if (launcher.hasOwnProperty('version')) {
                        const lastStableVersion   = localStorage.getItem(`last-${device}-${abbr}-stable-download`);
                        const latestStableVersion = launcher.version;
                        if (lastStableVersion && lastStableVersion != latestStableVersion) {
                            createUpdateLayer(abbr, lastStableVersion, latestStableVersion, launcher.download, device, deviceInfo, 'release');
                        };
                    };
                    if (launcher.hasOwnProperty('dev')) {
                        const lastDevVersion   = localStorage.getItem(`last-${device}-${abbr}-dev-download`);
                        const latestDevVersion = launcher.dev.version;
                        if (lastDevVersion && lastDevVersion != latestDevVersion) {
                            createUpdateLayer(abbr, lastDevVersion, latestDevVersion, launcher.dev.download, device, deviceInfo, 'preRelease');
                        };
                    };
                };
            };
            $('.update-layer').click(deleteUpdateLayer);
        };
        // 默认值初始化
        $('.Modrinth-projectType').val('mod');
        $('.Modrinth-versions').val(['all']);
        // 最后处理
        hashChanged();
        $('.wait').removeAttr('class').removeAttr('style');
        try { document.querySelector(decodeURI(location.hash)).scrollIntoView(); } catch {};
    });

    // 点击特效：此处包含外链地址，内容由XiaozhiSans提供。如果您需要使用，应先询问其意见。
    $('#clickEffect').change(() => {
        if ($('#clickEffect')[0].checked) {
            let script = document.createElement('script');
            script.id  = 'ces';
            script.type= 'text/javascript';
            script.src = 'https://log.xsawa.dev.tc/js/candy.min.js';
            $('head')[0].appendChild(script);
        } else $('#ces')[0].remove();
    });
});
// 监听标签页切换事件
$(document).on('visibilitychange', () => {
    if (document.visibilityState == 'hidden') {
        // 当前标签页隐藏时
        visibility = false;
    };
    if (document.visibilityState == 'visible') {
        // 当前标签页显示时
        visibility = true;
    };
});

// 调试模式 (Debug Mode)
let debug = false;
const debugChange = (e = $('[visibleInDebugMode]')) => {for (const t of e) t.style.display = (debug ? 'block': 'none')};
debugChange(); /* 监听变更我就先咕咕咕了 ＜（＾－＾）＞ --xs */
