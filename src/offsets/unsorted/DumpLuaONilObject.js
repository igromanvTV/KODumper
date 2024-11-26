const config = require( "../../config/Patterns.json" )

const { ScanPattern } = require( "../../modules/Pattern" );

const {
    SHIFT,
    InstructionSizes
} = require( "../../constants/Instructions" );


const DumpLuaONilObject = ( buffer ) => {
    let LuaONilObject = ScanPattern( config.LuaONilObjectPattern, buffer );
    let LuaONilObjectRelative = buffer.readInt32LE( LuaONilObject.offset + LuaONilObject.size );
    let LuaONilObjectNext = (LuaONilObject.offset + LuaONilObject.size) + InstructionSizes.LEA; // LEA is instruction size (7)

    // 3 is start instruction bytes 48 8D 05
    return LuaONilObjectNext + LuaONilObjectRelative + SHIFT - 3;
}

module.exports.DumpLuaONilObject = DumpLuaONilObject;