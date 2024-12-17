const { scanPattern } = require( "../../modules/pattern" );
const { instructionsSizes, fileAlignment, opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const { findEpilogue } = require( "../../modules/function" );
const { scanXref } = require( "../../modules/xref" );
const { shuffle } = require( "../../modules/shuffle" );

let config = require( "../../config/patterns.json" );

const dumpLuaStateDecoder = (buffer) => {
    let { address : scriptStartAddress } = scanPattern( config.LuaStateDecoderPattern, buffer );

    if (scriptStartAddress === null) {
        return null;
    }

    let decoderOffset = buffer.readUInt16LE( scriptStartAddress + 3 );

    let nextCallFunction = buffer.indexOf( opCode.call, scriptStartAddress );

    let decoderAddress = buffer.readInt32LE( nextCallFunction + 1 ) + nextCallFunction + instructionsSizes.call + fileAlignment;

    return {
        decoderReference : toHex( decoderOffset ),
        decoderAddress : toHex( decoderAddress )
    }
}

const dumpCallInfo = (buffer) => {
    let { address : pushErrorAddress } = scanPattern( config.LuaPushError, buffer );

    if (pushErrorAddress === null) {
        return null;
    }

    let pushErrorAbsoluteAddress = buffer.readInt32LE( pushErrorAddress + 1 ) + pushErrorAddress + instructionsSizes.call;

    let firstMovAddress = buffer.indexOf( opCode.mov, pushErrorAbsoluteAddress );

    return buffer[firstMovAddress + 2];
}

const dumpGlobal = (buffer) => {
    let { address : freeArrayAddress } = scanPattern( config.LuaFreeArray, buffer );
    let epilogueAddress = findEpilogue( freeArrayAddress, buffer );
    let jzInstructions = [];

    if (freeArrayAddress === null || epilogueAddress === null) {
        return null;
    }

    for (let address = freeArrayAddress; address <= epilogueAddress; address++) {
        let op = buffer[address];

        if (op === opCode.jz) {
            jzInstructions.push( address );
        }
    }

    if (jzInstructions.length >= 3) {
        let thirdInstructionAddress = jzInstructions[3];
        for (let address = thirdInstructionAddress; address <= epilogueAddress; address++) {
            let op = buffer[address + 1];

            if ([ opCode.mov, opCode.lea ].includes( op )) {
                return buffer[address + 3];
            }
        }
    }

    return null;
}

const dumpStack = (buffer) => {
    let [ stackAddress ] = scanXref( ',"stack":[', buffer );

    if (stackAddress === null) {
        return null;
    }

    for (let address = stackAddress; address < stackAddress + 100; address++) {
        if (buffer[address] === 0x49 && buffer[address + 1] === 0x8B) {
            return buffer[address + 3];
        }
    }

    return null;
}

const dumpLuaState = (buffer) => {
    let { address : luaStateAddress, size : luaStateMatchSize } = scanPattern( config.LuaStateGetterPattern, buffer );
    let { address : luaStateTopBaseAddress } = scanPattern( config.TopBasePattern, buffer );

    if (luaStateAddress === null || luaStateTopBaseAddress === null) {
        return null;
    }

    let luaStateFieldAddress = buffer.readUInt16LE( luaStateAddress + 3 );
    let luaStateGetterAddress = (
        buffer.readUInt32LE( luaStateAddress + luaStateMatchSize - 4 ) + (
            luaStateAddress + luaStateMatchSize - 5
        ) + instructionsSizes.call + fileAlignment
    );

    let decoder = dumpLuaStateDecoder( buffer );

    let top = buffer[luaStateTopBaseAddress + 3];
    let base = buffer[luaStateTopBaseAddress + 7];
    let global = dumpGlobal( buffer );
    let callInfo = dumpCallInfo( buffer );
    let stack = dumpStack( buffer );
    let stackLast = null;

    for (let address = 8; address < 0x30; address += 8) {
        if (![ top, base, global, callInfo, stack ].includes( address )) {
            stackLast = address;
        }
    }

    let shuffle6 = shuffle( [ top, base, global, callInfo, stackLast, stack ], 8, 8 );

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
        shuffles : {
            shuffle6 : shuffle6,
        },
    }
}

module.exports.dumpLuaState = dumpLuaState;