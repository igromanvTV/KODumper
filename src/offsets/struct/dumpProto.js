const { scanXref } = require( "../../modules/xref" );
const { scanPattern } = require( "../../modules/pattern" );
const { findEpilogue } = require( "../../modules/function" );
const { opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const { shuffle } = require( "../../modules/shuffle" );

const config = require( "../../config/patterns.json" );

const dumpLineDefined = (buffer) => {
    let dumpThread = scanXref( ':%d:%s\"', buffer );

    if (dumpThread.length === 0) {
        return null;
    }

    let dumpThreadFirstAddress = dumpThread[0];

    for (let address = dumpThreadFirstAddress - 30; address < dumpThreadFirstAddress; address++) {
        if (buffer[address] === opCode.rexr && buffer[address + 1] === opCode.mov) {
            let offset = buffer[address + 3];

            if (offset >= 0x88) {
                return offset;
            }
        }
    }
}

const dumpBytecodeId = (buffer) => {
    let { address : vmLoadAddress } = scanPattern( config.LuaVMLoad, buffer );

    let {
        address : newProtoAddress,
        size : newProtoSize
    } = scanPattern( "89 ? ? ? ? ? 0F 83 ? ? ? ? 48 ? ? E8 ? ? ? ?", buffer, vmLoadAddress ); // this pattern from luavmload function (first new proto function)

    if (!vmLoadAddress || !newProtoAddress) {
        return null;
    }

    for (let address = newProtoAddress; address < newProtoAddress + newProtoSize + 40; address++) {
        if (buffer[address] === opCode.movrm64 && buffer[address + 1] !== opCode.movrm64) {
            let offset = buffer[address + 2];

            if (offset >= 0x88) {
                return offset;
            }
        }
    }

    return null;
}

const dumpProto = (buffer) => {
    let { address : freeArrayAddress } = scanPattern( config.LuaFreeArray, buffer );

    if (!freeArrayAddress) {
        return null;
    }

    let freeArrayEpilogue = findEpilogue( freeArrayAddress, buffer );

    let movsxdValueOffsets = [];

    let leaValueOffsets = [];

    for (let address = freeArrayAddress; address < freeArrayEpilogue; address++) {
        let prefix = buffer[address];
        let op = buffer[address + 1];
        let value = buffer[address + 3];

        if ([ opCode.rexrx, opCode.rex ].includes( prefix )) {
            if (op === opCode.movsxd) {
                movsxdValueOffsets.push( value );
            }
        }

        if (prefix === opCode.rex && [ opCode.lea, opCode.subAdd ].includes( op )) {
            leaValueOffsets.push( value );
        }
    }

    let [ sizecode, sizep, sizek, sizelineinfo, sizelocvars, sizeupvalues ] = movsxdValueOffsets;

    let [ , code, p, k ] = leaValueOffsets

    let codeentry = 0;

    for (let offset = 0x8; offset < 0x20; offset += 0x8) {
        if (![ code, p, k ].includes( offset )) {
            codeentry = offset;
        }
    }

    let linedefined = dumpLineDefined( buffer );
    let bytecodeid = dumpBytecodeId( buffer );

    let linegaplog2 = 0;
    for (let offset = 0x88; offset < 0xA8; offset += 0x4) {
        if (![ sizecode, sizep, sizelocvars, sizeupvalues, sizek, sizelineinfo, linedefined, bytecodeid ].includes( offset )) {
            linegaplog2 = offset;
        }
    }

    let shuffle4 = shuffle( [ k, code, p, codeentry ], 8, 8 );
    let shuffle9 = shuffle( [ sizecode, sizep, sizelocvars, sizeupvalues, sizek, sizelineinfo, linegaplog2, linedefined, bytecodeid ], 0x88, 4 );

    return {
        fields : {
            k : toHex( k ),
            p : toHex( p ),
            code : toHex( code ),
            codeentry : toHex( codeentry ),
            sizecode : toHex( sizecode ),
            sizep : toHex( sizep ),
            sizelocvars : toHex( sizelocvars ),
            sizeupvalues : toHex( sizeupvalues ),
            sizek : toHex( sizek ),
            sizelineinfo : toHex( sizelineinfo ),
            linegaplog2 : toHex( linegaplog2 ),
            linedefined : toHex( linedefined ),
            bytecodeid : toHex( bytecodeid ),
        },
        shuffles : {
            shuffle4 : shuffle4,
            shuffle9 : shuffle9,
        }
    }
}

module.exports.dumpProto = dumpProto;