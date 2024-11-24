/**
 *
 * @param name
 * @param buffer
 * @returns {number|{pointer: number, size: number, virtualAddress: number}|Error}
 * @constructor
 */
const FindSection = ( name, buffer ) => {
    try {
        if ( !Buffer.isBuffer( buffer ) || buffer.length < 80 * (1024 * 1024) ) {
            return new Error( "Недейсвительный Buffer" );
        }

        if ( typeof name !== 'string' ) {
            return new Error( "Имя секции должно быть строкой" );
        }

        const PE_HEADER_OFFSET = buffer.readUInt32LE( 0x3C );
        const PE_SIGNATURE = buffer.toString( "utf-8", PE_HEADER_OFFSET, PE_HEADER_OFFSET + 4 );


        if ( PE_SIGNATURE === 'PE\x00\x00' ) {
            const PE_NUMBER_OF_SECTIONS = buffer.readUint8( PE_HEADER_OFFSET + 6 );
            const PE_HEADER_SIZE = buffer.readUInt16LE( PE_HEADER_OFFSET + 20 );

            const SECTIONS_TABLE_OFFSET = PE_HEADER_OFFSET + 24 + PE_HEADER_SIZE;

            for (let index = 0; index < PE_NUMBER_OF_SECTIONS; index++) {
                const sectionOffset = SECTIONS_TABLE_OFFSET + (index * 40);
                const sectionName = buffer.toString( "utf-8", sectionOffset, sectionOffset + 8 ).replace( /\0/g, '' );
                const sectionRawDataPointer = buffer.readUInt32LE( sectionOffset + 20 );
                const sectionSizeOfRawData = buffer.readUInt32LE( sectionOffset + 16 );
                const sectionVirtualAddress = buffer.readUInt32LE( sectionOffset + 12 );

                if ( sectionName === name ) return {
                    "virtualAddress": sectionVirtualAddress,
                    "pointer": sectionRawDataPointer,
                    "size": sectionSizeOfRawData
                };
            }
        }
    } catch ( error ) {
        console.error( error );
    }

    return -1;
}

module.exports = {
    FindSection
}