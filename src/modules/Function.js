const isPrologue = ( address, buffer ) => {
    return address;
}

/**
 * Проверка на эпилог функции
 * @param address
 * @param buffer
 * @returns {number}
 */
const FindEpilogue = ( address, buffer ) => {
    while (buffer[address] !== 0xC3) {
        address++;
    }

    return address;
}

/**
 * Сканирование байтов на наличие xor, sub операций
 * @param start
 * @param end
 * @param buffer
 * @returns {*[]}
 */
const GetInstructions = ( start, end, buffer ) => {
    let instructions = []

    for (let offset = start; offset <= end; offset++) {
        const byte = buffer.readUInt8( offset );

        if ( byte === 0x48 ) { // lea
            const nextByte = buffer[offset + 1];

            switch (nextByte) {
                case 0x29: // sub
                    instructions.push( {
                        instruction: "sub", address: offset,
                    } );
                    break;
                case 0x33: // xor
                    instructions.push( {
                        instruction: "xor", address: offset,
                    } );
                    break;
                case 0x03:
                    instructions.push( {
                        instruction: "add", address: offset,
                    } );
                    break;
            }
        }
    }

    return instructions;
}

module.exports = {
    FindEpilogue, GetInstructions
}