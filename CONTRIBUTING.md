# 贡献教程

> [!IMPORTANT]
> 为了避免不必要的麻烦，请在修改代码前同步fork。

**您需要拥有一个 GitHub 账号！**

1. [点击这里 Fork 此仓库](https://github.com/teaSummer/MCiSEE/fork)。
2. 在您 Fork 的仓库内进行修改。
3. 点击顶部【Pull requests】— 右上角【New pull request】—【Create pull request】。
4. 填写标题和描述，说明您做了什么修改，然后提交 PR。
5. 等待此项目所有者 [@teaSummer](https://github.com/teaSummer) 或是协作者 通过审核。

## 如何更改数据？

在仓库中找到 [data](data) 文件夹，里面可以找到所有数据文件。

**添加新的数据时，不要漏写数据之间的分隔符号！**

`data` 目录下的文件列表：

| 文件名                                                                           | 数据含义             | 文件                                                                       |
|-------------------------------------------------------------------------------|------------------|--------------------------------------------------------------------------|
| [![](assets/icon/doc/link-16.svg)](#launcherjsonc) launcher.jsonc             | 启动器列表（**Java版**） | [查看![](assets/icon/doc/link-external-16.svg)](data/launcher.jsonc)       |
| [![](assets/icon/doc/link-16.svg)](#forumjsonc) forum.jsonc                   | 论坛列表             | [查看![](assets/icon/doc/link-external-16.svg)](data/forum.jsonc)          |
| [![](assets/icon/doc/link-16.svg)](#searchablejsonc) searchable.jsonc         | 可供快速查询的站点列表      | [查看![](assets/icon/doc/link-external-16.svg)](data/searchable.jsonc)     |
| [![](assets/icon/doc/link-16.svg)](#utilityWebsitejsonc) utilityWebsite.jsonc | 实用网站列表           | [查看![](assets/icon/doc/link-external-16.svg)](data/utilityWebsite.jsonc) |

打开文件后，你将看到一些常量，例如 AndroidLauncher 等。

常量的前一行是注释，以便告知用途。

常量的值是一个数组，每一项都是对象。

下面详细介绍了每个文件的数据。

## launcher.jsonc

对象有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                       |
|------------|--------|---------------------------------------------|
| `title`    | String | 软件完整名称。                                     |
| `abbr`     | String | 可选。简写名称，若不填写此属性，将与 `title` 值保持一致。           |
| `download` | String | 可选。最新稳定版（正式版）下载地址 URL，优先填写下载源 URL。          |
| `version`  | String | 可选。最新稳定版版本名/号，可填 `latest`，仅在保持最新且不便自动修改时使用。 |
| `github`   | String | 可选。GitHub 仓库地址 URL。                         |
| `url`      | String | 可选。官方网站地址 URL。                              |
| `dev`      | Object | 可选。开发版信息，见下文，尽量不提供只在 GitHub Actions 中出现的版本。 |

`dev` 是其中的对象，它有以下属性：

| 属性键名称      | 属性值类型  | 属性值描述                                    |
|------------|--------|------------------------------------------|
| `download` | String | 最新开发版（测试版）下载地址 URL，优先填写下载源 URL。          |
| `version`  | String | 最新开发版版本名/号，可填 `latest`，仅在保持最新且不便自动修改时使用。 |

示例如下：

``` jsonc
{
  "title": "Hello Minecraft! Launcher",
  "abbr": "HMCL",
  "download": "https://github.com/HMCL-dev/HMCL/releases/download/3.6.11.266/HMCL-3.6.11.exe",
  "version": "3.6.11",
  "github": "https://github.com/HMCL-dev/HMCL",
  "url": "https://hmcl.huangyuhui.net",
  "dev": {
	"download": "https://github.com/HMCL-dev/HMCL/releases/download/v3.6.11.266/HMCL-3.6.11.266.exe",
	"version": "3.6.11.266"
  }
}
```

更多信息请见[贡献声明](#贡献声明)。

---

## forum.jsonc

参见段落 [utilityWebsite.jsonc](#utilityWebsitejsonc)。

---

## searchable.jsonc

对象有以下属性：

| 属性键名称    | 属性值类型  | 属性值描述                                 |
|----------|--------|---------------------------------------|
| `title`  | String | 站点完整名称。                               |
| `abbr`   | String | 可选。简称，若不填写此属性，将与 `title` 值保持一致。       |
| `search` | String | 搜索后跳转的地址 URL，使用 `<T>` 表示关键词，留空则由前端处理。 |
| `note`   | String | 可选。备注。                                |
| `url`    | String | 可选。站点主页地址 URL。                        |

示例如下：

``` jsonc
{
  "title": "维基百科: 原站",
  "abbr": "Wiki",
  "search": "https://zh.minecraft.wiki/?search=<T>&title=Special%3A%E6%90%9C%E7%B4%A2&fulltext=search",
  "note": "中文 Minecraft Wiki",
  "url": "https://zh.minecraft.wiki"
}
```

---

## utilityWebsite.jsonc

**请勿**提供仅限单一模组的网站。

以分类作为键，值为一个数组。

在数组内，每项对应的描述：

1. 第一项 - 网站名称。
2. 第二项 - 网站地址 URL。
3. 第三项 - 可选，网站简介。
4. 第四项 - 可选，网站图标，默认调用API获取。
5. 第五项 - 可选，填 `true` 会将 `网站名称` 和 `网站简介` 视为语言文件中的键。

如果分类后面有 `[open]`，则该分类默认展开。

示例如下：

``` jsonc
{
  "官方网站 (©Mojang/©微软)": [
	["Minecraft", "https://www.minecraft.net"],
	["Minecraft教育版", "https://education.minecraft.net"],
	["漏洞追踪器(反馈Bug)", "https://bugs.mojang.com", "Mojang Jira/Mojira\n用于反馈Bug"],
	["基岩版开发者文档", "https://learn.microsoft.com/minecraft/creator/"],
	["Feedback", "https://feedback.minecraft.net"],
  ],
}
```

---

### 贡献声明

请尽量避免提供关注度低、无独有特性且已停止维护的产物。

为了便于维护，请按照以下方式排列数据：

1. 启动器：见下文。
2. 实用网站：无序/按相关程度排序。
3. 论坛：按创建时间降序。
4. 其它：按受欢迎程度升序。

若要修改启动器列表，指导如下：

1. 可以提供 `更适合旧设备` 的启动器（限制 **2个/设备**）。
2. 下拉菜单从上到下排序：`官方` > `国内知名第三方` > `网易` > `国外第三方` > `更适合旧设备`。
3. `国内知名第三方` 限制 **6个/设备**，`国外第三方` 限制 **3个/设备**。
4. 对于 `version` 属性，应优先考虑 GitHub 仓库的相应 Tag，其次是官方的相应版本名/号。
5. 另外，由于 `PCL2` 快照版本尚未公开，**请勿**提供其 `dev` 属性。
6. 由于特殊原因，辅助类启动器请在 [utilityWebsite.jsonc](data/utilityWebsite.jsonc) 中提供。

感谢您的贡献。历史的长河将会为您留名。
