const { scanPattern } = require( "../../modules/pattern" );
const config = require( "../../config/patterns.json" );
const { shift } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );

const dumpProximityPromptTrigger = (buffer) => {
    return toHex( scanPattern( config.ProximityPromptTriggerPattern, buffer ).offset + shift );
}

module.exports.dumpProximityPromptTrigger = dumpProximityPromptTrigger;