const {
    SHIFT
} = require( "../../constants/Instructions" );

const config = require( '../../config/Patterns.json' );

const { ScanPattern } = require( "../../modules/Pattern" );

const DumpTaskScheduler = ( buffer ) => {
    let TaskScheduler = ScanPattern( config.TaskSchedulerPattern, buffer );
    let TaskSchedulerRelative = buffer.readUInt32LE( TaskScheduler.offset );

    return TaskSchedulerRelative + TaskScheduler.offset + 4 + SHIFT;
}

module.exports.DumpTaskScheduler = DumpTaskScheduler;