const { scanPattern } = require( "../../modules/pattern" );
const { opCode, instructionsSizes, fileAlignment } = require( "../../constants/instructions" );

const config = require( "../../config/patterns.json" );
const { toHex } = require( "../../modules/string" );

const dumpDummyNode = (buffer) => {
    let { address : dumpTableAddress } = scanPattern( config.DumpTable, buffer );

    if (dumpTableAddress === null) {
        return null;
    }

    for (let address = dumpTableAddress; address < dumpTableAddress + 30; address++) {
        address = address + 2;
        let firstByte = buffer[address];
        let secondByte = buffer[address + 1];

        if (firstByte === opCode.rex && secondByte === opCode.lea) {
            let unkRelativeAddress = buffer.readUInt32LE( address + 3 );
            let unkAbsoluteAddress = unkRelativeAddress + address + instructionsSizes.lea;

            return toHex( unkAbsoluteAddress + fileAlignment );
        }
    }

    return null;
}

module.exports.dumpDummyNode = dumpDummyNode;
