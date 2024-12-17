const { fileAlignment } = require( "../../constants/instructions" );
const config = require( "../../config/patterns.json" )
const { scanPattern } = require( "../../modules/pattern" );
const { toHex } = require( "../../modules/string" );

const dumpRBXPrint = (buffer) => {
    return toHex( scanPattern( config.RBXPrintPattern, buffer ).address + fileAlignment );
}

module.exports.dumpRBXPrint = dumpRBXPrint;