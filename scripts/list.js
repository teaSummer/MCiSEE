function list( ele ){
    var blocks = ele.innerHTML.split( "\n\n" )
    var lineBlocks = []
    var retValue = ""
    for( let block of blocks ){
        // lineBlocks.push( ( "<textBlock>" + block + "</textBlock><hr>" ).split( "\n" ) )
        lineBlocks.push(block.split('\n'));
    }
    for( let block of lineBlocks ){
        for( let lineBlock = 0; lineBlock < block.length; lineBlock += 2 ){
             console.log(block);
                block[lineBlock] = block[lineBlock].split('：').join('');
            if(typeof(block[lineBlock + 1]) == "undefined") {continue;}
            else if(!(block[lineBlock + 1].startsWith("http"))) {
                block[lineBlock + 1] = block[lineBlock + 1].split('：').join('');
                if(lineBlock == 0) {retValue += `<h3>${block[lineBlock]}</h3>`;}
                retValue += `<a class="button" onclick="window.open('${block[lineBlock + 2]}')">${block[lineBlock + 1]}</a>`;
            }
            else {
                retValue += `<a class="button" onclick="window.open('${block[lineBlock + 1]}')">${block[lineBlock]}</a>`;
            }
            // retValue += "<lineBlock>" + block[lineBlock + 0] + "\n" + block[lineBlock + 1] + "</lineBlock>"
        }
        retValue += "<hr>";
    }
    retValue = retValue
        .replace( /<lineBlock><textBlock>/g, "<textBlock><lineBlock>" )
        .replace( /<\/textBlock><\/lineBlock>/g, "</lineBlock></textBlock>" )
        // .replace( /undefined/g, "" ) // 解决出现 undefined
    ele.innerHTML = retValue
    return retValue
}
//test
/*console.log( list({innerHTML: `hello
114514
AAAAAAAAAA
114514

world
1919`}))*/