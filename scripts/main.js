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

$('.launcher-list').html(DOMLauncherList.deviceList());
$('#searchable-list').html(DOMSearchableList.list(searchable));

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

const searchableChanged = ((event) => {
    const target = $( $(event.target)[0][$(event.target)[0].selectedIndex] );
    searchKeyword = target.attr('data-search');
    const note = target.attr('data-note');
    const explain = target.attr('data-explain');
    console.log(note, explain);
    if (note) {
        $('.searchable-label').html(`${target.attr('data-title')}（<a href="${target.attr('data-url')}" title="${explain}" target="_blank">${note} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" fill="currentColor"></path></svg></a>）`);
    }
});
$('#searchable-list').change(searchableChanged);

$('.searchable-input').on('input', ((event) => {
    $('.searchable-button').removeClass('disabled');
    if ($('.searchable-input').val().trim() == '') {
        $('.searchable-button').addClass('disabled');
    }
}));

$('.searchable-form').submit((event) => {
    event.preventDefault();
    const input = $('.searchable-input').val().trim()
    const search = encodeURI(decodeURI(input));
    console.log(searchKeyword);
    let url = searchKeyword.replace(encodeURI('<T>'), search);
    if ($('.searchable-direct').is(':checked') && url.indexOf('&fulltext=search') != -1) {
        url = url.replace(/&[^&]*$/, '');
    }
    if (input != '') createSuperLabel(url, 'searchable-search');
});

$('.searchable-direct').change(() => {
    localStorage.setItem('searchable-direct', $('.searchable-direct').is(':checked'));
});

if (localStorage.getItem('github-proxy') == 'false') $('.github-proxy').attr('checked', false);
if (localStorage.getItem('searchable-direct') == 'false') $('.searchable-direct').attr('checked', false);