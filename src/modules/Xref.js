const {
    SHIFT,
    InstructionSizes
} = require( "../constants/Instructions" );

const { FindSection } = require( "./Section" );
const { terminate } = require( "./String" );

/**
 * Парсинг абсолютного адреса с найденой строки
 * @param buffer
 * @param section
 * @param offset
 * @returns {*[]}
 * @constructor
 */
const FindXrefLinks = ( buffer, section, offset ) => {
    const links = [];

    for (let sectionOffset = section.pointer; sectionOffset <= section.pointer + section.size; sectionOffset++) {
        const byte = buffer.readUInt8( sectionOffset );

        if ( byte === 0x48 ) // LEA offset
        {
            const relative = buffer.readInt32LE( sectionOffset + 3 );
            const absolute = (
                relative + sectionOffset + InstructionSizes.LEA
            );

            if ( absolute === offset - SHIFT ) links.push( sectionOffset + SHIFT );
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

const scanXref = ( target, buffer ) => {
    if ( typeof target !== 'string' ) {
        throw new TypeError( "The provided argument is not a String" );
    }

    if ( !Buffer.isBuffer( buffer ) || buffer.length < 80 * (
        1024 * 1024
    ) ) {
        throw new TypeError( "The provided argument is not a Buffer or Buffer size is invalid ( > 80)" );
    }

    const rdataSection = FindSection( ".rdata", buffer );
    const textSection = FindSection( ".text", buffer );
    const rdataSectionOffset = rdataSection.pointer;
    const rdataSectionSize = rdataSection.size;

    let string = "";

    for (let offset = rdataSectionOffset; offset < rdataSectionOffset + rdataSectionSize; offset++) {
        // Читаем байт
        const byte = buffer[offset];
        // Если байт равняется 0 (конец строки) и строка ра
        if ( byte === 0 ) {
            if ( string === terminate( target ) ) {
                // получаем ссылки на функции, в которых используется данная строка
                return FindXrefLinks( buffer, textSection, offset - target.length + 0x1800 );
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