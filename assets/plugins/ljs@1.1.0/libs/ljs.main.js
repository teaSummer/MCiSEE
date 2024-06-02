/*
 *	(￣﹃￣).zZ Code by XiaozhiSans
 */

globalThis.ljsCfg = {
	launcherCfg: "data/launchers.ini", // 默认配置文件路径
	keepUpdateVerify: true, // 检测启动器是否维护,默认: true,不维护的启动器不检查更新
	tagNameAsLatestVer: true, // 是否以"tag_name"为获取到版本号,否则以"name"(也就是release的名字)
	useProxy: false, // 是否使用代理加速release下载链,若启用请先配置好代理url(proxyUrl)
	proxyUrl: '/', // 代理url,'/'结尾
}

let checkUpdate = (list) => {
	ljsCfg.checked = 0;

	let checkNext = () => {
		if(ljsCfg.checked >= list.length) {
			console.log(`(~￣▽￣)~ 所有启动器均检查更新完毕,共检查了${ljsCfg.checked}个启动器`);
			return;
		}

		// 把仓库url转换为rest api url
		list[ljsCfg.checked][1] = (list[ljsCfg.checked][1].replace(/(https?:\/\/)?github\.com\//g, "https://api.github.com/repos/") + "/releases/latest");

		$.get(list[ljsCfg.checked][1], data => {
			let getDownloadUrl = (system, assets) => {
				let result = [], keyword;
				system = system.toLowerCase();
				switch(system) { // 以可执行文件后缀避免误检
					// 但是这也会导致一个问题,要是发行包是压缩包怎么办
					// 暂时摆烂罢
					case "android":
						keyword = /(\.apk)$/;
						break;
					case "ios":
						keyword = /(\.ipa)$/;
						break;
					case "java":
						keyword = /(\.jar)$/;
						break;
					case "linux":
						keyword = /((\.appimage)|(\.deb)|(\.rpm))$/;
						break;
					case "macos":
						keyword = /((\.app)|(\.dmg))$/;
						break;
					case "windows":
						keyword = /((\.exe)|(\.msi))$/;
						break;
					default:
						return "不支持的操作系统";
				}

				if(assets == '') {
					return "assets is empty";
				} else {
				for(let d of assets) {
					keyword.test(d.browser_download_url.toLowerCase())? result.push(d.browser_download_url): null;
				}}
				return result;
			}

			// 获取最新版本
			let version;
			ljsCfg.tagNameAsNewVer? version = data.tag_name: version = data.name;

			// 获取下载链接
			let downloadUrls = getDownloadUrl(list[ljsCfg.checked][2], data.assets);
			for(let downloadUrl of downloadUrls) {
				if(!ljsCfg.useProxy) {break;}
				downloadUrl = ljsCfg.proxyUrl + downloadUrl;
			}

			// 输出控制台
			/* console.log(`( •̀ ω •́ )✧ ${list[ljsCfg.checked][2]} mc启动器 ${list[ljsCfg.checked][0]}\n\t最新版本: ${version}\n\t下载链接: `);
			console.table(downloadUrls) */

			// Obj template
			function Obj(name, downloadUrl, version, url) {
				this.title = name.split('/')[0];
				this.subtitle = name.split('/')[1] || '';
				this.download = downloadUrl;
				this.version = version;
				this.url = url;
			}
			switch(list[ljsCfg.checked][2].toLowerCase()) {
				case "android":
					let downloadUrl;
					for(let d of downloadUrls) {
						if(/(all)|(release)/.test(d)) {
							downloadUrl = d;
							break;
						}
					}
					AndroidLauncher.push(new Obj(list[ljsCfg.checked][0], downloadUrl, version, list[ljsCfg.checked][1].replace("https://api.github.com/repos/", "https://github.com/").replace("/releases/latest", '')));
					break;

				case "ios":
					iOSLauncher.push(new Obj(list[ljsCfg.checked][0], downloadUrls[0], version, list[ljsCfg.checked][1].replace("https://api.github.com/repos/", "https://github.com/").replace("/releases/latest", '')));
					break;
				
				case "linux":
					LinuxLauncher.push(new Obj(list[ljsCfg.checked][0], downloadUrls[0], version, list[ljsCfg.checked][1].replace("https://api.github.com/repos/", "https://github.com/").replace("/releases/latest", '')));
					break;

				case "windows":
					WindowsLauncher.push(new Obj(list[ljsCfg.checked][0], downloadUrls[0], version, list[ljsCfg.checked][1].replace("https://api.github.com/repos/", "https://github.com/").replace("/releases/latest", '')));
					break;

				case "java":
				case "macos":
					macOSLauncher.push(new Obj(list[ljsCfg.checked][0], downloadUrls[0], version, list[ljsCfg.checked][1].replace("https://api.github.com/repos/", "https://github.com/").replace("/releases/latest", '')));

				default:
					break;
			}
            $('div.launcher-list').html(DOMLauncherList.deviceList());
            deviceChanged();

			ljsCfg.checked++;
			checkNext();
		}).fail = ((jqxhr, settings, exception) => {
			console.info(`${list[ljsCfg.checked]} 检查更新失败`);
			ljsCfg.checked++;
			checkNext();
		});

	}

	checkNext();
}

export let start = () => {$.get(ljsCfg.launcherCfg, data => {
	ljsCfg.list = [];
	let lines = data.trim().split('\n');

	for (let line of lines) {
		line = line.trim(); // 移除多余空字符

		let isComment = (line.startsWith(';') || line.startsWith('#'));
		if (isComment || line === '') {continue;} // 跳过空行和整行注释

		line = line.replace(/;.*|#.*/g, ''); // 移除每行内嵌注释
		let parts = line.split('|').map(part => {return part.trim();});

		let keepUpdate, part = [parts[0], parts[1], parts[3]];
		ljsCfg.keepUpdateVerify? keepUpdate = parts[2]: keepUpdate = true;
		keepUpdate? ljsCfg.list.push(part): void 0;
	}

	checkUpdate(ljsCfg.list);
})};
