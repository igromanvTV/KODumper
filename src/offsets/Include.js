const { DumpLuaState } = require( "./luastate/DumpLuaState" );
const { DumpLuaStateDecoder } = require( "./luastate/DumpLuaStateDecoder" );
const { DumpLuaONilObject } = require( "./unsorted/DumpLuaONilObject" );
const { DumpRBXPrint } = require( "./unsorted/DumpRBXPrint" );
const { DumpTaskScheduler } = require( "./unsorted/DumpTaskScheduler" );
const { DumpProximityPromptTrigger } = require( "./unsorted/DumpProximityPromptTrigger" );
const { DumpTaskDefer } = require( "./unsorted/DumpTaskDefer" );
const { hex } = require( "../modules/String" );
const { DumpPushInstance } = require( "./unsorted/DumpPushInstance" );

const Dump = ( buffer ) => {
    if ( !Buffer.isBuffer( buffer ) ) {
        throw new TypeError( "The provided argument is not a Buffer" );
    }

    let luaState = DumpLuaState( buffer );
    let luaStateDecoder = DumpLuaStateDecoder( buffer );
    let luaStateFields = luaState.fields;

    return JSON.stringify( {
        "version-8aa36bbf0eb1494a": {
            "addresses": {
                "LuaONilObject": hex( DumpLuaONilObject( buffer ) ),
                "TaskScheduler": hex( DumpTaskScheduler( buffer ) ),
                "RBXPrint": hex( DumpRBXPrint( buffer ) ),
                "LuaState": hex( luaState.offset ),
                "LuaStateDecoder": hex( luaStateDecoder.offset ),
                "ProximityPromptTrigger": hex( DumpProximityPromptTrigger( buffer ) ),
                "TaskDefer": hex( DumpTaskDefer( buffer ) ),
                "PushInstance": hex( DumpPushInstance( buffer ) ),
            },
            "fields": {
                "luastate": {
                    "reference": hex( luaState.reference ),
                    "decryption": hex( luaStateDecoder.reference ),
                    "fields": {
                        "top": hex( luaStateFields.top ),
                        "base": hex( luaStateFields.base )
                    }
                },
                "proto": {}
            },
            "ecryptions": {
                "luastate": {
                    //"global": "xor",
                }
            },
            "shuffles": {}
        }
    } );
}

module.exports.Dump = Dump;