import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(20, 'Password must be at most 20 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one digit')
  .regex(/[@$!%*?&#]/, 'Must contain at least one special character (@$!%*?&#)');

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .regex(
        /^[A-Za-z]{2,50}\s[A-Za-z]{2,50}$/,
        'Enter first and last name, each 2–50 alphabetic characters'
      ),
    companyName: z
      .string()
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must be at most 100 characters')
      .regex(/^[A-Za-z0-9\s&\-.]+$/, 'Only letters, numbers, &, -, . allowed'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phoneNumber: z
      .string()
      .regex(/^\d{10,15}$/, 'Phone number must be 10–15 digits'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─── Settings ─────────────────────────────────────────────────────────────────

export const settingsSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .regex(
      /^[A-Za-z]{2,50}\s[A-Za-z]{2,50}$/,
      'Enter first and last name, each 2–50 alphabetic characters'
    ),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

// ─── Bus Form ─────────────────────────────────────────────────────────────────

export const busInfoSchema = z.object({
  busName: z.string().min(2, 'Bus name must be at least 2 characters').max(100),
  totalSeat: z
    .number()
    .int('Seat count must be a whole number')
    .min(1, 'At least 1 seat required')
    .max(100, 'Maximum 100 seats'),
});

export type BusInfoFormData = z.infer<typeof busInfoSchema>;

export const stationSchema = z.object({
  station: z.string().min(2, 'Station name required').max(60),
  arrived_time: z.string().min(1, 'Arrival time required'),
  Distance_from_Previous_Station: z.number().min(0, 'Distance must be ≥ 0'),
  isLastStation: z.boolean().optional(),
});

export type StationFormData = z.infer<typeof stationSchema>;

// ─── Driver Form ──────────────────────────────────────────────────────────────

export const driverSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  licenseNumber: z.string().min(4, 'License number required').max(30),
  phone: z.string().regex(/^\d{10,15}$/, 'Phone must be 10–15 digits'),
  status: z.enum(['available', 'on_trip', 'leave']),
});

export type DriverFormData = z.infer<typeof driverSchema>;
