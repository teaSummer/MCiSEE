class DOMLauncherList {
    constructor() {};

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
        };

        let download, devDownload, url;
        const version = item.version;
        const devVersion = item.dev.version;
        try {
            download = new URL(item.download);
        } catch (e) {
            download = {host: item.download};
        };
        try {
            devDownload = new URL(item.dev.download);
        } catch (e) {
            devDownload = {host: item.dev.download};
        };
        try {
            url = new URL(item.url);
        } catch (e) {
            url = {host: item.url};
        };
        const convert = function(URL, arg) {
            return (URL == 'https://www.example.com/' || URL.host == '') ? '' : `${arg}="${URL}"`;
        };
        const _title = `data-title="${item.title}"`;
        const _download = convert(download, 'data-download');
        const _devDownload = convert(devDownload, 'data-dev-download');
        const _backupDownload = convert(download, 'data-backup-download');
        const _backupDevDownload = convert(devDownload, 'data-backup-dev-download');
        const _url = convert(url, 'data-url');
        const _version = (version == '1.0.x' ? '' : `data-version="${version}"`);
        const _devVersion = (devVersion == '1.0.x.x' ? '' : `data-dev-version="${devVersion}"`);
        const properties = `${_title} ${_download} ${_devDownload} ${_version} ${_devVersion} ${_url} ${_backupDownload} ${_backupDevDownload}`;
        return `<option ${properties}>${item.subtitle}</option>`;
    };

    static deviceList(target = '') {
        let dom = '';
        for (const [deviceName, supportedDevice] of supportedDevices) {
            dom += `<select name="launcher-list" class="launcher-list ${deviceName} normal fold" style="display: none;">${
                this.list(eval(deviceName + 'Launcher'))
            }</select>`;
        };
        return dom;
    };

    static list(items = []) {
        if (items.length == 0) return '<option value="?">【暂无】</option>';
        let dom = '<option value="?">【待选择】</option>';
        items.forEach(function(e) {
            dom += DOMLauncherList.item(e);
        });
        return dom;
    };
};

class DOMSearchableList {
    constructor() {};

    static item(item) {
        item = {
            title: "未命名",
            subtitle: item.title,
            search: "https://www.example.com",
            note: "",
            url: "https://www.example.com",
            __domID: undefined,
            __domClass: undefined,
            ...item
        };

        let search, url;
        try {
            search = new URL(item.search);
        } catch (e) {
            search = {host: item.search};
        };
        try {
            url = new URL(item.url);
        } catch (e) {
            url = {host: item.url};
        };
        const convert = function(URL, arg) {
            return (URL == 'https://www.example.com/' || URL.host == '') ? '' : `${arg}="${URL}"`;
        };
        const _title = `data-title="${item.title}"`;
        const _search = convert(search, 'data-search');
        const _subtitle = `data-subtitle="${item.subtitle}"`;
        const _note = `data-note="${item.note}"`;
        const _url = convert(url, 'data-url');
        const properties = `${_title} ${_search} ${_subtitle} ${_note} ${_url}`;
        return `<option ${properties}>${item.title}${item.subtitle == '' || item.subtitle == item.title ? '' : ` (${item.subtitle})`}</option>`;
    };

    static list(items = []) {
        if (items.length == 0) return '<option value="?">【无】</option>';
        let dom = '';
        items.forEach(function(e) {
            dom += DOMSearchableList.item(e);
        });
        return dom;
    };
};

class DOMDeviceList {
    constructor() {};

    static show() {
        let dom = '';
        for (const [deviceName, supportedDevice] of supportedDevices) {
            dom += `<option value="${deviceName}">${supportedDevice}</option>`;
        };
        dom += `<option value="unsupported" disabled="disabled" hidden="hidden">不支持</option>
                <option value="unknown" selected="selected" disabled="disabled" hidden="hidden">未知</option>`;
        $('#device-list').html(dom);

        const UA = navigator.userAgent;
        const getDevice = function() {
            const device = browser();
            if (device.device != 'Desktop') {
                $('.auto-folding').parent().hide();
                localStorage.removeItem('auto-folding');
            }
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
        };

        const toHide = 4;
        $('#device-list').change(function() {
            $('.app-container').show();
            if ($(this)[0].selectedIndex > toHide) {
                $('.app-container').hide();
            };
        });
        $('#device-list').val(getDevice());
        if ($('#device-list')[0].selectedIndex > toHide) {
            $('.app-container').hide();
        };
    };
};