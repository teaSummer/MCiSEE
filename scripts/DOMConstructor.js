const safeUrl = (url) => {
    try {
        return new URL(url);
    } catch (err) {
        return;
    }
}

class DOMLauncherList {
    constructor() {}

    static item(item) {
        item = {
            title: "", // Launcher
            abbr: item.title, // L
            download: "", // https://www.example.com
            version: "", // 1.0.x
            github: "", // https://github.com/example
            url: "", // https://www.example.com
            dev: {
                download: "", // https://www.example.com
                version: "" // 1.0.x.x
            },
            ...item
        }
        const download = safeUrl(item.download);
        const devDownload = safeUrl(item.dev.download);

        const attrList = [
            ['title', item.title],
            ['abbr', item.abbr],
            ['download', download],
            ['dev-download', devDownload],
            ['backup-download', download],
            ['backup-dev-download', devDownload],
            ['github', safeUrl(item.github)],
            ['url', safeUrl(item.url)],
            ['version', item.version],
            ['dev-version', item.dev.version],
            ['device', linkDeviceName]
        ];

        const properties = attrList.map(([attr, value]) => value ? `data-${attr}="${value}"` : '').filter(Boolean).join(' ');
        return `<mdui-menu-item label="${item.abbr}" ${properties}><div slot="custom" class="custom-item"><div>${item.abbr}</div><div class="secondary">${item.title}</div></div></mdui-menu-item>`;
    }

    static deviceList(target = '') {
        let dom = '';
        for (const [device, _] of supportedDevices) {
            window.linkDeviceName = device;
            dom += `<mdui-select name="launcher-list" class="launcher-list ${device}" style="display: none;" value="?" placement="bottom" variant="outlined" required>${
this.list(eval(device + 'Launcher'))
}</mdui-select>`;
        }
        return dom;
    }

    static list(items = []) {
        const staticItem = '<mdui-menu-item value="?" disabled hidden><div slot="custom" class="custom-item"><div al="unselected"></div></div></mdui-menu-item>';
        const itemList = items.map(e => DOMLauncherList.item(e));
        return itemList.join('') + staticItem;
    }
}

class DOMSearchableList {
    constructor() {}

    static item(item) {
        item = {
            title: "", // Searchable
            abbr: item.title, // S
            search: "", // https://www.example.com
            note: "", // 这是一个网页
            url: "", // https://www.example.com
            ...item
        }
        const attrList = [
            ['title', item.title],
            ['search', safeUrl(item.search)],
            ['abbr', item.abbr],
            ['note', item.note],
            ['url', safeUrl(item.url)]
        ];

        const properties = attrList.map(([attr, value]) => value ? `data-${attr}="${value}"` : '').filter(Boolean).join(' ');
        const abbrDisplay = item.abbr && item.abbr != item.title ? ` (${item.abbr})` : '';
        return `<mdui-menu-item value="${item.abbr}" ${properties}><div slot="custom" class="custom-item"><div>${item.title}${abbrDisplay}</div></div></mdui-menu-item>`;
    }

    static list(items = []) {
        return items.map(e => DOMSearchableList.item(e)).join('');
    }
}

class DOMDeviceList {
    constructor() {}

    static show() {
        const createMenuItem = (device, deviceInfo) => `<mdui-menu-item label="${device}"><div slot="custom"><div>${deviceInfo}</div><div class="secondary" al="${device}.tip"></div></div></mdui-menu-item>`;
        let domItems = supportedDevices.map(([device, deviceInfo]) => createMenuItem(device, deviceInfo)).join('');
        domItems += `<mdui-menu-item value="unsupported" disabled hidden><div slot="custom" class="custom-item"><div al="unsupported"></div></div></mdui-menu-item><mdui-menu-item value="unknown" selected disabled hidden><div slot="custom" class="custom-item"><div al="unknown"></div></div></mdui-menu-item>`;
        $('.device-list').html(domItems);
        const UA = navigator.userAgent;
        const getDevice = (() => {
            const device = browser.parse();
            const isDesktop = device.device == 'Desktop';
            switch (device.system) {
                case 'HarmonyOS':
                case 'iPad':
                    return isDesktop ? 'unsupported' : 'iOS';
                case 'Android':
                case 'iOS':
                case 'macOS':
                    return isDesktop ? 'unsupported' : device.system;
                case 'Windows':
                    return isDesktop ? 'Windows' : 'unsupported';
                case 'Linux':
                case 'Ubuntu':
                case 'FreeBSD':
                case 'Debian':
                    return 'Linux';
                default:
                    return 'unsupported';
            }
        });

        const toHide = 4;
        $('.device-list').val(getDevice());
        if ($('.device-list')[0].selectedIndex > toHide) {
            $('.app-container').hide();
        }
    }
}