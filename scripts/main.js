// 列出所有已支持的设备
window.supportedDevices = [
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
    if (localStorage.getItem('check-update') == 'false') return;
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
          <text>➔</text>
          <text class="latest-version">${latestVersion}</text>
        </div>
        <div>(${deviceInfo})</div>
        <span class="close">❌</span>
        <a class="download" href="${downloadMirror(download)}" data-backup-href="${download}" al="download" ondragstart="event.dataTransfer.effectAllowed = 'none';"></a>
      </div>`;
    $('sidebar').before(dom);
    const set = ((version, stableOrDev) => {
        localStorage.setItem(`last-${device}-${abbr}-${stableOrDev}-download`, version);
    });
    $(`.update-layer-${updateLayerNumber} .download, .update-layer-${updateLayerNumber} .close`).click(() => {
        set(latestVersion, stableOrDev);
    });
    if (updateLayerNumber) notificationCount = `(${updateLayerNumber})`;
});

// 更新提示 删除
const deleteUpdateLayer = function(all) {
    --updateLayerNumber;
    if (all == true && updateLayerNumber) deleteUpdateLayer(true);
    notificationCount = '';
    if (updateLayerNumber) notificationCount = `(${updateLayerNumber})`;
    i18n();

    const number = all == true ? 1 : Number($(this).parent().attr('class').split('update-layer-')[1]);
    $(`.update-layer-${number}`).remove();
    for (let i = number + 1;; ++i) {
        if ($(`.update-layer-${i}`).length) {
            $(`.update-layer-${i}`).removeClass(`update-layer-${i}`).addClass(`update-layer-${i - 1}`);
        } else break;
    }
}


// 获取下拉菜单选中项
const checkedOption = ((selectElement) => {
    const selectInclude = (str) => ( $(selectElement).html().indexOf(str) != -1 );
    if (selectElement.value) {
        if (selectInclude('Wiki') || selectInclude('Launcher')) {
            return $(selectElement).find(`mdui-menu-item[data-abbr="${selectElement.value}"]`);
        }
    }
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
        }
    })
    try { launcherChanged(); } catch {}
});


// 应用启动器
$('div.launcher-list').html(DOMLauncherList.deviceList());


// 监听启动器选择项
const launcherChanged = ((event = {target: $('mdui-select.launcher-list')}) => {
    const checked = checkedOption(event.target);
    const title = checked.data('title');
    const abbr = checked.data('abbr');
    const device = checked.data('device');
    let version, devVersion;
    $('.launcher-title').text('');
    if (title && title != checked.val()) {
        $('.launcher-title').text(title);
    }
    for (const attribute of ['data-download', 'data-dev-download', 'data-url', 'data-github']) {
        const button = $(`.${attribute}-launcher`);
        let url = checked.attr(attribute);
        if (attribute.endsWith('-download')) {
            url = downloadMirror(url);
            const removeEmpty = (version) => {
                if (version === void 0) {
                    button.removeAttr('href title data-backup-href al').html('');
                }
            };
            if (attribute == 'data-download') {
                version = checked.data('version');
                window.linkVersion = version;
                window.linkUrl = url;
                window.linkDownload = checked.data('backup-download');
                call = version == 'latest' ? 'launcher.release.latest' : 'launcher.release';
                button.attr('al', call)
                removeEmpty(version);
            } else {
                const devVersion = checked.data('dev-version');
                window.linkDevVersion = devVersion;
                window.linkDevUrl = url;
                window.linkDevDownload = checked.data('backup-dev-download');
                call = version == 'latest' ? 'launcher.preRelease.latest' : 'launcher.preRelease';
                button.attr('al', call)
                removeEmpty(devVersion);
            }
        }
        button.hide();
        if (attribute == 'data-url') window.linkFavicon = url ? fIconGet(url) : '';
        if (url) button.attr('href', url).show();
    }
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
    const isChecked = $('.github-proxy').is(':checked');
    localStorage.setItem('github-proxy', isChecked);
    try {
        $('.launcher-download a.button, .update-layer a.download').each((i, e) => {
            const url = $(e).attr(isChecked ? 'href' : 'data-backup-href');
            $(e).attr('href', isChecked ? downloadMirror(url) : url);
        });
    } catch {}
});
$('.github-proxy').change(proxyChanged);


// 检查更新是否勾选
const checkUpdateChanged = (() => {
    const isChecked = $('.check-update').is(':checked');
    localStorage.setItem('check-update', isChecked);
    if (!isChecked) deleteUpdateLayer(true);
});
$('.check-update').change(checkUpdateChanged);


// 应用快速查询
$('.searchable-list').html(DOMSearchableList.list(searchable));

// 站内搜索
function siteSearch(allow = true) {
    $('.searchmatch').contents().unwrap();
    const keyword = $('.searchable-input').val();
    if (allow) location.hash = '-';
    if (!allow || !keyword) {
        if (allow) location.hash = '全部收起';
        $('pre a.button').show();
        return;
    }
    $('pre details').removeAttr('open');
    $('pre a.button').each(function() {
        let z = $(this).parent();
        const span = $(this).find('span');
        const title = span.text();
        const description = z.attr('content') || '';
        if (description) z = z.parent();
        const pattern = new RegExp('(' + keyword.replace(/([[\](){}.*+?|^$\\\-])/g, '\\$1') + ')' , 'gi');
        if (pattern.test(title + description)) {
            z.attr('open', true);
            const titleH = span.text().replace(pattern, '<text class="searchmatch">$1</text>');
            span.html(titleH);
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}
$('#site-search').click(() => {
    location.hash = '-';
    location.hash = '网站';
    if ($('.searchable-list').val() == 'MCiSEE') return;
    $('.searchable-list').val('MCiSEE');
    searchableChanged();
});

// 监听快速查询选择项
let countSearchable = 0;
const searchableChanged = (event = { target: $('.searchable-list') }) => {
    const e = $(event.target);
    const checked = checkedOption(event.target);
    searchKeyword = checked.data('search');
    const abbr = checked.data('abbr');
    window.linkSearchFrom = searchableAbbr = abbr;
    $('.searchable-label').html(`<a class="searchable-goto gravity-inline" href="${checked.data('url')}" title="${checked.data('note') ? checked.data('note') : ''}" target="_blank"><p al="goto"></p>
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></svg></a>`);
    localStorage.setItem('searchable-checked', e.val());
    siteSearch(false);
    // 计数器
    countSearchable++;
    if (countSearchable > 2) $('.searchable-list').click();
    // 显示 Modrinth 专用项
    $('.Modrinth').hide();
    if (abbr == 'Modrinth') $('.Modrinth').show();
    i18n();
};
$('.searchable-list').change(searchableChanged);


// 快速查询 表单提交处理
$('.searchable-form').submit((event) => {
    event.preventDefault();
    const input = $('.searchable-input').val().trim();
    if (!input) return;
    const search = encodeURI(input);
    let url;
    if (searchableAbbr == 'Modrinth') {
        if ($('.Modrinth-projectType').val() == '') return;
        const ver = $('.Modrinth-versions').val();
        let versions = '';
        if (ver != 'all' && ver != '?') {
            versions = `&v=${ver.join('&v=')}`
        }
        url = `https://modrinth.com/${$('.Modrinth-projectType').val()}s?q=${search}${versions}`;
    } else {
        if (!searchKeyword) return;
        if (searchableAbbr == 'BEID') search = search.split('%20-%20').slice(0, -1).join('%20-%20');
        url = searchKeyword.replace(encodeURI('<T>'), search);
        if ($('.searchable-direct').is(':checked') && url.indexOf('&fulltext=') != -1) {
            url = url.replace(/&[^&]*$/, '');
        }
    }
    createSuperLabel(url, 'searchable-search');
});

