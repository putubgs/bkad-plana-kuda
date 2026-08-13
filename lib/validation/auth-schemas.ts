import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username atau email wajib diisi").trim(),
  password: z.string().min(1, "Kata sandi wajib diisi"),
  rememberMe: z.boolean().optional(),
});

export const otpVerifySchema = z.object({
  otp: z
    .string()
    .trim()
    .min(6, "Kode harus 6 digit atau kode pemulihan yang valid")
    .max(20, "Kode tidak valid"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid").trim(),
});

const passwordField = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .regex(/[a-zA-Z]/, "Password harus mengandung huruf")
  .regex(/[0-9]/, "Password harus mengandung angka");

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token tidak valid"),
    password: passwordField,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Password lama wajib diisi"),
    newPassword: passwordField,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "Password baru harus berbeda dari password lama",
    path: ["newPassword"],
  });

export const mfaSetupVerifySchema = z.object({
  otp: z.string().trim().length(6, "Kode OTP harus 6 digit"),
});

export const mfaReauthSchema = z.object({
  currentPassword: z.string().min(1, "Password wajib diisi"),
});
