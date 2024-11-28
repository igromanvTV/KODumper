const { dumpLuaState, dumpLuaStateDecoder } = require( "./luaState/dumpLuaState" );
const { dumpLuaONilObject } = require( "./unsorted/dumpLuaONilObject" );
const { dumpRBXPrint } = require( "./unsorted/dumpRBXPrint" );
const { dumpTaskScheduler } = require( "./unsorted/dumpTaskScheduler" );
const { dumpProximityPromptTrigger } = require( "./unsorted/dumpProximityPromptTrigger" );
const { dumpTaskDefer } = require( "./unsorted/dumpTaskDefer" );
const { dumpPushInstance } = require( "./unsorted/dumpPushInstance" );
const { dumpGlobalEncryption } = require( "./encryption/dumpEncryption" );

const { toHex } = require( "../modules/String" );

/**
 * Общая функция со сбором всех сдампленых смещений
 * @param buffer
 * @returns {string}
 * @constructor
 */
const dump = (buffer) => {
    if (!Buffer.isBuffer( buffer )) {
        throw new TypeError( "The provided argument is not a Buffer" );
    }

    let luaState = dumpLuaState( buffer );
    let luaStateDecoder = dumpLuaStateDecoder( buffer );
    let luaStateFields = luaState.fields;

    return JSON.stringify( {
        "version-8aa36bbf0eb1494a": {
            addresses: {
                LuaONilObject: toHex( dumpLuaONilObject( buffer ) ),
                TaskScheduler: toHex( dumpTaskScheduler( buffer ) ),
                RBXPrint: toHex( dumpRBXPrint( buffer ) ),
                luaState: toHex( luaState.offset ),
                decoder: toHex( luaStateDecoder.offset ),
                ProximityPromptTrigger: toHex( dumpProximityPromptTrigger( buffer ) ),
                TaskDefer: toHex( dumpTaskDefer( buffer ) ),
                PushInstance: toHex( dumpPushInstance( buffer ) ),
            },
            fields: {
                luaState: {
                    reference: toHex( luaState.reference ),
                    decryption: toHex( luaStateDecoder.reference ),
                    fields: {
                        top: toHex( luaStateFields.top ),
                        base: toHex( luaStateFields.base ),
                        global: toHex( luaStateFields.global ),
                        ci: toHex( luaStateFields.callinfo ),
                        // "stack_last": toHex( LuaStateFields.stacklast ),
                        // "stack": toHex( LuaStateFields.stack ),
                    }
                },
                proto: {
                    fields: {
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
            ecryptions: {
                global: dumpGlobalEncryption( buffer ),
                // "stacksize": "",
                // "proto_member_one": "",
                // "proto_member_two": "",
                // "debugname": "",
                // "debugsign": "",
                // "typeinfo": "",
                // "hash": "",
                // "len": ""
            },
            shuffles: {}
        }
    } );
}

module.exports.dump = dump;