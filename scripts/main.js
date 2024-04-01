const supportedDevices = [
    // | 最早名称 |      显示名称      |
    [   'Android',  'Android'         ],
    [       'iOS',  'iOS'             ],
    [  'Windows7',  'Windows 7/8/8.1' ],
    [ 'Windows10',  'Windows 10/11'   ],
    [     'macOS',  'macOS'           ],
];
DOMDeviceList.show();

$('#launcher-container').html(DOMLauncherList.deviceList());

const deviceChanged = () => {
    for (const diffSelect of document.querySelectorAll('.device-diff select')) {
        diffSelect.style.display = 'none';
        const select = $('.' + document.querySelector('#device').value);
        select.get(0).selectedIndex = 0;
        select.show();
    }
    try {
        launcherChanged();
    } catch (e) {}
}
$('#device').change(deviceChanged);

const launcherChanged = () => {
    for (const attribute of ['data-download', 'data-dev-download', 'data-url']) {
        let URL = event.target.options[event.target.selectedIndex].getAttribute(attribute);
        if (attribute.endsWith('download') && $('#proxy').get(0).checked && String(URL).startsWith('https://github.com/')) {
            URL = 'https://mirror.ghproxy.com/' + URL;
        }
        const launcher = $(`.${attribute}-launcher`);
        launcher.hide();
        if (URL) {
            launcher.show();
            launcher.attr('href', URL);
        }
    }
}
$('.launcher').change(launcherChanged);

$('#proxy').change(() => {
    if ($('#proxy').get(0).checked) {
        $('.download>a.button').each((index, element) => {
            const link = $(element).attr('href');
            if (link.startsWith('https://github.com/')) $(element).attr('href', 'https://mirror.ghproxy.com/' + link);
        })
    } else {
        $('.download>a.button').each((index, element) => {
            $(element).attr('href', $(element).attr('href').replace(/^https:\/\/mirror\.ghproxy\.com\//, ''));
        })
    }
});