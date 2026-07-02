import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// FAIL-SAFE: Mock modules that might cause side-effect crashes
vi.mock('@/lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            single: vi.fn().mockResolvedValue({ data: {}, error: null }),
        })),
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        }
    }
}));

// Mock actions to prevent their imports from executing real code
vi.mock('@/actions/loadNegotiationThread', () => ({ default: vi.fn() }));
vi.mock('@/actions/createNegotiationMessage', () => ({ default: vi.fn() }));
vi.mock('@/actions/createProjectScope', () => ({ default: vi.fn() }));
vi.mock('@/actions/approveProjectScope', () => ({ default: vi.fn() }));

import { NegotiationWorkspace } from './NegotiationWorkspace';
import * as dataActions from '@/lib/data-actions';
import * as store from '@/lib/store';

// Mock component dependencies
vi.mock('@/lib/data-actions', () => ({
    useLoadAction: vi.fn(() => [null, true, null, vi.fn()]),
    useMutateAction: vi.fn(() => [vi.fn(), false]),
}));

vi.mock('@/lib/store', () => ({
    useAppStore: vi.fn(),
}));

vi.mock('@/hooks/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
        toasts: []
    }),
}));

vi.mock('@/components/ui/animation-wrapper', () => ({
    FadeInUp: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    SpringPress: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    StaggerContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NegotiationWorkspace', () => {
    const mockUser = {
        user_id: 'user-1',
        name: 'Test User',
        organization: 'Test Org',
        organization_type: 'corporate',
        role: 'admin',
    };

    const mockThreadData = {
        thread_id: 1,
        collaboration_request_id: 123,
        project_brief: 'Test Project Brief',
        messages: [
            {
                id: 'msg-1',
                sender_name: 'Test User',
                sender_organization: 'Test Org',
                message_type: 'text',
                content: 'Hello there!',
                created_at: new Date().toISOString(),
            }
        ],
    };

    const mockRefresh = vi.fn();
    const mockSendMessage = vi.fn().mockResolvedValue({});

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(store.useAppStore).mockReturnValue({
            user: mockUser,
            userLoading: false,
        } as any);

        vi.mocked(dataActions.useLoadAction).mockImplementation(() => [
            mockThreadData,
            false,
            null,
            mockRefresh,
        ] as any);

        vi.mocked(dataActions.useMutateAction).mockReturnValue([
            mockSendMessage,
            false,
        ] as any);
    });

    it('sanity check', () => {
        expect(true).toBe(true);
    });

    it('renders workspace', () => {
        render(<NegotiationWorkspace collaborationRequestId={123} />);
        expect(screen.getByRole('heading', { name: /Negotiation Workspace/i })).toBeInTheDocument();
        expect(screen.getByText('Hello there!')).toBeInTheDocument();
    });
});
