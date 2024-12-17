const {
    fileAlignment,
    instructionsSizes, opCode
} = require( "../constants/instructions" );

const { findSection } = require( "./section" );
const { terminate } = require( "./string" );

/**
 * Парсинг абсолютного адреса с найденой строки
 * @param buffer
 * @param textSection
 * @param rdataSection
 * @param stringOffset
 * @returns {*[]}
 * @constructor
 */

const findReferences = (buffer, textSection, rdataSection, stringOffset) => {
    let links = [];

    for (let sectionOffset = textSection.pointer; sectionOffset < textSection.pointer +
    textSection.size; sectionOffset++) {
        let byte = buffer.readUInt8( sectionOffset );
        let nextByte = buffer.readUInt8( sectionOffset + 1 );

        if (byte === opCode.rex && nextByte === opCode.lea) {
            let relativeAddress = buffer.readInt32LE( sectionOffset + 3 );
            let absoluteAddress = relativeAddress + sectionOffset + instructionsSizes.lea + fileAlignment;

            let rvaStringAddress = stringOffset - rdataSection.pointer + rdataSection.virtualAddress

            if (absoluteAddress === rvaStringAddress) {
                links.push( sectionOffset );
            }
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
    let rdataSection = findSection( ".rdata", buffer );
    let textSection = findSection( ".text", buffer );

    let string = "";

    for (let address = rdataSection.pointer; address < rdataSection.pointer + rdataSection.size; address++) {
        let byte = buffer[address];

        if (byte === 0) { // null terminator
            if (string === terminate( target )) {
                return findReferences( buffer, textSection, rdataSection, address - target.length );
            }
            string = ""; // clear string (if no results)
        } else {
            string += String.fromCharCode( byte );
        }
    }

    return null;
}

module.exports = {
    scanXref,
};