/* Смещения */

const { DumpLuaState } = require( "./luastate/DumpLuaState" );
const { DumpLuaStateDecoder } = require( "./luastate/DumpLuaStateDecoder" );
const { DumpLuaONilObject } = require( "./unsorted/DumpLuaONilObject" );
const { DumpRBXPrint } = require( "./unsorted/DumpRBXPrint" );
const { DumpTaskScheduler } = require( "./unsorted/DumpTaskScheduler" );
const { DumpProximityPromptTrigger } = require( "./unsorted/DumpProximityPromptTrigger" );
const { DumpTaskDefer } = require( "./unsorted/DumpTaskDefer" );
const { DumpPushInstance } = require( "./unsorted/DumpPushInstance" );

const { toHex } = require( "../modules/String" );
const { DumpGlobalEncryption } = require( "./encryption/DumpEncryption" );

/**
 * Общая функция со сбором всех сдампленых смещений
 * @param buffer
 * @returns {string}
 * @constructor
 */
const Dump = ( buffer ) => {
    if ( !Buffer.isBuffer( buffer ) ) {
        throw new TypeError( "The provided argument is not a Buffer" );
    }

    let LuaState = DumpLuaState( buffer );
    let LuaStateDecoder = DumpLuaStateDecoder( buffer );
    let LuaStateFields = LuaState.fields;

    return JSON.stringify( {
        "version-8aa36bbf0eb1494a": {
            "addresses": {
                "LuaONilObject": toHex( DumpLuaONilObject( buffer ) ),
                "TaskScheduler": toHex( DumpTaskScheduler( buffer ) ),
                "RBXPrint": toHex( DumpRBXPrint( buffer ) ),
                "LuaState": toHex( LuaState.offset ),
                "Decoder": toHex( LuaStateDecoder.offset ),
                "ProximityPromptTrigger": toHex( DumpProximityPromptTrigger( buffer ) ),
                "TaskDefer": toHex( DumpTaskDefer( buffer ) ),
                "PushInstance": toHex( DumpPushInstance( buffer ) ),
            },
            "fields": {
                "luastate": {
                    "reference": toHex( LuaState.reference ),
                    "decryption": toHex( LuaStateDecoder.reference ),
                    "fields": {
                        "top": toHex( LuaStateFields.Top ),
                        "base": toHex( LuaStateFields.Base ),
                        // "global": toHex( LuaStateFields.global ),
                        // "ci": toHex( LuaStateFields.callinfo ),
                        // "stack_last": toHex( LuaStateFields.stacklast ),
                        // "stack": toHex( LuaStateFields.stack ),
                    }
                },
                "proto": {
                    "fields": {
                        // "k": toHex( protoFields.k ),
                        // "code": toHex( protoFields.code ),
                        // "p": toHex( protoFields.p ),
                        // "codeentry": toHex( protoFields.codeentry ),
                        // "sizecode": toHex( protoFields.sizecode ),
                        // "sizep": toHex( protoFields.sizep ),
                        // "sizelocvars": toHex( protoFields.sizelocvars ),
                        // "sizeupvalues": toHex( protoFields.sizeupvalues ),
                        // "sizek": toHex( protoFields.sizek ),
                        // "sizelineinfo": toHex( protoFields.linedefined ),
                        // "linegaplog2": toHex( protoFields.linegaplog2 ),
                        // "linedefined": toHex( protoFields.linedefined ),
                        // "bytecodeid": toHex( protoFields.bytecodeid )
                    }
                }
            },
            "ecryptions": {
                "global": DumpGlobalEncryption( buffer ),
                "stacksize": "",
                "proto_member_one": "",
                "proto_member_two": "",
                "debugname": "",
                "debugsign": "",
                "typeinfo": "",
                "hash": "",
                "len": ""
            },
            "shuffles": {}
        }
    } );
}

module.exports.Dump = Dump;