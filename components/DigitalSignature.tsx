import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    CheckCircle2,
    Clock,
    PenTool,
    ShieldCheck,
    ArrowRight,
    UserCheck,
    Building,
    GraduationCap,
    History,
    Eraser,
    MousePointer2
} from 'lucide-react';
import { useAgreement } from '@/hooks/useDatabase';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

type AuditEvent = {
    id: string;
    event: string;
    actor: string;
    timestamp: string;
};

export function DigitalSignature({ collaborationRequestId = 2 }: { collaborationRequestId?: number }) {
    const { data: agreement, loading: agreementLoading, approve: grantApproval, sign: applySignature } = useAgreement(collaborationRequestId);
    const { toast } = useToast();

    const loading = agreementLoading;


    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const signatureWorkflow = {
        status: agreement?.status || 'draft',
        College_approval: !!agreement?.college_approval_status,
        corporate_approval: !!agreement?.corporate_approval_status,
        College_signed: !!agreement?.college_signed_at,
        corporate_signed: !!agreement?.corporate_signed_at,
        audit_trail: [
            { id: '1', event: 'Agreement Draft Created', actor: 'System', timestamp: formatDate(agreement?.created_at || null) || 'Jan 10, 2024' },
            { id: '2', event: 'Legal Review Initiated', actor: 'Legal Dept', timestamp: agreement?.created_at ? formatDate(new Date(new Date(agreement.created_at).getTime() + 86400000).toISOString()) : 'Jan 11, 2024' },
            agreement?.college_approval_status ? { id: '3', event: 'College Approval Granted', actor: 'Legal Committee', timestamp: formatDate(agreement.created_at || null) } : null,
            agreement?.corporate_approval_status ? { id: '4', event: 'Corporate Approval Granted', actor: 'Compliance Board', timestamp: formatDate(agreement.created_at || null) } : null,
            agreement?.college_signed_at ? { id: '5', event: 'College Signature Applied', actor: agreement.college_signatory || 'Dean', timestamp: formatDate(agreement.college_signed_at) } : null,
            agreement?.corporate_signed_at ? { id: '6', event: 'Corporate Signature Applied', actor: agreement.corporate_signatory || 'CEO', timestamp: formatDate(agreement.corporate_signed_at) } : null,
        ].filter(Boolean) as AuditEvent[]
    };
    const [isSigning, setIsSigning] = useState(false);
    const [signature, setSignature] = useState('');
    const [activeRole, setActiveRole] = useState<'college' | 'corporate'>('college');
    const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Canvas Drawing Logic
    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            setSignature(canvasRef.current.toDataURL());
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
    };

    const handleApproval = async (role: 'college' | 'corporate') => {
        try {
            await grantApproval(role);
            toast({
                title: "Approval Granted",
                description: `${role === 'college' ? 'College' : 'Corporate'} approval recorded successfully.`,
            });
        } catch (error: any) {
            toast({
                title: "Approval Failed",
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    if (loading || !agreement) {
        return <div className="p-8 text-slate-400">Loading signature workflow...</div>;
    }

    const steps = [
        { id: 'draft', label: 'Agreement Draft', icon: Clock },
        { id: 'review', label: 'Legal Review', icon: ShieldCheck },
        { id: 'approval', label: 'Approval Status', icon: UserCheck },
        { id: 'signed', label: 'Final Execution', icon: PenTool },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === signatureWorkflow.status);

    return (
        <div className="p-8 bg-slate-50/30 min-h-screen text-slate-900">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                            <PenTool className="h-9 w-9 text-primary" />
                            Digital Signature Workflow
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">Track approvals and execute legal agreements securely</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                            <MousePointer2 className="h-4 w-4 text-slate-400" />
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mr-2">Simulate Role:</span>
                            <Select value={activeRole} onValueChange={(val: any) => setActiveRole(val)}>
                                <SelectTrigger className="w-[160px] h-8 bg-slate-50 border-slate-200 text-xs font-bold text-slate-700">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200">
                                    <SelectItem value="college">College Admin</SelectItem>
                                    <SelectItem value="corporate">Corporate Exec</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest h-9">
                            SECURE AUDIT ENABLED
                        </Badge>
                    </div>
                </div>

                {/* Stepper */}
                <div className="grid grid-cols-4 gap-6">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="relative">
                            <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-300 ${idx <= currentStepIndex
                                ? 'bg-white border-primary/20 shadow-md transform scale-[1.02]'
                                : 'bg-white/40 border-slate-100 opacity-60'
                                }`}>
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${idx <= currentStepIndex ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${idx <= currentStepIndex ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {step.label}
                                </span>
                                {idx < currentStepIndex && (
                                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-green-50 flex items-center justify-center border border-green-200">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`absolute top-1/2 -right-3 h-[2px] w-6 z-10 rounded-full ${idx < currentStepIndex ? 'bg-primary' : 'bg-slate-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Approval Tracking */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border">
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                                <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                    Party Approvals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-2 divide-x divide-slate-100">
                                    {/* College Approval */}
                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                                                <GraduationCap className="h-9 w-9 text-primary/60" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 leading-tight">College Side</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Legal & Ethics Committee</p>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-xl flex items-center justify-between border transition-all ${signatureWorkflow.College_approval ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {signatureWorkflow.College_approval ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                                <span className={`text-xs font-black uppercase tracking-widest ${signatureWorkflow.College_approval ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {signatureWorkflow.College_approval ? 'Approved' : 'Pending Approval'}
                                                </span>
                                            </div>
                                            {signatureWorkflow.College_approval && (
                                                <span className="text-[10px] text-slate-400 font-bold font-mono">JAN 12, 11:30 AM</span>
                                            )}
                                        </div>

                                        <Button
                                            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-600 font-bold border border-slate-200 rounded-xl shadow-sm transition-all"
                                            disabled={signatureWorkflow.College_approval || activeRole !== 'college'}
                                            onClick={() => handleApproval('college')}
                                        >
                                            {signatureWorkflow.College_approval ? 'Approval Granted' : 'Grant Approval'}
                                        </Button>
                                    </div>

                                    {/* Corporate Approval */}
                                    <div className="p-8 space-y-6 bg-slate-50/20">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                                <Building className="h-9 w-9 text-slate-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 leading-tight">Corporate Side</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Compliance & Executive Board</p>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-xl flex items-center justify-between border transition-all ${signatureWorkflow.corporate_approval ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {signatureWorkflow.corporate_approval ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                                <span className={`text-xs font-black uppercase tracking-widest ${signatureWorkflow.corporate_approval ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {signatureWorkflow.corporate_approval ? 'Approved' : 'Pending Approval'}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 rounded-xl transition-all active:scale-[0.98]"
                                            disabled={signatureWorkflow.corporate_approval || activeRole !== 'corporate'}
                                            onClick={() => handleApproval('corporate')}
                                        >
                                            {signatureWorkflow.corporate_approval ? 'Approved' : 'Process Approval'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Signature Area */}
                        <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border">
                            <CardHeader className="border-b border-slate-100 p-6">
                                <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                                    <PenTool className="h-4 w-4 text-primary" />
                                    Final Execution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-8">
                                <div className="max-w-md">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">Ready for Digital Signature</h3>
                                    <p className="text-sm text-slate-500 font-medium">
                                        All compliance checks have passed. Once both parties sign, this agreement becomes legally binding and active.
                                    </p>
                                </div>

                                <div className="flex gap-4 w-full max-w-lg">
                                    <div className="flex-1 p-6 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center gap-3 transition-all hover:bg-slate-50">
                                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">College Signatory</span>
                                        <div className="h-[2px] w-full bg-slate-200/50 my-2" />
                                        <span className="text-xs text-slate-400 font-bold italic">Awaiting Signature</span>
                                    </div>
                                    <div className="flex-1 p-6 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center gap-3 transition-all hover:bg-slate-50">
                                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Corporate Signatory</span>
                                        <div className="h-[2px] w-full bg-slate-200/50 my-2" />
                                        <span className="text-xs text-slate-400 font-bold italic">Awaiting Signature</span>
                                    </div>
                                </div>

                                <Button
                                    className="px-12 h-14 bg-primary hover:bg-primary/90 text-white text-lg font-black shadow-2xl shadow-primary/30 rounded-2xl transition-all active:scale-[0.98] group"
                                    onClick={() => setIsSigning(true)}
                                    disabled={!signatureWorkflow.College_approval || !signatureWorkflow.corporate_approval}
                                >
                                    Sign Document Now
                                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Audit Trail */}
                    <Card className="bg-white border-slate-200 shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden border flex flex-col">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-6">
                            <CardTitle className="text-xs font-black flex items-center gap-2 uppercase tracking-widest text-slate-400">
                                <History className="h-4 w-4" />
                                Audit Trail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-8 overflow-auto">
                            <div className="space-y-8 relative">
                                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100" />
                                {signatureWorkflow.audit_trail.map((event: AuditEvent) => (
                                    <div key={event.id} className="relative pl-12 group/event">
                                        <div className="absolute left-[13px] top-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-primary z-10 transition-transform group-hover/event:scale-125" />
                                        <p className="text-sm font-black text-slate-900 leading-tight">{event.event}</p>
                                        <div className="flex flex-col mt-1.5">
                                            <span className="text-xs font-bold text-slate-500">{event.actor}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{event.timestamp}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Signature Modal Overlay */}
            <AnimatePresence>
                {isSigning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-xl font-black flex items-center gap-2 text-slate-900">
                                    <PenTool className="h-6 w-6 text-primary" />
                                    Secure Digital Signature
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <Tabs defaultValue="type" value={signatureMode} onValueChange={(v: any) => setSignatureMode(v)} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 p-1.5 h-12 rounded-2xl">
                                        <TabsTrigger value="type" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Type Signature</TabsTrigger>
                                        <TabsTrigger value="draw" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">Draw Signature</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="type" className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Type your full name</label>
                                            <input
                                                type="text"
                                                value={signature}
                                                onChange={(e) => setSignature(e.target.value)}
                                                placeholder="Enter full legal name"
                                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                        {signature && (
                                            <div className="p-10 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30 flex items-center justify-center shadow-inner mt-4">
                                                <span className="text-5xl font-signature text-primary select-none" style={{ fontFamily: '"Great Vibes", cursive' }}>
                                                    {signature}
                                                </span>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="draw" className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draw your signature</label>
                                                <Button size="sm" variant="ghost" onClick={clearCanvas} className="h-7 text-[10px] font-black uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg">
                                                    <Eraser className="h-3 w-3 mr-1.5" /> Clear
                                                </Button>
                                            </div>
                                            <div className="border-2 border-dashed border-slate-200 rounded-2xl bg-white overflow-hidden flex items-center justify-center relative h-56 shadow-inner ring-4 ring-slate-50">
                                                <canvas
                                                    ref={canvasRef}
                                                    width={400}
                                                    height={224}
                                                    className="w-full h-full cursor-crosshair touch-none"
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                    onMouseUp={stopDrawing}
                                                    onMouseLeave={stopDrawing}
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onTouchEnd={stopDrawing}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex gap-4 pt-2">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 h-14 text-slate-500 hover:text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                                        onClick={() => setIsSigning(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-[2] h-14 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl px-8 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                                        disabled={!signature}
                                        onClick={async () => {
                                            try {
                                                const role = activeRole;
                                                await applySignature(signature, role);

                                                toast({
                                                    title: "Agreement Signed",
                                                    description: `Successfully signed as ${role === 'college' ? 'College' : 'Corporate'} representative.`,
                                                });
                                                setIsSigning(false);
                                                setSignature('');
                                            } catch (e: any) {
                                                toast({
                                                    title: "Signing Failed",
                                                    description: e.message,
                                                    variant: "destructive"
                                                });
                                            }
                                        }}
                                    >
                                        Confirm & Sign
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
