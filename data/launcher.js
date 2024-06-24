// 适用于 安卓手机/鸿蒙手机/安卓平板/鸿蒙平板 的启动器
const AndroidLauncher = [
    {
        title: "Fold Craft Launcher",
        abbr: "FCL",
        download: "https://github.com/FCL-Team/FoldCraftLauncher/releases/download/1.1.6.2/FCL-release-1.1.6.2-all.apk",
        version: "1.1.6.2",
        url: "https://github.com/FCL-Team/FoldCraftLauncher"
    },
    {
        title: "PojavLauncher",
        download: "https://share.feijipan.com/s/QEBPJVqh",
        version: "foxglo",
        url: "https://github.com/PojavLauncherTeam/PojavLauncher"
    },
    {
        title: "Hello Minecraft! Launcher:Pocket Edition",
        abbr: "HMCL-PE",
        download: "https://github.com/HMCL-dev/HMCL-PE/releases/download/2.0.8/HMCLPE-release.apk",
        version: "2.0.8",
        url: "https://github.com/HMCL-dev/HMCL-PE"
    },
    {
        title: "ColorMC",
        url: "https://github.com/Coloryr/ColorMC.Android",
        dev: {
            download: "https://github.com/Coloryr/ColorMC.Android/releases/download/A21/colormc-a21-android.zip",
            version: "A21"
        }
    }
];


// 适用于 苹果手机/苹果平板 的启动器
const iOSLauncher = [
    {
        title: "PojavLauncher",
        download: "https://github.com/PojavLauncherTeam/PojavLauncher_iOS/releases/download/v2.2/net.kdt.pojavlauncher-2.2-ios.ipa",
        version: "2.2",
        url: "https://github.com/PojavLauncherTeam/PojavLauncher_iOS"
    }
];


// 适用于 Windows电脑 的启动器
const WindowsLauncher = [
    {
        title: "*国际版* Minecraft 启动器",
        abbr: "Minecraft 启动器",
        download: "https://launcher.mojang.com/download/MinecraftInstaller.exe",
        version: "latest",
        url: "https://www.minecraft.net/zh-hans"
    },
    {
        title: "Hello Minecraft! Launcher",
        abbr: "HMCL",
        download: "https://github.com/HMCL-dev/HMCL/releases/download/release-3.5.8/HMCL-3.5.8.exe",
        version: "3.5.8",
        url: "https://github.com/HMCL-dev/HMCL",
        dev: {
            download: "https://github.com/HMCL-dev/HMCL/releases/download/v3.5.8.249/HMCL-3.5.8.249.exe",
            version: "3.5.8.249"
        }
    },
    {
        title: "Plain Craft Launcher 2",
        abbr: "PCL2",
        download: "https://fastly.jsdelivr.net/gh/Hex-Dragon/PCL2@main/%E6%9C%80%E6%96%B0%E6%AD%A3%E5%BC%8F%E7%89%88.zip",
        version: "2.7.4",
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
        download: "https://github.com/Coloryr/ColorMC/releases/download/A26/colormc-x64.msi",
        version: "A26",
        url: "https://github.com/Coloryr/ColorMC"
    },
    {
        title: "X Minecraft Launcher",
        abbr: "XMCL",
        download: "https://github.com/Voxelum/x-minecraft-launcher/releases/download/v0.44.9/xmcl-0.44.9-win32-x64.zip",
        version: "0.44.9",
        url: "https://github.com/voxelum/x-minecraft-launcher"
    },
    {
        title: "LabyMod Launcher",
        abbr: "LabyMod",
        download: "https://releases.r2.labymod.net/launcher/win32/x64/LabyModLauncherSetup-latest.exe",
        version: "latest",
        url: "https://labymod.net"
    },
    {
        title: "*中国版* 我的世界启动器",
        abbr: "我的世界启动器",
        download: "https://x19.gdl.netease.com/MCLauncher_1.14.0.36188.exe",
        version: "1.14.0.36188",
        url: "https://mc.163.com"
    },
    {
        title: "MultiMC",
        abbr: "MMC",
        download: "https://files.multimc.org/downloads/mmc-develop-win32.zip",
        version: "latest",
        url: "https://github.com/MultiMC/Launcher"
    },
    {
        title: "Prism Launcher",
        abbr: "Prism",
        download: "https://github.com/PrismLauncher/PrismLauncher/releases/download/8.4/PrismLauncher-Windows-MSVC-Setup-8.4.exe",
        version: "8.4",
        url: "https://github.com/PrismLauncher/PrismLauncher"
    },
    {
        title: "Salwyrr Launcher",
        abbr: "Salwyrr",
        download: "https://appsdl-overwolf-com.akamaized.net/prod/apps/ehdhabenpndnlfhfchfacfmnkhmnmigdjjlkeimc/1.0.4/setup.exe",
        version: "1.0.4",
        url: "https://www.salwyrr.com"
    },
    {
        title: "*国际版* Minecraft 启动器 (旧版)",
        abbr: "Minecraft 启动器 (旧版)",
        version: "latest",
        download: "https://launcher.mojang.com/download/MinecraftInstaller.msi",
        url: "https://www.minecraft.net/zh-hans"
    },
    {
        title: "Plain Craft Launcher 1",
        abbr: "PCL1",
        download: "https://share.feijipan.com/s/kwAt8rhZ",
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
        abbr: "HMCL",
        download: "https://github.com/HMCL-dev/HMCL/releases/download/release-3.5.8/HMCL-3.5.8.jar",
        version: "3.5.8",
        url: "https://github.com/HMCL-dev/HMCL",
        dev: {
            download: "https://github.com/HMCL-dev/HMCL/releases/download/v3.5.8.249/HMCL-3.5.8.249.jar",
            version: "3.5.8.249"
        }
    },
    {
        title: "ColorMC",
        download: "https://github.com/Coloryr/ColorMC/releases/download/A26/colormc-A26-1-x86_64.pkg.tar.zst",
        version: "A26",
        url: "https://github.com/Coloryr/ColorMC"
    },
    {
        title: "X Minecraft Launcher",
        abbr: "XMCL",
        download: "https://github.com/Voxelum/x-minecraft-launcher/releases/download/v0.44.9/xmcl-0.44.9.dmg",
        version: "0.44.9",
        url: "https://github.com/Voxelum/x-minecraft-launcher"
    },
    {
        title: "LabyMod Launcher",
        abbr: "LabyMod",
        download: "https://releases.r2.labymod.net/launcher/darwin/x64/LabyMod%20Launcher-latest-x64.dmg",
        version: "latest",
        url: "https://labymod.net"
    },
    {
        title: "MultiMC",
        abbr: "MMC",
        download: "https://files.multimc.org/downloads/mmc-develop-osx64.tar.gz",
        version: "latest",
        url: "https://github.com/MultiMC/Launcher"
    },
    {
        title: "Prism Launcher",
        abbr: "Prism",
        download: "https://github.com/PrismLauncher/PrismLauncher/releases/download/8.4/PrismLauncher-macOS-8.4.zip",
        version: "8.4",
        url: "https://github.com/PrismLauncher/PrismLauncher"
    },
    {
        title: "Salwyrr Launcher",
        abbr: "Salwyrr",
        download: "https://www.salwyrr.com/4/Salwyrr%20Minecraft%20Launcher%204.jar",
        version: "4",
        url: "https://www.salwyrr.com"
    }
];


