const {
    shift
} = require( "../../constants/instructions" );

const config = require( '../../config/patterns.json' );

const { scanPattern } = require( "../../modules/pattern" );
const { toHex } = require( "../../modules/string" );

const dumpTaskScheduler = (buffer) => {
    let TaskScheduler = scanPattern( config.TaskSchedulerPattern, buffer );
    let TaskSchedulerRelative = buffer.readUInt32LE( TaskScheduler.offset );

    return toHex( TaskSchedulerRelative + TaskScheduler.offset + 4 + shift );
}

module.exports.dumpTaskScheduler = dumpTaskScheduler;