import { useCollaborationRequests, useCorporatePartners, useProjects } from '@/hooks/useDatabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Building2, Briefcase } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function NotificationsPanel() {
  const { data: requests, loading: requestsLoading } = useCollaborationRequests();
  const { data: corporates } = useCorporatePartners();
  const { data: projects } = useProjects();
  const { toast } = useToast();

  const loading = requestsLoading;

  const enrichedRequests = (requests || []).map(request => {
    const corporate = (corporates || []).find(c => c.id === request.corporate_partner_id);
    const project = (projects || []).find(p => p.id === request.research_project_id);
    return {
      ...request,
      company_name: corporate?.name || 'Unknown Company',
      industry: corporate?.industry || '',
      project_title: project?.title || 'Unknown Project',
      College_name: project?.college_name || '',
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <Bell className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Pending collaboration requests</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading notifications...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-4">
          {enrichedRequests.filter(r => r.status === 'pending').map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">Collaboration Request</CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        <span>{request.company_name}</span>
                      </div>
                      {request.industry && (
                        <>
                          <span>•</span>
                          <span>{request.industry}</span>
                        </>
                      )}
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Recent'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {request.project_title && (
                  <div className="mb-3 p-3 bg-blue-50 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <p className="text-sm font-semibold text-blue-900">
                        Research Project
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{request.project_title}</p>
                    {request.College_name && (
                      <p className="text-xs text-gray-600 mt-1">
                        {request.College_name}
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Project Brief</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {request.project_brief}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Proposed Budget</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(request.budget_proposed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Proposed Timeline</p>
                    <p className="font-semibold text-gray-900">
                      {request.timeline_proposed}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      toast({
                        title: "Request Accepted",
                        description: `You have accepted the collaboration request for ${request.project_title || 'this project'}.`,
                        variant: "default",
                      });
                    }}
                  >
                    Accept Request
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Reviewing Details",
                        description: "Opening detailed view...",
                      });
                    }}
                  >
                    Review Details
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      toast({
                        title: "Request Declined",
                        description: "The collaboration request has been declined.",
                        variant: "destructive",
                      });
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && enrichedRequests.filter(r => r.status === 'pending').length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
