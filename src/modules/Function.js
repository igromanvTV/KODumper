const { hex } = require( "./String" );

const isPrologue = ( address, buffer ) => {
    return buffer.readUInt32BE( address ) === 0x488BC4;
}

/**
 * Проверка на эпилог функции
 * @param address
 * @param buffer
 * @returns {boolean}
 */
const isEpilogue = ( address, buffer ) => {
    const firstByte = buffer.readUInt8( address );
    const secondByte = buffer.readUInt8( address + 1 );

    return (
            firstByte === 0xC3 && secondByte === 0xCC
        ) ||
        (
            firstByte === 0x5F && secondByte === 0xC3
        ); // ret ( 0xC3 ), second int 3 ( 0xCC )
}

/**
 * Сканирование байтов на наличие xor, sub операций
 * @param address
 * @param buffer
 * @returns {*[]}
 */
// const getInstructions = ( address, buffer ) => {
//     let instructions = []
//
//     while (!isEpilogue( address, buffer )) {
//         const byte = buffer.readUInt8( address );
//
//         if ( byte === 0x48 ) { // lea
//             const nextByte = buffer[address + 1];
//
//             switch (nextByte) {
//                 case 0x29: // sub
//                     instructions.push( {
//                         instruction: "sub", address: address,
//                     } );
//                     break;
//                 case 0x33: // xor
//                     instructions.push( {
//                         instruction: "xor", address: address,
//                     } );
//                     break;
//             }
//         }
//
//         address++;
//     }
//     return instructions;
// }

module.exports = {
    // isPrologue, isEpilogue, getInstructions
}