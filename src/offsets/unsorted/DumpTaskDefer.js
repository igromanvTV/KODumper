const { ScanPattern } = require( "../../modules/Pattern" );
const config = require( '../../config/Patterns.json' );
const { SHIFT } = require( "../../constants/Instructions" );
const DumpTaskDefer = ( buffer ) => {
    return ScanPattern( config.TaskDeferPattern, buffer ).offset + SHIFT;
}

module.exports.DumpTaskDefer = DumpTaskDefer;