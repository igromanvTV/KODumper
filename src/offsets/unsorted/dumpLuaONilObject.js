const config = require( "../../config/patterns.json" )

const { scanPattern } = require( "../../modules/pattern" );

const {
    fileAlignment,
    instructionsSizes, opCode
} = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );

const dumpLuaONilObject = (buffer) => {
    let {
        address : LuaONilObjectAddress,
        size : LuaONilObjectSize
    } = scanPattern( config.LuaONilObjectPattern, buffer );

    if (LuaONilObjectAddress === null) {
        return null;
    }

    for (let address = LuaONilObjectAddress; address <= LuaONilObjectAddress + LuaONilObjectSize; address++) {
        if (buffer[address] === opCode.rex && buffer[address + 1] === opCode.lea) {
            let luaONilObjectRelative = buffer.readInt32LE( address + 3 );
            let luaONilObjectAbsolute = luaONilObjectRelative + address + instructionsSizes.lea; // lea is instruction size (7)

            return toHex( luaONilObjectAbsolute + fileAlignment );
        }
    }

    return null;
}

module.exports.dumpLuaONilObject = dumpLuaONilObject;