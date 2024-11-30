const config = require( "../../config/patterns.json" );

const { scanPattern } = require( "../../modules/pattern" );
const { instructionsSizes, shift, opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const { findEpilogue } = require( "../../modules/function" );
const { scanXref } = require( "../../modules/xref" );

const dumpLuaStateDecoder = (buffer) => {
    const { offset : decoderAddress } = scanPattern( config.LuaStateDecoderPattern, buffer );
    const decoderFieldAddress = buffer.readUInt16LE( decoderAddress + 3 );

    if (decoderAddress === null || decoderFieldAddress === null) {
        return 0;
    }

    let nextCallFunction = buffer.indexOf( opCode.CALL, decoderAddress );

    const decoderOffset = buffer.readInt32LE( nextCallFunction + 1 ) + nextCallFunction + instructionsSizes.CALL + shift;

    return {
        decoderReference : toHex( decoderFieldAddress ),
        decoderAddress : toHex( decoderOffset )
    }
}

const dumpCallInfo = (buffer) => {
    let { offset : pushErrorAddress } = scanPattern( config.LuaPushError, buffer );

    if (pushErrorAddress === null) {
        return 0;
    }

    let pushErrorAbsoluteAddress = buffer.readInt32LE( pushErrorAddress + 1 ) + pushErrorAddress + instructionsSizes.CALL;

    let firstMovAddress = buffer.indexOf( opCode.MOV, pushErrorAbsoluteAddress );

    return buffer[firstMovAddress + 2];
}

const dumpGlobal = (buffer) => {
    let { offset : freeArrayAddress } = scanPattern( config.LuaFreeArray, buffer );
    let epilogueAddress = findEpilogue( freeArrayAddress, buffer );
    let jzInstructions = [];

    if (freeArrayAddress === null || epilogueAddress === null) {
        return 0;
    }

    for (let offset = freeArrayAddress; offset <= epilogueAddress; offset++) {
        let memoryOpCode = buffer[offset];

        if (memoryOpCode === opCode.JZ) {
            jzInstructions.push( offset );
        }
    }

    if (jzInstructions.length >= 3) {
        let thirdInstructionAddress = jzInstructions[3];
        for (let offset = thirdInstructionAddress; offset <= epilogueAddress; offset++) {
            let memoryOpCode = buffer[offset + 1];

            if ([ opCode.MOV, opCode.LEA ].includes( memoryOpCode )) {
                return buffer[offset + 3];
            }
        }
    }

    return 0;
}

const dumpStack = (buffer) => {
    const [ stackAddress ] = scanXref( ',"stack":[', buffer );

    if (stackAddress === null) {
        return 0;
    }

    for (let offset = stackAddress; offset < stackAddress + 50; offset++) {
        if (buffer[offset] === 0x49 && buffer[offset + 1] === 0x8B && buffer[offset + 2] === 0x5D) {
            return buffer[offset + 3];
        }
    }

    return 0;
}

const dumpLuaState = (buffer) => {
    let { offset : luaStateAddress, size : luaStateMatchSize } = scanPattern( config.LuaStateGetterPattern, buffer );
    let { offset : luaStateTopBaseAddress } = scanPattern( config.TopBasePattern, buffer );

    if (luaStateAddress === null || luaStateTopBaseAddress === null) {
        return 0;
    }

    let luaStateFieldAddress = buffer.readUInt16LE( luaStateAddress + 3 );
    let luaStateGetterAddress = (
        buffer.readUInt32LE( luaStateAddress + luaStateMatchSize - 4 ) + (
            luaStateAddress + luaStateMatchSize - 5
        ) + instructionsSizes.CALL + shift
    );

    let decoder = dumpLuaStateDecoder( buffer );

    let top = buffer[luaStateTopBaseAddress + 3];
    let base = buffer[luaStateTopBaseAddress + 7];
    let global = dumpGlobal( buffer );
    let callInfo = dumpCallInfo( buffer );
    let stack = dumpStack( buffer );
    let stackLast = null;

    for (let offset = 8; offset < 0x30; offset += 8) {
        if (![ top, base, global, callInfo, stack ].includes( offset )) {
            stackLast = offset;
        }
    }

    return {
        luaStateAddress : toHex( luaStateGetterAddress ),
        luaStateReference : toHex( luaStateFieldAddress ),
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

module.exports.dumpLuaState = dumpLuaState;