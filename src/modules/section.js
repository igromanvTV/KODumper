/**
 *
 * @param name
 * @param buffer
 * @returns {number|{pointer: number, size: number, virtualAddress: number}|Error}
 * @constructor
 */
const findSection = (name, buffer) => {
    const peHeaderOffset = buffer.readUInt32LE( 0x3C );
    const peSignature = buffer.toString( "utf-8", peHeaderOffset, peHeaderOffset + 4 );

    if (peSignature === 'PE\x00\x00') {
        const peNumberOfSections = buffer.readUint8( peHeaderOffset + 6 );
        const peHeaderSize = buffer.readUInt16LE( peHeaderOffset + 20 );

        const sectionTableOffset = peHeaderOffset + 24 + peHeaderSize;

        for (let index = 0; index < peNumberOfSections; index++) {
            const sectionOffset = sectionTableOffset + (index * 40);
            const sectionName = buffer.toString( "utf-8", sectionOffset, sectionOffset + 8 ).replace( /\0/g, '' );
            const sectionRawDataPointer = buffer.readUInt32LE( sectionOffset + 20 );
            const sectionSizeOfRawData = buffer.readUInt32LE( sectionOffset + 16 );
            const sectionVirtualAddress = buffer.readUInt32LE( sectionOffset + 12 );

            if (sectionName === name) return {
                "virtualAddress" : sectionVirtualAddress,
                "pointer" : sectionRawDataPointer,
                "size" : sectionSizeOfRawData
            };
        }
    }

    return null;
}

module.exports = {
    findSection
}