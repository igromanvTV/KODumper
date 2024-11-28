const {
    shift
} = require( "../../constants/Instructions" );

const config = require( '../../config/Patterns.json' );

const { scanPattern } = require( "../../modules/Pattern" );

const dumpTaskScheduler = ( buffer ) => {
    let TaskScheduler = scanPattern( config.TaskSchedulerPattern, buffer );
    let TaskSchedulerRelative = buffer.readUInt32LE( TaskScheduler.offset );

    return TaskSchedulerRelative + TaskScheduler.offset + 4 + shift;
}

module.exports.dumpTaskScheduler = dumpTaskScheduler;