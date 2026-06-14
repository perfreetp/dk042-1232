export interface Collaborator {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: string;
  joinedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: 'todo' | 'doing' | 'done';
  deadline: string;
}

export interface FileLink {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface MeetingNote {
  id: string;
  title: string;
  content: string;
  date: string;
  attendees: string[];
}

export interface ReviewNote {
  id: string;
  phase: string;
  achievements: string;
  improvements: string;
  nextSteps: string;
  date: string;
}

export interface Collaboration {
  id: string;
  projectId: string;
  projectTitle: string;
  coverImage: string;
  collaborators: Collaborator[];
  progress: number;
  tasks: TaskItem[];
  files: FileLink[];
  meetings: MeetingNote[];
  reviews: ReviewNote[];
  status: 'active' | 'completed';
}
