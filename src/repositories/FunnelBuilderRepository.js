import BaseRepository from "./BaseRepository.js";
import FunnelBuilder from "../models/FunnelBuilder.js";

export default class FunnelBuilderRepository extends BaseRepository {
  constructor() {
    super(FunnelBuilder);
  }
}