const { scanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { shift } = require( "../../constants/Instructions" );

const dumpProximityPromptTrigger = (buffer) => {
    return scanPattern( config.ProximityPromptTriggerPattern, buffer ).offset + shift;
}

module.exports.dumpProximityPromptTrigger = dumpProximityPromptTrigger;