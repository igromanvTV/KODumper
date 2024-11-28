const { scanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { shift } = require( "../../constants/Instructions" );
const dumpPushInstance = ( buffer ) => {
    return scanPattern( config.PushInstancePattern, buffer ).offset + shift;
}

module.exports.dumpPushInstance = dumpPushInstance;