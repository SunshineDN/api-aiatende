// import { createRequire } from 'module';
import { colors } from './colors.js';
import BrazilianDate from '../BrazilianDate.js';
import packageJson from '../../../package.json' assert { type: "json" };

export default class styled {

  static name_version() {
    // const require = createRequire(import.meta.url);
    // const { version } = require('../../../package.json');
    const version = packageJson.version;
    return `${colors.white}[ AI Atende API ] v${version.substring(0, 3)}${colors.reset}`;
  }

  static prefix() {
    return `${styled.name_version()} - ${colors.bgWhite}${colors.black}${colors.bold} ${BrazilianDate.getLocalWeekDay()} - ${BrazilianDate.getLocalDateTime()} ${colors.reset}`;
  }

  static error(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.red}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()}${colors.bgRed}${colors.white}${colors.bold}   \u{2716}   ${colors.reset}${colors.red}${colors.bold} ERROR: ${colors.reset}${messageArray}`);
  }

  static errordir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.red}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${styledJson}`);
  }

  static success(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.green}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()}${colors.bgGreen}${colors.white}${colors.bold}   \u{2714}   ${colors.reset}${colors.green}${colors.bold} SUCCESS: ${colors.reset}${messageArray}`);
  }

  static successdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.green}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${styledJson}`);
  }

  static warning(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.yellow}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()}${colors.bgYellow}${colors.white}${colors.bold}   \u{26A0}   ${colors.reset}${colors.yellow}${colors.bold} WARNING: ${colors.reset}${messageArray}`);
  }

  static warningdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.yellow}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${styledJson}`);
  }

  static info(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.cyan}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()}${colors.bgCyan}${colors.white}${colors.bold}   \u{2139}   ${colors.reset}${colors.cyan}${colors.bold} INFO: ${colors.reset}${messageArray}`);
  }

  static infodir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.cyan}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${styledJson}`);
  }

  // Console log for function entrance
  static function(...data) {
    let message = data.join(' ');
    // console.log(`${styled.prefix()}${colors.orange}${colors.bold} FUNCTION: ${message} ${colors.reset}`);
    const messageArray = message
      .split('\n')
      .map(line => `${colors.orange}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${colors.orange}${colors.bold}FUNCTION: ${colors.reset}${messageArray}`);
  }

  static middleware(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.lightMagenta}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()}${colors.bgLightMagenta}${colors.white}${colors.bold}   \u{1F47E}   ${colors.reset}${colors.lightMagenta}${colors.bold} MIDDLEWARE: ${colors.reset}${messageArray}`);
  }

  static middlewaredir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.lightMagenta}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${styledJson}`);
  }

  // Console debug for database logging
  static db(msg) {
    console.log(`\n${styled.prefix()}${colors.bgDatabase}${colors.white}${colors.bold}   \u{26C1}   ${colors.reset}${colors.database}${colors.bold} DATABASE: ${colors.reset}${colors.database}${msg}${colors.reset}\n`);
  }

  static test(...data) {
    let message = data.join(' ');
    const messageArray = message
      .split('\n')
      .map(line => `${colors.bgWhite}${colors.black}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()}${colors.bgBlack}${colors.white}${colors.bold}   \u{1F914}   ${colors.reset}${colors.bgWhite}${colors.black}${colors.bold} TEST: ${colors.reset}${messageArray}`);
  }

  static testdir(obj) {
    const jsonString = JSON.stringify(obj, null, 2);
    const styledJson = jsonString
      .split('\n')
      .map(line => `${colors.bgWhite}${colors.black}${line}${colors.reset}`)
      .join('\n');
    console.log(`${styled.prefix()} ${styledJson}`);
  }
};
