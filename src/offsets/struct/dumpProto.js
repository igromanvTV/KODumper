const { scanXref } = require( "../../modules/xref" );
const { toHex } = require( "../../modules/string" );
const { scanPattern } = require( "../../modules/pattern" );
const config = require( "../../config/patterns.json" );
const { findEpilogue } = require( "../../modules/function" );
const { opCode } = require( "../../constants/instructions" );

const dumpProto = (buffer) => {
    let { address : freeArrayAddress } = scanPattern( config.LuaFreeArray, buffer );
    let { address : vmLoadAddress } = scanPattern( config.LuaVMLoad, buffer );
    let { address : newProtoAddress, size : newProtoSize } = scanPattern( "89 ? ? ? ? ? 0F 83 ? ? ? ? 48 ? ? E8 ? ? ? ?", buffer, vmLoadAddress );

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

    let freeArrayEpilogue = findEpilogue( freeArrayAddress, buffer );

    let offsets = [];

    for (let address = freeArrayAddress; address < freeArrayEpilogue; address++) {
        if ([ opCode.rexrx, opCode.rex ].includes( buffer[address] )) {
            if (buffer[address + 1] === opCode.movsxd) {
                offsets.push( toHex( buffer[address + 3] ) );
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

    let [ sizecode, sizep, sizek, sizelineinfo, sizelocvars, sizeupvalues, , sizetypeinfo ] = offsets;

    let linegaplog2 = 0;

    for (let offset = 0x88; offset <= 0xA8; offset++) {
        if (![ sizecode, sizep, sizelocvars, sizeupvalues, sizek, sizelineinfo, sizelineinfo, bytecodeid, sizetypeinfo ].includes( offset )) {
            linegaplog2 = offset;
        }
    }

    return {
        sizecode : sizecode,
        sizep : sizep,
        sizelocvars : sizelocvars,
        sizeupvalues : sizeupvalues,
        sizek : sizek,
        sizelineinfo : sizelineinfo,
        linegaplog2 : toHex( linegaplog2 ),
        linedefined : toHex( linedefinedOffset ),
        bytecodeid : toHex( bytecodeid ),
        sizetypeinfo : sizetypeinfo,
    }
}

module.exports.dumpProto = dumpProto;