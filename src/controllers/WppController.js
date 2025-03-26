import styled from "../utils/log/styled.js";
import StaticUtils from "../utils/StaticUtils.js";

export default class WebCalendarController {

  /**
    * @param { import('express').Request } req
    * @param { import('express').Response } res
    */
  static async handleReceiveMessage(req, res) {
    const { query } = req;
    styled.info('Query:');
    styled.infodir(query);

    const hash = StaticUtils.generateUUIDv5(query);
    styled.info('Hash:', hash);

    res.redirect(`https://wa.me/558130930133?source=${hash}`);
  }
}