// 适用于 Linux系统 的启动器
const LinuxLauncher = [
    {
        title: "Hello Minecraft! Launcher",
        abbr: "HMCL",
        download: "https://github.com/HMCL-dev/HMCL/releases/download/release-3.5.8/HMCL-3.5.8.sh",
        version: "3.5.8",
        url: "https://github.com/HMCL-dev/HMCL",
        dev: {
            download: "https://github.com/HMCL-dev/HMCL/releases/download/v3.5.8.249/HMCL-3.5.8.249.sh",
            version: "3.5.8.249"
        }
    },
    {
        title: "ColorMC",
        download: "https://github.com/Coloryr/ColorMC/releases/download/A26/colormc-A26-linux-x64.deb",
        version: "A26",
        url: "https://github.com/Coloryr/ColorMC"
    },
    {
        title: "X Minecraft Launcher",
        abbr: "XMCL",
        download: "https://github.com/Voxelum/x-minecraft-launcher/releases/download/v0.44.9/xmcl-0.44.9-arm64.deb",
        version: "0.44.9",
        url: "https://github.com/voxelum/x-minecraft-launcher"
    },
    {
        title: "LabyMod Launcher",
        abbr: "LabyMod",
        download: "https://releases.r2.labymod.net/launcher/linux/x64/labymodlauncher_latest_amd64.deb",
        version: "latest",
        url: "https://labymod.net"
    },
    {
        title: "Prism Launcher",
        abbr: "Prism",
        download: "https://github.com/PrismLauncher/PrismLauncher/releases/download/8.4/PrismLauncher-Linux-x86_64.AppImage",
        version: "8.4",
        url: "https://github.com/PrismLauncher/PrismLauncher"
    },
    {
        title: "Salwyrr Launcher",
        abbr: "Salwyrr",
        download: "https://www.salwyrr.com/4/Salwyrr%20Minecraft%20Launcher%204.jar",
        version: "4",
        url: "https://www.salwyrr.com"
    }
];
