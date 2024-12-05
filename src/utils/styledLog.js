const colors = require('./colors');

class styled {
  static log(color, ...data) {
    let message = data.join(' ');
    console.log(colors[color] + message + colors.reset);
  }

  static error(...data) {
    let message = data.join(' ');
    console.log(`${colors.bgRed}${colors.white}${colors.bold}   \u{2716}   ${colors.reset}${colors.red}${colors.bold} ERROR: ${message} ${colors.reset}`);
  }

  static errordir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.red}${colors.bold}${line}${colors.reset}`)
      .join('\n');
    console.log(styledJson);
  }

  static success(...data) {
    let message = data.join(' ');
    console.log(`${colors.bgGreen}${colors.white}${colors.bold}   \u{2714}   ${colors.reset}${colors.green}${colors.bold} SUCCESS: ${message} ${colors.reset}`);
  }

  static successdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.green}${colors.bold}${line}${colors.reset}`)
      .join('\n');
    console.log(styledJson);
  }

  static warning(...data) {
    let message = data.join(' ');
    console.log(`${colors.bgYellow}${colors.white}${colors.bold}   \u{26A0}   ${colors.reset}${colors.yellow}${colors.bold} WARNING: ${message} ${colors.reset}`);
  }

  static warningdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.yellow}${colors.bold}${line}${colors.reset}`)
      .join('\n');
    console.log(styledJson);
  }

  static info(...data) {
    let message = data.join(' ');
    console.log(`${colors.bgBlue}${colors.white}${colors.bold}   \u{2139}   ${colors.reset}${colors.blue}${colors.bold} INFO: ${message} ${colors.reset}`);
  }

  static infodir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.blue}${colors.bold}${line}${colors.reset}`)
      .join('\n');
    console.log(styledJson);
  }

  static bgBlack(...data) {
    let message = data.join(' ');
    console.log(colors.bgBlack + message + colors.reset);
  }

  static bgRed(...data) {
    let message = data.join(' ');
    console.log(colors.bgRed + message + colors.reset);
  }

  static bgGreen(...data) {
    let message = data.join(' ');
    console.log(colors.bgGreen + message + colors.reset);
  }

  static bgYellow(...data) {
    let message = data.join(' ');
    console.log(colors.bgYellow + message + colors.reset);
  }

  static bgBlue(...data) {
    let message = data.join(' ');
    console.log(colors.bgBlue + message + colors.reset);
  }

  static bgMagenta(...data) {
    let message = data.join(' ');
    console.log(colors.bgMagenta + message + colors.reset);
  }

  static bgCyan(...data) {
    let message = data.join(' ');
    console.log(colors.bgCyan + message + colors.reset);
  }

  static bgWhite(...data) {
    let message = data.join(' ');
    console.log(colors.bgWhite + message + colors.reset);
  }

  static bgGray(...data) {
    let message = data.join(' ');
    console.log(colors.bgGray + message + colors.reset);
  }

  static bgCrimson(...data) {
    let message = data.join(' ');
    console.log(colors.bgCrimson + message + colors.reset);
  }

  static bold(...data) {
    let message = data.join(' ');
    console.log(colors.bold + message + colors.reset);
  }

  static dim(...data) {
    let message = data.join(' ');
    console.log(colors.dim + message + colors.reset);
  }

  static underline(...data) {
    let message = data.join(' ');
    console.log(colors.underline + message + colors.reset);
  }

  static blink(...data) {
    let message = data.join(' ');
    console.log(colors.blink + message + colors.reset);
  }

  static reverse(...data) {
    let message = data.join(' ');
    console.log(colors.reverse + message + colors.reset);
  }

  static hidden(...data) {
    let message = data.join(' ');
    console.log(colors.hidden + message + colors.reset);
  }

  static black(...data) {
    let message = data.join(' ');
    console.log(colors.black + message + colors.reset);
  }

  static red(...data) {
    let message = data.join(' ');
    console.log(colors.red + message + colors.reset);
  }

  static green(...data) {
    let message = data.join(' ');
    console.log(colors.green + message + colors.reset);
  }

  static yellow(...data) {
    let message = data.join(' ');
    console.log(colors.yellow + message + colors.reset);
  }

  static blue(...data) {
    let message = data.join(' ');
    console.log(colors.blue + message + colors.reset);
  }

  static magenta(...data) {
    let message = data.join(' ');
    console.log(colors.magenta + message + colors.reset);
  }

  static cyan(...data) {
    let message = data.join(' ');
    console.log(colors.cyan + message + colors.reset);
  }

  static white(...data) {
    let message = data.join(' ');
    console.log(colors.white + message + colors.reset);
  }

  static gray(...data) {
    let message = data.join(' ');
    console.log(colors.gray + message + colors.reset);
  }

  static crimson(...data) {
    let message = data.join(' ');
    console.log(colors.crimson + message + colors.reset);
  }
};

module.exports = styled;
