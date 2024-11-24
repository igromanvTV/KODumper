const { scanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const {
    InstructionSizes,
    SHIFT
} = require( "../../constants/Instructions" );
const { hex } = require( "../../modules/String" );

const DumpLuaStateDecoder = ( buffer ) => {
    const luaStateDecoderMatch = scanPattern( config.LuaStateDecoderPattern, buffer );

    const luaStateDecoderFieldOffset = buffer.readUInt16LE( luaStateDecoderMatch.offset + 3 );

    const luaStateDecoderOffset = (
        buffer.readUIntLE( luaStateDecoderMatch.offset + luaStateDecoderMatch.size - 7, 3 ) +
        (
            luaStateDecoderMatch.offset + luaStateDecoderMatch.size - 8
        ) +
        InstructionSizes.CALL -
        SHIFT
    );

    console.log( hex( (
        buffer.readUIntLE( luaStateDecoderMatch.offset + luaStateDecoderMatch.size - 7, 3 ) +
        (
            luaStateDecoderMatch.offset + luaStateDecoderMatch.size - 8
        ) +
        InstructionSizes.CALL + SHIFT
    ) ) );
    return {
        offset: luaStateDecoderOffset,
        reference: luaStateDecoderFieldOffset
    }
}

module.exports.DumpLuaStateDecoder = DumpLuaStateDecoder;