const init = ((file) => {
    return JSON5.parse($.ajax({
        url: `data/${file}.json5`,
        dataType: 'json',
        async: false
    }).responseText);
});

// 启动器数据
const launcherData = init('launcher');
// 各平台启动器数据
const AndroidLauncher = launcherData['AndroidLauncher'];
const iOSLauncher = launcherData['iOSLauncher'];
const WindowsLauncher = launcherData['WindowsLauncher'];
const macOSLauncher = launcherData['macOSLauncher'];
const LinuxLauncher = launcherData['LinuxLauncher'];

// 各类与搜索有关的站点数据
const searchable = init('searchable');

// 各类网站数据
const utilityWebsite = init('utilityWebsite');
const otherForum = init('otherForum');
