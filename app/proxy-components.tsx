// Proxy components for router — kept separate to satisfy Fast Refresh constraints
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ProjectWorkspace } from '@/components/ProjectWorkspace';
import { QuantumDashboard } from '@/components/QuantumDashboard';

export const SplashFallback = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};

export const DashboardProxy = () => {
    const navigate = useNavigate();
    const { theme } = useAppStore();
    const onNav = (path: any) => navigate(path === 'dashboard' ? '/' : `/${path}`);
    if (theme === 'quantum') return <QuantumDashboard />;
    return <DashboardOverview onNavigate={onNav} onProjectSelect={(id: number) => navigate(`/workspace/${id}`)} />;
};

export const WorkspaceProxy = () => {
    const { projectId } = useParams();
    return <ProjectWorkspace projectId={Number(projectId) || 1} />;
};
