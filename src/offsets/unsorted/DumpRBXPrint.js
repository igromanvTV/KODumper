const { SHIFT } = require( "../../constants/Instructions" );
const config = require( "../../config/Patterns.json" )
const { scanPattern } = require( "../../modules/Pattern" );

const DumpRBXPrint = ( buffer ) => {
    return scanPattern( config.RBXPrintPattern, buffer ).offset + SHIFT;
}

module.exports.DumpRBXPrint = DumpRBXPrint;