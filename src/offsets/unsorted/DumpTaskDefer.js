const { scanPattern } = require( "../../modules/Pattern" );
const config = require( '../../config/Patterns.json' );
const { shift } = require( "../../constants/Instructions" );
const dumpTaskDefer = ( buffer ) => {
    return scanPattern( config.TaskDeferPattern, buffer ).offset + shift;
}

module.exports.dumpTaskDefer = dumpTaskDefer;