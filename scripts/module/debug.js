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

export {debug}
