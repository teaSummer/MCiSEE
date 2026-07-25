'use uwu';

const UWU_LOGO = $(`<div class="uwu-logo">
	<img alt="MCISEE" draggable="false" src="https://next.mcisee.top/images/mcisee-uwu.png" />
	<sup>Design by LateDreamXD</sup>
</div>`);
UWU_LOGO.css({
	position: 'absolute',
	top: 0, right: 0,
	height: '100%',
	display: 'flex',
	'flex-direction': 'column',
	'align-items': 'center',
	'user-select': 'none'
});
UWU_LOGO.children('img').css({
	// width: '100%',
	height: '100%'
});

export const apply = () => {
	$('html').addClass('uwu');
	$('.introduction').css({ position: 'relative', width: '100%' }).append(UWU_LOGO);

	const tooltip = UWU_LOGO.children('sup');
	tooltip.hide();
	UWU_LOGO.mouseenter(() => tooltip.fadeToggle('fast'))
			.mouseleave(() => tooltip.fadeToggle('fast'));
}

export const cancel = () => {
	$('html').removeClass('uwu');
	$('.introduction').children('.uwu-logo').remove();
}