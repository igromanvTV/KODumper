const config = require( "../../config/patterns.json" );

const { scanPattern } = require( "../../modules/pattern" );
const { instructionsSizes, shift, opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const { findEpilogue } = require( "../../modules/function" );
const { scanXref } = require( "../../modules/xref" );

const dumpLuaStateDecoder = (buffer) => {
    const luaStateDecoderMatch = scanPattern( config.LuaStateDecoderPattern, buffer );

    const decoderFieldOffset = buffer.readUInt16LE( luaStateDecoderMatch.offset + 3 );

    while (buffer[luaStateDecoderMatch.offset] !== 0xE8) {
        luaStateDecoderMatch.offset++;
    }

    const decoderOffset = buffer.readInt32LE( luaStateDecoderMatch.offset + 1 ) + luaStateDecoderMatch.offset + instructionsSizes.CALL + shift;

    return {
        reference : toHex( decoderFieldOffset ),
        address : toHex( decoderOffset )
    }
}

const dumpCallInfo = (buffer) => {
    const luaPushErrorMatch = scanPattern( config.LuaPushError, buffer );
    let luaPushErrorAddress = buffer.readInt32LE( luaPushErrorMatch.offset + 1 ) + luaPushErrorMatch.offset + instructionsSizes.CALL;

    while (buffer[luaPushErrorAddress] !== opCode.MOV) {
        luaPushErrorAddress++
    }


    return buffer[luaPushErrorAddress + 2];
}

const dumpGlobal = (buffer) => {
    const luaFreeArrayMatch = scanPattern( config.LuaFreeArray, buffer );
    const luaFreeArrayMatchEpilogueAddress = findEpilogue( luaFreeArrayMatch.offset, buffer );

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
                    return buffer[thirdJzInstructionAddress + 3];
                }
                thirdJzInstructionAddress++;
            }
        }

        luaFreeArrayMatch.offset++;
    }

    return null;
}

const dumpStack = (buffer) => {
    const stackStringXrefs = scanXref( ',"stack":[', buffer );

    let dumpStackAddress = stackStringXrefs.length > 0 ? stackStringXrefs[0] : null;

    if (dumpStackAddress === null) {
        return null;
    }

    for (let offset = dumpStackAddress; offset < dumpStackAddress + 50; offset++) {
        if (buffer[offset] === 0x49 && buffer[offset + 1] === 0x8B && buffer[offset + 2] === 0x5D) {
            return buffer[offset + 3];
        }
    }

    return null;
}

const dumpLuaState = (buffer) => {
    const luaStateGetterMatch = scanPattern( config.LuaStateGetterPattern, buffer );
    const luaStateTopBaseMatch = scanPattern( config.TopBasePattern, buffer );

    const luaStateFieldOffset = buffer.readUInt16LE( luaStateGetterMatch.offset + 3 );
    const luaStateGetterOffset = (
        buffer.readUInt32LE( luaStateGetterMatch.offset + luaStateGetterMatch.size - 4 ) + (
            luaStateGetterMatch.offset + luaStateGetterMatch.size - 5
        ) + instructionsSizes.CALL + shift
    );

    /* Decoder */

    let decoder = dumpLuaStateDecoder( buffer );

    /* Lua state fields */

    let top = buffer.readUInt8( luaStateTopBaseMatch.offset + 3 );
    let base = buffer.readUInt8( luaStateTopBaseMatch.offset + 7 );
    let global = dumpGlobal( buffer );
    let callInfo = dumpCallInfo( buffer );
    let stack = dumpStack( buffer );
    let stackLast = null;

    for (let offset = 8; offset < 0x30; offset += 8) {
        if (![top, base, global, callInfo, stack].includes( offset )) {
            stackLast = offset;
        }
    }

    return {
        offset : toHex( luaStateGetterOffset ),
        reference : toHex( luaStateFieldOffset ),
        decoder : decoder,
        fields : {
            top : toHex( top ),
            base : toHex( base ),
            global : toHex( global ),
            callInfo : toHex( callInfo ),
            stackLast : toHex( stackLast ),
            stack : toHex( stack ),
        },
        encryption : {
            global : "none",
        }
    }
}

module.exports = { dumpLuaState };