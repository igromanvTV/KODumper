const shuffle = (offsets, size) => {
    let arrayLength = offsets.length;

    let shuffleData = [];

    for (let offset = size; offset < (arrayLength + 1) * size; offset += size) {
        let index = offsets.indexOf( offset );
        shuffleData.push( index !== -1 ? `a${index}` : `a${arrayLength}` );
    }

    return shuffleData.join( " sep " )
}

module.exports.shuffle = shuffle;