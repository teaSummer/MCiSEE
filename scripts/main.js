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


// 创建超文本标签（并点击）
const createSuperLabel = ((url, id) => {
    const a = `<a href="${url}" target="_blank" id="${id}" style="display: none;">`;
    $('body').after(a);
    const aElement = $('#' + id);
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
          <text al="${flag}"></text>
          <text al="updatedTo"></text>
        </div><div>
          <text class="last-version">${lastVersion}</text>
          <text al="updateArrow"></text>
          <text class="latest-version">${latestVersion}</text>
        </div>
        <div>(${deviceInfo})</div>
        <a class="download" href="${downloadMirror(download)}" data-backup-href="${download}" target="_blank" al="download" ondragstart="event.dataTransfer.effectAllowed = 'none';"></a>
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
const deleteUpdateLayer = () => {
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
            url = downloadMirror(url);
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
        downloadClick();
    });
});


// 监听代理是否勾选
const proxyChanged = (() => {
    localStorage.setItem('github-proxy', $('.github-proxy').is(':checked'));
    try {
        if ($('.github-proxy').is(':checked')) {
            $('.launcher-download a.button, .update-layer a.download').each((i, e) => {
                const url = $(e).attr('href');
                $(e).attr('href', downloadMirror(url));
            });
        } else {
            $('.launcher-download a.button, .update-layer a.download').each((i, e) => {
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
$('.Modrinth-versions').change(() => {
    const val = $(this).val();
    if (val.length == 0) $(this).val(['all']);
    if (val.length >= 2 && val[val.length - 1] == 'all') $(this).val(val.slice(0, -1));
});

// 获取版本列表
$('.acquire-versions').click(() => {
    $(this).attr('loading', true).attr('disabled', true);
    const releaseVersions = [];
    $.getJSON('https://piston-meta.mojang.com/mc/game/version_manifest.json').then((result) => {
        result.versions.forEach(v => v.type == 'release'? releaseVersions.push(v.id): 0);
        let dom = '';
        for (const rv of releaseVersions) {
            dom += `<mdui-menu-item class="version-item" value="${rv}"><div slot="custom" class="custom-item"><div>${rv}</div></div></mdui-menu-item>`;
        };
        dom += '<mdui-menu-item value="all" hidden><div slot="custom" class="custom-item"><div al="all"></div></div></mdui-menu-item>';
        $('.Modrinth-versions').html(dom);
        $('.Modrinth-versions').click();
        i18n(() => $('.acquire-versions').removeAttr('loading'));
    });
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
                    return $.get(url, void(0), (abbr == 'Modrinth')? 'json': 'jsonp').then((result) => {
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
                    }).catch((e) => {
                        $('.searchable-clear').removeAttr('loading');  // 在获取候选词时显示加载动画（已完成）
                    });
                }
            });
        })
    }
);


// 生成网站details板块
const pre_list = ((e) => {
    const lineBlocks = [];
    let blocks = JSON.parse($(e).html());
    let dom = '';
    const importantPattern = /(?<!\.)((半价|免费|公益|折扣|限时|特惠|热门|新品|热销|促销|推荐|礼品|[一二两三四五六七八九]折|打折|超值|全新|便宜|披风)|\b(free|off|new|hot|recommend|top|discount|limit|cheap|present|gift|cape)\b)/gi;
    for (const block of blocks) {
        // 获取分类并处理
        const category = Object.keys(block)[0];
        if (category.endsWith('[open]')) {
            dom += `<details class="keep" id="${category.replace('[open]', '').replace(/ .+/, '')}" open><summary>${category.replace('[open]', '')}</summary>`;
        }
        else dom += `<details id="${category.replace(/ .+/, '')}"><summary>${category}</summary>`;
        let content;
        // 生成元素
        for (const [_title, url, description, autoLang] of block[category]) {
            let template = '|DOM|';
            const title = autoLang ? `al="${_title}">` : `>${_title}`;
            if (autoLang && description) template = `<mdui-tooltip al-aplto="content: ${description};" placement="top">|DOM|</mdui-tooltip>`;
            else if (description) template = `<mdui-tooltip content="${description}" placement="top">|DOM|</mdui-tooltip>`;
            // 判断是否为内部链接
            if (url.startsWith('#')) {
                // 内部链接
                content = `<a class="button noicon" href="${url}" onclick="hashChanged();" ${title}</a>`;
                // 找不到合适的外部链接
                if (url == '#') content = `<a class="button noicon" ${title}</a>`;
            } else {
                // 外部链接
                content = `<a class="button" href="${url}" target="_blank" ${title}</a>`;
                if (importantPattern.test(title)) {
                    content = `<a class="button important" href="${url}" target="_blank" ${title.replace(importantPattern, '<text class="bold">$1</text>')}</a>`;
                };
            };
            dom += template.replace('|DOM|', content);
        };
        dom += '</details><hr>';
    };
    dom = dom.replace(/<hr>$/, '');
    $(e).html(dom);
});



// 获取正常状态的简体中文论坛
const CSForum = [{"简体中文论坛": []}];
for (const forum of db_forums) {
    if (forum.state == 'up') {
        CSForum[0]['简体中文论坛'].push([forum.title, forum.url, forum.note.replace(/。$/, '')]);
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
        $(e).children().click(() => {
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
        $(e).children().click(() => {
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
            downloadClick();
            i18n();
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
        if ($('#clickEffect')[0].checked) $.getScript('https://log.xsawa.dev.tc/js/candy.min.js')
          .then(console.log('[debug] clickEffect is now enabled!\nif you want to disable it pls refresh the page.'))
          .catch(e => console.error(`[debug] ${e}`)); // 打开了就没有退路了awa 除非刷新页面awa
    });
});


// 调试模式 (Debug Mode)
const debugCallback = (e = $('[visibleInDebugMode]')) => (debug.mode ? e.show() : e.hide());
const debugChange = ((object) => {
    const handler = {
        defineProperty: (target, property, descriptor) => {
            Reflect.defineProperty(target, property, descriptor);
            debugCallback();
        }
    };
    return new Proxy(object, handler);
});
const debug = debugChange({mode: false});
debugCallback();

// 愚人节彩蛋 awa
import("./apf.js").then(apf => (globalThis.apf = apf, apf.main()));
