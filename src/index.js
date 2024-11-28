const filesystem = require( "fs" );

const { dump } = require( "./offsets/Include" );

let binary = filesystem.readFileSync( "decrypted-actual.bin", "hex" ); // 8aa36bbf0eb1494a

let buffer = new Buffer.from( binary, "hex" );

filesystem.writeFileSync( "output.json", dump( buffer ) );