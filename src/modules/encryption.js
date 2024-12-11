const { opCode } = require( "../constants/instructions" );

const parseEncryption = (address, buffer) => {
    for (let offset = address; offset < address + 30; offset++) {
        let prefix = buffer[offset];
        let op = buffer[offset + 1];

        if (prefix === opCode.rex) {
            switch (op) {
                case opCode.mov:
                    let nextPrefix = buffer[address + 4];
                    let nextOp = buffer[address + 5];

                    if (nextPrefix === opCode.rex && nextOp === opCode.mov) {
                        return "add";
                    }
                    break;
                case opCode.xor:
                    return "xor";
                default:
                    return "undefined encryption";
            }
        }
    }

    return "none"
}

module.exports.parseEncryption = parseEncryption;