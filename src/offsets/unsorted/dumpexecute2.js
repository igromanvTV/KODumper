const { scanPattern } = require( "../../modules/pattern" );
const config = require( '../../config/patterns.json' );
const { fileAlignment } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );

const dumpExecute2 = (buffer) => {
    return toHex( scanPattern( config.execute2, buffer ).address + fileAlignment );
}

module.exports.dumpExecute2 = dumpExecute2;