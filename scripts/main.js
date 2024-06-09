let searchKeyword = '';
let searchableSubtitle = '';

let countSearchable = 0;
const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';

// 所有已支持设备
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


const i18n = function() {
    al.setLangProp(['locales/zh-CN.yml'], function() {
        al.load();
    }, {url: true, yaml: true});
}



// 创建超文本标签（并点击）
const createSuperLabel = function(url, id) {
    const a = `<a href="" target="_blank" id="${id}">`;
    $('body').after(a);
    const aElement = $('#' + id);
    aElement.attr('href', url);
    aElement[0].click();
    aElement.remove();
};

// 获取下拉菜单选中项
const checkedOption = function(selectElement) {
    const selectInclude = (str) => ( $(selectElement).html().indexOf(str) != -1 );
    if (selectElement.value) {
        if (selectInclude('Wiki') || selectInclude('Launcher')) {
            return $(selectElement).find(`mdui-menu-item[data-subtitle="${selectElement.value}"]`);
        };
    };
    return $( $(selectElement)[0][$(selectElement)[0].selectedIndex] );
};


const deviceChanged = function() {
    $('div.launcher-list mdui-select').each(function(i, e) {
        $(e).hide();
        const select = $('.' + $('.device-list').val());
        select.val('【待选择】');
        select.show();
    });
    try { launcherChanged(); } catch (err) {};
};


// 应用启动器
$('div.launcher-list').html(DOMLauncherList.deviceList());


