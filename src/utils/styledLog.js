const colors = require('./colors');

class styled {
  static log(message, color) {
    console.log(colors[color] + message + colors.reset);
  }

  static error(message) {
    console.log(colors.red + message + colors.reset);
  }

  static success(message) {
    console.log(colors.green + message + colors.reset);
  }

  static warning(message) {
    console.log(colors.yellow + message + colors.reset);
  }

  static info(message) {
    console.log(colors.white + colors.bgBlue + colors.bold + ' \u{2139} ' + colors.reset + colors.blue + ' ' + message + colors.reset);
  }

  static bgBlack(message) {
    console.log(colors.bgBlack + message + colors.reset);
  }

  static bgRed(message) {
    console.log(colors.bgRed + message + colors.reset);
  }

  static bgGreen(message) {
    console.log(colors.bgGreen + message + colors.reset);
  }

  static bgYellow(message) {
    console.log(colors.bgYellow + message + colors.reset);
  }

  static bgBlue(message) {
    console.log(colors.bgBlue + message + colors.reset);
  }

  static bgMagenta(message) {
    console.log(colors.bgMagenta + message + colors.reset);
  }

  static bgCyan(message) {
    console.log(colors.bgCyan + message + colors.reset);
  }

  static bgWhite(message) {
    console.log(colors.bgWhite + message + colors.reset);
  }

  static bgGray(message) {
    console.log(colors.bgGray + message + colors.reset);
  }

  static bgCrimson(message) {
    console.log(colors.bgCrimson + message + colors.reset);
  }

  static bold(message) {
    console.log(colors.bold + message + colors.reset);
  }

  static dim(message) {
    console.log(colors.dim + message + colors.reset);
  }

  static underline(message) {
    console.log(colors.underline + message + colors.reset);
  }

  static blink(message) {
    console.log(colors.blink + message + colors.reset);
  }

  static reverse(message) {
    console.log(colors.reverse + message + colors.reset);
  }

  static hidden(message) {
    console.log(colors.hidden + message + colors.reset);
  }

  static black(message) {
    console.log(colors.black + message + colors.reset);
  }

  static red(message) {
    console.log(colors.red + message + colors.reset);
  }

  static green(message) {
    console.log(colors.green + message + colors.reset);
  }

  static yellow(message) {
    console.log(colors.yellow + message + colors.reset);
  }

  static blue(message) {
    console.log(colors.blue + message + colors.reset);
  }

  static magenta(message) {
    console.log(colors.magenta + message + colors.reset);
  }

  static cyan(message) {
    console.log(colors.cyan + message + colors.reset);
  }

  static white(message) {
    console.log(colors.white + message + colors.reset);
  }

  static gray(message) {
    console.log(colors.gray + message + colors.reset);
  }

  static crimson(message) {
    console.log(colors.crimson + message + colors.reset);
  }
};

module.exports = styled;
