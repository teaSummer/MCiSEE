const supportedDevices = [
    // |   最早名称   |         显示名称         |
    [      'Android',  'Android/HarmonyOS' ],
    [          'iOS',  'iOS/iPad'          ],
    [      'Windows',  'Windows'           ],
    [        'macOS',  'macOS'             ],
];
DOMDeviceList.show();

const createSuperLabel = ((url, id) => {
    let a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("id", id);
    if(!document.getElementById(id)) {
        document.body.appendChild(a);
    }
    a.click();
});

$('.launcher-list').html(DOMLauncherList.deviceList());

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
});
$('.github-proxy').change(proxyChanged);

$('.wiki-input').on('input', ((event) => {
    $('.wiki-button').removeClass('disabled');
    if ($('.wiki-input').val().trim() == '') {
        $('.wiki-button').addClass('disabled');
    }
}));

$('.wiki-form').submit((event) => {
    event.preventDefault();
    const search = encodeURI(decodeURI($('.wiki-input').val()));
    let url = `https://zh.minecraft.wiki/?search=${search}&title=Special%3A%E6%90%9C%E7%B4%A2&fulltext=search}`;
    if ($('.wiki-direct').is(':checked')) {
        url = url.replace(/&[^&]*$/, '');
    }
    if ($('.wiki-input').val().trim() != '') createSuperLabel(url, 'wiki-search');
});