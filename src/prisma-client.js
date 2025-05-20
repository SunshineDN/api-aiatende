import { PrismaClient } from "../generated/prisma/index.js";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient();
prisma.$extends(withAccelerate());

export default prisma;