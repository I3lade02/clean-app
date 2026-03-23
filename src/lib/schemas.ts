import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "E-mail je povinny.")
    .email("Zadej platny e-mail."),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Jmeno musi mit aspon 2 znaky."),
  email: z
    .string()
    .trim()
    .min(1, "E-mail je povinny.")
    .email("Zadej platny e-mail."),
});

export const createReportSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, "Nazev hlaseni musi mit aspon 4 znaky.")
    .max(80, "Nazev hlaseni je prilis dlouhy."),
  description: z
    .string()
    .trim()
    .min(12, "Popis musi mit aspon 12 znaku.")
    .max(500, "Popis je prilis dlouhy."),
});