// 监听启动器选择项
const launcherChanged = function(event = {target: $('mdui-select.launcher-list')}) {
    const checked = checkedOption(event.target);
    const dataTitle = checked.attr('data-title');
    $('.launcher-title').text('');
    if (dataTitle && dataTitle != checked.val()) {
        $('.launcher-title').text(dataTitle);
    };
    for (const attribute of ['data-download', 'data-dev-download', 'data-url']) {
        const button = $(`.${attribute}-launcher`);
        let url = checked.attr(attribute);
        if (attribute.endsWith('download')) {
            if ($('.github-proxy').is(':checked') && String(url).startsWith('https://github.com/')) {
                url = 'https://sciproxy.com/' + url;
            };
            const removeEmpty = function(version) {
                if (version === void 0) {
                    button.removeAttr('href').removeAttr('title').removeAttr('data-backup-href');
                    button.html('')
                    button.parent().removeAttr('al');
                };
            };
            if (attribute == 'data-download') {
                const version = checked.attr('data-version');
                window.linkVersion = version;
                window.linkUrl = url;
                window.linkDownload = checked.attr('data-backup-download');
                button.parent().attr('al', 'launcher.release.latest');
                if (version != 'latest') {
                    button.parent().attr('al', 'launcher.release');
                };
                removeEmpty(version);
            } else {
                const devVersion = checked.attr('data-dev-version');
                window.linkDevVersion = devVersion;
                window.linkDevUrl = url;
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
    i18n();
};


// 监听代理是否勾选
const proxyChanged = function() {
    localStorage.setItem('github-proxy', $('.github-proxy').is(':checked'));
    try {
        if ($('.github-proxy').is(':checked')) {
            $('.launcher-download>a.button').each(function(i, e) {
                const link = $(e).attr('href');
                if (link.startsWith('https://github.com/')) $(e).attr('href', 'https://sciproxy.com/' + link);
            });
        } else {
            $('.launcher-download>a.button').each(function(i, e) {
                $(e).attr('href', $(e).attr('data-backup-href'));
            });
        };
    } catch (err) {};
};
$('.github-proxy').change(proxyChanged);


// 应用快速查询
$('.searchable-list').html(DOMSearchableList.list(searchable));

// 监听快速查询选择项
const searchableChanged = function(event = {target: $('.searchable-list')}) {
    const checked = checkedOption(event.target);
    searchKeyword = checked.attr('data-search');
    const subtitle = checked.attr('data-subtitle');
    searchableSubtitle = subtitle;
    const note = checked.attr('data-note');
    $('.searchable-input').attr('placeholder', ` 从 ${subtitle} 中搜索 ....`);
    $('.searchable-label').html(`<a class="searchable-goto by-inline" href="${checked.attr('data-url')}" title="${note}" target="_blank"><p al="goto"></p> <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></svg></a>`);
    localStorage.setItem('searchable-checked', event.target.value);
    countSearchable += 1;
    if (countSearchable > 2) $('.searchable-list').click();
    i18n();
};
$('.searchable-list').change(searchableChanged);


// 快速查询 表单提交处理
$('.searchable-form').submit(function(event) {
    event.preventDefault();
    const input = $('.searchable-input').val().trim();
    const search = encodeURI(input);
    let url = searchKeyword.replace(encodeURI('<T>'), search);
    if ($('.searchable-direct').is(':checked') && url.indexOf('&fulltext=') != -1) {
        url = url.replace(/&[^&]*$/, '');
    };
    if (input != '') createSuperLabel(url, 'searchable-search');
});

// 快速查询 拼写完成校验
let searchableComposition = true;
$('.searchable-input').on('compositionstart', function() {
    searchableComposition = false;
});
$('.searchable-input').on('compositionend', function() {
    searchableComposition = true;
});
$('.searchable-input').on('input', function() {
    let _this = this;
    setTimeout(function() {
        $('.searchable-button, .searchable-clear').attr('disabled', true);
        if (!searchableComposition) return;
        $('.searchable-button, .searchable-clear').attr('disabled', false);
        if ($('.searchable-input').val().trim() == '') {
            $('.searchable-button').attr('disabled', true);
            $('.searchable-clear').attr('hidden', true);
        } else $('.searchable-clear').removeAttr('hidden');
    }, 0);
});

// 快速查询 清空搜索框
$('.searchable-clear').click(function() {
    $('.searchable-input').trigger('input').focus();
});

// 监听快速查询是否勾选
$('.searchable-direct').change(function() {
    localStorage.setItem('searchable-direct', $('.searchable-direct').is(':checked'));
});


// 配置初始化
const config = function(...settings) {
    for (const [option, defaultVal] of Object.entries(settings)) {
        if (localStorage.getItem(option) === void 0) localStorage.setItem(option, defaultVal);
        if (localStorage.getItem(option) == 'true') $('.' + option).attr('checked', true);
        else $('.' + option).attr('checked', false);
    };
};
config({'github-proxy': true}, {'searchable-direct': true});


// 获取候选词
$('.searchable-input').typeahead(
    {
        hint: false,
        highlight: true,
        minLength: 1
    },
    {
        name: 'searchable-data',
        async: true,
        limit: 10,
        source: function(query, syncResults, asyncResults) {
            setTimeout(function() {
                if (!searchableComposition) return;
                let subtitle = searchableSubtitle;
                let search = encodeURI($('.searchable-input').val().trim());
                // API
                const api = {
                    Wiki: `https://zh.minecraft.wiki/api.php?action=opensearch&search=${search}&limit=11`,
                    BWiki: `https://wiki.biligame.com/mc/api.php?action=opensearch&search=${search}&limit=11`,
                    BEDW: `https://wiki.mcbe-dev.net/w/api.php?action=opensearch&search=${search}&namespace=0%7C3000%7C3002%7C3004%7C3008%7C3010&limit=11`,
                    MinePlugin: `https://mineplugin.org/api.php?action=opensearch&search=${search}&limit=11`
                };
                const url = api[subtitle];
                if (url) {
                    // 获取候选词
                    $('.searchable-clear').attr('loading', true);  // 在获取候选词时显示加载动画（进行中）
                    return $.ajax({
                        url: url,
                        type: 'get',
                        cache: true,
                        data: {keyword: query},
                        dataType: 'jsonp',
                        success: function(result) {
                            if (result.length > 1 && Array.isArray(result[1])) {
                                result = result[1];
                            };
                            $('.searchable-clear').removeAttr('loading');  // 在获取候选词时显示加载动画（已完成）
                            return asyncResults(result);
                        },
                        error: function() {
                            $('.searchable-clear').removeAttr('loading');  // 在获取候选词时显示加载动画（已完成）
                        }
                    }, 0);
                };
            });
        }
    }
);


// 网站板块生成
const pre_list = function(e) {
    const lineBlocks = [];
    let blocks = JSON.parse($(e).html());
    let dom = '';
    for (let block of blocks) {
        // 获取分类并处理
        const category = Object.keys(block)[0];
        if (category.endsWith('[open]')) {
            dom += `<details class="keep" id="${category.replace('[open]', '').replace(/ .+/, '')}" open><summary>${category.replace('[open]', '')}</summary>`;
        }
        else dom += `<details id="${category.replace(/ .+/, '')}"><summary>${category}</summary>`;
        // 生成元素
        for (const [title, url] of block[category]) {
            dom += `<a class="button" href="${url}" target="_blank">${title}</a>`;
        };
        dom += '</details><hr>';
    };
    dom = dom.replace(/<hr>$/, '');
    $(e).html(dom);
};


// URL哈希属性监听
const hashChanged = function() {
    if (location.hash == '') return;
    let hash = decodeURI(location.hash);
    const slicedHash = hash.slice(0, -3);
    try {
        if (hash == '#全部展开') $('.page-content').find('details:not(.keep)').attr('open', true);
        if (hash == '#全部收起') $('.page-content').find('details:not(.keep)').attr('open', false);
        if (hash.endsWith('-展开')) {
            $(slicedHash).find('details').attr('open', true);
            $(slicedHash).find('.to-fold').show();
            $(slicedHash).find('.to-unfold').hide();
            location.hash = slicedHash;
        }
        if (hash.endsWith('-收起')) {
            $(slicedHash).find('details:not(.keep)').attr('open', false);
            $(slicedHash).find('.to-unfold').show();
            $(slicedHash).find('.to-fold').hide();
            hash = slicedHash;
        }
        if ($(hash).html().startsWith('<summary>')) $(hash).attr('open', true);
        else $(`${hash}>*:first-child`).addClass('hash');
    } catch (err) {};
};
$(window).on('hashchange', function() {
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
$(document).ready(function() {
    // 网站列表
    $('.utility-website-list').text(JSON.stringify(utilityWebsite));
    $('.forum-list').text(JSON.stringify([].concat.apply(CSForum, otherForum)));
    // 缓存处理
    const searchableChecked = localStorage.getItem('searchable-checked');
    if (searchableChecked == 'undefined' || searchableChecked == void 0) $('.searchable-list').val('Wiki');
    else $('.searchable-list').val(searchableChecked);
    // 设备
    deviceChanged();
    supportedDevices.forEach(function(deviceInfo) {
        if (deviceInfo[0] == $('.device-list').val()) $('.device-list').val((deviceInfo[1]));
    });
    $('.device-list').each(function(i, e) {
        $(e).children().click(function() {
            const value = $(this).attr('label');
            $('.device-list').val(value);
            deviceChanged();
            $('.device-list').val($(this).find('div div:first-child').text());
            $(e).click();
        });
    });
    // 启动器
    $('mdui-select.launcher-list').each(function(i, e) {
        $(e).val('【待选择】');
        $(e).children().click(function() {
            const value = $(this).attr('label');
            $('mdui-select.launcher-list').val(value);
            launcherChanged({target: e});
            $('mdui-select.launcher-list').val($(this).find('div div:first-child').text());
            $(e).click();
        });
    });
    // 快速查询
    searchableChanged();
    $('.pre-flex').each(function(i, e) {
        pre_list(e);
    });
    // 国际化 (internationalization)
    i18n();
    // 最后处理
    hashChanged();
    $('.wait').removeAttr('class').removeAttr('style');
    try { document.querySelector(decodeURI(location.hash)).scrollIntoView(); } catch (err) {};
});