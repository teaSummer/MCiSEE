class DOMLauncherList {
    constructor() {};

    static item(item) {
        item = {
            title: "Launcher",
            abbr: item.title,
            download: "https://www.example.com",
            version: "1.0.x",
            url: "https://www.example.com",
            dev: {
                download: "https://www.example.com",
                version: "1.0.x.x"
            },
            ...item
        };

        let download, devDownload, url;
        const version = item.version;
        const devVersion = item.dev.version;
        try {
            download = new URL(item.download);
        } catch (err) {
            download = {host: item.download};
        };
        try {
            devDownload = new URL(item.dev.download);
        } catch (err) {
            devDownload = {host: item.dev.download};
        };
        try {
            url = new URL(item.url);
        } catch (err) {
            url = {host: item.url};
        };
        const convert = ((url, arg) => {
            return (url == 'https://www.example.com/' || url.host == '') ? '' : `${arg}="${url}"`;
        });
        const _title = ((item.title == item.abbr) ? '' : `data-title="${item.title}"`);
        const _abbr = `data-abbr="${item.abbr}"`;
        const _download = convert(download, 'data-download');
        const _devDownload = convert(devDownload, 'data-dev-download');
        const _backupDownload = convert(download, 'data-backup-download');
        const _backupDevDownload = convert(devDownload, 'data-backup-dev-download');
        const _url = convert(url, 'data-url');
        const _version = (version == '1.0.x' ? '' : `data-version="${version}"`);
        const _devVersion = (devVersion == '1.0.x.x' ? '' : `data-dev-version="${devVersion}"`);
        const properties = `${_title} ${_abbr} ${_download} ${_devDownload} ${_version} ${_devVersion} ${_url} ${_backupDownload} ${_backupDevDownload} data-device="${linkDeviceName}"`;
        return `<mdui-menu-item label="${item.abbr}" ${properties}><div slot="custom" class="custom-item"><div>${item.abbr}</div><div class="secondary">${_title.slice(12, -1)}</div></div></mdui-menu-item>`;
    };

    static deviceList(target = '') {
        let dom = '';
        for (const [device, _] of supportedDevices) {
            window.linkDeviceName = device;
            dom += `<mdui-select name="launcher-list" class="launcher-list ${device}" style="/*display: none;" value="?" placement="bottom" variant="outlined" required>${
                this.list(eval(device + 'Launcher'))
            }</mdui-select>`;
        };
        return dom;
    };

    static list(items = []) {
        let dom = '';
        items.forEach((e) => {
            dom += DOMLauncherList.item(e);
        });
        dom += '<mdui-menu-item value="?" disabled hidden><div slot="custom" class="custom-item"><div al="unselected"></div></div></mdui-menu-item>';
        return dom;
    };
};

class DOMSearchableList {
    constructor() {};

    static item(item) {
        item = {
            title: "Searchable",
            abbr: item.title,
            search: "https://www.example.com",
            note: "",
            url: "https://www.example.com",
            ...item
        };

        let search, url;
        try {
            search = new URL(item.search);
        } catch (err) {
            search = {host: item.search};
        };
        try {
            url = new URL(item.url);
        } catch (err) {
            url = {host: item.url};
        };
        const convert = ((url, arg) => {
            return (url == 'https://www.example.com/' || url.host == '') ? '' : `${arg}="${url}"`;
        });
        const _title = `data-title="${item.title}"`;
        const _search = convert(search, 'data-search');
        const _abbr = `data-abbr="${item.abbr}"`;
        const _note = `data-note="${item.note}"`;
        const _url = convert(url, 'data-url');
        const properties = `${_title} ${_search} ${_abbr} ${_note} ${_url}`;
        return `<mdui-menu-item value="${item.abbr}" ${properties}><div slot="custom" class="custom-item"><div>${item.title}${item.abbr == '' || item.abbr == item.title ? '' : ` (${item.abbr})`}</div></div></mdui-menu-item>`;
    };

    static list(items = []) {
        let dom = '';
        items.forEach((e) => {
            dom += DOMSearchableList.item(e);
        });
        return dom;
    };
};

class DOMDeviceList {
    constructor() {};

    static show() {
        let dom = '';
        for (const [device, deviceInfo] of supportedDevices) {
            dom += `<mdui-menu-item label="${device}"><div slot="custom"><div>${deviceInfo}</div><div class="secondary" al="${device}.tip"></div></div></mdui-menu-item>`;
        };
        dom += `<mdui-menu-item value="unsupported" disabled hidden><div slot="custom" class="custom-item"><div al="unsupported"></div></div></mdui-menu-item>
                <mdui-menu-item value="unknown" selected disabled hidden><div slot="custom" class="custom-item"><div al="unknown"></div></div></mdui-menu-item>`;
        $('.device-list').html(dom);

        const UA = navigator.userAgent;
        const getDevice = (() => {
            const device = browser();
            switch (device.system) {
                case 'HarmonyOS':
                    if (device.device == 'Desktop') return 'unsupported';
                    return 'Android';
                case 'iPad':
                    if (device.device == 'Desktop') return 'unsupported';
                    return 'iOS';
                case 'Android':
                case 'iOS':
                case 'macOS':
                    if (device.device == 'Desktop') return 'unsupported';
                    return device.system;
                case 'Windows':
                    if (device.device != 'Desktop') return 'unsupported';
                    return 'Windows';
                case 'Linux':
                case 'Ubuntu':
                case 'FreeBSD':
                case 'Debian':
                    return 'Linux';
                default:
                    return 'unsupported';
            };
        });

        const toHide = 4;
        $('.device-list').val(getDevice());
        if ($('.device-list')[0].selectedIndex > toHide) {
            $('.app-container').hide();
        };
    };
};