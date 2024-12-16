require('dotenv').config();
const colors = require('./colors');
const BrazilianDate = require('../BrazilianDate');

class styledLog {

  static name_version() {
    const project_name = process.env.PROJECT_NAME || 'Projeto';
    const version = require('../../../package.json').version;
    return `${colors.white}${colors.bold}[ AI Atende - ${project_name} ] v${version}${colors.reset}`;
  }

  static prefix() {
    return `${styledLog.name_version()} - ${colors.bgWhite}${colors.black}${colors.bold} ${BrazilianDate.getLocalWeekDay()} - ${BrazilianDate.getLocalDateTime()} ${colors.reset}`;
  }

  static error(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.red}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()}${colors.bgRed}${colors.white}${colors.bold}   \u{2716}   ${colors.reset}${colors.red}${colors.bold} ERROR: ${colors.reset}${messageArray}`);
  }

  static errordir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.red}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${styledJson}`);
  }

  static success(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.green}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()}${colors.bgGreen}${colors.white}${colors.bold}   \u{2714}   ${colors.reset}${colors.green}${colors.bold} SUCCESS: ${colors.reset}${messageArray}`);
  }

  static successdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.green}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${styledJson}`);
  }

  static warning(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.yellow}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()}${colors.bgYellow}${colors.white}${colors.bold}   \u{26A0}   ${colors.reset}${colors.yellow}${colors.bold} WARNING: ${colors.reset}${messageArray}`);
  }

  static warningdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.yellow}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${styledJson}`);
  }

  static info(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.cyan}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()}${colors.bgCyan}${colors.white}${colors.bold}   \u{2139}   ${colors.reset}${colors.cyan}${colors.bold} INFO: ${colors.reset}${messageArray}`);
  }

  static infodir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.cyan}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${styledJson}`);
  }

  // Console log for function entrance
  static function(...data) {
    let message = data.join(' ');
    // console.log(`${styledLog.prefix()}${colors.orange}${colors.bold} FUNCTION: ${message} ${colors.reset}`);
    const messageArray = message
      .split('\n')
      .map(line => `${colors.orange}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${colors.orange}${colors.bold}FUNCTION: ${colors.reset}${messageArray}`);
  }

  static middleware(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.lightMagenta}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()}${colors.bgLightMagenta}${colors.white}${colors.bold}   \u{1F47E}   ${colors.reset}${colors.lightMagenta}${colors.bold} MIDDLEWARE: ${colors.reset}${messageArray}`);
  }

  static middlewaredir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.lightMagenta}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${styledJson}`);
  }

  static test(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.bgWhite}${colors.black}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()}${colors.bgBlack}${colors.white}${colors.bold}   \u{1F914}   ${colors.reset}${colors.bgWhite}${colors.black}${colors.bold} TEST: ${colors.reset}${messageArray}`);
  }

  static testdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.bgWhite}${colors.black}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styledLog.prefix()} ${styledJson}`);
  }
};

module.exports = styledLog;
