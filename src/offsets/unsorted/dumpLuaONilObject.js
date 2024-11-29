const config = require( "../../config/patterns.json" )

const { scanPattern } = require( "../../modules/pattern" );

const {
    shift,
    instructionsSizes
} = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );


const dumpLuaONilObject = (buffer) => {
    let LuaONilObject = scanPattern( config.LuaONilObjectPattern, buffer );
    let LuaONilObjectRelative = buffer.readInt32LE( LuaONilObject.offset + LuaONilObject.size );
    let LuaONilObjectNext = (LuaONilObject.offset + LuaONilObject.size) + instructionsSizes.LEA; // LEA is instruction size (7)

    // 3 is start instruction bytes 48 8D 05
    return toHex( LuaONilObjectNext + LuaONilObjectRelative + shift - 3 );
}

module.exports.dumpLuaONilObject = dumpLuaONilObject;