const { scanXref } = require( "../../modules/xref" );
const { scanPattern } = require( "../../modules/pattern" );
const config = require( "../../config/patterns.json" );
const { findEpilogue } = require( "../../modules/function" );
const { opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );

const dumpProto = (buffer) => {
    let { address : freeArrayAddress } = scanPattern( config.LuaFreeArray, buffer );
    let { address : vmLoadAddress } = scanPattern( config.LuaVMLoad, buffer );
    let {
        address : newProtoAddress,
        size : newProtoSize
    } = scanPattern( "89 ? ? ? ? ? 0F 83 ? ? ? ? 48 ? ? E8 ? ? ? ?", buffer, vmLoadAddress ); // this pattern from luavmload function (first new proto function)

    if (!freeArrayAddress || !vmLoadAddress || !newProtoAddress) {
        throw new Error( "Failed to scan some offsets" );
    }

    let bytecodeid = 0;

    for (let address = newProtoAddress; address < newProtoAddress + newProtoSize + 40; address++) {
        if (buffer[address] === opCode.movrm64 && buffer[address + 1] !== opCode.movrm64) {
            let offset = buffer[address + 2];

            if (offset >= 0x88) {
                bytecodeid = offset;
            }
        }
    }

    let linedefined = scanXref( ':%d:%s\"', buffer )[0];

    let linedefinedOffset = 0;

    for (let address = linedefined - 30; address < linedefined; address++) {
        if (buffer[address] === opCode.rexr && buffer[address + 1] === opCode.mov) {
            let offset = buffer[address + 3];

            if (offset >= 0x88) {
                linedefinedOffset = offset;
            }
        }
    }

    let freeArrayEpilogue = findEpilogue( freeArrayAddress, buffer );

    let movsxdValueOffsets = [];

    let leaValueOffsets = [];

    for (let address = freeArrayAddress; address < freeArrayEpilogue; address++) {
        let firstByte = buffer[address];
        let secondByte = buffer[address + 1];
        let thirdByte = buffer[address + 3];

        if ([ opCode.rexrx, opCode.rex ].includes( firstByte )) {
            if (secondByte === opCode.movsxd) {
                movsxdValueOffsets.push( thirdByte );
            }
        }

        if (firstByte === opCode.rex && [ opCode.lea, opCode.subAdd ].includes( secondByte )) {
            leaValueOffsets.push( thirdByte );
        }
    }

    let [ sizecode, sizep, sizek, , sizelocvars, sizeupvalues, , sizetypeinfo ] = movsxdValueOffsets;

    let [ , code, p, k ] = leaValueOffsets

    let codeentry = 0;

    for (let offset = 0x8; offset < 0x20; offset += 0x8) {
        if (![ code, p, k ].includes( offset )) {
            codeentry = offset;
        }
    }

    let linegaplog2 = 0;

    for (let offset = 0x88; offset <= 0xA8; offset += 0x4) {
        if (![ sizecode, sizep, sizelocvars, sizeupvalues, sizek, bytecodeid, sizetypeinfo ].includes( offset )) {
            linegaplog2 = offset;
        }
    }

    return {
        offsets : {
            k : toHex( k ),
            p : toHex( p ),
            code : toHex( code ),
            codeentry : toHex( codeentry ),
            sizecode : toHex( sizecode ),
            sizep : toHex( sizep ),
            sizelocvars : toHex( sizelocvars ),
            sizeupvalues : toHex( sizeupvalues ),
            sizek : toHex( sizek ),
            linegaplog2 : toHex( linegaplog2 ),
            linedefined : toHex( linedefinedOffset ),
            bytecodeid : toHex( bytecodeid ),
            sizetypeinfo : toHex( sizetypeinfo ),
        },
        shuffles : {}
    }
}

module.exports.dumpProto = dumpProto;