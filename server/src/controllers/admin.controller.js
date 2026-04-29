import prisma from "../config/prisma.js";
import { createActivityLog } from "../services/activityLog.service.js";

export const listApplicants = async (req, res, next) => {
  try {
    const { search = "", status, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      AND: [
        search
          ? {
              OR: [
                { nim: { contains: search } },
                { nama: { contains: search } },
              ],
            }
          : {},
        status ? { applicant: { status } } : {},
      ],
    };

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { applicant: true },
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      data,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateApplicant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, catatanAdmin } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { applicant: true },
    });

    if (!user?.applicant) {
      return res.status(404).json({ message: "Pendaftar tidak ditemukan" });
    }

    const updated = await prisma.applicant.update({
      where: { userId: user.id },
      data: {
        status: status || user.applicant.status,
        catatanAdmin: catatanAdmin ?? user.applicant.catatanAdmin,
      },
    });

    await createActivityLog({
      adminId: req.user.id,
      action: "update_applicant",
      description: `Update status pendaftar ${user.nim} menjadi ${updated.status}.`,
    });

    return res.json({
      message: "Data pendaftar berhasil diperbarui",
      applicant: updated,
    });
  } catch (error) {
    return next(error);
  }
};
