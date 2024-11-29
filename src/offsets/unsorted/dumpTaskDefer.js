const { scanPattern } = require( "../../modules/pattern" );
const config = require( '../../config/patterns.json' );
const { shift } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const dumpTaskDefer = ( buffer ) => {
    return toHex(scanPattern( config.TaskDeferPattern, buffer ).offset + shift);
}

module.exports.dumpTaskDefer = dumpTaskDefer;