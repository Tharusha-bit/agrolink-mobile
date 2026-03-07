import React, { createContext, ReactNode, useContext, useState } from 'react';

// ─── 1. Define the Shape of a Project ─────────────────────────────────────────
export interface Project {
  id: string;
  farmer: string;
  since: string;       // e.g., "19 Nov 2025"
  title: string;       // e.g., "Yala Paddy Expansion"
  location: string;    // e.g., "Anuradhapura"
  description: string;
  raised: number;      // Current amount (LKR)
  goal: number;        // Target amount (LKR)
  minInvest: string;   // e.g., "LKR 5,000"
  duration: string;    // e.g., "6 Months"
  roi: string;         // e.g., "14%"
  riskLevel: 'Low' | 'Medium' | 'High';
  image: string;       // URL
  tags: string[];      // e.g., ["Rice", "Organic"]
  progress: number;    // 0.0 to 1.0 (Percentage)
  updates: ProjectUpdate[];
  investors: Investor[];
}

export interface ProjectUpdate {
  date: string;
  title: string;
  description: string;
  image?: string;
}

export interface Investor {
  id: string;
  name: string;
  amount: number;
  date: string;
  image: string;
}

// Define the Context Shape (Data + Functions)
interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
}

// ─── 2. Create the Context ────────────────────────────────────────────────────
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// ─── 3. Initial Dummy Data (So the app isn't empty) ───────────────────────────
const INITIAL_DATA: Project[] = [
  {
    id: '1',
    farmer: 'Suriyakumar',
    since: '19 Nov 2025',
    title: 'Suriyakumar Paddy Estate',
    location: 'Anuradhapura',
    description: 'Committed farmer seeking investment partners for 8 acres of fertile paddy field. Excellent soil quality and reliable water access.',
    raised: 48000,
    goal: 60000,
    minInvest: 'LKR 5,000',
    duration: '4 Months',
    roi: '12-15%',
    riskLevel: 'Low',
    image: 'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg',
    tags: ['Paddy', 'Rice'],
    progress: 0.8,
    updates: [],
    investors: []
  },
  {
    id: '2',
    farmer: 'Priya Devi',
    since: '2 Jan 2026',
    title: 'Jaffna Organic Veg',
    location: 'Jaffna',
    description: 'Organic vegetable farm seeking working capital. Specialises in export-grade green beans and okra.',
    raised: 14100,
    goal: 30000,
    minInvest: 'LKR 2,500',
    duration: '3 Months',
    roi: '18%',
    riskLevel: 'Medium',
    image: 'https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg',
    tags: ['Organic', 'Veg'],
    progress: 0.47,
    updates: [
      { date: '20 Nov 2025', title: 'Land Preparation', description: 'Ploughing completed.', image: '...' }
    ],
    investors: [
      { id: '101', name: 'Dr. Perera', amount: 20000, date: '21 Nov', image: '...' },
      { id: '102', name: 'InvestCorp', amount: 15000, date: '22 Nov', image: '...' }
    ]
  }

];

// ─── 4. The Provider Component ────────────────────────────────────────────────
export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_DATA);

  // Function to add a new project to the TOP of the list
  const addProject = (newProject: Project) => {
    setProjects((prevProjects) => [newProject, ...prevProjects]);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

// ─── 5. The Hook (Use this in your screens) ───────────────────────────────────
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};