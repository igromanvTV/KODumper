const filesystem = require( "fs" );

const { Dump } = require( "./offsets/Include" );

let binary = filesystem.readFileSync( "../decrypted-e.bin", "hex" );

let buffer = new Buffer.from( binary, "hex" );

filesystem.writeFileSync( "output.json", Dump( buffer ) );