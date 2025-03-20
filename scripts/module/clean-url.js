/**
 * MCiSEE Clean URL Module
 * @author LateDream
 */
(function() {
	'use strict';
	const checkbox = document.querySelector('.clean-url');
	let cleanUrl = JSON.parse(localStorage.getItem('clean-url')) || false;

	checkbox.addEventListener('click', () => {
		localStorage.setItem('clean-url', checkbox.checked);
		const cleanUrlFunc = () => {
			history.replaceState(null, null, location.href.split('#')[0].replace('index.html', ''));
		}
		if(checkbox.checked) {
			window.addEventListener('hashchange', cleanUrlFunc);
			cleanUrlFunc();
		} else location.reload();
		// window.removeEventListener('hashchange', cleanUrlFunc); // not work
	});

	if(cleanUrl) {checkbox.click();}
})();