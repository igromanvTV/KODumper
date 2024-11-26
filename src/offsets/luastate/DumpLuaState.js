const { ScanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { InstructionSizes, SHIFT } = require( "../../constants/Instructions" );
const { toHex } = require( "../../modules/String" );
/**
 *
 * @param buffer
 * @returns {{reference: number, offset: number, fields: {Top: number, Base: number}}}
 * @constructor
 */

const DumpLuaState = ( buffer ) => {
    const LuaStateGetterMatch = ScanPattern( config.LuaStateGetterPattern, buffer );
    const TopBaseMatch = ScanPattern( config.TopBasePattern, buffer );
    const LuaFreeArrayMatch = ScanPattern( "48 89 5C 24 ? 48 89 74 24 ? 57 48 83 EC 30 48 8B DA 49 8B F0", buffer );

    const LuaStateFieldOffset = buffer.readUInt16LE( LuaStateGetterMatch.offset + 3 );
    const GetterOffset = (
        buffer.readUInt32LE( LuaStateGetterMatch.offset + LuaStateGetterMatch.size - 4 ) + (
            LuaStateGetterMatch.offset + LuaStateGetterMatch.size - 5
        ) + InstructionSizes.CALL
    );

    let Top = buffer.readUInt8( TopBaseMatch.offset + 3 );
    let Base = buffer.readUInt8( TopBaseMatch.offset + 7 );

    return {
        offset: GetterOffset + SHIFT,
        reference: LuaStateFieldOffset,
        fields: {
            Top,
            Base
        }
    }
}

module.exports.DumpLuaState = DumpLuaState;