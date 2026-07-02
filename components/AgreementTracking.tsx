import { useAgreements, useCollaborationRequests, useProjects } from '@/hooks/useDatabase';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { FileText, Building2, Briefcase, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

function getStatusBadgeClasses(status: string) {
    const normalized = status?.toLowerCase() ?? '';
    if (normalized === 'signed' || normalized === 'completed' || normalized === 'active') {
        return 'bg-emerald-100 text-emerald-800';
    }
    if (normalized === 'under_review' || normalized === 'under review' || normalized === 'pending') {
        return 'bg-amber-100 text-amber-800';
    }
    if (normalized === 'rejected' || normalized === 'declined') {
        return 'bg-red-100 text-red-800';
    }
    return 'bg-slate-100 text-slate-800';
}

function getRoleLabel(role: string | undefined) {
    switch (role) {
        case 'student':
            return 'Student';
        case 'college':
            return 'College';
        case 'corporate':
        default:
            return 'Corporate';
    }
}

export function AgreementTracking() {
    const user = useAppStore((state) => state.user);
    
    const { data: rawAgreements, loading: loadingAgreements, error: errorAgreements } = useAgreements();
    const { data: requests } = useCollaborationRequests();
    const { data: projects } = useProjects();

    const loading = loadingAgreements;
    const error = errorAgreements;

    // Join data for the demo view
    const safeAgreements = (rawAgreements || []).map(agreement => {
        const request = (requests || []).find(r => r.id === agreement.collaboration_request_id);
        const project = request ? (projects || []).find(p => p.id === request.research_project_id) : null;
        
        return {
            ...agreement,
            project_title: project?.title || 'Collaboration Initiative',
            college_name: project?.college_name || 'Partner College',
            company_name: 'Industrial Partner', // Mocked for demo
            college_approval_status: agreement.status === 'active' || agreement.status === 'signed',
            corporate_approval_status: agreement.status === 'active' || agreement.status === 'signed',
            updated_at: agreement.created_at || new Date().toISOString()
        };
    });

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Agreement Tracking</h1>
                        <p className="text-slate-500">
                            Track collaboration agreements between colleges, students, and industry partners.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                        Viewing as <span className="font-semibold ml-1">{getRoleLabel(user?.organization_type)}</span>
                    </Badge>
                </div>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-500">Loading agreements...</p>
                </div>
            )}

            {error && (
                <Card>
                    <CardContent className="p-6 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <p className="text-red-600">
                            Error loading agreements: {(error as any).message}
                        </p>
                    </CardContent>
                </Card>
            )}

            {!loading && !error && safeAgreements.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center space-y-2">
                        <p className="text-slate-900 font-semibold">No agreements found.</p>
                        <p className="text-slate-500 text-sm">
                            Once collaborations are formalized, they will appear here with their current status.
                        </p>
                    </CardContent>
                </Card>
            )}

            {!loading && !error && safeAgreements.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                    {safeAgreements.map((agreement: any) => (
                        <Card key={agreement.id} className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3">
                                <div>
                                    <CardTitle className="text-slate-900 text-lg">
                                        Joint Development Agreement
                                    </CardTitle>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {agreement.project_title}
                                    </p>
                                </div>
                                <Badge className={getStatusBadgeClasses(agreement.status)}>
                                    {agreement.status || 'unknown'}
                                </Badge>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span className="truncate">
                                        <span className="font-medium">College:</span>{' '}
                                        {agreement.college_name || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <span className="truncate">
                                        <span className="font-medium">Industry:</span>{' '}
                                        {agreement.company_name || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <Clock className="h-3 w-3 text-slate-400" />
                                    <span>
                                        Created{' '}
                                        {new Date(agreement.created_at || '').toLocaleDateString()} • Updated{' '}
                                        {new Date(agreement.updated_at || '').toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    <Badge
                                        variant={agreement.college_approval_status ? 'default' : 'outline'}
                                        className={
                                            agreement.college_approval_status
                                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                : 'border-slate-200 text-slate-600'
                                        }
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        College approval {agreement.college_approval_status ? 'granted' : 'pending'}
                                    </Badge>
                                    <Badge
                                        variant={agreement.corporate_approval_status ? 'default' : 'outline'}
                                        className={
                                            agreement.corporate_approval_status
                                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                : 'border-slate-200 text-slate-600'
                                        }
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Corporate approval {agreement.corporate_approval_status ? 'granted' : 'pending'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
