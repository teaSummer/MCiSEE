// 适用于 安卓手机/鸿蒙手机/安卓平板/鸿蒙平板 的启动器
const AndroidLauncher = [
    {
        title: "Fold Craft Launcher",
        subtitle: "FCL",
        download: "https://github.com/FCL-Team/FoldCraftLauncher/releases/download/1.1.6/FCL-release-1.1.6-all.apk",
        version: "1.1.6",
        url: "https://github.com/FCL-Team/FoldCraftLauncher"
    },
    {
        title: "PojavLauncher",
        download: "https://lz.qaiu.top/parser?url=https://share.feijipan.com/s/xpA9fMeC",
        version: "Edelweiss",
        url: "https://github.com/PojavLauncherTeam/PojavLauncher"
    },
    {
        title: "Hello Minecraft! Launcher:Pocket Edition",
        subtitle: "HMCL-PE",
        download: "https://github.com/HMCL-dev/HMCL-PE/releases/download/2.0.8/HMCLPE-release.apk",
        version: "2.0.8",
        url: "https://github.com/HMCL-dev/HMCL-PE"
    },
    {
        title: "ColorMC",
        download: "https://github.com/Coloryr/ColorMC.Android/releases/download/A21/colormc-a21-android.zip",
        version: "A21",
        url: "https://github.com/Coloryr/ColorMC.Android"
    }
];

// 适用于 苹果手机/苹果平板 的启动器
const iOSLauncher = [
    {
        title: "PojavLauncher",
        download: "https://github.com/PojavLauncherTeam/PojavLauncher_iOS/releases/download/v2.2/net.kdt.pojavlauncher-2.2-ios.ipa",
        version: "v2.2 Deepslate",
        url: "https://github.com/PojavLauncherTeam/PojavLauncher_iOS"
    }
];

// 适用于 Windows电脑 的启动器
const WindowsLauncher = [
    {
        title: "Minecraft 启动器",
        download: "https://launcher.mojang.com/download/MinecraftInstaller.exe",
        version: "latest",
        url: "https://www.minecraft.net/zh-hans"
    },
    {
        title: "Hello Minecraft! Launcher",
        subtitle: "HMCL",
        download: "https://github.com/HMCL-dev/HMCL/releases/download/release-3.5.7/HMCL-3.5.7.exe",
        version: "3.5.7",
        url: "https://github.com/HMCL-dev/HMCL",
        dev: {
            download: "https://github.com/HMCL-dev/HMCL/releases/download/v3.5.7.245/HMCL-3.5.7.245.exe",
            version: "3.5.7.245"
        }
    },
    {
        title: "Plain Craft Launcher 2",
        subtitle: "PCL2",
        download: "https://lz.qaiu.top/parser?url=https://ltcat.lanzoum.com/ilOSm1uci9de",
        version: "2.7.1 (2.7.1.1)",
        url: "https://afdian.net/@LTCat"
    },
    {
        title: "BakaXL",
        download: "https://contents.baka.zone/Release/BakaXL_Public_Ver_3.5.1.0.exe",
        version: "3.51",
        url: "https://www.bakaxl.com"
    },
    {
        title: "ColorMC",
        download: "https://github.com/Coloryr/ColorMC/releases/download/A24/colormc-x64-aot.msi",
        version: "A24",
        url: "https://github.com/Coloryr/ColorMC"
    },
    {
        title: "X Minecraft Launcher",
        subtitle: "XMCL",
        download: "https://github.com/Voxelum/x-minecraft-launcher/releases/download/v0.43.3/xmcl-0.43.3-win32-x64.zip",
        version: "0.43.3",
        url: "https://github.com/voxelum/x-minecraft-launcher"
    },
    {
        title: "我的世界启动器",
        download: "https://x19.gdl.netease.com/MCLauncher_1.14.0.36188.exe",
        version: "1.14.0.36188",
        url: "https://mc.163.com"
    },
    {
        title: "MultiMC",
        subtitle: "MMC",
        download: "https://files.multimc.org/downloads/mmc-develop-win32.zip",
        version: "latest",
        url: "https://github.com/MultiMC/Launcher"
    },
    {
        title: "Minecraft 启动器 (旧版)",
        version: "latest",
        download: "https://launcher.mojang.com/download/MinecraftInstaller.msi",
        url: "https://www.minecraft.net/zh-hans"
    },
    {
        title: "Plain Craft Launcher 1",
        subtitle: "PCL1",
        download: "https://lz.qaiu.top/parser?url=https://indragon.lanzoue.com/iPF341vfkzsb&pwd=pcl1",
        version: "1.0.9",
        url: "https://gitee.com/Cmbself/PCL1"
    }
];

// 适用于 苹果电脑 的启动器
const macOSLauncher = [
    {
        title: "Minecraft 启动器",
        download: "https://launcher.mojang.com/download/Minecraft.dmg",
        version: "latest",
        url: "https://www.minecraft.net/zh-hans"
    },
    {
        title: "Hello Minecraft! Launcher",
        subtitle: "HMCL",
        download: "https://github.com/HMCL-dev/HMCL/releases/download/release-3.5.7/HMCL-3.5.7.jar",
        version: "3.5.7",
        url: "https://github.com/HMCL-dev/HMCL",
        dev: {
            download: "https://github.com/HMCL-dev/HMCL/releases/download/v3.5.7.245/HMCL-3.5.7.245.jar",
            version: "3.5.7.245"
        }
    },
    {
        title: "ColorMC",
        download: "https://github.com/Coloryr/ColorMC/releases/download/A24/colormc-a24-1-x86_64-aot.pkg.tar.zst",
        version: "A24",
        url: "https://github.com/Coloryr/ColorMC"
    },
    {
        title: "X Minecraft Launcher",
        subtitle: "XMCL",
        download: "https://github.com/Voxelum/x-minecraft-launcher/releases/download/v0.43.3/xmcl-0.43.3.dmg",
        version: "0.43.3",
        url: "https://github.com/voxelum/x-minecraft-launcher"
    },
    {
        title: "MultiMC",
        subtitle: "MMC",
        download: "https://files.multimc.org/downloads/mmc-develop-osx64.tar.gz",
        version: "latest",
        url: "https://github.com/MultiMC/Launcher"
    }
];