const { scanPattern } = require( "../../modules/pattern" );
const config = require( "../../config/patterns.json" );
const { shift } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const dumpPushInstance = (buffer) => {
    return toHex( scanPattern( config.PushInstancePattern, buffer ).offset + shift );
}

module.exports.dumpPushInstance = dumpPushInstance;