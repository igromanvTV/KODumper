const { shift } = require( "../../constants/instructions" );
const config = require( "../../config/patterns.json" )
const { scanPattern } = require( "../../modules/pattern" );
const { toHex } = require( "../../modules/string" );

const dumpRBXPrint = (buffer) => {
    return toHex( scanPattern( config.RBXPrintPattern, buffer ).offset + shift );
}

module.exports.dumpRBXPrint = dumpRBXPrint;