// IP disclosure submission form

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Lightbulb, CheckCircle, Loader2 } from 'lucide-react';
import { useIPDisclosures } from '@/hooks/useDatabase';

const ipSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  inventionCategory: z.string().min(1, 'Category is required'),
  potentialApplications: z.string().min(20, 'Please describe potential applications'),
  priorArtReferences: z.string(),
  commercialPotential: z.string().min(20, 'Please describe commercial potential'),
});

type IPFormData = z.infer<typeof ipSchema>;

type IPDisclosureFormProps = {
  activeProjectId: number;
  onSuccess?: () => void;
  onNavigate?: (section: any) => void;
};

export function IPDisclosureForm({ activeProjectId, onSuccess, onNavigate }: IPDisclosureFormProps) {
  const [step, setStep] = useState(1);
  const { create: createDisclosure } = useIPDisclosures();
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<IPFormData>({
    resolver: zodResolver(ipSchema),
    defaultValues: {
      title: '',
      description: '',
      inventionCategory: '',
      potentialApplications: '',
      priorArtReferences: '',
      commercialPotential: '',
    },
  });

  const onSubmit = async (data: IPFormData) => {
    try {
      setSubmitting(true);
      await createDisclosure({
        active_project_id: activeProjectId,
        title: data.title,
        description: data.description,
        invention_type: data.inventionCategory,
        inventors: ['Prof. Lead Scientist', 'Research Associate'], // Mocked for demo
        disclosure_date: new Date().toISOString(),
        status: 'under_review'
      });
      
      toast({
        title: 'Success',
        description: 'IP disclosure submitted successfully',
      });
      onSuccess?.();
      if (onNavigate) {
        onNavigate('ip-portfolio');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit disclosure',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Applications & Prior Art' },
    { id: 3, title: 'Commercial Assessment' },
  ];

  return (
    <>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Submit IP Disclosure</h1>
          </div>
          <p className="text-gray-600">
            Document your innovation for patent protection and licensing
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${step > s.id
                      ? 'bg-green-600 text-white'
                      : step === s.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {step > s.id ? <CheckCircle className="h-5 w-5" /> : s.id}
                  </div>
                  <p className="text-sm font-medium text-gray-700 mt-2">{s.title}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${step > s.id ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="border-slate-200 bg-white shadow-sm border">
          <CardContent className="p-6 text-slate-900">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="title" className="text-slate-700 font-bold">Invention Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Real-time Vibration Analysis Algorithm"
                      {...form.register('title')}
                      className="bg-white border-slate-200 text-slate-900 font-medium"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="inventionCategory" className="text-slate-700 font-bold">Invention Category</Label>
                    < Select
                      value={form.watch('inventionCategory')}
                      onValueChange={(value) => form.setValue('inventionCategory', value)}
                    >
                      <SelectTrigger className="bg-white border-slate-200 text-slate-900 font-medium">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white text-slate-900">
                        <SelectItem value="software">Software/Algorithm</SelectItem>
                        <SelectItem value="hardware">Hardware/Device</SelectItem>
                        <SelectItem value="process">Process/Method</SelectItem>
                        <SelectItem value="composition">Composition of Matter</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.inventionCategory && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.inventionCategory.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description" className="text-slate-700 font-bold">Detailed Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a comprehensive description of your invention..."
                      rows={8}
                      {...form.register('description')}
                      className="bg-white border-slate-200 text-slate-900 font-medium"
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="potentialApplications" className="text-slate-700 font-bold">Potential Applications</Label>
                    <Textarea
                      id="potentialApplications"
                      placeholder="Describe potential use cases and applications..."
                      rows={6}
                      {...form.register('potentialApplications')}
                      className="bg-white border-slate-200 text-slate-900 font-medium"
                    />
                    {form.formState.errors.potentialApplications && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.potentialApplications.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="priorArtReferences" className="text-slate-700 font-bold">
                      Prior Art References (Optional)
                    </Label>
                    <Textarea
                      id="priorArtReferences"
                      placeholder="List any existing patents, publications, or technologies related to your invention..."
                      rows={6}
                      {...form.register('priorArtReferences')}
                      className="bg-white border-slate-200 text-slate-900 font-medium"
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      This helps assess novelty and patentability
                    </p>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="commercialPotential" className="text-slate-700 font-bold">Commercial Potential</Label>
                    <Textarea
                      id="commercialPotential"
                      placeholder="Describe market opportunity, competitive advantage, and revenue potential..."
                      rows={8}
                      {...form.register('commercialPotential')}
                      className="bg-white border-slate-200 text-slate-900 font-medium"
                    />
                    {form.formState.errors.commercialPotential && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.commercialPotential.message}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Next Steps
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-2 font-medium">
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blue-400 rounded-full" /> Legal team will review within 5 business days</li>
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blue-400 rounded-full" /> Prior art search will be conducted</li>
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blue-400 rounded-full" /> Patent attorney will assess patentability</li>
                      <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 bg-blue-400 rounded-full" /> You'll be notified of filing decision</li>
                    </ul>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="border-slate-200 text-slate-600"
                  >
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto bg-primary hover:bg-primary/90 text-white font-bold"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" disabled={submitting} className="ml-auto bg-primary hover:bg-primary/90 text-white font-bold">
                    {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    {submitting ? 'Submitting...' : 'Submit IP Disclosure'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </>
  );
}
