let searchKeyword = '';

const supportedDevices = [
    // |   最早名称   |       显示名称       |           描述           |
    [      'Android',  'Android/HarmonyOS', '安卓/鸿蒙 - 手机/平板'     ],
    [          'iOS',  'iOS/iPad'         , '苹果 - 手机/平板'         ],
    [      'Windows',  'Windows'          , 'Windows - 电脑'          ],
    [        'macOS',  'macOS'            , '苹果 - 电脑'              ],
    [        'Linux',  'Linux'            , '含Ubuntu/FreeBSD/Debian' ],
];
DOMDeviceList.show();
$('#device-list').attr('data-max-size', supportedDevices.length);


// 不记录历史滚动位置
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
};



// 创建超文本标签（并点击）
const createSuperLabel = function(url, id) {
    const a = `<a href="" target="_blank" id="${id}">`;
    $('body').after(a);
    const aElement = $(`#${id}`);
    aElement.attr('href', url);
    aElement[0].click();
    aElement.remove();
};

// 获取下拉菜单选中项
const checkedOption = function(selectElement) {
    return $( $(selectElement)[0][$(selectElement)[0].selectedIndex] );
};


const deviceChanged = function() {
    $('.device-diff select').each(function(index, element) {
        $(element).hide();
        const select = $('.' + $('#device-list').val());
        select.val('?');
        select.show();
    });
    try { launcherChanged(); } catch (e) {};
};


$('div.launcher-list').html(DOMLauncherList.deviceList());

const launcherChanged = function(event = {target: $('.launcher-list')}) {
    const checked = checkedOption(event.target);
    const dataTitle = checked.attr('data-title');
    $('.launcher-title').text('');
    if (dataTitle && dataTitle != checked.val()) {
        $('.launcher-title').text(dataTitle);
    };
    for (const attribute of ['data-download', 'data-dev-download', 'data-url']) {
        const button = $(`.${attribute}-launcher`);
        let URL = checked.attr(attribute);
        if (attribute.endsWith('download')) {
            if ($('.github-proxy').is(':checked') && String(URL).startsWith('https://github.com/')) {
                URL = 'https://sciproxy.com/' + URL;
            };
            const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';
            const emptyrm = function(ver) {
                if (ver === void 0) {
                    button.removeAttr('href').removeAttr('title').removeAttr('data-backup-href');
                    button.html('');
                };
            };
            if (attribute == 'data-download') {
                const version = checked.attr('data-version');
                button.html(downloadSVG + '下载最新稳定版');
                button.attr('title', '下载尽可能新的稳定正式版');
                if (version != 'latest') {
                    button.html(downloadSVG + '下载稳定版 ' + version);
                    button.attr('title', '下载稳定正式版 ' + version);
                };
                button.attr('data-backup-href', checked.attr('data-backup-download'));
                emptyrm(version);
            } else {
                const devVersion = checked.attr('data-dev-version');
                button.html(downloadSVG + '下载最新开发版');
                button.attr('title', '下载尽可能新的开发测试版');
                if (devVersion != 'latest') {
                    button.html(downloadSVG + '下载开发版 ' + devVersion);
                    button.attr('title', '下载开发测试版 ' + devVersion);
                };
                button.attr('data-backup-href', checked.attr('data-backup-dev-download'));
                emptyrm(devVersion);
            };
        };
        button.hide();
        if (URL) {
            button.attr('href', URL).show();
        };
    };
};
$('select.launcher-list').change(launcherChanged);


const proxyChanged = function() {
    localStorage.setItem('github-proxy', $('.github-proxy').is(':checked'));
    try {
        if ($('.github-proxy').is(':checked')) {
            $('.launcher-download>a.button').each(function(index, element) {
                const link = $(element).attr('href');
                if (link.startsWith('https://github.com/')) $(element).attr('href', 'https://sciproxy.com/' + link);
            });
        } else {
            $('.launcher-download>a.button').each(function(index, element) {
                $(element).attr('href', $(element).attr('data-backup-href'));
            });
        };
    } catch (e) {};
};
$('.github-proxy').change(proxyChanged);


$('#searchable-list').html(DOMSearchableList.list(searchable));

const searchableChanged = function(event = {target: $('#searchable-list')}) {
    const checked = checkedOption(event.target);
    searchKeyword = checked.attr('data-search');
    const subtitle = checked.attr('data-subtitle');
    const note = checked.attr('data-note');
    $('.searchable-input').attr('placeholder', ` 从 ${subtitle} 中搜索 ...`);
    $('.searchable-label').html(`<a class="searchable-goto" href="${checked.attr('data-url')}" title="${note}" target="_blank">跳转 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></svg></a>`);
};
$('#searchable-list').change(searchableChanged);

// 表单提交处理
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

// 拼写完成校验
let searchableComposition = true;
$('.searchable-input').on('compositionstart', function() {
    searchableComposition = false;
})
$('.searchable-input').on('compositionend', function() {
    searchableComposition = true;
})
$('.searchable-input').on('input', function() {
    let _this = this;
    setTimeout(function() {
        if (!searchableComposition) return;
        $('.searchable-button').removeClass('disabled');
        if ($('.searchable-input').val().trim() == '') {
            $('.searchable-button').addClass('disabled');
        };
    }, 0);
});

$('.searchable-direct').change(function() {
    localStorage.setItem('searchable-direct', $('.searchable-direct').is(':checked'));
});


// 同步配置
const config = function (...classNames) {
    for (const className of classNames) {
        if (localStorage.getItem(className) == 'true') $('.' + className).attr('checked', true);
        else $('.' + className).attr('checked', false);
    };
};
config('auto-folding', 'github-proxy', 'searchable-direct');


