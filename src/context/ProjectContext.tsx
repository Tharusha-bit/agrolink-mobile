import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface Farmer {
  id:         string;
  name:       string;
  location:   string;
  trustScore: number;   // 0–100
  since:      string;   // e.g. "Nov 2024"
  avatarUrl?: string;
}

export interface Investor {
  id:        string;
  name:      string;
  amount:    number;    // LKR
  date:      string;    // ISO date string
  avatarUrl?: string;
}

export interface ProjectUpdate {
  id:          string;
  date:        string;  // ISO date string
  title:       string;
  description: string;
  imageUrl?:   string;
}

export interface Project {
  id:          string;
  createdAt:   string;              // ISO date string — auto-set on creation

  // Farmer
  farmer:      Farmer;

  // Core details
  title:       string;
  location:    string;
  description: string;
  tags:        string[];

  // Financials
  goal:        number;              // LKR — funding target
  raised:      number;              // LKR — current total
  minInvest:   number;              // LKR — minimum investment amount
  roiMin:      number;              // e.g. 12  (means 12%)
  roiMax:      number;              // e.g. 15  (means 15%)
  duration:    number;              // months

  // Risk
  riskLevel:   'Low' | 'Medium' | 'High';

  // Media
  imageUrl:    string;

  // Relationships
  updates:     ProjectUpdate[];
  investors:   Investor[];
}

// ─────────────────────────────────────────────────────────────────────────────
// INPUT TYPES  (what callers pass in — id and createdAt are auto-generated)
// ─────────────────────────────────────────────────────────────────────────────

export type NewProjectInput = Omit<Project, 'id' | 'createdAt' | 'raised' | 'investors' | 'updates'> & {
  raised?:    number;          // optional override — defaults to 0
  investors?: Investor[];      // optional seed data
  updates?:   ProjectUpdate[];
};

export interface InvestInput {
  projectId: string;
  investor:  Omit<Investor, 'id' | 'date'>;
  amount:    number;           // LKR
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT SHAPE
// ─────────────────────────────────────────────────────────────────────────────

interface ProjectContextType {
  projects:    Project[];

  /** Add a new project. id and createdAt are auto-generated. */
  addProject:  (input: NewProjectInput) => Project;

  /** Record an investment against a project. */
  invest:      (input: InvestInput) => void;

  /** Pure helper — compute 0.0–1.0 progress from raised / goal. */
  getProgress: (project: Pick<Project, 'raised' | 'goal'>) => number;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Lightweight UUID — good enough for a mobile app without an extra library. */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Clamp progress between 0 and 1. */
function computeProgress(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(raised / goal, 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED FARMERS
// ─────────────────────────────────────────────────────────────────────────────

const FARMERS: Record<string, Farmer> = {
  suriya: {
    id:         'f-001',
    name:       'Suriyakumar',
    location:   'Anuradhapura',
    trustScore: 92,
    since:      'Nov 2024',
  },
  priya: {
    id:         'f-002',
    name:       'Priya Devi',
    location:   'Jaffna',
    trustScore: 85,
    since:      'Jan 2025',
  },
  nimal: {
    id:         'f-003',
    name:       'Nimal Perera',
    location:   'Kurunegala',
    trustScore: 78,
    since:      'Mar 2025',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_DATA: Project[] = [
  {
    id:          'p-001',
    createdAt:   '2025-11-19T08:00:00.000Z',
    farmer:      FARMERS.suriya,
    title:       'Suriyakumar Paddy Estate',
    location:    'Anuradhapura',
    description:
      'Committed farmer seeking investment partners for 8 acres of fertile paddy field. Excellent soil quality and reliable water access.',
    tags:        ['Paddy', 'Rice', 'Organic'],
    goal:        60000,
    raised:      48000,
    minInvest:   5000,
    roiMin:      12,
    roiMax:      15,
    duration:    4,
    riskLevel:   'Low',
    imageUrl:    'https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg',
    updates:     [],
    investors:   [],
  },
  {
    id:          'p-002',
    createdAt:   '2026-01-02T09:30:00.000Z',
    farmer:      FARMERS.priya,
    title:       'Jaffna Organic Vegetables',
    location:    'Jaffna',
    description:
      'Organic vegetable farm seeking working capital. Specialises in export-grade green beans and okra.',
    tags:        ['Organic', 'Vegetables', 'Export'],
    goal:        30000,
    raised:      14100,
    minInvest:   2500,
    roiMin:      16,
    roiMax:      18,
    duration:    3,
    riskLevel:   'Medium',
    imageUrl:    'https://cdn.pixabay.com/photo/2018/03/11/01/25/vegetable-3215091_1280.jpg',
    updates: [
      {
        id:          'u-001',
        date:        '2025-11-20T06:00:00.000Z',
        title:       'Land Preparation Complete',
        description: 'Ploughing and soil treatment completed. Ready for planting.',
      },
    ],
    investors: [
      { id: 'i-001', name: 'Dr. Perera',  amount: 10000, date: '2025-11-21T00:00:00.000Z', avatarUrl: '' },
      { id: 'i-002', name: 'InvestCorp',  amount: 4100,  date: '2025-11-22T00:00:00.000Z', avatarUrl: '' },
    ],
  },
  {
    id:          'p-003',
    createdAt:   '2026-02-10T07:00:00.000Z',
    farmer:      FARMERS.nimal,
    title:       'Kurunegala Coconut Grove',
    location:    'Kurunegala',
    description:
      'Expanding a 5-acre coconut grove with modern irrigation. Steady long-term returns expected from coconut oil exports.',
    tags:        ['Coconut', 'Export', 'Perennial'],
    goal:        80000,
    raised:      12000,
    minInvest:   10000,
    roiMin:      10,
    roiMax:      13,
    duration:    12,
    riskLevel:   'Low',
    imageUrl:    'https://cdn.pixabay.com/photo/2017/08/10/02/05/coconut-2616984_1280.jpg',
    updates:     [],
    investors:   [],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_DATA);

  // ── addProject ──────────────────────────────────────────────────────────────
  const addProject = useCallback((input: NewProjectInput): Project => {
    const newProject: Project = {
      ...input,
      id:        generateId(),
      createdAt: nowIso(),
      raised:    input.raised    ?? 0,
      investors: input.investors ?? [],
      updates:   input.updates   ?? [],
    };

    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  }, []);

  // ── invest ──────────────────────────────────────────────────────────────────
  const invest = useCallback(({ projectId, investor, amount }: InvestInput): void => {
    if (amount <= 0) {
      console.warn('invest(): amount must be greater than 0');
      return;
    }

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;

        const newInvestor: Investor = {
          ...investor,
          id:     generateId(),
          date:   nowIso(),
          amount,
        };

        return {
          ...p,
          raised:    p.raised + amount,
          investors: [newInvestor, ...p.investors],
        };
      })
    );
  }, []);

  // ── getProgress ─────────────────────────────────────────────────────────────
  const getProgress = useCallback(
    (project: Pick<Project, 'raised' | 'goal'>): number =>
      computeProgress(project.raised, project.goal),
    []
  );

  // ── memoised context value ───────────────────────────────────────────────────
  const value = useMemo<ProjectContextType>(
    () => ({ projects, addProject, invest, getProgress }),
    [projects, addProject, invest, getProgress]
  );

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects() must be used inside a <ProjectProvider>.');
  }
  return context;
};