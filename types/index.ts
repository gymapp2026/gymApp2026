export type Role = "superadmin" | "admin" | "user";

export type Plan = "free" | "basic" | "pro";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  plan: Plan;
  avatar?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExercise {
  _id: string;
  name: string;
  category: string;
  muscleGroup: string[];
  description: string;
  videoUrl?: string;
  gifUrl?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
}

export interface IRoutineExercise {
  exerciseId: string;
  exercise?: IExercise;
  sets: number;
  reps: number;
  rest: number;
  notes?: string;
}

export interface IRoutineDay {
  day: string;
  exercises: IRoutineExercise[];
}

export interface IRoutine {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  days: IRoutineDay[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  duration: "monthly" | "yearly";
  isActive: boolean;
}
