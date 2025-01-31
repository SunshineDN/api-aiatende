import KommoServices from "../kommo/KommoServices.js"
import styled from "../../utils/log/styled.js";
import KommoUtils from "../../utils/KommoUtils.js";

export default class CalendarServices {
  #calendar_id;

  
  constructor(calendar_id) {
    this.#calendar_id = calendar_id;
  }

  async registerCalendarEvent(obj, lead_id = "") {
    
  }
}