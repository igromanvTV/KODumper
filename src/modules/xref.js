const {
    shift,
    instructionsSizes, opCode
} = require( "../constants/instructions" );

const { findSection } = require( "./section" );
const { terminate } = require( "./string" );

/**
 * Парсинг абсолютного адреса с найденой строки
 * @param buffer
 * @param section
 * @param offset
 * @returns {*[]}
 * @constructor
 */
const findXrefLinks = (buffer, section, offset) => {
    const links = [];

    for (let sectionOffset = section.pointer; sectionOffset <= section.pointer + section.size; sectionOffset++) {
        const byte = buffer.readUInt8( sectionOffset );

        if (byte === opCode.REX) // LEA offset
        {
            // рассчитывание смещения в памяти
            const relative = buffer.readInt32LE( sectionOffset + 3 );
            const absolute = (
                relative + sectionOffset + instructionsSizes.LEA
            );

            // если абослютное смещение соотвествует искомому смещению - сдвиг

            if (absolute === offset - shift) links.push( sectionOffset );
        }
    }

    return links;
};

/**
 * Поиск ссылки на строки из фукнций
 * @param target
 * @param buffer
 * @returns {Error|null|*[]}
 * @constructor
 */

const scanXref = (target, buffer) => {
    if (typeof target !== 'string') {
        throw new TypeError( "The provided argument is not a String" );
    }

    if (!Buffer.isBuffer( buffer ) || buffer.length < 80 * (
        1024 * 1024
    )) {
        throw new TypeError( "The provided argument is not a Buffer or Buffer size is invalid ( > 80)" );
    }

    const rdataSection = findSection( ".rdata", buffer );
    const textSection = findSection( ".text", buffer );
    const rdataSectionOffset = rdataSection.pointer;
    const rdataSectionSize = rdataSection.size;

    let string = "";

    for (let offset = rdataSectionOffset; offset < rdataSectionOffset + rdataSectionSize; offset++) {
        // Читаем байт
        const byte = buffer[offset];
        // Если байт равняется 0 (конец строки) и строка ра
        if (byte === 0) {
            if (string === terminate( target )) {
                // получаем ссылки на функции, в которых используется данная строка
                return findXrefLinks( buffer, textSection, offset - target.length + 0x1800 );
            }
            string = '';
        } else {
            // Переводим байт в char код (символ)
            string += String.fromCharCode( byte );
        }
    }
    return null;
}

module.exports = {
    scanXref,
};