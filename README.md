# MCiSEE

![](https://img.shields.io/badge/license-CC--BY--SA--4.0-green) ![](https://img.shields.io/github/stars/teaSummer/MCiSEE) [![Page Views](https://badges.toozhao.com/badges/01HTFPN35M6ETEFBVAP3SEWRKG/green.svg)](https://badges.toozhao.com/stats/01HTFPN35M6ETEFBVAP3SEWRKG)

**所见皆是*Minecraft*，让获取MC资源更加轻便！**

**欢迎点击 “Star” 按钮来支持我们的编写。**

**玩家们可以从这里挖掘Minecraft常用资源，例如软件等。这里也需要你们提供更多有趣的资源！**

本项目展示的网站内容均收集自互联网，不代表参与本项目的任何个人或组织的观点。

欢迎各位对此项目做出贡献，教程可在下方查看，Fork 后进行修改，感谢每一位贡献者的 PR！

**注意：请确保您 Fork 的仓库为最新，可通过自己仓库页面的【Sync fork】更新后再提交 PR！旧版仓库的合并会带来很多麻烦，感谢您的支持！**


## 贡献教程

**您需要拥有一个 GitHub 账号！**

1. [点击这里 Fork 此仓库](https://github.com/teaSummer/MCiSEE/fork)。
2. 在您 Fork 的仓库内进行修改。
3. 点击顶部【Pull requests】— 右上角【New pull request】—【Create pull request】。
4. 填写标题和描述，说明您做了什么修改，然后提交 PR。
5. 等待此项目所有者 [@teaSummer](https://github.com/teaSummer) 通过审核。

### 如何更改数据？

在仓库中找到 [data](data) 文件夹，里面可以找到所有数据文件。

**添加新的数据时，不要漏写数据之间的分隔符号！**

`data` 目录下的文件列表：

| 文件名           | 数据含义             | 文件                       |
|---------------|------------------|--------------------------|
| launcher.js   | 启动器列表（**Java版**） | [查看](data/launcher.js)   |
| searchable.js | 可供快速查询的站点列表      | [查看](data/searchable.js) |
| website.js    | 网站列表             | [查看](data/website.js)    |

打开文件后，你将看到一些常量，例如 AndroidLauncher 等。

常量的前一行是注释，以便告知用途。

常量的值是一个数组，每一项都是对象。

下面详细介绍了每个文件的数据。

### launcher.js

对象有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                            |
|------------|--------|--------------------------------------------------|
| `title`    | String | 软件完整名称。                                          |
| `subtitle` | String | 可选。简写名称，若不填写此属性，将与 `title` 值保持一致。                |
| `download` | String | 可选。最新稳定版（正式版）下载地址 URL，优先填写下载源 URL。               |
| `version`  | String | 可选。最新稳定版版本名/号，可填 `latest`，仅在 `download` 保持版本最新时使用。 |
| `url`      | String | 可选。GitHub 仓库地址 URL，若没有公开的开源仓库，填写官方网站地址 URL。      |
| `dev`      | Object | 可选。开发版信息，见下文，尽量不提供只在 GitHub Actions 中出现的版本。      |

`dev` 是其中的对象，它有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                         |
|------------|--------|-----------------------------------------------|
| `download` | String | 最新开发版（测试版）下载地址 URL，优先填写下载源 URL。               |
| `version`  | String | 最新开发版版本名/号，可填 `latest`，仅在 `download` 保持版本最新时使用。 |

示例如下：

``` javascript
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
}
```

---

### searchable.js

对象有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                           |
|------------|--------|---------------------------------|
| `title`    | String | 站点完整名称。                         |
| `subtitle` | String | 可选。简称，若不填写此属性，将与 `title` 值保持一致。 |
| `search`   | String | 搜索后跳转的地址 URL，使用 `<T>` 表示关键词。    |
| `note`     | String | 可选。备注。                          |
| `url`      | String | 可选。站点主页地址 URL。                  |

示例如下：

``` javascript
{
    title: "维基百科: 原站",
    subtitle: "Wiki",
    search: "https://zh.minecraft.wiki/?search=<T>&title=Special%3A%E6%90%9C%E7%B4%A2&fulltext=search",
    note: "中文 Minecraft Wiki",
    url: "https://zh.minecraft.wiki"
}
```

---

### website.js

以分类作为键，值为一个数组。

在数组内，第一项为网站名称，第二项为网站地址 URL。

如果分类后面有 `[open]`，则该分类默认展开。

示例如下：

``` javascript
{
    // | 分类 |
    "官方网站 (©Mojang/©微软)": [
        // | 网站名称 |  网站地址 URL  |
        ["Minecraft", "https://www.minecraft.net"],
        ["Minecraft教育版", "https://education.minecraft.net"],
        ["去Xbox购买正版", "https://www.xbox.com/zh-CN/games/store/minecraft-java-bedrock-edition-for-pc/9NXP44L49SHJ/0010"],
        ["漏洞追踪器(反馈Bug)", "https://bugs.mojang.com"],
        ["基岩版开发者文档", "https://learn.microsoft.com/minecraft/creator/"],
        ["Feedback", "https://feedback.minecraft.net"],
        ["知识库", "https://feedback.minecraft.net/hc/categories/115000410252-Knowledge-Base"],
        ["远古版网页MC", "https://classic.minecraft.net"],
        ["Forge模组加载器", "https://www.minecraftforge.net"],
        ["基岩版专用服务端", "https://www.minecraft.net/zh-hans/download/server/bedrock"]
    ]
}
```

---

### 贡献声明

为了便于维护，请按照以下方式排列数据：

1. 启动器：见下文。
2. 实用网站：无序/按相关程度排序。
3. 论坛：按创建时间降序。
4. 其它：按受欢迎程度升序。

若要修改启动器列表，请遵循下列规则：

1. 请勿提供过于小众或停止更新/维护的启动器。当然，也有例外：`更适合旧设备`（限制 **2个/设备**）。
2. 下拉菜单从上到下排序：`官方` > `国内知名第三方` > `网易` > `国外第三方` > `更适合旧设备`。
3. `国内知名第三方` 限制 **6个/设备**，`国外第三方` 限制 **3个/设备**。
4. 对于 `download` 和 `version` 属性，应优先考虑GitHub上的tag名，其次是官方版本名/号。
5. 另外，由于 `PCL2` 快照版本尚未公开，请勿提供其 `dev` 属性。

感谢您的贡献。历史的长河将会为您留名。


## 感谢

详见 [thanks.md](thanks.md) 文件。


## 统计信息

### 贡献者

[![Contributors](https://contrib.rocks/image?repo=teaSummer/MCiSEE)](https://github.com/teaSummer/MCiSEE/graphs/contributors)

### 星星历史图

[![Stars over time](https://starchart.cc/teaSummer/MCiSEE.svg?variant=adaptive)](https://starchart.cc/teaSummer/MCiSEE)


## 协议

开源协议：[GPL-3.0 license](LICENSE)

知识共享协议：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
