# API文档

## 1. 启动器下载/跳转/信息获取

### 接口

```http
GET /r/launcher HTTP/1.1
Host: mcisee.top
```

```http
POST /r/launcher HTTP/1.1
Host: mcisee.top
```

[Apifox 文档](https://mcisee.apifox.cn)

### 接口说明
对已在 [mcisee.top](https://mcisee.top) 中记录的Minecraft启动器进行下载/跳转/信息获取等操作。

### 请求参数
| 参数名                | 类型            | 必需 | 说明                                                                                                                                                     |
|--------------------|---------------|----|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`<br>`n`      | string        | 否  | 启动器名称，可填别名<br>示例值：`HMCL`                                                                                                                               |
| `device`<br>`d`    | enum\<string> | 否  | 设备，可仅填首字母<br>枚举值：<br>`Android` `HarmonyOS` `iOS` `iPad` `Windows` `macOS` `Linux`<br>默认值：`Windows`<br>示例值：`Linux`                                      |
| `operation`<br>`o` | enum\<string> | 否  | 要执行的操作<br>枚举值：<br>`stable`（下载稳定版）<br>`dev`（下载开发版）<br>`github`（跳转GitHub仓库）<br>`url`（跳转网站）<br>`info`（获取信息）<br>`list`（列出所有）<br>默认值：`stable`<br>示例值：`info` |
| `nomirror`         | boolean       | 否  | 是否禁用镜像地址<br>默认值：`false`<br>示例值：`true`                                                                                                                  |

### 请求示例
* 获取官启信息：https://mcisee.top/r/launcher?name=MCL&operation=info
* 下载FCL：https://mcisee.top/r/launcher?n=fcl&d=a
* 列出macOS上的启动器，不含镜像地址：https://mcisee.top/r/launcher?d=m&o=list&nomirror=true
* 列出所有设备上的HMCL：https://mcisee.top/r/launcher?n=hmcl&o=list

### 返回响应
以下仅列出基本信息，详细信息请见 [Apifox 文档](https://mcisee.apifox.cn)。

<details>
<summary>状态码及简述</summary>

🟢 200 成功跳转/下载  
🟢 200 成功获取信息  
🟢 200 成功列出所有  
⚪ 800 参数缺失  
⚪ 810 启动器名称参数重复  
⚪ 811 设备参数重复  
⚪ 812 操作参数重复  
⚪ 820 拒绝无效操作  
⚪ 821 拒绝缺失启动器名称参数  
⚪ 822 拒绝过多参数  
⚪ 830 不支持的启动器名称  
⚪ 831 不支持的设备  
⚪ 832 不受设备支持的启动器  
⚪ 840 不存在稳定版的下载链接  
⚪ 841 不存在开发版的下载链接  
⚪ 842 不存在GitHub仓库  
⚪ 843 不存在网站
</details>
