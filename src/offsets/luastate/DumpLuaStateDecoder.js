const { ScanPattern } = require( "../../modules/Pattern" );
const config = require( "../../config/Patterns.json" );
const {
    InstructionSizes,
    SHIFT
} = require( "../../constants/Instructions" );
const { toHex } = require( "../../modules/String" );

const DumpLuaStateDecoder = ( buffer ) => {
    const LuaStateDecoderMatch = ScanPattern( config.LuaStateDecoderPattern, buffer );

    const LuaStateDecoderFieldOffset = buffer.readUInt16LE( LuaStateDecoderMatch.offset + 3 );

    const DecoderOffset = (
        buffer.readUIntLE( LuaStateDecoderMatch.offset + LuaStateDecoderMatch.size - 7, 3 ) +
        (
            LuaStateDecoderMatch.offset + LuaStateDecoderMatch.size - 8
        ) +
        InstructionSizes.CALL -
        SHIFT
    );

    return {
        offset: DecoderOffset,
        reference: LuaStateDecoderFieldOffset
    }
}

module.exports.DumpLuaStateDecoder = DumpLuaStateDecoder;