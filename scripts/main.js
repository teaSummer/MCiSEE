const supportedDevices = [
    // | 最早名称 |      显示名称      |
    [   'Android',  'Android'         ],
    [       'iOS',  'iOS/iPad'        ],
    [  'Windows7',  'Windows 7/8/8.1' ],
    [ 'Windows10',  'Windows 10/11'   ],
    [     'macOS',  'macOS'           ],
];
DOMDeviceList.show();

$('#launcher-container').html(DOMLauncherList.deviceList());

const deviceChanged = (() => {
    $('.device-diff select').each((index, element) => {
        $(element).hide();
        const select = $('.' + $('#device').val());
        select.val('【待选择】');
        select.show();
    });
    try { launcherChanged(); } catch (e) {}
});
$('#device').change(deviceChanged);

const launcherChanged = (() => {
    for (const attribute of ['data-download', 'data-dev-download', 'data-url']) {
        const target = $(event.target)[0];
        let URL = $(target[target.selectedIndex]).attr(attribute);
        if (attribute.endsWith('download') && $('#proxy').is(':checked') && String(URL).startsWith('https://github.com/')) {
            URL = 'https://mirror.ghproxy.com/' + URL;
        }
        const launcher = $(`.${attribute}-launcher`);
        launcher.hide();
        if (URL) {
            launcher.attr('href', URL);
            launcher.show();
        }
    }
});
$('.launcher').change(launcherChanged);

const proxyChanged = (() => {
    if ($('#proxy').is(':checked')) {
        $('.launcher-download>a.button').each((index, element) => {
            const link = $(element).attr('href');
            if (link.startsWith('https://github.com/')) $(element).attr('href', 'https://mirror.ghproxy.com/' + link);
        })
    } else {
        $('.launcher-download>a.button').each((index, element) => {
            $(element).attr('href', $(element).attr('href').replace(/^https:\/\/mirror\.ghproxy\.com\//, ''));
        })
    }
});
$('#proxy').change(proxyChanged);
