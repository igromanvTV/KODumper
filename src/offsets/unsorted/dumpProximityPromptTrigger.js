const { scanPattern } = require( "../../modules/pattern" );
const config = require( "../../config/patterns.json" );
const { fileAlignment } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );

const dumpProximityPromptTrigger = (buffer) => {
    return toHex( scanPattern( config.ProximityPromptTriggerPattern, buffer ).address + fileAlignment );
}

module.exports.dumpProximityPromptTrigger = dumpProximityPromptTrigger;