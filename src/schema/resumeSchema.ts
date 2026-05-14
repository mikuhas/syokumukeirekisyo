import { z } from 'zod';

export const STARSchema = z.object({
  situation: z.string().optional(),
  task: z.string().optional(),
  action: z.string().optional(),
  result: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrentlyWorking: z.boolean().default(false),
  details: z.string().min(1, 'Project details are required'),
  workContent: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  scale: z.string().optional(),
  assignedTasks: z.string().optional(),
  star: STARSchema,
  techStack: z.record(z.string(), z.array(z.object({
    name: z.string(),
    version: z.string().optional(),
  }))).optional(),
});

export const WorkExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  employmentStatus: z.string().min(1, 'Employment status is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  isCurrentlyWorking: z.boolean().default(false),
  projects: z.array(ProjectSchema),
});

export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).optional(),
  summary: z.string().min(1, 'Summary is required'),
  selfPromotion: z.string().min(1, 'Self promotion is required'),
  certifications: z.array(z.string()).optional(),
});

export const ResumeSchema = z.object({
  profile: ProfileSchema,
  workExperiences: z.array(WorkExperienceSchema),
});

export type STAR = z.infer<typeof STARSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
