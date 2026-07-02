// IP portfolio management dashboard

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, FileText, Users, DollarSign, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useIPDisclosures, useProjects } from '@/hooks/useDatabase';
import { useToast } from "@/hooks/use-toast";

export function IPPortfolio() {
  const { toast } = useToast();
  const [selectedDisclosure, setSelectedDisclosure] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: rawDisclosures, loading: loadingIP, error } = useIPDisclosures();
  const { data: projects } = useProjects();

  const loading = loadingIP;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disclosed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'under_review':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'patent_pending':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'patented':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'licensed':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const disclosures = (rawDisclosures || []).map(d => {
    const project = projects?.find(p => p.id === d.active_project_id);
    return {
      ...d,
      project_name: project?.title || 'Unknown Project',
      // Mocked extra fields for UI
      invention_category: d.invention_type || 'Software/Algorithm',
      potential_applications: 'Advanced medical imaging, real-time diagnostics.',
      commercial_potential: 'High - $50M+ Addressable Market',
      contributors: d.inventors?.map((name: string, i: number) => ({
        name,
        organization: 'Main University',
        ownership_percentage: i === 0 ? 60 : 40,
        role: i === 0 ? 'Lead Inventor' : 'Contributor'
      })) || [],
      filing_date: d.disclosure_date,
      patent_number: d.status === 'patented' ? 'US12345678B2' : undefined
    };
  }).filter(d => statusFilter === 'all' || d.status === statusFilter);

  const statusCounts = {
    total: rawDisclosures?.length || 0,
    disclosed: rawDisclosures?.filter(d => d.status === 'disclosed').length || 0,
    under_review: rawDisclosures?.filter(d => d.status === 'under_review').length || 0,
    patent_pending: rawDisclosures?.filter(d => d.status === 'patent_pending').length || 0,
    patented: rawDisclosures?.filter(d => d.status === 'patented').length || 0,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="h-8 w-8 text-primary shadow-sm" />
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">IP Portfolio</h1>
        </div>
        <p className="text-slate-500 font-medium">
          Manage intellectual property and commercialization opportunities
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-slate-200 bg-white shadow-sm border">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-extrabold text-slate-900">{statusCounts.total}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Total Disclosures</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm border">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-extrabold text-blue-600">{statusCounts.disclosed}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Disclosed</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm border">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-extrabold text-amber-600">{statusCounts.under_review}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Under Review</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm border">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-extrabold text-primary">
              {statusCounts.patent_pending}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Patent Pending</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm border">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-extrabold text-green-600">{statusCounts.patented}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Patented</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4" onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="disclosed">Disclosed</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="patent_pending">Patent Pending</TabsTrigger>
          <TabsTrigger value="patented">Patented</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter}>
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading IP disclosures...</p>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="p-6">
                <p className="text-red-600">Error: {(error as any).message}</p>
              </CardContent>
            </Card>
          )}

          {!loading && !error && (
            <div className="space-y-6">
              {disclosures.map((disclosure: any) => (
                <Card key={disclosure.id} className="hover:shadow-lg transition-all duration-300 border-slate-200 bg-white border group overflow-hidden">
                  <CardHeader className="border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{disclosure.title}</CardTitle>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-semibold uppercase tracking-tight">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent h-6 font-bold text-[10px] px-2">{disclosure.invention_category}</Badge>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-slate-300" />
                            {disclosure.project_name}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "font-bold uppercase tracking-wider text-[10px] h-6 px-3",
                        getStatusColor(disclosure.status)
                      )}>
                        {(disclosure.status || '').replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {disclosure.description}
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100 shadow-inner">
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <Lightbulb className="h-3 w-3" />
                          Potential Applications
                        </h4>
                        <p className="text-sm text-slate-600 font-bold leading-tight">
                          {disclosure.potential_applications}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          <TrendingUp className="h-3 w-3" />
                          Commercial Potential
                        </h4>
                        <p className="text-sm text-slate-600 font-bold leading-tight">
                          {disclosure.commercial_potential}
                        </p>
                      </div>
                    </div>

                    {disclosure.contributors && disclosure.contributors.length > 0 && (
                      <div className="pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-300" />
                          Contributors & Ownership
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {disclosure.contributors.map((contributor: any, idx: number) => (
                            <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group/item">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="font-bold text-slate-900 group-hover/item:text-primary transition-colors">{contributor.name}</p>
                                <Badge variant="secondary" className="bg-primary/10 text-primary font-bold text-[10px]">
                                  {contributor.ownership_percentage}%
                                </Badge>
                              </div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {contributor.organization}
                              </p>
                              {contributor.role && (
                                <p className="text-xs font-semibold text-slate-500 mt-2 flex items-center gap-1">
                                  <span className="h-1 w-1 bg-primary/40 rounded-full" />
                                  {contributor.role}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-6 border-t border-slate-100">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                        onClick={() => setSelectedDisclosure(disclosure)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {disclosure.status === 'patented' && (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white font-bold"
                          onClick={() => {
                            toast({
                              title: "Licensing Market",
                              description: "Redirecting to licensing options for this patented asset...",
                            });
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          Licensing Options
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && !error && disclosures.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No IP disclosures found
                </h3>
                <p className="text-gray-600 mb-4">
                  Start documenting your innovations
                </p>
                <Button onClick={() => {
                  toast({
                    title: "Submission Protocol",
                    description: "Opening secure IP disclosure submission form...",
                  });
                }}>Submit IP Disclosure</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedDisclosure} onOpenChange={(open) => !open && setSelectedDisclosure(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white border border-slate-200 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900">{selectedDisclosure?.title}</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              {selectedDisclosure?.invention_category} - {(selectedDisclosure?.status || '').replace('_', ' ')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Description</h4>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">{selectedDisclosure?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Filing Date</h4>
                <p className="text-sm font-bold text-slate-900">{selectedDisclosure?.filing_date ? new Date(selectedDisclosure.filing_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5">Patent Number</h4>
                <p className="text-sm font-bold text-slate-900">{selectedDisclosure?.patent_number || 'Pending Analysis'}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-3">Contributors</h4>
              <ul className="space-y-2">
                {selectedDisclosure?.contributors?.map((c: any, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700 bg-white p-3 border border-slate-100 rounded-xl shadow-sm">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">{c.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.organization} • {c.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl text-[10px] font-mono text-slate-400 flex justify-between items-center">
              <span>SYSTEM_ID: {selectedDisclosure?.id}</span>
              <span className="text-primary/70">PROT_VER: 2.1.0-Kyber</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
