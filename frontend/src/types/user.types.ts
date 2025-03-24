// types/user.types.ts

export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    skillLevel: string;
    preferences: UserPreferences;
    projects: Project[];
    stepProgress: StepProgress[];
  }
  
  export interface UserPreferences {
    id: string;
    userId: string;
    timeZone: string;
    dailyWorkHours: number;
    emailNotifications: boolean;
    theme: 'light' | 'dark';
  }
  
  export interface Project {
    id: string;
    title: string;
    status: string;
    progress: number;
  }
  
  export interface StepProgress {
    id: string;
    step: {
      id: string;
      title?: string;
      learningPath: {
        id: string;
        title?: string;
      };
    };
    completed: boolean;
    completedAt?: Date;
  }