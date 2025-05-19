import BaseRepository from "./BaseRepository.js";
import models from "../models/index.js";
import prisma from "../prisma-client.js";

export default class FunnelBuilderRepository extends BaseRepository {
  constructor() {
    super(prisma.funnel_builder);
  }
}