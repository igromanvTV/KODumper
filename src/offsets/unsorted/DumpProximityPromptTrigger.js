const { scanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { SHIFT } = require( "../../constants/Instructions" );

const DumpProximityPromptTrigger = ( buffer ) => {
    return scanPattern( config.ProximityPromptTriggerPattern, buffer ).offset + SHIFT;
}

module.exports.DumpProximityPromptTrigger = DumpProximityPromptTrigger;