const { scanPattern } = require( "../../modules/pattern" );
const config = require( '../../config/patterns.json' );
const { fileAlignment } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const dumpExecute1 = (buffer) => {
    return toHex( scanPattern( config.execute1, buffer ).address + fileAlignment );
}

module.exports.dumpExecute1 = dumpExecute1;