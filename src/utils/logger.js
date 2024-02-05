const fs = require('fs');
const path = require('path');

class Logger {
  static log(message) {
    const logMessage = `[INFO] ${message}`;
    fs.appendFileSync(path.join(__dirname, 'logs.txt'), logMessage + '\n');
    console.log(logMessage);
  }

  static error(message) {
    const errorMessage = `[ERROR] ${message}`;
    fs.appendFileSync(path.join(__dirname, 'logs.txt'), errorMessage + '\n');
    console.error(errorMessage);
  }

  static warn(message) {
    const warningMessage = `[WARNING] ${message}`;
    fs.appendFileSync(path.join(__dirname, 'logs.txt'), warningMessage + '\n');
    console.warn(warningMessage);
  }
}

export default Logger;
