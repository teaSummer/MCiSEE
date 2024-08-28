// 调试模式 (Debug Mode)
const debugCallback = (e = $('[debugFuncs]')) => (debug.mode ? e.show() : e.hide());
const debugChange = ((object) => {
    const handler = {
        defineProperty: (target, property, descriptor) => {
            Reflect.defineProperty(target, property, descriptor);
            debugCallback();
        }
    };
    return new Proxy(object, handler);
});
const debug = debugChange({mode: (location.hostname === "127.0.0.1" || location.hostname === "localhost")});
debugCallback();

// 点击特效：此处包含外链地址，内容由XiaozhiSans提供。如果您需要使用，应先询问其意见。
$('#clickEffect').change(() => {
	if ($('#clickEffect')[0].checked) $.getScript('https://log.xsawa.dev.tc/js/candy.min.js')
	  .then(console.log('[debug] clickEffect is now enabled!\nif you want to disable it pls refresh the page.'))
	  .catch(e => console.error(`[debug] ${e}`)); // 打开了就没有退路了awa 除非刷新页面awa
});
// githubRepoProxy
$('#githubRepoProxy').change(() => {
	const proxy = ghRepoMirrorUrl || 'https://www.jsdelivr.com/package/gh';
	if ($('#githubRepoProxy')[0].checked) {
		try {$('a').each(function() {
			if (this.href && this.href.startsWith('https://github.com'))
			this.href = this.href.replace('https://github.com', proxy);
		})} catch(e) {console.error(e)}
	} else {
		try {$('a').each(function() {
			if (this.href && this.href.startsWith(proxy))
			this.href = this.href.replace(proxy, 'https://github.com');
		})} catch(e) {console.error(e)}
	}
});

export {debug};
