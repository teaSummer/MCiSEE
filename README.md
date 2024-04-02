# MCiSEE
![](https://img.shields.io/badge/license-CC--BY--SA--4.0-green)[![Page Views Count](https://badges.toozhao.com/badges/01HTFPN35M6ETEFBVAP3SEWRKG/green.svg)](https://badges.toozhao.com/stats/01HTFPN35M6ETEFBVAP3SEWRKG)

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

| 文件名         | 文件作用  | 链接                     |
|-------------|-------|------------------------|
| launcher.js | 启动器列表 | [跳转](data/launcher.js) |

打开文件后，你将看到一些常量，例如 AndroidLauncher 等。

不用害怕，常量的前一行是注释，它将会告诉你常量的用途。

常量的值是一个数组，每一项都是对象。对象有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                            |
|------------|--------|--------------------------------------------------|
| `title`    | String | 填写名称，例如启动器名称等。                                   |
| `download` | String | 填写稳定版（正式版）下载地址 URL，优先填写下载源。                      |
| `version`  | String | 可选。填写稳定版版本号，可填 `latest`，仅在 `download` 保持版本最新时使用。 |
| `url`      | String | 可选。GitHub 仓库地址 URL，如果没有公开的开源仓库，填写官网地址 URL。       |
| `dev`      | Object | 可选。填写关于开发版的信息，尽量不要提供只在 `Action` 中出现的版本，具体见下文。    |

`dev` 是一个对象，它有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                            |
|------------|--------|--------------------------------------------------|
| `download` | String | 填写开发版（测试版）下载地址 URL，优先填写下载源。                      |
| `version`  | String | 可选。填写开发版版本号，可填 `latest`，仅在 `download` 保持版本最新时使用。 |

示例如下：

``` js
{
    title: "HMCL",
    download: "https://github.com/HMCL-dev/HMCL/releases/download/release-3.5.7/HMCL-3.5.7.exe",
    version: "3.5.7",
    url: "https://github.com/HMCL-dev/HMCL",
    dev: {
        download: "https://github.com/HMCL-dev/HMCL/releases/download/v3.5.7.245/HMCL-3.5.7.245.exe",
        version: "3.5.7.245"
    }
}
```
