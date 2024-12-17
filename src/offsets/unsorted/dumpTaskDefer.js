const { scanPattern } = require( "../../modules/pattern" );
const config = require( '../../config/patterns.json' );
const { fileAlignment } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const dumpTaskDefer = (buffer) => {
    return toHex( scanPattern( config.TaskDeferPattern, buffer ).address + fileAlignment );
}

module.exports.dumpTaskDefer = dumpTaskDefer;