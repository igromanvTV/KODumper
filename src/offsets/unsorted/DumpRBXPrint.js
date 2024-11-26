const { SHIFT } = require( "../../constants/Instructions" );
const config = require( "../../config/Patterns.json" )
const { ScanPattern } = require( "../../modules/Pattern" );

const DumpRBXPrint = ( buffer ) => {
    return ScanPattern( config.RBXPrintPattern, buffer ).offset + SHIFT;
}

module.exports.DumpRBXPrint = DumpRBXPrint;