# MCiSEE

![](https://img.shields.io/badge/license-CC--BY--SA--4.0-green) [![Page Views Count](https://badges.toozhao.com/badges/01HTFPN35M6ETEFBVAP3SEWRKG/green.svg)](https://badges.toozhao.com/stats/01HTFPN35M6ETEFBVAP3SEWRKG)

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

在仓库中找到 [data](data) 文件夹，可以里面找到所有数据的脚本文件，数据通过数组呈现。

**添加新的数据时，不要漏写数据之间的分隔符号！**

`data` 目录下的文件列表：

| 文件名           | 数据含义             | 文件                       |
|---------------|------------------|--------------------------|
| launcher.js   | 启动器列表（**Java版**） | [查看](data/launcher.js)   |
| searchable.js | 可供快速查询的网站列表      | [查看](data/searchable.js) |

打开文件后，你将看到一些常量，例如 AndroidLauncher 等。

常量的前一行是注释，以便告知用途。

常量的值是一个数组，每一项都是对象。

下面详细介绍了每个文件的数据。

### launcher.js

对象有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                         |
|------------|--------|-----------------------------------------------|
| `title`    | String | 软件完整名称。                              |
| `subtitle` | String | 可选。简写名称，若不填写此属性，将与 `title` 值保持一致。             |
| `download` | String | 最新稳定版（正式版）下载地址 URL，优先填写下载源 URL。               |
| `version`  | String | 最新稳定版版本号，可填 `latest`，仅在 `download` 保持版本最新时使用。 |
| `url`      | String | 可选。GitHub 仓库地址 URL，若没有公开的开源仓库，填写官方网站地址 URL。   |
| `dev`      | Object | 可选。开发版信息，见下文，尽量不提供只在 GitHub Actions 中出现的版本。   |

`dev` 是其中的对象，它有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                         |
|------------|--------|-----------------------------------------------|
| `download` | String | 最新开发版（测试版）下载地址 URL，优先填写下载源 URL。               |
| `version`  | String | 最新开发版版本号，可填 `latest`，仅在 `download` 保持版本最新时使用。 |

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

### searchable.js

对象有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                             |
|------------|--------|-----------------------------------|
| `title`    | String | 站点完整名称。                             |
| `subtitle` | String | 可选。简称，若不填写此属性，将与 `title` 值保持一致。 |
| `search`   | String | 搜索后跳转的地址 URL，使用 `<T>` 表示关键词。      |
| `note`     | String | 可选。备注。                            |
| `url`      | String | 可选。站点主页地址 URL。                    |

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

...

---

### 贡献声明

为了便于维护，请按照以下方式排列数据：
1. 实用网站：无序。
2. 论坛：按创建时间降序。
3. 其它：按受欢迎程度升序。

若提供启动器，请遵循以下要求：

1. 启动器至今仍在更新/维护，或 `更适合旧设备`（限制 **2个/设备**）。
2. 启动器使用人群基数大、范围广。另外，官方启动器优先。
3. 下拉菜单从上到下排序：`官方` > `国内第三方` > `网易` > `国外第三方` > `更适合旧设备`。
4. `国内第三方` 限制 **6个/设备**，`国外第三方` 限制 **3个/设备**。
5. 另外，由于 `PCL2` 快照版本尚未公开，请勿提供其 `dev` 属性。

感谢您的贡献。

## 统计信息

### 贡献者

[![Contrib](https://contrib.rocks/image?repo=teaSummer/MCiSEE)](https://github.com/teaSummer/MCiSEE/graphs/contributors)

### 星星历史图

[![Stargazers over time](https://starchart.cc/teaSummer/MCiSEE.svg?variant=adaptive)](https://starchart.cc/teaSummer/MCiSEE)
