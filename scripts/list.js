function list(ele) {
    let blocks = $(ele).html().split('\n\n');
    let lineBlocks = [];
    let retValue = '';
    for (let block of blocks) {
        lineBlocks.push(block.split('\n'));
    };
    for (let block of lineBlocks) {
        for (let lineBlock = 0; lineBlock < block.length; lineBlock += 2) {
            block[lineBlock] = block[lineBlock].split('：').join('');
            if (typeof (block[lineBlock + 1]) == 'undefined') continue;
            else if (!(block[lineBlock + 1].startsWith('http'))) {
                block[lineBlock + 1] = block[lineBlock + 1].split('：').join('');
                if (lineBlock == 0) retValue += `<h3>${block[lineBlock]}</h3>`;
                retValue += `<a class="button" href="${block[lineBlock + 2]}" target="_blank">${block[lineBlock + 1]}</a>`;
            }
            else {
                retValue += `<a class="button" href="${block[lineBlock + 1]}" target="_blank">${block[lineBlock]}</a>`;
            };
        };
        retValue += '<hr>';
    };
    retValue = retValue
        .replace(/<lineBlock><textBlock>/g, '<textBlock><lineBlock>')
        .replace(/<\/textBlock><\/lineBlock>/g, '</lineBlock></textBlock>');
    $(ele).html(retValue);
    return retValue;
};
