const { dumpLuaONilObject } = require( "./unsorted/dumpLuaONilObject" );
const { dumpRBXPrint } = require( "./unsorted/dumpRBXPrint" );
const { dumpTaskScheduler } = require( "./unsorted/dumpTaskScheduler" );
const { dumpProximityPromptTrigger } = require( "./unsorted/dumpProximityPromptTrigger" );
const { dumpTaskDefer } = require( "./unsorted/dumpTaskDefer" );
const { dumpPushInstance } = require( "./unsorted/dumpPushInstance" );

const { dumpLuaState } = require( "./struct/dumpLuaState" );
const { dumpProto } = require( "./struct/dumpProto" );

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
    let proto = dumpProto( buffer );

    return JSON.stringify( {
        address : {
            luaONilObject : dumpLuaONilObject( buffer ),
            taskScheduler : dumpTaskScheduler( buffer ),
            rbxPrint : dumpRBXPrint( buffer ),
            luaState : luaState.luaStateAddress,
            luaStateDecoder : luaState.decoder.decoderAddress,
            proximityPromptTrigger : dumpProximityPromptTrigger( buffer ),
            taskDefer : dumpTaskDefer( buffer ),
            pushInstance : dumpPushInstance( buffer ),
        },
        struct : {
            luaState : {
                luaStateReference : luaState.luaStateReference,
                decoderReference : luaState.decoder.decoderReference,
                fields : {
                    top : luaState.fields.top,
                    base : luaState.fields.base,
                    global : luaState.fields.global,
                    callInfo : luaState.fields.callInfo,
                    stackLast : luaState.fields.stackLast,
                    stack : luaState.fields.stack,
                }
            },
            proto : {
                fields : {
                    // "k":  protoFields.k,
                    // "code":  protoFields.code,
                    // "p":  protoFields.p,
                    // "codeentry":  protoFields.codeentry,

                    // "sizecode":  protoFields.sizecode,
                    sizep : proto.sizep,
                    // "sizelocvars":  protoFields.sizelocvars,
                    // "sizeupvalues":  protoFields.sizeupvalues,
                    // "sizek":  protoFields.sizek,
                    // "sizelineinfo":  protoFields.linedefined,
                    // "linegaplog2":  protoFields.linegaplog2,
                    // "linedefined":  protoFields.linedefined,
                    // "bytecodeid":  protoFields.bytecodeid
                }
            }
        },
        encryption : {
            //global : dumpGlobalEncryption( buffer ),
            // "stacksize": "",
            // "proto_member_one": "",
            // "proto_member_two": "",
            // "debugname": "",
            // "debugsign": "",
            // "typeinfo": "",
            // "hash": "",
            // "len": ""
        },
        shuffle : {}
    } );
}

module.exports.dump = dump;