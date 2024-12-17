const { scanPattern } = require( "../../modules/pattern" );
const config = require( "../../config/patterns.json" );
const { fileAlignment } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const dumpPushInstance = (buffer) => {
    return toHex( scanPattern( config.PushInstancePattern, buffer ).address + fileAlignment );
}

module.exports.dumpPushInstance = dumpPushInstance;