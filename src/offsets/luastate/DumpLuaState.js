const { scanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const { InstructionSizes, SHIFT } = require( "../../constants/Instructions" );
/**
 *
 * @param buffer
 * @returns {{reference: number, offset: number, fields: {top: string, base: string}}}
 * @constructor
 */

const DumpLuaState = ( buffer ) => {
    const luaStateGetterMatch = scanPattern( config.LuaStateGetterPattern, buffer );
    const luaStateTopBaseMatch = scanPattern( config.TopBasePattern, buffer );
    const luaFreeArrayMatch = scanPattern( "48 89 5C 24 ? 48 89 74 24 ? 57 48 83 EC 30 48 8B DA 49 8B F0", buffer );

    const luaStateFieldOffset = buffer.readUInt16LE( luaStateGetterMatch.offset + 3 );
    const luaStateGetterOffset = (
        buffer.readUInt32LE( luaStateGetterMatch.offset + luaStateGetterMatch.size - 4 ) + (
            luaStateGetterMatch.offset + luaStateGetterMatch.size - 5
        ) + InstructionSizes.CALL
    );

    let top = buffer.readUInt8( luaStateTopBaseMatch.offset + 3 );
    let base = buffer.readUInt8( luaStateTopBaseMatch.offset + 7 );

    return {
        offset: luaStateGetterOffset + SHIFT,
        reference: luaStateFieldOffset,
        fields: {
            top,
            base
        }
    }
}

module.exports.DumpLuaState = DumpLuaState;