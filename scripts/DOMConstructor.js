class DOMLauncherList {
    constructor() {}

    static item(item) {
        item = {
            title: "未命名",
            download: "https://www.example.com",
            version: "1.0.0",
            url: "https://www.example.com",
            dev: {
                download: "https://www.example.com",
                version: "1.0.0.1"
            },
            __domID: undefined,
            __domClass: undefined,
            ...item
        }

        let download, devDownload, url;
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
        const convert = (URL, arg) => (URL == 'https://www.example.com/' || URL.host == '') ? '' : `${arg}="${URL}"`;
        const _download = convert(download, 'data-download');
        const _devDownload = convert(devDownload, 'data-dev-download');
        const _url = convert(url, 'data-url');
        return `<option ${_download} ${_devDownload} ${_url}>${item.title}</option>`;
    }

    static deviceList(target = '') {
        let dom = '';
        for (const [deviceName, supportedDevice] of supportedDevices) {
            dom += `<select name="launcher" class="launcher ${deviceName}" style="display: none;">${
                this.list(eval(deviceName + 'Launcher'))
            }</select>`;
        }
        return dom;
    }

    static list(items = []) {
        let dom = '<option>【待选择】</option>';
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
        dom += '<option value="unsupported" disabled hidden>不支持</option>' +
        '<option value="unknown" selected disabled hidden>未知</option>';
        $('#device').html(dom);

        const UA = navigator.userAgent;
        const getDeviceIndex = () => {
            switch (device.os) {
                case 'android':
                    return 0;
                case 'ios':
                    return 1;
                case 'windows':
                    if (UA.indexOf('Windows NT 6.1') > -1 || UA.indexOf('Windows 7') > -1 || UA.indexOf('Windows NT 8') > -1) return 2;
                    if (UA.indexOf('Windows NT 10') > -1 || UA.indexOf('Windows NT 11') > -1) return 3;
                    return 5;
                case 'macos':
                    return 4;
                case 'unknown':
                    return 6;
                default:
                    return 5;
            }
        }

        $('#device').change(() => {
            $('#resource-container').show();
            if ($('#device').get(0).selectedIndex > 4) {
                $('#resource-container').hide();
            }
        });

        $('#device').get(0).selectedIndex = getDeviceIndex();
        if (getDeviceIndex() > 4) {
            $('#resource-container').hide();
        }
    }
}