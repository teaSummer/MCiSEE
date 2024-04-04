class DOMLauncherList {
    constructor() {}

    static item(item) {
        item = {
            title: "未命名",
            subtitle: item.title,
            download: "https://www.example.com",
            version: "1.0.x",
            url: "https://www.example.com",
            dev: {
                download: "https://www.example.com",
                version: "1.0.x.x"
            },
            __domID: undefined,
            __domClass: undefined,
            ...item
        }

        let download, devDownload, url;
        const version = item.version;
        const devVersion = item.dev.version;
        try {
            download = new URL(item.download);
        } catch (error) {
            download = {
                host: item.download
            }
        }
        try {
            devDownload = new URL(item.dev.download);
        } catch (error) {
            devDownload = {
                host: item.dev.download
            }
        }
        try {
            url = new URL(item.url);
        } catch (error) {
            url = {
                host: item.url
            }
        }
        const convert = (URL, arg) => ((URL == 'https://www.example.com/' || URL.host == '') ? '' : `${arg}="${URL}"`);
        const _title = `data-title="${item.title}"`;
        const _download = convert(download, 'data-download');
        const _devDownload = convert(devDownload, 'data-dev-download');
        const _url = convert(url, 'data-url');
        const _version = (version == '1.0.x' ? '' : `data-version="${version}"`);
        const _devVersion = (devVersion == '1.0.x.x' ? '' : `data-dev-version="${devVersion}"`);
        const properties = `${_title} ${_download} ${_devDownload} ${_version} ${_devVersion} ${_url}`;
        return `<option ${properties}>${item.subtitle}</option>`;
    }

    static deviceList(target = '') {
        let dom = '';
        for (const [deviceName, supportedDevice] of supportedDevices) {
            dom += `<select name="launcher" class="launcher ${deviceName}" hidden>${
                this.list(eval(deviceName + 'Launcher'))
            }</select>`;
        }
        return dom;
    }

    static list(items = []) {
        if (items.length == 0) return '<option value="?">【无】</option>';
        let dom = '<option value="?">【待选择】</option>';
        items.forEach(e => {
            dom += DOMLauncherList.item(e);
        });
        return dom;
    }
}


class DOMDeviceList {
    static show() {
        let dom = '';
        for (const [deviceName, supportedDevice] of supportedDevices) {
            dom += `<option value="${deviceName}">${supportedDevice}</option>`;
        }
        dom += `<option value="unsupported" disabled hidden>不支持</option>
                <option value="unknown" selected disabled hidden>未知</option>`;
        $('#device').html(dom);

        const UA = navigator.userAgent;
        const getDevice = (() => {
            const device = browser();
            let AB;
            if (device.architecture == 'x86') {
                if (device.bitness == '64') {
                    AB = 'X64';
                }
                else if (device.bitness == '32') {
                    AB = 'X86';
                }
            }
            else if (device.architecture == 'arm') {
                if (device.bitness == '64') {
                    AB = 'ARM64';
                }
                else if (device.bitness == '32') {
                    AB = 'ARM32';
                }
            }
            if (AB.startsWith('ARM')) AB = 'ARM';
            switch (device.system) {
                case 'Android':
                case 'HarmonyOS':
                case 'iOS':
                case 'iPad':
                case 'macOS':
                    if (device.device == 'Desktop') return 'unsupported';
                    return device.system;
                case 'Windows':
                    if (device.device != 'Desktop' || AB == 'ARM') return 'unsupported';
                    switch (device.systemVersion) {
                        case '10':
                        case '11':
                            return 'Windows10' + AB;
                        case '7':
                        case '8':
                        case '8.1':
                            return 'Windows7' + AB;
                        default:
                            return 'unsupported';
                    };
                default:
                    return 'unsupported';
            }
        });

        const toHide = 6;
        $('#device').change(() => {
            $('#resource-container').show();
            if ($('#device')[0].selectedIndex > toHide) {
                $('#resource-container').hide();
            }
        });
        $('#device').val(getDevice());
        if ($('#device')[0].selectedIndex > toHide) {
            $('#resource-container').hide();
        }
    }
}