const filesystem = require( "fs" );

const { Dump } = require( "./offsets/Include" );

let binary = filesystem.readFileSync( "decrypted.bin", "hex" );

let buffer = new Buffer.from( binary, "hex" );

filesystem.writeFileSync( "output.json", Dump( buffer ) );