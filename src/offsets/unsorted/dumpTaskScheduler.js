const {
    fileAlignment
} = require( "../../constants/instructions" );

const config = require( '../../config/patterns.json' );

const { scanPattern } = require( "../../modules/pattern" );
const { toHex } = require( "../../modules/string" );

const dumpTaskScheduler = (buffer) => {
    let TaskScheduler = scanPattern( config.TaskSchedulerPattern, buffer );
    let TaskSchedulerRelative = buffer.readUInt32LE( TaskScheduler.address );

    return toHex( TaskSchedulerRelative + TaskScheduler.address + 4 + fileAlignment );
}

module.exports.dumpTaskScheduler = dumpTaskScheduler;