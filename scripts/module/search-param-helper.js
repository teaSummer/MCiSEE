/**
 * @author LateDream
 */
(function() {
	const searchParams = new URLSearchParams(window.location.search);

	const launcher = searchParams.get('launcher') || false;
	if(!!launcher) {
		for(const i of document.querySelectorAll('.custom-item')) {
			if(i.textContent.toLowerCase().includes(launcher.toLowerCase())) {
				i.click(); i.click(); // prevent form popup
				break;
			}
		}
	}

	if(JSON.parse(localStorage.getItem('clean-url') || 'false')) {
		// clean-url for linkage
		window.history.replaceState(null, null, location.href.split('?')[0].replace('index.html', ''));
	}
})();