import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";

export default class FunnelBuilderRepository extends BaseRepository {
  constructor() {
    super(models.FunnelBuilder);
  }
}