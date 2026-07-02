// Custom React hooks for IndexedDB operations using Dexie

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import type {
    ResearchProject,
    IndustryChallenge,
    College,
    CollaborationRequest,
    IPDisclosure,
    Negotiation,
    Agreement,
    Notification as AppNotification,
    StudentProfile,
    LicensingOpportunity,
    InterviewRequest,
    LicensingInquiry,
    ProjectDocument,
    CorporatePartner,
    ProjectScope,
    NegotiationMessage,
} from '../lib/types';

// Research Projects Hook
export function useProjects() {
    const data = useLiveQuery(() => db.research_projects.toArray()) || [];

    const create = async (project: Omit<ResearchProject, 'id' | 'created_at'>) => {
        return await db.research_projects.add({
            ...project,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<ResearchProject>) => {
        return await db.research_projects.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.research_projects.delete(id);
    };

    const getById = async (id: number) => {
        return await db.research_projects.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Single Project Hook
export function useProject(id: number) {
    const data = useLiveQuery(() => db.research_projects.get(id), [id]);

    return {
        data,
        loading: data === undefined,
        error: null,
    };
}

// Industry Challenges Hook
export function useChallenges() {
    const data = useLiveQuery(() => db.industry_challenges.toArray()) || [];

    const create = async (challenge: Omit<IndustryChallenge, 'id' | 'created_at'>) => {
        return await db.industry_challenges.add({
            ...challenge,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<IndustryChallenge>) => {
        return await db.industry_challenges.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.industry_challenges.delete(id);
    };

    const getById = async (id: number) => {
        return await db.industry_challenges.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Colleges Hook
export function useColleges() {
    const data = useLiveQuery(() => db.colleges.toArray()) || [];

    const create = async (college: Omit<College, 'id' | 'created_at'>) => {
        return await db.colleges.add({
            ...college,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<College>) => {
        return await db.colleges.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.colleges.delete(id);
    };

    const getById = async (id: number) => {
        return await db.colleges.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Collaboration Requests Hook
export function useCollaborationRequests() {
    const data = useLiveQuery(() => db.collaboration_requests.toArray()) || [];

    const create = async (request: Omit<CollaborationRequest, 'id' | 'created_at'>) => {
        return await db.collaboration_requests.add({
            ...request,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<CollaborationRequest>) => {
        return await db.collaboration_requests.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.collaboration_requests.delete(id);
    };

    const getById = async (id: number) => {
        return await db.collaboration_requests.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// IP Disclosures Hook
export function useIPDisclosures() {
    const data = useLiveQuery(() => db.ip_disclosures.toArray()) || [];

    const create = async (disclosure: Omit<IPDisclosure, 'id' | 'created_at'>) => {
        return await db.ip_disclosures.add({
            ...disclosure,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<IPDisclosure>) => {
        return await db.ip_disclosures.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.ip_disclosures.delete(id);
    };

    const getById = async (id: number) => {
        return await db.ip_disclosures.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Negotiations Hook
export function useNegotiations() {
    const data = useLiveQuery(() => db.negotiations.toArray()) || [];

    const create = async (negotiation: Omit<Negotiation, 'id' | 'created_at'>) => {
        return await db.negotiations.add({
            ...negotiation,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<Negotiation>) => {
        return await db.negotiations.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.negotiations.delete(id);
    };

    const getById = async (id: number) => {
        return await db.negotiations.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Single Negotiation Hook
export function useNegotiation(collaborationRequestId: number) {
    const data = useLiveQuery(
        () => db.negotiations.where('collaboration_request_id').equals(collaborationRequestId).first(),
        [collaborationRequestId]
    );

    const addMessage = async (message: Omit<NegotiationMessage, 'id' | 'created_at'>) => {
        if (!data || !data.id) return;
        const messages = [...(data.messages || []), { ...message, id: Date.now().toString(), created_at: new Date().toISOString() }];
        return await db.negotiations.update(data.id, { messages });
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        addMessage,
    };
}

// Project Scopes Hook
export function useProjectScopes(collaborationRequestId?: number) {
    const data = useLiveQuery(
        () => collaborationRequestId
            ? db.project_scopes.where('collaboration_request_id').equals(collaborationRequestId).sortBy('version_number')
            : db.project_scopes.toArray(),
        [collaborationRequestId]
    ) || [];

    const create = async (scope: Omit<ProjectScope, 'id' | 'created_at'>) => {
        return await db.project_scopes.add({
            ...scope,
            created_at: new Date().toISOString(),
        });
    };

    const updateStatus = async (id: number, status: ProjectScope['status']) => {
        return await db.project_scopes.update(id, { status });
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        updateStatus,
    };
}

// Agreements Hook
export function useAgreements() {
    const data = useLiveQuery(() => db.agreements.toArray()) || [];

    const create = async (agreement: Omit<Agreement, 'id' | 'created_at'>) => {
        return await db.agreements.add({
            ...agreement,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<Agreement>) => {
        return await db.agreements.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.agreements.delete(id);
    };

    const getById = async (id: number) => {
        return await db.agreements.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Single Agreement Hook
export function useAgreement(collaborationRequestId: number) {
    const data = useLiveQuery(
        () => db.agreements.where('collaboration_request_id').equals(collaborationRequestId).first(),
        [collaborationRequestId]
    );

    const approve = async (role: 'college' | 'corporate') => {
        if (!data || !data.id) return;
        const updates = role === 'college'
            ? { college_approval_status: true }
            : { corporate_approval_status: true };
        return await db.agreements.update(data.id, updates);
    };

    const sign = async (signature: string, role: 'college' | 'corporate') => {
        if (!data || !data.id) return;
        const updates = role === 'college'
            ? { college_signed_at: new Date().toISOString(), college_signatory: signature }
            : { corporate_signed_at: new Date().toISOString(), corporate_signatory: signature };

        // If both signed, mark as signed
        const agreement = await db.agreements.get(data.id);
        if (agreement) {
            const bothSigned = (role === 'college' ? !!signature : !!agreement.college_signatory) &&
                (role === 'corporate' ? !!signature : !!agreement.corporate_signatory);
            if (bothSigned) {
                (updates as any).status = 'signed';
            }
        }

        return await db.agreements.update(data.id, updates);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        approve,
        sign,
    };
}

// Notifications Hook
export function useNotifications() {
    const data = useLiveQuery(() =>
        db.notifications.orderBy('created_at').reverse().toArray()
    ) || [];

    const create = async (notification: Omit<AppNotification, 'id' | 'created_at'>) => {
        return await db.notifications.add({
            ...notification,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<AppNotification>) => {
        return await db.notifications.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.notifications.delete(id);
    };

    const markAsRead = async (id: number) => {
        return await db.notifications.update(id, { read: true });
    };

    const markAllAsRead = async () => {
        const unread = await db.notifications.where('read').equals(0).toArray();
        await Promise.all(unread.map((n: AppNotification) => n.id && db.notifications.update(n.id, { read: true })));
    };

    const unreadCount = data.filter((n: AppNotification) => !n.read).length;

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        markAsRead,
        markAllAsRead,
        unreadCount,
    };
}

// Student Profiles Hook
export function useStudentProfiles() {
    const data = useLiveQuery(() => db.student_profiles.toArray()) || [];

    const create = async (profile: Omit<StudentProfile, 'id' | 'created_at'>) => {
        return await db.student_profiles.add({
            ...profile,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<StudentProfile>) => {
        return await db.student_profiles.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.student_profiles.delete(id);
    };

    const getById = async (id: number) => {
        return await db.student_profiles.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Licensing Opportunities Hook
export function useLicensingOpportunities() {
    const data = useLiveQuery(() => db.licensing_opportunities.toArray()) || [];

    const create = async (opportunity: Omit<LicensingOpportunity, 'id' | 'created_at'>) => {
        return await db.licensing_opportunities.add({
            ...opportunity,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<LicensingOpportunity>) => {
        return await db.licensing_opportunities.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.licensing_opportunities.delete(id);
    };

    const getById = async (id: number) => {
        return await db.licensing_opportunities.get(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
        getById,
    };
}

// Interview Requests Hook
export function useInterviewRequests() {
    const data = useLiveQuery(() => db.interview_requests.toArray()) || [];

    const create = async (request: Omit<InterviewRequest, 'id' | 'created_at'>) => {
        return await db.interview_requests.add({
            ...request,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<InterviewRequest>) => {
        return await db.interview_requests.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.interview_requests.delete(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
    };
}

// Licensing Inquiries Hook
export function useLicensingInquiries() {
    const data = useLiveQuery(() => db.licensing_inquiries.toArray()) || [];

    const create = async (inquiry: Omit<LicensingInquiry, 'id' | 'created_at'>) => {
        return await db.licensing_inquiries.add({
            ...inquiry,
            created_at: new Date().toISOString(),
        });
    };

    const update = async (id: number, updates: Partial<LicensingInquiry>) => {
        return await db.licensing_inquiries.update(id, updates);
    };

    const remove = async (id: number) => {
        return await db.licensing_inquiries.delete(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        update,
        remove,
    };
}

// Project Documents Hook
export function useProjectDocuments(projectId?: number) {
    const data = useLiveQuery(
        () => projectId 
            ? db.project_documents.where('project_id').equals(projectId).toArray()
            : db.project_documents.toArray(),
        [projectId]
    ) || [];

    const create = async (doc: Omit<ProjectDocument, 'id' | 'uploaded_at'>) => {
        return await db.project_documents.add({
            ...doc,
            uploaded_at: new Date().toISOString(),
        });
    };

    const remove = async (id: number) => {
        return await db.project_documents.delete(id);
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
        remove,
    };
}

// IP Disclosures for Project Hook
export function useIPDisclosuresForProject(projectId: number) {
    const data = useLiveQuery(
        () => db.ip_disclosures.where('active_project_id').equals(projectId).toArray(),
        [projectId]
    ) || [];

    return {
        data,
        loading: data === undefined,
        error: null,
    };
}

// Corporate Partners Hook
export function useCorporatePartners() {
    const data = useLiveQuery(() => db.corporate_partners.toArray()) || [];

    const create = async (partner: Omit<CorporatePartner, 'id'>) => {
        return await db.corporate_partners.add({
            ...partner,
            created_at: new Date().toISOString(),
        });
    };

    return {
        data,
        loading: data === undefined,
        error: null,
        create,
    };
}
