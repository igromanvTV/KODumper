/**
 * Получение шестнадцатеричного числа с десятичного числа
 * @param address
 * @returns {string}
 */
const toHex = (address) => {
    if (typeof address !== "number" || Number.isNaN( address )) {
        return "";
    }

    return `0x${address.toString( 16 ).toUpperCase()}`;
}

/**
 * Удаление лишних пробелов с строки с использованием регулярных выражений
 * @param string
 * @returns {*}
 */
const terminate = (string) => {
    return string.replace( /\0/g, '' );
}

/**
 * Чтение строки из памяти
 * @param address
 * @param buffer
 * @returns {string}
 */
const read = (address, buffer) => {
    let byte = buffer[address];

    let string = "";

    while (byte !== 0) {
        string += String.fromCharCode( byte );
        address++;
        byte = buffer[address];
    }

    return string;
}

module.exports = {
    toHex,
    read,
    terminate
}