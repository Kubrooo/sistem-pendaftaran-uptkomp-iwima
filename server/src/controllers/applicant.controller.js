import prisma from "../config/prisma.js";

export const myStatus = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { applicant: true },
    });

    if (!user?.applicant) {
      return res
        .status(404)
        .json({ message: "Data pendaftaran tidak ditemukan" });
    }

    return res.json({
      applicant: {
        nim: user.nim,
        nama: user.nama,
        motivasi: user.applicant.motivasi,
        status: user.applicant.status,
        catatanAdmin: user.applicant.catatanAdmin,
      },
    });
  } catch (error) {
    return next(error);
  }
};
