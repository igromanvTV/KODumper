const { fileAlignment } = require( "../../constants/instructions" );
const config = require( "../../config/patterns.json" )
const { scanPattern } = require( "../../modules/pattern" );
const { toHex } = require( "../../modules/string" );

const dumpgetState = (buffer) => {
    return toHex( scanPattern( config.RBXgetstatePattern, buffer ).address + fileAlignment );
}

module.exports.dumpgetState = dumpgetState;