// 快速查询 拼写完成校验
let searchableComposition = true;
$('.searchable-input').on('compositionstart compositionend', (event) => {
    searchableComposition = event.type == 'compositionstart' ? false : true;
});

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
        if (searchableAbbr == 'MCiSEE') siteSearch();
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
    $.getJSON('https://piston-meta.mojang.com/mc/game/version_manifest.json').then((result) => {
        result.versions.forEach(v => v.type == 'release'? releaseVersions.push(v.id): 0);
        let dom = '';
        for (const rv of releaseVersions) {
            dom += `<mdui-menu-item class="version-item" value="${rv}"><div slot="custom" class="custom-item"><div>${rv}</div></div></mdui-menu-item>`;
        }
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
    }
});
config({
    'theme': 'system',
    'github-proxy': (navigator.language == 'zh-CN' ? true : false),
    'check-update': true,
    'searchable-direct': true,
    'searchable-prompt-length': 10,
    'clean-url': true
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
        limit: 100,  // 实际限制 30
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
                        versions = Array.from(ver).map(v => `versions:${v}`).join(',');
                        versions = `[${versions}]`;
                    }
                    const categoryMap = {
                        'mod': ['forge', 'fabric', 'quilt', 'liteloader', 'modloader', 'rift', 'neoforge'],
                        'plugin': ['bukkit', 'spigot', 'paper', 'purpur', 'sponge', 'bungeecord', 'waterfall', 'velocity', 'folia'],
                        'datapack': ['datapack']
                    };
                    switch (projectType) {
                        case 'mod':
                        case 'plugin':
                        case 'datapack':
                            const categories = categoryMap[projectType].map(category => `"categories:${category}"`);
                            facets = encodeURI(`[[${categories.join(",")}],["project_type:${projectType}"]${versions}]`);
                            break;
                        default:
                            facets = encodeURI(`[["project_type:${projectType}"]${versions}]`);
                    }
                }
                // API
                const api = {
                    Wiki: `https://zh.minecraft.wiki/api.php?action=opensearch&search=${search}&limit=30`,
                    BWiki: `/r/request/BWiki?action=opensearch&search=${search}&limit=30`,
                    Modrinth: `https://api.modrinth.com/v2/search?limit=30&index=relevance&query=${search}&facets=${facets}`,
                    MCMOD: `/r/request/MCMOD/search_api.php?key=${search}`,
                    BEID: `/r/request/BEID?q=${search}&limit=60`,
                    // BEDW: `https://wiki.mcbe-dev.net/w/api.php?action=opensearch&search=${search}&namespace=0%7C3000%7C3002%7C3004%7C3008%7C3010&limit=30`,
                    MinePlugin: `/r/request/MinePlugin?action=opensearch&search=${search}&limit=30`,
                }
                const url = api[abbr];
                if (url) {
                    // 获取候选词
                    $('.searchable-clear').attr('loading', true);  // 在获取候选词时显示加载动画（进行中）
                    return $.get(url, void 0, 'json').then((result) => {
                        if (result.length > 1 && Array.isArray(result[1])) {
                            result = result[1];
                        }
                        if (abbr == 'Modrinth') {
                            let arr = [];
                            result.hits.map((item) => arr.push(item.title));
                            result = arr;
                        }
                        if (abbr == 'BEID') {
                            let arr = [];
                            result.data.result.map((item) => arr.push(item.value + " - " + item.key));
                            result = [...new Set(arr)];
                        }
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
    for (const block of blocks) {
        // 获取分类并处理
        const category = Object.keys(block)[0];
        const toolCount = block[category].length;
        
        if (category.endsWith('[open]')) {
            dom += `<details class="keep" id="${category.replace('[open]', '').replace(/ .+/, '')}" data-tool-count="${toolCount}" open><summary>${category.replace('[open]', '')}</summary>`;
        }
        else dom += `<details id="${category.replace(/ .+/, '')}" data-tool-count="${toolCount}"><summary>${category}</summary>`;
        let content;
        // 生成元素
        for (const [_title, url, description, favicon, autoLang] of block[category]) {
            let template = '|DOM|';
            let icon = '';
            if (!url.startsWith('#')) icon = fIconGet(url, favicon);
            if (favicon == "") icon = '';
            const title = autoLang ? `>${icon}<span al="${_title}"></span>` : `>${icon}<span>${_title}</span>`;
            if (autoLang && description) template = `<mdui-tooltip al-aplto="content: ${description};" placement="top">|DOM|</mdui-tooltip>`;
            else if (description) template = `<mdui-tooltip content="${description}" placement="top">|DOM|</mdui-tooltip>`;
            // 判断是否为内部链接
            if (url.startsWith('#')) {
                // 内部链接
                content = `<a class="button noicon" href="${url}" onclick="hashChanged();" ${title}</a>`;
                // 找不到合适的外部链接
                if (url == '#') content = `<a class="button nosupport" ${title}</a>`;
            } else {
                // 外部链接
                content = `<a class="button" href="${url}" target="_blank" ${title}</a>`;
            }
            dom += template.replace('|DOM|', content);  // 应用模板
        }
        dom += '</details><hr>';
    }
    dom = dom.replace(/<hr>$/, '');
    $(e).html(dom);
    
    // 设置自适应高度
    setAdaptiveDetailsHeight(e);
    
    $('.nosupport').click(function() {
        clearTimeout(hShake);
        $(this).addClass('h-shake');
        hShake = setTimeout(() => $(this).removeClass('h-shake'), 700);
    });
});

// 设置 details 元素自适应高度
function setAdaptiveDetailsHeight(container) {
    $(container).find('details').each(function() {
        const $details = $(this);
        const toolCount = parseInt($details.attr('data-tool-count')) || 0;
        
        // 计算基础高度：summary 高度 + 工具按钮高度 * 行数 + 间距
        const summaryHeight = 2.5; // em
        const buttonHeight = 2.8; // em，包括 margin
        const padding = 1; // em
        
        // 根据屏幕宽度和容器宽度计算每行工具数量
        let toolsPerRow = 3; // 默认值
        const screenWidth = window.innerWidth;
        
        if (screenWidth <= 480) {
            toolsPerRow = 1;
        } else if (screenWidth <= 768) {
            toolsPerRow = 2;
        } else if (screenWidth <= 1024) {
            toolsPerRow = 3;
        } else {
            // 桌面端：更精确的计算
            // 获取页面内容区域的实际宽度
            const pageContent = document.querySelector('.page-content');
            const containerWidth = pageContent ? pageContent.offsetWidth : screenWidth;
            
            // 考虑按钮的实际尺寸：
            // - 按钮基础宽度约 120px (根据内容自适应)
            // - margin: 6px (左右各6px，总共12px)
            // - 额外间距和padding
            const buttonTotalWidth = 144; // 120px + 12px margin + 12px 额外间距
            const availableWidth = containerWidth - 32; // 减去容器的padding
            
            toolsPerRow = Math.max(1, Math.floor(availableWidth / buttonTotalWidth));
            
            // 限制最大值，避免按钮过于分散
            toolsPerRow = Math.min(toolsPerRow, 6);
            
            // 针对常见分辨率的优化
            if (screenWidth >= 1920) {
                toolsPerRow = Math.min(toolsPerRow, 5); // 4K显示器不要太分散
            } else if (screenWidth >= 1440) {
                toolsPerRow = Math.min(toolsPerRow, 4); // 2K显示器
            }
        }
        
        const rows = Math.ceil(toolCount / toolsPerRow);
        const calculatedHeight = summaryHeight + (rows * buttonHeight) + padding;
        
        // 设置 CSS 自定义属性
        $details[0].style.setProperty('--calculated-height', `${calculatedHeight}em`);
    });
    
    // 监听窗口大小变化
    $(window).off('resize.adaptiveDetails').on('resize.adaptiveDetails', function() {
        setAdaptiveDetailsHeight(container);
    });
}



// 页面加载完成事件
$(() => {
    // 网站列表
    $('.utility-website-list').text(JSON.stringify(utilityWebsite));
    $('.forum-list').text(JSON.stringify(forum));
    // 缓存处理
    const searchableChecked = localStorage.getItem('searchable-checked');
    if (searchableChecked == 'undefined' || searchableChecked == void 0) $('.searchable-list').val('MCiSEE');
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
    // 公告栏
    announcementInit();
    announcementSwitch();
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
                        }
                    }
                    if (launcher.hasOwnProperty('dev')) {
                        const lastDevVersion   = localStorage.getItem(`last-${device}-${abbr}-dev-download`);
                        const latestDevVersion = launcher.dev.version;
                        if (lastDevVersion && lastDevVersion != latestDevVersion) {
                            createUpdateLayer(abbr, lastDevVersion, latestDevVersion, launcher.dev.download, device, deviceInfo, 'preRelease');
                        }
                    }
                }
            }
            $('.update-layer .close, .update-layer .download').click(deleteUpdateLayer);
            downloadClick();
            i18n();
        }
        // 默认值初始化
        $('.Modrinth-projectType').val('mod');
        $('.Modrinth-versions').val(['all']);
        // 最后处理
        $('a.button img').on('error', (event) => $(event.target).remove());
        hashChanged();
        $('.wait').removeAttr('class style');
        try { document.querySelector(decodeURI(location.hash)).scrollIntoView(); } catch {}
    });

    // init clean url
    import('./module/clean-url.js');

    import('./module/search-param-helper.js');

    // init debug
    import("./module/debug.js").then(d => globalThis.debug = d.debug);
});
