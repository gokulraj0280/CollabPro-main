import { create } from 'zustand';
import { supabase } from './supabase';

// User Types
export type User = {
    user_id: string;
    name: string;
    email: string;
    organization: string;
    organization_type: 'college' | 'corporate' | 'student';
    role: string;
    department?: string;
};

// Test Data Types
export interface MetricData {
    title: string;
    value: string | number;
    trend: string;
    color: string;
    bg: string;
    icon?: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface ResearchProject {
    id: number;
    title: string;
    description: string;
    funding_needed: number;
    trl_level: number;
    status: string;
    team_lead: string;
    team_size: number;
    publications_count: number;
    College_name: string;
    College_location: string;
    expertise_areas: string[];
}

export interface IndustryChallenge {
    id: number;
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    timeline_months: number;
    status: string;
    company_name: string;
    industry: string;
    company_location: string;
    required_expertise: string[];
    created_at: string;
}

export interface College {
    id: number;
    name: string;
    location: string;
    website: string;
    research_strengths: string;
    available_resources: string;
    success_rate: number;
    past_partnerships_count: number;
    active_projects_count: number;
}

export interface TestData {
    metrics: MetricData[];
    chartData: ChartDataPoint[];
    projects: ResearchProject[];
    challenges: IndustryChallenge[];
    Colleges: College[];
    recentActivity: { id: number; title: string; College_name: string; timestamp: string }[];
    agreementVersions: { version_number: string; created_at: string; created_by: string; content: string; sections: { id: string; title: string; text: string }[] }[];
    agreementComments: { id: number; section_id: string; author: string; text: string; timestamp: string }[];
    signatureWorkflow: {
        status: 'draft' | 'review' | 'approval' | 'signed';
        College_approval: boolean;
        corporate_approval: boolean;
        College_signed: boolean;
        corporate_signed: boolean;
        audit_trail: { id: number; event: string; actor: string; timestamp: string }[];
    };
    projectName: string;
    userRole: string;
}

interface UserSlice {
    user: User | null;
    userLoading: boolean;
    loadUser: (userId: string) => Promise<User | null>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    setCurrentUser: (userId: string) => Promise<void>;
    setUserFromAuth: (authUser: { id: string; email?: string; user_metadata?: { name?: string } }) => void;
}

interface DataSlice {
    testData: TestData;
}

interface UISlice {
    theme: 'light' | 'quantum';
    setTheme: (theme: 'light' | 'quantum') => void;
    livePulse: { id: string; message: string; type: 'match' | 'system' | 'alert'; timestamp: string }[];
    addPulse: (pulse: { message: string; type: 'match' | 'system' | 'alert' }) => void;
}

type AppState = UserSlice & DataSlice & UISlice;
import { StateCreator } from 'zustand';

const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set, get) => ({
    user: null,
    userLoading: true,
    loadUser: async (userId: string): Promise<User | null> => {
        const storedUser = localStorage.getItem(`collabpro_user_${userId}`);
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            set({ user: parsedUser, userLoading: false });
            return parsedUser;
        }

        set({ userLoading: true });
        try {
            const { data, error } = await supabase
                .from('user_sessions')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();

            if (error) throw error;
            if (data) {
                set({ user: data as User });
                return data as User;
            }
            return null;
        } catch (error) {
            console.error('Error loading user:', error);
            return null;
        } finally {
            set({ userLoading: false });
        }
    },
    updateUser: async (updates: Partial<User>) => {
        let currentUser = get().user;
        if (!currentUser) {
            // Auto-initialize demo user if session is missing (Local Demo Mode)
            currentUser = {
                user_id: 'user_1',
                name: 'Demo Architect',
                email: 'demo@collabsync.pro',
                organization: 'CollabSync Lab',
                organization_type: updates.organization_type || 'corporate',
                role: 'Lead Researcher'
            };
        }
        const updatedUser = { ...currentUser, ...updates };
        set({ user: updatedUser, userLoading: false });
        localStorage.setItem(`collabpro_user_${currentUser.user_id}`, JSON.stringify(updatedUser));
        await new Promise(resolve => setTimeout(resolve, 500));
    },
    setCurrentUser: async (userId: string) => {
        await get().loadUser(userId);
    },
    setUserFromAuth: (authUser: { id: string; email?: string; user_metadata?: { name?: string } }) => {
        set({
            user: {
                user_id: authUser.id,
                name: authUser.user_metadata?.name ?? authUser.email ?? 'User',
                email: authUser.email ?? '',
                organization: '',
                organization_type: 'corporate',
                role: '',
            },
        });
    },
});

const defaultTestData: TestData = {
    projectName: "CollabSync Pro",
    userRole: "Lead Researcher",
    metrics: [
        { title: 'Active Projects', value: 0, trend: '0%', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-500' },
        { title: 'Open Challenges', value: 0, trend: '0%', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-500' },
        { title: 'Pending Requests', value: 0, trend: '0%', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-500' },
        { title: 'Success Rate', value: '0%', trend: '0%', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-500' }
    ],
    chartData: [],
    recentActivity: [],
    agreementVersions: [],
    agreementComments: [],
    signatureWorkflow: {
        status: 'draft',
        College_approval: false,
        corporate_approval: false,
        College_signed: false,
        corporate_signed: false,
        audit_trail: []
    },
    projects: [],
    challenges: [],
    Colleges: []
};

const createDataSlice: StateCreator<AppState, [], [], DataSlice> = () => ({
    testData: defaultTestData,
});

const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
    theme: (localStorage.getItem('collabpro_theme') as 'light' | 'quantum') || 'light',
    setTheme: (theme: 'light' | 'quantum') => {
        set({ theme });
        localStorage.setItem('collabpro_theme', theme);
    },
    livePulse: [],
    addPulse: (pulse: { message: string; type: 'match' | 'system' | 'alert' }) => {
        const newPulse = {
            ...pulse,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toLocaleTimeString(),
        };
        set((state: AppState) => ({
            livePulse: [newPulse, ...state.livePulse].slice(0, 15)
        }));
    },
});

export const useAppStore = create<AppState>()((...a) => ({
    ...createUserSlice(...a),
    ...createDataSlice(...a),
    ...createUISlice(...a),
}));
