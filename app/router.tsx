import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

// Pages
import { ProjectDiscovery } from '@/components/ProjectDiscovery';
import { IndustryChallengesBoard } from '@/components/IndustryChallengesBoard';
import { AIMatchmaking } from '@/components/AIMatchmaking';
import { PartnerShowcase } from '@/components/PartnerShowcase';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { TalentShowcase } from '@/components/TalentShowcase';
import { IPPortfolio } from '@/components/IPPortfolio';
import { NegotiationWorkspace } from '@/components/NegotiationWorkspace';
import { AgreementGenerator } from '@/components/AgreementGenerator';
import { IPDisclosureForm } from '@/components/IPDisclosureForm';
import { LicensingMarketplace } from '@/components/LicensingMarketplace';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AgreementCompareReview } from '@/components/AgreementCompareReview';
import { DigitalSignature } from '@/components/DigitalSignature';
import { AgreementTracking } from '@/components/AgreementTracking';
import { ProfilePage } from '@/components/ProfilePage';
import { MatchmakingBlueprint } from '@/components/MatchmakingBlueprint';
import { IndustryProfileSettings } from '@/components/IndustryProfileSettings';
import { CollaborationFeed } from '@/components/CollaborationFeed';
import { LoginPage } from '@/components/LoginPage';

// Proxy components live in a separate file to satisfy react-refresh Fast Refresh rules
import { SplashFallback, DashboardProxy, WorkspaceProxy } from './proxy-components';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DashboardProxy />
            },
            {
                path: 'projects',
                element: <SplashFallback><ProjectDiscovery /></SplashFallback>
            },
            {
                path: 'challenges',
                element: <SplashFallback><IndustryChallengesBoard /></SplashFallback>
            },
            {
                path: 'partners',
                element: <SplashFallback><PartnerShowcase /></SplashFallback>
            },
            {
                path: 'matchmaking',
                element: <SplashFallback><AIMatchmaking /></SplashFallback>
            },
            {
                path: 'agreement-review',
                element: <SplashFallback><AgreementCompareReview /></SplashFallback> // Needs onNavigate technically, maybe we refactor the props of these.
            },
            {
                path: 'digital-signature',
                element: <SplashFallback><DigitalSignature /></SplashFallback>
            },
            {
                path: 'notifications',
                element: <SplashFallback><NotificationsPanel /></SplashFallback>
            },
            {
                path: 'feed',
                element: <SplashFallback><CollaborationFeed /></SplashFallback>
            },
            {
                path: 'profile',
                element: <SplashFallback><ProfilePage /></SplashFallback>
            },
            {
                path: 'engine-blueprint',
                element: <SplashFallback><MatchmakingBlueprint /></SplashFallback>
            },
            {
                path: 'industry-profile',
                element: <SplashFallback><IndustryProfileSettings /></SplashFallback>
            },
            {
                path: 'workspace',
                element: <SplashFallback><Navigate to="/workspace/1" replace /></SplashFallback>
            },
            {
                path: 'workspace/:projectId',
                element: <SplashFallback><WorkspaceProxy /></SplashFallback>
            },
            {
                path: 'talent',
                element: <SplashFallback><TalentShowcase /></SplashFallback>
            },
            {
                path: 'ip',
                element: <SplashFallback><IPPortfolio /></SplashFallback>
            },
            {
                path: 'negotiate',
                element: <SplashFallback><NegotiationWorkspace collaborationRequestId={1} /></SplashFallback>
            },
            {
                path: 'agreement',
                element: <SplashFallback><AgreementGenerator collaborationRequestId={1} /></SplashFallback>
            },
            {
                path: 'agreement-tracking',
                element: <SplashFallback><AgreementTracking /></SplashFallback>
            },
            {
                path: 'ipdisclosure',
                element: <SplashFallback><IPDisclosureForm activeProjectId={1} onSuccess={() => { }} /></SplashFallback>
            },
            {
                path: 'licensing',
                element: <SplashFallback><LicensingMarketplace /></SplashFallback>
            },
            {
                path: 'analytics',
                element: <SplashFallback><AnalyticsDashboard /></SplashFallback>
            }
        ]
    }
]);
