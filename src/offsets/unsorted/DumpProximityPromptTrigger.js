const { ScanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { SHIFT } = require( "../../constants/Instructions" );

const DumpProximityPromptTrigger = ( buffer ) => {
    return ScanPattern( config.ProximityPromptTriggerPattern, buffer ).offset + SHIFT;
}

module.exports.DumpProximityPromptTrigger = DumpProximityPromptTrigger;