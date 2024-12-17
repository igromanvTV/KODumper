const { scanPattern } = require( "../../modules/pattern" );
const { fileAlignment } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );

const config = require( "../../config/patterns.json" );

const dumpLuaVmLoad = (buffer) => {
    return toHex( scanPattern( config.LuaVMLoad, buffer ).address + fileAlignment );
}

module.exports.dumpLuaVmLoad = dumpLuaVmLoad;