let instructionsSizes = {
    LEA : 7,
    JMP : 6,
    CALL : 5,
    JZ : 2,
    NOP : 1,
    RET : 1,
    PUSH_RAX : 1,
}

let opCode = {
    REX : 0x48,
    MOV : 0x8B,
    SUB : 0x2B,
    LEA : 0x8D,
    JZ : 0x74,
    CMOVNZ : 0x0F,
    CMP : 0x3B,
    XOR : 0x33,
    ADD : 0x83,
    CALL : 0xE8,
    RET: 0xC3
}

const shift = 0xA00;

module.exports = {
    instructionsSizes,
    opCode,
    shift
}