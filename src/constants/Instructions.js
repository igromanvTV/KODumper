const InstructionSizes = {
    LEA: 7,
    JMP: 6,
    CALL: 5,
    NOP: 1,
    RET: 1,
    PUSH_RAX: 1,
}

const SHIFT = 0xA00;

module.exports = {
    InstructionSizes,
    SHIFT
}