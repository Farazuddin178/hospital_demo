import { z } from "zod";

// Shared validation rules used by both the client form (instant feedback)
// and the API route (source of truth — never trust client-side validation alone).

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email: z.string().trim().email("Enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
  // Honeypot: real users never see/fill this field; bots that auto-fill every field will.
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export const appointmentSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(80),
  email: z.string().trim().email("Enter a valid email address").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number"),
  department: z.string().trim().min(1, "Please select a department"),
  preferredDate: z.string().trim().min(1, "Please choose a preferred date"),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  company: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
