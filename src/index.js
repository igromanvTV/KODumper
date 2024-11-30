const filesystem = require( "fs" );

const { dump } = require( "./offsets/include" );

let binary = filesystem.readFileSync( "decrypted-actual.bin", "hex" ); // 8aa36bbf0eb1494a

let buffer = new Buffer.from( binary, "hex" );

const startTime = Date.now();

filesystem.writeFileSync( "output.json", dump( buffer ) );

const endTime = new Date(Date.now() - startTime).getSeconds();

console.log(`Dump done. Work time ${endTime} seconds`);