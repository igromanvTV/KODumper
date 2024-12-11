/**
 * Generate shuffle from offsets
 * @param offsets struct offsets
 * @param shuffleStart shuffle start offset
 * @param typeSize each item type size
 * @returns {string}
 */
const shuffle = (offsets, shuffleStart, typeSize) => {
    let arrayLength = offsets.length;

    let shuffleData = [];

    let end = shuffleStart + (arrayLength * typeSize);

    for (let offset = shuffleStart; offset < end; offset += typeSize) {
        let index = offsets.indexOf( offset );

        shuffleData.push( `a${index}` );
    }


    return shuffleData.join( " sep " );
}

module.exports.shuffle = shuffle;