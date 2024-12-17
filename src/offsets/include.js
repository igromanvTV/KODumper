const { dumpLuaONilObject } = require( "./unsorted/dumpLuaONilObject" );
const { dumpRBXPrint } = require( "./unsorted/dumpRBXPrint" );
const { dumpTaskScheduler } = require( "./unsorted/dumpTaskScheduler" );
const { dumpProximityPromptTrigger } = require( "./unsorted/dumpProximityPromptTrigger" );
const { dumpTaskDefer } = require( "./unsorted/dumpTaskDefer" );
const { dumpPushInstance } = require( "./unsorted/dumpPushInstance" );
const { dumpDummyNode } = require( "./unsorted/dumpDummyNode" );
const { dumpLuaVmLoad } = require( "./unsorted/dumpLuaVmLoad" );

const { dumpLuaState } = require( "./struct/dumpLuaState" );
const { dumpProto } = require( "./struct/dumpProto" );
const { dumpGlobalState } = require( "./struct/dumpGlobalState" );

module.exports = {
    dumpLuaONilObject,
    dumpRBXPrint,
    dumpTaskScheduler,
    dumpProximityPromptTrigger,
    dumpTaskDefer,
    dumpPushInstance,
    dumpDummyNode,
    dumpLuaVmLoad,

    dumpLuaState,
    dumpProto,
    dumpGlobalState,
}