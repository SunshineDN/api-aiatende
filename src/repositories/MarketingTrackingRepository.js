import BaseRepository from "./BaseRepository";
import MarketingTracking from "../models/marketing_tracking.js";


export default class MarketingTrackingRepository extends BaseRepository {
  constructor() {
    super(MarketingTracking);
  }
}