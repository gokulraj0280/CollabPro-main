import { useState } from 'react';
import { useAppStore, User } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Briefcase, Building2, Camera, User as UserIcon, ShieldCheck, Cpu } from 'lucide-react';
import { FadeInUp, SpringPress } from '@/components/ui/animation-wrapper';
import { getRoleLabel } from '@/lib/userUtils';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function ProfilePage() {
    const { user, updateUser } = useAppStore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        organization: user?.organization || '',
        department: user?.department || '',
    });
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStep, setVerificationStep] = useState(0);
    const [isVerified, setIsVerified] = useState(localStorage.getItem('collabpro_sovereign_verified') === 'true');

    const handleVerifySovereign = () => {
        setIsVerifying(true);
        setVerificationStep(1);

        // Simulate multi-step biometric and quantum handshake
        setTimeout(() => setVerificationStep(2), 1500);
        setTimeout(() => setVerificationStep(3), 3000);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
            setVerificationStep(4);
            localStorage.setItem('collabpro_sovereign_verified', 'true');
            toast({
                title: "Sovereign ID Verified",
                description: "Your professional identity has been anchored to the decentralized sovereign mesh.",
            });
        }, 4500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser(formData);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch {
            toast({
                title: "Update Failed",
                description: "There was an error saving your profile.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const placeholderPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0D8ABC&color=fff&size=128`;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <FadeInUp>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and account preferences.</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Photo Sidebar */}
                <FadeInUp delay={0.1} className="md:col-span-1">
                    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden border">
                        <CardContent className="p-6 flex flex-col items-center">
                            <div className="relative group mb-4">
                                <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-lg">
                                    <img
                                        src={placeholderPhoto}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors ring-4 ring-white">
                                    <Camera className="h-5 w-5" />
                                </button>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{formData.name}</h3>
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full mb-4">
                                {getRoleLabel(user)}
                            </p>

                            <div className="w-full space-y-2 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <span>{formData.role}</span>
                                </div>
                            </div>

                            <div className="w-full mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className={cn("h-4 w-4", isVerified ? "text-green-500" : "text-slate-400")} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sovereign ID</span>
                                    </div>
                                    <Badge variant="outline" className={cn("text-[8px] h-4", isVerified ? "bg-green-500/10 text-green-600 border-green-200" : "bg-slate-200 text-slate-500 border-transparent")}>
                                        {isVerified ? "VERIFIED" : "UNVERIFIED"}
                                    </Badge>
                                </div>

                                {!isVerified && !isVerifying && (
                                    <Button
                                        onClick={handleVerifySovereign}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-[10px] font-black uppercase tracking-widest h-8 border-primary/20 text-primary hover:bg-primary/5"
                                    >
                                        Initiate Handshake
                                    </Button>
                                )}

                                {isVerifying && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[7px] font-mono text-primary uppercase">
                                            <span>{verificationStep === 1 ? "Biometric Sync..." : verificationStep === 2 ? "Quantum Handshake..." : "Anchoring Proof..."}</span>
                                            <span>{Math.round((verificationStep / 3) * 100)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(verificationStep / 3) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isVerified && (
                                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-medium bg-white p-2 rounded-lg border border-slate-100 italic">
                                        <Cpu className="h-3 w-3 text-primary" />
                                        Identity anchored to block #492...AX9
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </FadeInUp>

                {/* Main Settings Form */}
                <FadeInUp delay={0.2} className="md:col-span-2">
                    <Card className="border-slate-200 bg-white shadow-sm border">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-xl text-slate-900">Personal Information</CardTitle>
                            <CardDescription>Update your profile details and how others see you.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <UserIcon className="h-3.5 w-3.5" /> Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" /> Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5" /> Professional Role
                                    </Label>
                                    <Input
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5" /> Department
                                    </Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="organization" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" /> Organization
                                </Label>
                                <Input
                                    id="organization"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <SpringPress>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20"
                                    >
                                        {isSaving ? 'Saving Changes...' : 'Save Profile'}
                                    </Button>
                                </SpringPress>
                            </div>
                        </CardContent>
                    </Card>
                </FadeInUp>
            </div>
        </div>
    );
}
