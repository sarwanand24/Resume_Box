export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  screenshot?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  screenshot: File | null;
}