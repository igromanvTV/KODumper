const { toHex } = require( "./String" );
const { shift } = require( "../constants/Instructions" );

const isPrologue = (address, buffer) => {
    return address;
}

/**
 * Проверка на эпилог функции
 * @param address
 * @param buffer
 * @returns {number}
 */
const findEpilogue = (address, buffer) => {
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
const getInstructions = (start, end, buffer) => {
    let Instructions = []

    for (let offset = start; offset <= end; offset++) {
        const byte = buffer.readUInt8( offset );

        if (byte === 0x48) { // lea
            const NextByte = buffer[offset + 1];

            switch (NextByte) {
                case 0x2B: // sub
                    Instructions.push( {
                        instruction: "sub", address: offset,
                    } );
                    break;
                case 0x83:
                    Instructions.push( {
                        instruction: `sub`, value: buffer.readUInt8( offset + 3 ), address: offset,
                    } )
                    break;
                case 0x33: // xor
                    Instructions.push( {
                        instruction: "xor", address: offset,
                    } );
                    break;
                case 0x03:
                    Instructions.push( {
                        instruction: "add", address: offset,
                    } );
                    break;
            }
        }
    }

    return Instructions;
}

module.exports = {
    findEpilogue, getInstructions
}