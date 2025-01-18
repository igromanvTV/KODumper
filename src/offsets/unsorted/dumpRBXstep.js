const { fileAlignment } = require( "../../constants/instructions" );
const config = require( "../../config/patterns.json" )
const { scanPattern } = require( "../../modules/pattern" );
const { toHex } = require( "../../modules/string" );

const dumpRBXstep = (buffer) => {
    return toHex( scanPattern( config.LuaCstep, buffer ).address + fileAlignment );
}

module.exports.dumpRBXstep = dumpRBXstep;