import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCollaborationRequests } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const requestSchema = z.object({
  projectBrief: z.string().min(50, 'Project brief must be at least 50 characters'),
  budgetProposed: z.string().min(1, 'Budget is required'),
  timelineProposed: z.string().min(1, 'Timeline is required'),
});

type RequestFormData = z.infer<typeof requestSchema>;

type CollaborationRequestFormProps = {
  projectId: number;
  projectTitle: string;
  corporatePartnerId?: number;
  onClose: () => void;
  onSuccess?: () => void;
  onNavigate?: (section: any) => void;
};

export function CollaborationRequestForm({
  projectId,
  projectTitle,
  onClose,
  onSuccess,
  onNavigate,
}: CollaborationRequestFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      projectBrief: '',
      budgetProposed: '',
      timelineProposed: '',
    },
  });

  const { create: createRequest } = useCollaborationRequests();
  const onSubmit = async (data: RequestFormData) => {
    setSubmitting(true);
    try {
      await createRequest({
        research_project_id: projectId,
        corporate_partner_id: 1, // Simulated current user partner
        project_brief: data.projectBrief,
        budget_proposed: parseFloat(data.budgetProposed),
        timeline_proposed: data.timelineProposed,
        status: 'pending'
      });

      toast({
        title: "Request Submitted",
        description: `Your collaboration request for "${projectTitle}" has been sent.`,
      });

      onSuccess?.();
      onClose();

      if (onNavigate) {
        onNavigate('agreements');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white text-slate-900 border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Initiate Collaboration Request</DialogTitle>
            <DialogDescription className="text-slate-500">Project: {projectTitle}</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="projectBrief" className="text-slate-700 font-semibold">Project Brief</Label>
              <Textarea
                id="projectBrief"
                placeholder="Describe your collaboration proposal, objectives, and expected outcomes..."
                rows={8}
                {...form.register('projectBrief')}
                className="bg-white border-slate-200 text-slate-900 focus:ring-primary/20"
              />
              {form.formState.errors.projectBrief && (
                <p className="text-sm text-red-600 font-medium">
                  {form.formState.errors.projectBrief.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budgetProposed" className="text-slate-700 font-semibold">Proposed Budget ($)</Label>
              <Input
                id="budgetProposed"
                type="number"
                placeholder="850000"
                {...form.register('budgetProposed')}
                className="bg-white border-slate-200 text-slate-900 focus:ring-primary/20"
              />
              {form.formState.errors.budgetProposed && (
                <p className="text-sm text-red-600 font-medium">
                  {form.formState.errors.budgetProposed.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timelineProposed" className="text-slate-700 font-semibold">Proposed Timeline</Label>
              <Input
                id="timelineProposed"
                placeholder="e.g., 24 months with 6-month pilot phase"
                {...form.register('timelineProposed')}
                className="bg-white border-slate-200 text-slate-900 focus:ring-primary/20"
              />
              {form.formState.errors.timelineProposed && (
                <p className="text-sm text-red-600 font-medium">
                  {form.formState.errors.timelineProposed.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <Button type="submit" disabled={submitting} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold">
                {submitting ? 'Sending...' : 'Send Request'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
