const config = require( "../../config/Patterns.json" );

const { scanPattern } = require( "../../modules/Pattern" );
const { instructionsSizes, shift, opCode } = require( "../../constants/Instructions" );
const { toHex } = require( "../../modules/String" );
const { findEpilogue } = require( "../../modules/Function" );

/**
 *
 * @param buffer
 * @returns {{reference: number, offset: number}}
 * @constructor
 */

const dumpLuaStateDecoder = (buffer) => {
    const luaStateDecoderMatch = scanPattern( config.LuaStateDecoderPattern, buffer );

    const decoderFieldOffset = buffer.readUInt16LE( luaStateDecoderMatch.offset + 3 );

    while (buffer[luaStateDecoderMatch.offset] !== 0xE8) {
        luaStateDecoderMatch.offset++;
    }

    const decoderOffset = buffer.readInt32LE( luaStateDecoderMatch.offset + 1 ) + luaStateDecoderMatch.offset + instructionsSizes.CALL + shift;

    return {
        offset: decoderOffset,
        reference: decoderFieldOffset
    }
}

const dumpCallinfoField = (buffer) => {
    const luaPushError = scanPattern( config.LuaPushError, buffer );

    const callInstructions = [];

    while (buffer.readUInt16LE( luaPushError.offset ) !== 0xCCCC) {
        if (buffer[luaPushError.offset] === opCode.CALL) {
            callInstructions.push( luaPushError.offset );
        }

        if (callInstructions.length >= 4) {
            const pushErrorCall = callInstructions[2];

            let pushErrorAddress = buffer.readInt32LE( pushErrorCall + 1 ) + luaPushError.offset + shift - instructionsSizes.CALL - 3; // 3 пока что неизвестно
            console.log( toHex( pushErrorAddress ) );


            break;
        } else {
            luaPushError.offset++;
        }
    }
}

const dumpGlobalField = (buffer) => {
    const luaFreeArrayMatch = scanPattern( config.LuaFreeArray, buffer );
    const luaFreeArrayMatchEpilogueAddress = findEpilogue( luaFreeArrayMatch.offset, buffer );

    let global = null;

    let jzInstructions = [];

    while (luaFreeArrayMatch.offset <= luaFreeArrayMatchEpilogueAddress) {
        const memoryOpCode = buffer[luaFreeArrayMatch.offset];

        if (memoryOpCode === opCode.JZ) {
            jzInstructions.push( luaFreeArrayMatch.offset );
        }

        if (jzInstructions.length >= 3) {
            let thirdJzInstructionAddress = jzInstructions[3];
            while (thirdJzInstructionAddress <= luaFreeArrayMatchEpilogueAddress) {
                const memoryOpCode = buffer[thirdJzInstructionAddress + 1];

                if (memoryOpCode === opCode.MOV || memoryOpCode === opCode.LEA) {
                    global = buffer[thirdJzInstructionAddress + 3];
                    break;
                } else {
                    thirdJzInstructionAddress++;
                }
            }
        }

        luaFreeArrayMatch.offset++;
    }

    return global;
}

const dumpLuaState = (buffer) => {
    const luaStateGetterMatch = scanPattern( config.LuaStateGetterPattern, buffer );
    const luaStateTopBaseMatch = scanPattern( config.TopBasePattern, buffer );


    const LuaStateFieldOffset = buffer.readUInt16LE( luaStateGetterMatch.offset + 3 );
    const luaStateGetterOffset = (
        buffer.readUInt32LE( luaStateGetterMatch.offset + luaStateGetterMatch.size - 4 ) + (
            luaStateGetterMatch.offset + luaStateGetterMatch.size - 5
        ) + instructionsSizes.CALL + shift
    );

    let top = buffer.readUInt8( luaStateTopBaseMatch.offset + 3 );
    let base = buffer.readUInt8( luaStateTopBaseMatch.offset + 7 );
    let global = dumpGlobalField( buffer );
    let ci = dumpCallinfoField( buffer );

    return {
        offset: luaStateGetterOffset,
        reference: LuaStateFieldOffset,
        fields: {
            top: top,
            base: base,
            global: global,
            ci: ci
        }
    }
}

module.exports = { dumpLuaState, dumpLuaStateDecoder };