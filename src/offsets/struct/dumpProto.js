const { scanXref } = require( "../../modules/xref" );
const { toHex } = require( "../../modules/string" );


const dumpSizeProto = (buffer) => {
    let [ address ] = scanXref( ',"protos":[', buffer ); // first link

    let nextCmp = buffer.indexOf( 0xAF, address );

    return buffer[nextCmp + 1];
}

const dumpProto = (buffer) => {
    const sizeProto = dumpSizeProto( buffer );

    return {
        sizep : toHex( sizeProto ),
    }
}

module.exports.dumpProto = dumpProto;