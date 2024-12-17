/**
 *
 * @param name
 * @param buffer
 * @returns {number|{pointer: number, size: number, virtualAddress: number}|Error}
 * @constructor
 */
const findSection = (name, buffer) => {
    const peHeaderAddress = buffer.readUInt32LE( 0x3C );
    const peSignature = buffer.toString( "utf-8", peHeaderAddress, peHeaderAddress + 4 );

    if (peSignature === 'PE\x00\x00') {
        const peNumberOfSections = buffer.readUint8( peHeaderAddress + 6 );
        const peHeaderSize = buffer.readUInt16LE( peHeaderAddress + 20 );

        const sectionTableAddress = peHeaderAddress + 24 + peHeaderSize;

        for (let index = 0; index < peNumberOfSections; index++) {
            const sectionAddress = sectionTableAddress + (index * 40);
            const sectionName = buffer.toString( "utf-8", sectionAddress, sectionAddress + 8 ).replace( /\0/g, '' );
            const sectionRawDataPointer = buffer.readUInt32LE( sectionAddress + 20 );
            const sectionSizeOfRawData = buffer.readUInt32LE( sectionAddress + 16 );
            const sectionVirtualAddress = buffer.readUInt32LE( sectionAddress + 12 );
            const sectionFileAlignment = buffer.readUInt32LE( sectionTableAddress + 0x38 );

            if (sectionName === name) {
                return {
                    "virtualAddress" : sectionVirtualAddress,
                    "pointer" : sectionRawDataPointer,
                    "size" : sectionSizeOfRawData,
                    "fileAlignment" : sectionFileAlignment,
                };
            }
        }
    }

    return null;
}


module.exports = {
    findSection
}