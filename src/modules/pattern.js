const { findSection } = require( "./section" );

/**
 * Сканирование сигнатуры из памяти
 * @param signature
 * @param buffer
 * @param start
 * @param end
 * @returns {{address: number, size: number}|{address: null, size: number}|TypeError}
 */

const scanPattern = (signature, buffer, start = 0, end = 0) => {
    let parsedSignature = signature.split( " " ).map( byte => byte === '?' ? null : parseInt( byte, 16 ) );

    let textSection = findSection( ".text", buffer );

    // Простая реализация pattern сканнера

    for (let address = textSection.pointer; address < (end !== 0 ? end : textSection.pointer + textSection.size - parsedSignature.length); address++) {
        let found = true;

        for (let index = 0; index < parsedSignature.length; index++) {
            if (parsedSignature[index] !== null && buffer[address + index] !== parsedSignature[index]) {
                found = false;
                break;
            }
        }

        if (found) {
            return {
                address : address,
                size : parsedSignature.length,
            };
        }
    }

    return {
        address : null,
        size : parsedSignature.length
    };
}

module.exports = {
    scanPattern,
};