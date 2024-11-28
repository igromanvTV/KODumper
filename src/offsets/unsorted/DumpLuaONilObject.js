const config = require( "../../config/Patterns.json" )

const { scanPattern } = require( "../../modules/Pattern" );

const {
    shift,
    instructionsSizes
} = require( "../../constants/Instructions" );


const dumpLuaONilObject = ( buffer ) => {
    let LuaONilObject = scanPattern( config.LuaONilObjectPattern, buffer );
    let LuaONilObjectRelative = buffer.readInt32LE( LuaONilObject.offset + LuaONilObject.size );
    let LuaONilObjectNext = (LuaONilObject.offset + LuaONilObject.size) + instructionsSizes.LEA; // LEA is instruction size (7)

    // 3 is start instruction bytes 48 8D 05
    return LuaONilObjectNext + LuaONilObjectRelative + shift - 3;
}

module.exports.dumpLuaONilObject = dumpLuaONilObject;