// Shared negotiation workspace with messaging and scope editing

import { useState, useEffect } from 'react';
import { useNegotiation, useProjectScopes } from '@/hooks/useDatabase';
import { NegotiationMessage } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText, Send, Building2, GraduationCap } from 'lucide-react';
import { formatINR } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useAppStore } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FadeInUp, SpringPress, StaggerContainer } from '@/components/ui/animation-wrapper';

type NegotiationWorkspaceProps = {
  collaborationRequestId: number;
};

export function NegotiationWorkspace({ collaborationRequestId }: NegotiationWorkspaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const { data: threadData, loading: threadLoading, addMessage } = useNegotiation(collaborationRequestId);
  const { data: scopeVersions, loading: scopesLoading, create: createScope, updateStatus: updateScopeStatus } = useProjectScopes(collaborationRequestId);
  const { toast } = useToast();
  const { user, userLoading } = useAppStore();

  // Scope Management State

  // Scope Management State
  const [isScopeDialogOpen, setIsScopeDialogOpen] = useState(false);
  const [scopeDescription, setScopeDescription] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [submittingScope, setSubmittingScope] = useState(false);
  const [approvingScope, setApprovingScope] = useState(false);

  // Derive current scope from versions
  const currentScope = scopeVersions?.find(s => s.status === 'approved') || (scopeVersions && scopeVersions.length > 0 ? scopeVersions[scopeVersions.length - 1] : null);

  // Optimistic Messaging State
  const [localMessages, setLocalMessages] = useState<NegotiationMessage[]>([]);

  useEffect(() => {
    if (threadData?.messages) {
      setLocalMessages(threadData.messages);
    }
  }, [threadData?.messages]);

  const handleCreateScope = async () => {
    if (!user) return;
    setSubmittingScope(true);
    try {
      await createScope({
        collaboration_request_id: collaborationRequestId,
        version_number: (currentScope?.version_number || 0) + 1,
        scope_description: scopeDescription,
        deliverables,
        timeline,
        budget: parseFloat(budget) || 0,
        created_by: user.name,
        status: 'pending'
      });
      toast({ title: "Scope Proposed", description: "New version of scope has been submitted." });
      setIsScopeDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Failed to propose scope", description: e.message, variant: "destructive" });
    } finally {
      setSubmittingScope(false);
    }
  };

  const handleApproveScope = async () => {
    if (!currentScope || !user || !currentScope.id) return;
    setApprovingScope(true);
    try {
      await updateScopeStatus(currentScope.id, 'approved');
      toast({ title: "Scope Approved", description: "Project scope has been finalized." });
    } catch (e: any) {
      toast({ title: "Approval Failed", description: e.message, variant: "destructive" });
    } finally {
      setApprovingScope(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const message: Omit<NegotiationMessage, 'id' | 'created_at'> = {
      sender_name: user.name,
      sender_organization: user.organization,
      message_type: 'text',
      content: newMessage,
    };

    setNewMessage('');

    try {
      await addMessage(message);
    } catch {
      toast({ description: 'Failed to send message', variant: 'destructive' });
    }
  };

  const loading = threadLoading || scopesLoading || userLoading;

  if (loading || !user) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading negotiation workspace...</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 bg-slate-50/30 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Negotiation Workspace</h1>
          <p className="text-slate-500 font-bold text-lg">Collaborate on project scope and terms</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Discussion Thread */}
          <Card className="flex flex-col h-[700px] border-slate-200 bg-white shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
              <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                <MessageSquare className="h-4 w-4 text-primary" />
                Discussion Thread
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-6">
              <StaggerContainer className="space-y-4">
                {localMessages?.map((message: any, idx: number) => (
                  <FadeInUp key={message.id} delay={idx * 0.05}>
                    <div className="group/msg">
                      <div className="flex items-start gap-4">
                        <SpringPress>
                          <div
                            className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover/msg:scale-105 ${message.sender_organization?.toLowerCase().includes('iit') || message.sender_organization?.toLowerCase().includes('university') || message.sender_organization?.toLowerCase().includes('college')
                              ? 'bg-slate-700 shadow-slate-200'
                              : 'bg-primary shadow-primary/20'
                              }`}
                          >
                            {message.sender_organization?.toLowerCase().includes('iit') || message.sender_organization?.toLowerCase().includes('university') || message.sender_organization?.toLowerCase().includes('college') ? (
                              <GraduationCap className="h-6 w-6" />
                            ) : (
                              <Building2 className="h-6 w-6" />
                            )}
                          </div>
                        </SpringPress>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2 mb-2">
                            <p className="font-black text-slate-900 text-sm">
                              {message.sender_name}
                            </p>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-slate-200 text-[10px] font-bold uppercase py-0 px-2">
                              {message.sender_organization}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                              {new Date(message.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover/msg:bg-white group-hover/msg:shadow-md group-hover/msg:border-primary/10 transition-all">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeInUp>
                ))}
              </StaggerContainer>
            </CardContent>
            <div className="border-t border-slate-100 p-6 bg-slate-50/30">
              <div className="flex gap-3">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="flex-1 bg-white border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="h-auto px-6 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Current Project Scope */}
          <Card className="h-[700px] overflow-auto border-slate-200 bg-white shadow-xl shadow-slate-200/50 rounded-2xl border">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
              <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                <FileText className="h-4 w-4 text-primary" />
                Current Project Scope
                {currentScope && (
                  <Badge className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px] font-black">V{currentScope.version_number}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {currentScope ? (
                <div className="space-y-8">
                  <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 group/scope">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Scope Description</h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line group-hover:text-slate-900 transition-colors">
                      {currentScope.scope_description}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100 group/deliv">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Deliverables</h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-line group-hover:text-slate-900 transition-colors">
                      {currentScope.deliverables}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Timeline</h3>
                      <p className="text-sm text-slate-900 font-black">{currentScope.timeline}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                      <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-2">Proposed Budget</h3>
                      <p className="text-2xl font-black text-primary">
                        {formatINR(currentScope.budget)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Last synchronized by {currentScope.created_by}
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 h-12 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all active:scale-[0.98]"
                      onClick={() => setIsScopeDialogOpen(true)}
                    >
                      Propose Changes
                    </Button>
                    <Button
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                      onClick={handleApproveScope}
                      disabled={approvingScope}
                    >
                      {approvingScope ? 'Approving...' : 'Finalize Scope'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No project scope defined yet</p>
                  <Button className="mt-4" size="sm" onClick={() => setIsScopeDialogOpen(true)}>
                    Create Initial Scope
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />

      <Dialog open={isScopeDialogOpen} onOpenChange={setIsScopeDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Propose Project Scope v{(currentScope?.version_number || 0) + 1}</DialogTitle>
            <DialogDescription>Define the deliverables, timeline, and budget.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Scope Description</Label>
              <Textarea
                placeholder="Detailed description of work..."
                value={scopeDescription}
                onChange={(e) => setScopeDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Deliverables</Label>
              <Textarea
                placeholder="List of key deliverables..."
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Input
                  placeholder="e.g. 6 months"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget (INR)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsScopeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateScope} disabled={submittingScope}>
              {submittingScope ? 'Submitting...' : 'Propose Scope'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
