import prisma from "../config/prisma.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/token.js";

export const registerApplicant = async (req, res, next) => {
  try {
    const { nim, nama, motivasi, kelas, semester } = req.body;

    if (
      !nim ||
      !nama ||
      !motivasi ||
      !req.files?.file_transkip ||
      !req.files?.file_foto ||
      !req.files?.file_formulir
    ) {
      return res
        .status(400)
        .json({
          message:
            "Data pendaftaran belum lengkap (pastikan upload semua dokumen)",
        });
    }

    const existingUser = await prisma.user.findUnique({
      where: { nim },
      include: { applicant: true },
    });

    const password = await hashPassword(nim);

    const user = existingUser
      ? existingUser.applicant?.deletedAt
        ? await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              nama,
              password,
              kelas,
              semester: semester ? parseInt(semester) : null,
              applicant: {
                update: {
                  motivasi,
                  fileTranskrip: req.files.file_transkip[0].filename,
                  fileFoto: req.files.file_foto[0].filename,
                  fileFormulir: req.files.file_formulir[0].filename,
                  status: "pending",
                  deletedAt: null,
                  catatanAdmin: null,
                },
              },
            },
            include: { applicant: true },
          })
        : null
      : await prisma.user.create({
          data: {
            nim,
            nama,
            password,
            kelas,
            semester: semester ? parseInt(semester) : null,
            role: "applicant",
            applicant: {
              create: {
                motivasi,
                fileTranskrip: req.files.file_transkip[0].filename,
                fileFoto: req.files.file_foto[0].filename,
                fileFormulir: req.files.file_formulir[0].filename,
                status: "pending",
              },
            },
          },
          include: { applicant: true },
        });

    if (!user) {
      return res.status(409).json({ message: "NIM sudah terdaftar" });
    }

    return res.status(201).json({
      message: existingUser ? "Pendaftaran diperbarui" : "Pendaftaran berhasil",
      data: {
        id: user.id,
        nim: user.nim,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const loginApplicant = async (req, res, next) => {
  try {
    const { nim, password } = req.body;

    if (!nim || !password) {
      return res.status(400).json({ message: "NIM dan password wajib diisi" });
    }

    const user = await prisma.user.findUnique({
      where: { nim },
      include: { applicant: true },
    });

    if (!user || user.role !== "applicant") {
      return res.status(401).json({ message: "NIM atau password salah" });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "NIM atau password salah" });
    }

    const token = signToken({ id: user.id, role: user.role, nim: user.nim });

    return res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nim: user.nim,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi" });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const valid = await comparePassword(password, admin.password);
    if (!valid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = signToken({
      id: admin.id,
      role: "admin",
      email: admin.email,
    });

    return res.json({
      message: "Login admin berhasil",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      const admin = await prisma.admin.findUnique({
        where: { id: req.user.id },
      });
      return res.json({ user: admin });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { applicant: true },
    });

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Password lama dan baru wajib diisi" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const valid = await comparePassword(currentPassword, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Password lama tidak valid" });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: await hashPassword(newPassword) },
    });

    return res.json({ message: "Password berhasil diubah" });
  } catch (error) {
    return next(error);
  }
};
