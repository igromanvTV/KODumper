const config = require( "../../config/Patterns.json" )

const { scanPattern } = require( "../../modules/Pattern" );

const {
    SHIFT,
    InstructionSizes
} = require( "../../constants/Instructions" );


const DumpLuaONilObject = ( buffer ) => {
    let luaONilObject = scanPattern( config.LuaONilObjectPattern, buffer );
    let luaONilObjectRelative = buffer.readInt32LE( luaONilObject.offset + luaONilObject.size );
    let luaONilObjectNext = (luaONilObject.offset + luaONilObject.size) + InstructionSizes.LEA; // LEA is instruction size (7)

    // 3 is start instruction bytes 48 8D 05
    return luaONilObjectNext + luaONilObjectRelative + SHIFT - 3;
}

module.exports.DumpLuaONilObject = DumpLuaONilObject;