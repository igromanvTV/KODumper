const { scanPattern } = require( "../../modules/pattern" );

const { opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const { shuffle } = require( "../../modules/shuffle" );

const dumpGlobalState = (buffer) => {
    let { address : LuaFullGCAddress } = scanPattern( "48 8B 86 ? ? ? ? 48 89 86 ? ? ? ? 4C 89 76 ? 4C 89 76 ? 4C 89 76 ?", buffer ); // pattern on a piece of code in luaC_fullgc

    if (!LuaFullGCAddress) {
        throw Error( "Cannot process global state dump" );
    }

    let luaGcOffsets = [];

    for (let offset = LuaFullGCAddress; offset < LuaFullGCAddress + 30; offset++) {
        let prefix = buffer[offset];
        let opcode = buffer[offset + 1];
        let value = buffer[offset + 3];

        if (prefix === opCode.rexrx && opcode === opCode.movrm64) {

            luaGcOffsets.push( value );
        }
    }

    let [ gray, grayagain, weak ] = luaGcOffsets;

    let shuffle3 = shuffle( [ gray, grayagain, weak ], 0x58, 8 );

    return {
        fields : {
            gray : toHex( gray ),
            grayagain : toHex( grayagain ),
            weak : toHex( weak ),
        },
        shuffles : {
            shuffle3 : shuffle3,
        }
    }
}

module.exports.dumpGlobalState = dumpGlobalState;