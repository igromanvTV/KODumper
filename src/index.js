const { writeFileSync, readFileSync } = require( "fs" );

const {
    dumpPushInstance,
    dumpTaskDefer,
    dumpProximityPromptTrigger,
    dumpRBXPrint,
    dumpTaskScheduler,
    dumpProto,
    dumpGlobalState,
    dumpLuaState,
    dumpLuaONilObject,
    dumpDummyNode
} = require( "./offsets/include" );

const dump = () => {
    let binary = readFileSync( "decrypted.bin", "hex" );

    let buffer = new Buffer.from( binary, "hex" );

    let luaState = dumpLuaState( buffer );
    let proto = dumpProto( buffer );
    let globalState = dumpGlobalState( buffer );

    let dumpData = JSON.stringify( {
        address : {
            luaONilObject : dumpLuaONilObject( buffer ),
            taskScheduler : dumpTaskScheduler( buffer ),
            rbxPrint : dumpRBXPrint( buffer ),
            luaState : luaState.luaStateAddress,
            luaStateDecoder : luaState.decoder.decoderAddress,
            proximityPromptTrigger : dumpProximityPromptTrigger( buffer ),
            taskDefer : dumpTaskDefer( buffer ),
            pushInstance : dumpPushInstance( buffer ),
            dummyNode : dumpDummyNode( buffer ),
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
        shuffle : {
            shuffle3 : globalState.shuffles.shuffle3,
            shuffle4 : proto.shuffles.shuffle4,
            shuffle6 : luaState.shuffles.shuffle6,
            shuffle9 : proto.shuffles.shuffle9,
        }
    } );

    writeFileSync( "output.json", dumpData );
}

dump();