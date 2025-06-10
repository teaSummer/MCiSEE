// 调试模式 (Debug Mode)
const isLocal = location.hostname === "127.0.0.1" || location.hostname === "localhost";
const debugCallback = () => {
	if(isLocal) {
		$('#debugMode').children().show();
		$('#debugMode').children()[0].disabled = false;
	} else {
		$('#debugMode').children().hide();
		$('#debugMode').children()[0].disabled = true;
	}
	debug.mode ? $('#debugFuncs').show() && $('#debugMode').children().show() : $('#debugFuncs').hide();
	$('#debugMode').children()[0].checked = debug.mode;
	console.log(`[debug] debugMode is now ${debug.mode? "enabled": "disabled"}`);
}
const debugChange = ((object) => {
    const handler = {
        defineProperty: (target, property, descriptor) => {
            Reflect.defineProperty(target, property, descriptor);
            debugCallback();
        }
    }
    return new Proxy(object, handler);
});
const debug = debugChange({mode: isLocal});
debugCallback();

$('#debugMode').children().change(() => debug.mode = $('#debugMode').children()[0].checked);
// 点击特效：此处包含外链地址，内容由XiaozhiSans提供。如果您需要使用，应先询问其意见。
$('#clickEffect').change(() => {
	if ($('#clickEffect')[0].checked) $.getScript('//xsawa.us.kg/plugins/effects/click.min.js')
	  .then(()=>console.log('[debug] clickEffect is now enabled!\nif you want to disable it pls refresh the page.'))
	  .catch(()=>console.error(`[debug] clickEffect is failed to load`)); // 打开了就没有退路了awa 除非刷新页面awa
});
// githubRepoProxy
$('#githubRepoProxy').change(() => {
	const proxy = ghRepoMirrorUrl || 'https://www.jsdelivr.com/package/gh/';
	if ($('#githubRepoProxy')[0].checked) {
		try {$('a').each(function() {
			if (this.href && /^\/\/github.com\/|http(s)?:\/\/github.com\//.test(this.href))
			this.href = this.href.replace(/\/\/github.com\/|http(s)?:\/\/github.com\//, proxy);
		}) && console.log(`[debug] githubRepoProxy is now enabled\nproxy url = ${proxy}`)} catch(e) {console.error(e)}
	} else {
		try {$('a').each(function() {
			if (this.href && this.href.startsWith(proxy))
			this.href = this.href.replace(proxy, '//github.com/');
		}) && console.log("[debug] githubRepoProxy is now disabled")} catch(e) {console.error(e)}
	}
});

$("#snowEffect").change(() => {
	$('#snowEffect')[0].checked? $.getScript("//xsawa.us.kg/plugins/effects/snow.min.js")
	.then(()=>console.log("[debug] snowEffect is now enabled!\nif you want to disable it pls refresh the page.\ntips: only winter (nov. to jan.) is available"))
	.catch(()=>console.error(`[debug] snowEffect is failed to load`)) && (this.disabled = true): false;
});

export {debug}
