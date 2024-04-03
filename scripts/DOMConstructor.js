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
        dom += `<option value="unsupported" disabled hidden>不支持</option>
                <option value="unknown" selected disabled hidden>未知</option>`;
        $('#device').html(dom);

        const UA = navigator.userAgent;
        const getDevice = (() => {
            switch (device.os) {
                case 'android':
                    return 'Android';
                case 'ios':
                case 'ipad':
                    return 'iOS';
                case 'windows':
                    if (UA.indexOf('Windows NT 6.1') > -1 || UA.indexOf('Windows 7') > -1 || UA.indexOf('Windows NT 8') > -1) return 'Windows7';
                    if (UA.indexOf('Windows NT 10') > -1 || UA.indexOf('Windows NT 11') > -1) return 'Windows10';
                    return 'unsupported';
                case 'macos':
                    return 'macOS';
                case 'unknown':
                    return 'unknown';
                default:
                    return 'unsupported';
            }
        });

        $('#device').change(() => {
            $('#resource-container').show();
            if ($('#device')[0].selectedIndex > 4) {
                $('#resource-container').hide();
            }
        });

        $("#device").val(getDevice());
        if ($('#device')[0].selectedIndex > 4) {
            $('#resource-container').hide();
        }
    }
}