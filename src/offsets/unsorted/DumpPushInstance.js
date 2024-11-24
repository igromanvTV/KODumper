const { scanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { SHIFT } = require( "../../constants/Instructions" );
const DumpPushInstance = ( buffer ) => {
    return scanPattern( config.PushInstancePattern, buffer ).offset + SHIFT;
}

module.exports.DumpPushInstance = DumpPushInstance;