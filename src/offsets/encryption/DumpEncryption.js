const { ScanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { FindEpilogue } = require( "../../modules/Function" );
const { toHex } = require( "../../modules/String" );

const ParseEncryption = ( startAddress, buffer ) => {
    // encryption instruction brute forcing

    const Epilogue = FindEpilogue( startAddress, buffer );

    while (startAddress !== Epilogue) {

        const FirstInstruction = buffer[startAddress];

        if ( FirstInstruction === 0x48 ) {
            const SecondInstruction = buffer.readUInt8( startAddress + 2 );
            const ThirdInstruction = buffer.readUInt8( startAddress + 3 );
        }

        startAddress++;
    }
}

const DumpGlobalEncryption = ( buffer ) => {
    const LuaFreeProto = ScanPattern( config.LuaStateFreeProto, buffer );


    return "";
}

module.exports = {
    DumpGlobalEncryption
}