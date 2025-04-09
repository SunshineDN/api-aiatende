import BaseRepository from "./BaseRepository.js";
import FunnelBuilder from "../models/funnel_builder.js";

export default class FunnelBuilderRepository extends BaseRepository {
  constructor() {
    super(FunnelBuilder);
  }
}