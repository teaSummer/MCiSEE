## 📅ljs
谢邀!
`ljs`,即**`launcher.js`**

`ljs`的目的是实现自动化检测 github 开源 mc 启动器的更新并获取最新版本及下载链接!

### 📂依赖/兼容性
\* jQuery ^3.0.0

### 🥰使用与调教
#### 😊使用
[暂时不想安装?没问题!这里有测试页面!](./test.html)

只需在`html`中插入一行代码即可开始使用!

```html
<script type="module" src="./ljs.init.mjs"></script>
```

现在打开你的`html`!

然后打开开发者控制台!


不出意外的话你应该看到类似这段控制台输出!
```log
( •̀ ω •́ )✧ android mc启动器 FCL(Fold Craft Launcher)
	最新版本: 1.1.6.1
	下载链接: https://github.com/FCL-Team/FoldCraftLauncher/releases/download/1.1.6.1/FCL-release-1.1.6.1-x86_64.apk
(~￣▽￣)~ 所有启动器均检查更新完毕,共检查了1个启动器
```
---
以上,`ljs`安装完毕!

#### 🥵调教
##### 📄启动器配置文件
默认位于`./libs/launchers.ini`

里面有简单的格式说明!照着改就行了!

[点击这里查看文件内容!](./libs/launchers.ini)

##### 🧾main.lib.mjs
位于`./libs/main.lib.mjs`!

你只需要修改`ljs`配置(`ljsCfg`)和48行的内容就行了!

你也可以通过`js`动态修改`ljs`配置!比如
```js
ljsCfg.keepUpdataVerify = false; // 动态关闭检测启动器是否维护
```

里面都有注释和说明的!照着改就行了!

[点击这里查看文件内容!](./libs/main.lib.mjs)

---
以上,`ljs`调教完毕!

---
## 😘感谢
0. 排名不分前后!

1. jQuery: 提供支持性代码

2. XiaozhiSans: 主要开发

3. GitHub REST API: 提供接口

---
## 📃协议
[点我查看](./LICENSE)

---
以上,`ljs`说明文档到此结束!
