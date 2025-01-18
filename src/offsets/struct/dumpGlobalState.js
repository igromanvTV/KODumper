const { scanPattern } = require( "../../modules/pattern" );
const { opCode } = require( "../../constants/instructions" );
const { toHex } = require( "../../modules/string" );
const { shuffle } = require( "../../modules/shuffle" );

const config = require("../../config/patterns.json");

const dumpGlobalState = (buffer) => {
    let { address : LuaFullGCAddress } = scanPattern( config.LuaFullGc, buffer );

    if (!LuaFullGCAddress) {
        return null;
    }

    let luaGcOffsets = [];

    for (let address = LuaFullGCAddress; address < LuaFullGCAddress + 30; address++) {
        
        let prefix = buffer[address];
        let opcode = buffer[address + 1];
        let value = buffer[address + 3];

        if (prefix === opCode.rex && opcode === opCode.movrm64) {

            luaGcOffsets.push( value );
        }
    }

    let [ gray, grayagain, weak ] = luaGcOffsets;

    let shuffle3 = shuffle( [ gray, grayagain, weak ], 0x30, 8 );

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
