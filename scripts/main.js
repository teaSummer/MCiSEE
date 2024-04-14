let searchKeyword = '';

const supportedDevices = [
    // |   最早名称   |         显示名称         |
    [      'Android',  'Android/HarmonyOS' ],
    [          'iOS',  'iOS/iPad'          ],
    [      'Windows',  'Windows'           ],
    [        'macOS',  'macOS'             ],
];
DOMDeviceList.show();


const createSuperLabel = ((url, id) => {
    const a = `<a href="" target="_blank" id="${id}">`;
    $('body').after(a);
    const aElement = $(`#${id}`);
    aElement.attr('href', url);
    aElement[0].click();
    aElement.remove();
});


const deviceChanged = ((event) => {
    $('.device-diff select').each((index, element) => {
        $(element).hide();
        const select = $('.' + $('#device').val());
        select.val('?');
        select.show();
    });
    try { launcherChanged(); } catch (e) {}
});
$('#device').change(deviceChanged);


$('.launcher-list').html(DOMLauncherList.deviceList());

const launcherChanged = ((event) => {
    const target = $( $(event.target)[0][$(event.target)[0].selectedIndex] );
    const dataTitle = target.attr('data-title');
    $('.launcher-title').text('');
    if (dataTitle && dataTitle != target.val()) {
        $('.launcher-title').text(dataTitle);
    }
    for (const attribute of ['data-download', 'data-dev-download', 'data-url']) {
        const button = $(`.${attribute}-launcher`);
        let URL = target.attr(attribute);
        if (attribute.endsWith('download')) {
            if ($('.github-proxy').is(':checked') && String(URL).startsWith('https://github.com/')) {
                URL = 'https://mirror.ghproxy.com/' + URL;
            }
            const downloadSVG = '<span class="svg right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="56"></path></svg></span>';
            const emptyrm = ((ver) => {
                if (ver === void 0) {
                    button.removeAttr('href');
                    button.removeAttr('title');
                    button.html('');
                }
            });
            if (attribute == 'data-download') {
                const version = target.attr('data-version');
                button.html(downloadSVG + '下载最新稳定版');
                button.attr('title', '下载尽可能新的稳定正式版');
                if (version != 'latest') {
                    button.html(downloadSVG + '下载稳定版 ' + version);
                    button.attr('title', '下载稳定正式版 ' + version);
                }
                emptyrm(version);
            } else {
                const devVersion = target.attr('data-dev-version');
                button.html(downloadSVG + '下载最新开发版');
                button.attr('title', '下载尽可能新的开发测试版');
                if (devVersion != 'latest') {
                    button.html(downloadSVG + '下载开发版 ' + devVersion);
                    button.attr('title', '下载开发测试版 ' + devVersion);
                }
                emptyrm(devVersion);
            }
        }
        button.hide();
        if (URL) {
            button.attr('href', URL);
            button.show();
        }
    }
});
$('.launcher').change(launcherChanged);


const proxyChanged = ((event) => {
    localStorage.setItem('github-proxy', $('.github-proxy').is(':checked'));
    try {
        if ($('.github-proxy').is(':checked')) {
            $('.launcher-download>a.button').each((index, element) => {
                const link = $(element).attr('href');
                if (link.startsWith('https://github.com/')) $(element).attr('href', 'https://mirror.ghproxy.com/' + link);
            });
        } else {
            $('.launcher-download>a.button').each((index, element) => {
                $(element).attr('href', $(element).attr('href').replace(/^https:\/\/mirror\.ghproxy\.com\//, ''));
            });
        }
    } catch (e) {}
});
$('.github-proxy').change(proxyChanged);


$('#searchable-list').html(DOMSearchableList.list(searchable));

const searchableChanged = ((event) => {
    const target = $( $(event.target)[0][$(event.target)[0].selectedIndex] );
    searchKeyword = target.attr('data-search');
    const note = target.attr('data-note');
    const explain = target.attr('data-explain');
    $('.searchable-input').attr('placeholder', ` 从 ${note} 中搜索 ...`);
    $('.searchable-label').html(`<a class="searchable-goto" href="${target.attr('data-url')}" title="${explain}" target="_blank">跳转 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path><path d="M15 3h6v6"></path><path d="M10 14L21 3"></path></svg></a>`);
});
$('#searchable-list').change(searchableChanged);

$('.searchable-form').submit((event) => {
    event.preventDefault();
    const input = $('.searchable-input').val().trim();
    const search = encodeURI(input);
    let url = searchKeyword.replace(encodeURI('<T>'), search);
    if ($('.searchable-direct').is(':checked') && url.indexOf('&fulltext=search') != -1) {
        url = url.replace(/&[^&]*$/, '');
    }
    if (input != '') createSuperLabel(url, 'searchable-search');
});
$('.searchable-input').on('input', ((event) => {
    $('.searchable-button').removeClass('disabled');
    if ($('.searchable-input').val().trim() == '') {
        $('.searchable-button').addClass('disabled');
    }
}));

$('.searchable-direct').change(() => {
    localStorage.setItem('searchable-direct', $('.searchable-direct').is(':checked'));
});


if (localStorage.getItem('github-proxy') == 'false') $('.github-proxy').attr('checked', false);
if (localStorage.getItem('searchable-direct') == 'false') $('.searchable-direct').attr('checked', false);

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
        source: (query, syncResults, asyncResults) => {
            let note = $( $('#searchable-list')[0][$('#searchable-list')[0].selectedIndex] ).attr('data-note');
            let search = encodeURI($('.searchable-input').val().trim());
            let URL;
            switch (note) {
                case 'Wiki':
                    URL = `https://zh.minecraft.wiki/api.php?action=opensearch&search=${search}&namespace=*&limit=11`;
                    break;
                case 'BWiki':
                    URL = `https://wiki.biligame.com/mc/api.php?action=opensearch&search=${search}&namespace=*&limit=11`;
                    break;
                default:
                    return asyncResults([]);
            }
            return $.ajax({
                url: URL,
                type: 'get',
                cache: true,
                data: {keyword: query},
                dataType: "jsonp",
                success: (result) => {
                    return asyncResults(result[1]);
                }
            });
        }
    }
);


$(document).ready(() => {
    deviceChanged();
    searchableChanged({target: $('#searchable-list')});
    $('.wait').show();
    $('.wait').removeClass('wait');
});