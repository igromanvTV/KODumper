const { shift } = require( "../../constants/Instructions" );
const config = require( "../../config/Patterns.json" )
const { scanPattern } = require( "../../modules/Pattern" );

const dumpRBXPrint = ( buffer ) => {
    return scanPattern( config.RBXPrintPattern, buffer ).offset + shift;
}

module.exports.dumpRBXPrint = dumpRBXPrint;