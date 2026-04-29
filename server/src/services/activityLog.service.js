import prisma from "../config/prisma.js";

export const createActivityLog = ({ adminId, action, description }) =>
  prisma.activityLog.create({
    data: {
      adminId,
      action,
      description,
    },
  });
