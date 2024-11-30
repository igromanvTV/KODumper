const { opCode } = require( "../constants/instructions" );
/**
 * Проверка на эпилог функции
 * @param address
 * @param buffer
 * @returns {number}
 */
const findEpilogue = (address, buffer) => {
    return buffer.indexOf( opCode.RET, address );
}

module.exports = {
    findEpilogue
}