// 获取候选词
$.support.cors = true;
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
                if (!searchableComposition) return asyncResults([]);
                let subtitle = checkedOption('#searchable-list').attr('data-subtitle');
                let search = encodeURI($('.searchable-input').val().trim());
                const API = {
                    Wiki: `https://zh.minecraft.wiki/api.php?action=opensearch&search=${search}&limit=11`,
                    BWiki: `https://wiki.biligame.com/mc/api.php?action=opensearch&search=${search}&limit=11`,
                    BEDW: `https://wiki.mcbe-dev.net/w/api.php?action=opensearch&search=${search}&namespace=0%7C3000%7C3002%7C3004%7C3008%7C3010&limit=11`,
                    MinePlugin: `https://mineplugin.org/api.php?action=opensearch&search=${search}&limit=11`
                };
                const URL = API[subtitle];
                if (URL) {
                    return $.ajax({
                        url: URL,
                        type: 'get',
                        cache: true,
                        data: {keyword: query},
                        dataType: "jsonp",
                        success: function(result) {
                            if (result.length > 1 && Array.isArray(result[1])) {
                                result = result[1];
                            };
                            return asyncResults(result);
                        }
                    }, 0);
                };
                return asyncResults([]);
            });
        }
    }
);


const autoFolding = function(event) {
    const element = $(event.target);
    if (element.hasClass("fold")) {
        element.removeAttr('size');
    };
    if (element.hasClass("unfold")) {
        const maxSize = element.attr('data-max-size');
        let size = element.children().length;
        if (size > maxSize) size = maxSize;
        element.focus();
        element.attr('size', size);
    };
};

let realSelect;
const autoFoldingChanged = function() {
    localStorage.setItem('auto-folding', $('.auto-folding').is(':checked'));
    $('select.normal').off('mouseenter').off('mouseleave').attr('disabled', false);
    if ($('.auto-folding').is(':checked')) {
        $('select.normal').hover(
            // mouseenter - 展开
            function() {
                if ($('select.normal.unfold').length > 0) return;
                const setBold = checkedOption(this).text();
                realSelect = $(this).val();
                $(this).children().removeClass('bold');
                $(this).find(`option:contains(${setBold})`).map(function() {
                    if ($(this).text() == setBold) $(this).addClass('bold');
                });
                $(this).removeClass('fold').addClass('unfold');
                autoFolding({target: this});
            },
            // mouseleave - 收起
            function() {
                if ($('select.normal.unfold').length != 1) return;
                $(this).val(realSelect);
                if ($(this)[0].id == 'device-list') {
                    deviceChanged({target: this});
                } else if ($(this).hasClass('launcher-list')) {
                    launcherChanged({target: this});
                }
                $(this).removeClass('unfold').addClass('fold');
                autoFolding({target: this});
            }
        );
        $('select.normal').attr('disabled', true);
    };
};
// 启用自动展开下拉菜单后
$('#device-list option').mouseenter(function() {
    const parent = $(this).parent();
    parent.val($(this).val());
    deviceChanged({target: parent});
    launcherChanged();
});
$('select.launcher-list option').mouseenter(function() {
    const parent = $(this).parent();
    parent.val($(this).val());
    launcherChanged({target: parent});
});
$('select.normal option').click(function() {
    const parent = $(this).parent();
    realSelect = $(parent).val();
    parent.removeClass('unfold').addClass('fold');
    autoFolding({target: parent});
});
$('.auto-folding').change(autoFoldingChanged);


const pre_list = function(element) {
    const lineBlocks = [];
    let blocks = JSON.parse($(element).html());
    let retValue = '';
    for (let block of blocks) {
        const title = Object.keys(block)[0];
        if (title.endsWith('[open]')) {
            retValue += `<details class="keep" id="${title.replace('[open]', '').replace(/ .+/, '')}" open><summary>${title.replace('[open]', '')}</summary>`;
        }
        else retValue += `<details id="${title.replace(/ .+/, '')}"><summary>${title}</summary>`;
        for (const [key, value] of Object.entries(block[title])) {
            retValue += `<a class="button" href="${value}" target="_blank">${key}</a>`;
        };
        retValue += '</details><hr>';
    };
    retValue = retValue.replace(/<hr>$/, '');
    $(element).html(retValue);
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
    }
    catch (e) {};
};
$(window).on('hashchange', function() {
    $('.hash').removeClass('hash');
    hashChanged();
});



// 获取正常状态的简体中文论坛
const CSForum = [{"简体中文论坛": {}}];
for (const forum of db_forums) {
    if (forum.state == 'up') {
        CSForum[0]["简体中文论坛"][forum.title] = forum.url;
    };
};



// 页面加载完成事件
$(document).ready(function() {
    $('.utility-website-list').text(JSON.stringify(utilityWebsite));
    $('.forum-list').text(JSON.stringify([].concat.apply(CSForum, otherForum)));
    deviceChanged();
    autoFoldingChanged();
    searchableChanged();
    $('.pre-flex').each(function(index, element) {
        pre_list(element);
    });
    hashChanged();
    $('select').each(function(index, element) {
        autoFolding({target: element});
    });
    $('#device-list').each(function(index, element) {
        const e = $(element).find('.custom-item');
        $(element).children().click(function() {
            const value = $(this).attr('label');
            $('#device-list').val(value);
            deviceChanged();
            $('#device-list').val($(this).find('div div:first-child').text());
            $(element).click();

        });
    });
    $('.wait').removeAttr('class').removeAttr('style');
    try { document.querySelector(decodeURI(location.hash)).scrollIntoView(); }
    catch (e) {};
});