const { dumpLuaONilObject } = require( "./unsorted/dumpLuaONilObject" );
const { dumpRBXPrint } = require( "./unsorted/dumpRBXPrint" );
const { dumpTaskScheduler } = require( "./unsorted/dumpTaskScheduler" );
const { dumpProximityPromptTrigger } = require( "./unsorted/dumpProximityPromptTrigger" );
const { dumpTaskDefer } = require( "./unsorted/dumpTaskDefer" );
const { dumpPushInstance } = require( "./unsorted/dumpPushInstance" );

const { dumpLuaState } = require( "./struct/dumpLuaState" );
const { dumpProto } = require( "./struct/dumpProto" );
const { dumpGlobalState } = require( "./struct/dumpGlobalState" );

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
    let globalState = dumpGlobalState( buffer );

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
            globalState : {
                fields : {
                    gray : globalState.fields.gray,
                    grayagain : globalState.fields.grayagain,
                    weak : globalState.fields.weak,
                }
            },
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
                    k : proto.fields.k,
                    p : proto.fields.p,
                    code : proto.fields.code,
                    codeentry : proto.fields.codeentry,
                    sizecode : proto.fields.sizecode,
                    sizep : proto.fields.sizep,
                    sizelocvars : proto.fields.sizelocvars,
                    sizeupvalues : proto.fields.sizeupvalues,
                    sizek : proto.fields.sizek,
                    sizelineinfo : proto.fields.sizelineinfo,
                    linegaplog2 : proto.fields.linegaplog2,
                    linedefined : proto.fields.linedefined,
                    bytecodeid : proto.fields.bytecodeid,
                    sizetypeinfo : proto.fields.sizetypeinfo,
                }
            }
        },
        encryption : {},
        shuffle : {
            shuffle3 : globalState.shuffles.shuffle3,
            shuffle4 : proto.shuffles.shuffle4,
            shuffle6 : luaState.shuffles.shuffle6,
            shuffle9 : proto.shuffles.shuffle9,
        }
    } );
}

module.exports.dump = dump;