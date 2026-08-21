import { z } from 'zod';
import { MEMBERSHIP_PLAN_VALUES, PAYMENT_METHOD_VALUES, DONATION_PURPOSE_VALUES } from './constants.js';

export const memberSchema = z.object({
  membershipPlan: z.enum(MEMBERSHIP_PLAN_VALUES, {
    errorMap: () => ({ message: 'validation.membershipPlan.invalid' }),
  }),
  fullName: z.string().trim().min(2, 'validation.fullName.min'),
  email: z.string().trim().email('validation.email.invalid'),
  phone: z.string().trim().min(8, 'validation.phone.min'),
  city: z.string().trim().min(2, 'validation.city.min'),
  profession: z.string().trim().min(2, 'validation.profession.min'),
  motivation: z.string().trim().min(10, 'validation.motivation.min'),
  termsAgreement: z.literal(true, {
    errorMap: () => ({ message: 'validation.termsAgreement.required' }),
  }),
});

export const donationSchema = z
  .object({
    amount: z.coerce.number().positive('validation.amount.positive'),
    donorName: z.string().trim().nullable().optional(),
    donorEmail: z.string().trim().email('validation.email.invalid').nullable().optional().or(z.literal('')),
    donorPhone: z.string().trim().nullable().optional(),
    donationPurpose: z.enum(DONATION_PURPOSE_VALUES),
    paymentMethod: z.enum(PAYMENT_METHOD_VALUES, {
      errorMap: () => ({ message: 'validation.paymentMethod.required' }),
    }),
    anonymous: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.anonymous) {
      if (!data.donorName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['donorName'], message: 'validation.donorName.required' });
      }
      if (!data.donorEmail) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['donorEmail'], message: 'validation.email.required' });
      }
      if (!data.donorPhone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['donorPhone'], message: 'validation.phone.required' });
      }
    }
  });

export const quickContactSchema = z.object({
  name: z.string().trim().min(2, 'validation.name.min'),
  email: z.string().trim().email('validation.email.invalid'),
  phone: z.string().trim().min(8, 'validation.phone.min'),
  message: z.string().trim().min(10, 'validation.message.min'),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email('validation.email.invalid'),
});

export const volunteerSchema = z.object({
  volunteerName: z.string().trim().min(2, 'validation.fullName.min'),
  volunteerEmail: z.string().trim().email('validation.email.invalid'),
  volunteerPhone: z.string().trim().min(8, 'validation.phone.min'),
  volunteerSkills: z.string().trim().min(2, 'validation.skills.min'),
  volunteerAvailability: z.enum(['weekdays', 'weekends', 'evenings', 'flexible'], {
    errorMap: () => ({ message: 'validation.availability.required' }),
  }),
  volunteerMotivation: z.string().trim().min(10, 'validation.motivation.min'),
});
