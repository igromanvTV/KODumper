/**
 * Парсинг сигнатуры с строчного вида в массив из байтов
 * @param signature
 * @returns {(null|number)[]}
 * @constructor
 */

const parse = (signature) => {
    return signature.split( " " ).map( byte => byte === '?' ? null : parseInt( byte, 16 ) );
}

/**
 * Сканирование сигнатуры из памяти
 * @param signature
 * @param buffer
 * @param start
 * @param end
 * @returns {number|{offset: number, size: number}|TypeError}
 */

const scanPattern = (signature, buffer, start = 0, end = 0) => {
    if (typeof signature !== 'string') {
        return new TypeError( "The provided argument is not a String" );
    }

    let parsedSignature = parse( signature );

    // Простая реализация pattern сканнера

    for (let offset = start; offset < (end !== 0 ? end : buffer.length - parsedSignature.length); offset++) {
        let index = 0;
        let found = true;

        for (index = 0; index < parsedSignature.length; index++) {
            if (parsedSignature[index] !== null && buffer[offset + index] !== parsedSignature[index]) {
                found = false;
                break;
            }
        }

        if (found) {
            return {
                offset : offset,
                size : parsedSignature.length,
            };
        }
    }

    return null;
}

module.exports = {
    scanPattern,
};