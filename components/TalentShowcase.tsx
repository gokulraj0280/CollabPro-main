// Student talent showcase with filtering

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, GraduationCap, Briefcase, Mail, Star, Loader2, ShieldCheck, Fingerprint, Lock, CheckCircle2, Cpu } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentProfiles, useInterviewRequests } from '@/hooks/useDatabase';

export function TalentShowcase() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [requestingId, setRequestingId] = useState<number | null>(null);
  const [verifyingStudent, setVerifyingStudent] = useState<any | null>(null);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verifiedStudents, setVerifiedStudents] = useState<Set<number>>(new Set());

  const { data: rawStudents, loading, error } = useStudentProfiles();
  const { create: createInterviewRequest } = useInterviewRequests();

  const handleVerifyCredential = (student: any) => {
    setVerifyingStudent(student);
    setVerificationStep(1);

    // ZKP Simulation Steps
    setTimeout(() => setVerificationStep(2), 1200); // Identity anchor
    setTimeout(() => setVerificationStep(3), 2400); // Proof generation
    setTimeout(() => setVerificationStep(4), 3600); // Final verification

    setTimeout(() => {
      setVerifiedStudents(prev => new Set(prev).add(student.id));
      setVerifyingStudent(null);
      setVerificationStep(0);
      toast({
        title: "Proof Verified",
        description: `Cryptographic proof for ${student.name}'s ${student.degree} in ${student.skills?.[0] || 'Field'} has been anchored.`,
      });
    }, 4800);
  };

  const students = (rawStudents || [])
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.college.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDegree = !degreeFilter || degreeFilter === 'all' || s.degree === degreeFilter;
      return matchesSearch && matchesDegree;
    });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Talent Showcase</h1>
        <p className="text-slate-500 font-medium">Discover exceptional students for recruitment</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-slate-200 bg-white shadow-sm border">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by name or college..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger className="w-48 bg-white border-slate-200 text-slate-700 font-bold">
                <SelectValue placeholder="All Degrees" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="all">All Degrees</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="Bachelors">Bachelors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      {/* Student Cards */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-slate-200 bg-white border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-5 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="flex gap-2 border-t border-slate-100 pt-4">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-10" />
                </div>
              </CardContent>
            </Card>
          ))}
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
        <div className="grid md:grid-cols-2 gap-6">
          {students.map((student: any) => (
            <Card key={student.id} className="hover:shadow-lg transition-all duration-300 border-slate-200 bg-white border group overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-5 mb-4">
                  <Avatar className="h-16 w-16 ring-4 ring-slate-50 shadow-inner">
                    <AvatarFallback className="bg-primary text-white text-lg font-bold">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {student.name}
                      </h3>
                      {verifiedStudents.has(student.id) && (
                        <div className="flex items-center gap-1 bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full border border-green-200 animate-in fade-in zoom-in duration-300">
                          <ShieldCheck className="h-3 w-3" />
                          <span className="text-[8px] font-black uppercase tracking-tight">Proof Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 font-semibold">
                      <GraduationCap className="h-4 w-4 text-slate-400" />
                      <span>{student.degree}</span>
                      <span>•</span>
                      <span>{student.college}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-transparent font-bold uppercase tracking-wider text-[10px] h-6 px-3">
                        {student.availability.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-900">{student.gpa}</span>
                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-tight">GPA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                    Research & Development
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                    {student.bio}
                  </p>
                </div>

                {student.skills && student.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 px-1 px-1">Top Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.slice(0, 6).map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="bg-white text-slate-600 border-slate-200 font-bold text-[10px] uppercase h-6 px-2.5">
                          {skill}
                        </Badge>
                      ))}
                      {student.skills.length > 6 && (
                        <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-200 font-bold text-[10px] h-6">
                          +{student.skills.length - 6}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-5 pt-4 border-t border-slate-100 uppercase tracking-tight">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4 text-slate-300" />
                    <span>{student.projects?.length || 0} projects</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold"
                    size="sm"
                    disabled={requestingId === student.id}
                    onClick={async () => {
                      setRequestingId(student.id);
                      try {
                        await createInterviewRequest({
                          student_profile_id: student.id,
                          requester_name: 'Industry Partner',
                          requester_email: 'partner@example.com',
                          requester_organization: 'Nexus Corp',
                          status: 'pending'
                        });
                        toast({
                          title: "Interview Requested",
                          description: `Request sent to ${student.name}.`,
                        });
                      } catch (e: any) {
                        toast({
                          title: "Request Failed",
                          description: e.message,
                          variant: "destructive"
                        });
                      } finally {
                        setRequestingId(null);
                      }
                    }}
                  >
                    {requestingId === student.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {requestingId === student.id ? 'Sending...' : 'Request Interview'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={verifiedStudents.has(student.id)}
                    className={cn(
                      "border-slate-200 font-bold",
                      verifiedStudents.has(student.id) ? "text-green-600 bg-green-50" : "text-slate-500"
                    )}
                    onClick={() => handleVerifyCredential(student)}
                  >
                    {verifiedStudents.has(student.id) ? (
                      <ShieldCheck className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4 mr-2" />
                    )}
                    {!verifiedStudents.has(student.id) && "Verify Proof"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors h-9 w-10 p-0 flex items-center justify-center font-bold"
                    onClick={() => {
                      window.location.href = `mailto:student@university.edu`;
                    }}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ZKP Verification Modal Simulation */}
      <AnimatePresence>
        {verifyingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-primary/30 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {verificationStep === 1 && <Fingerprint className="h-10 w-10 text-primary animate-pulse" />}
                    {verificationStep === 2 && <Cpu className="h-10 w-10 text-primary animate-pulse" />}
                    {verificationStep === 3 && <Lock className="h-10 w-10 text-primary animate-pulse" />}
                    {verificationStep === 4 && <CheckCircle2 className="h-10 w-10 text-green-500" />}
                  </div>
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                  {verificationStep === 1 && "Identity Sync"}
                  {verificationStep === 2 && "Knowledge Proof"}
                  {verificationStep === 3 && "Mesh Anchoring"}
                  {verificationStep === 4 && "Verification Complete"}
                </h2>

                <p className="text-sm text-slate-500 font-medium mb-8">
                  {verificationStep === 1 && `Initiating biometric handshake for ${verifyingStudent.name}...`}
                  {verificationStep === 2 && "Generating Zero-Knowledge Proof for academic credentials..."}
                  {verificationStep === 3 && "Verifying cryptographic proof against university node..."}
                  {verificationStep === 4 && "Credential verified successfully."}
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Identity Hash", step: 1 },
                    { label: "Credential Proof", step: 2 },
                    { label: "University Node", step: 3 }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className={cn(verificationStep >= s.step ? "text-slate-900" : "text-slate-400")}>{s.label}</span>
                      {verificationStep > s.step ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : verificationStep === s.step ? (
                        <Loader2 className="h-3 w-3 text-primary animate-spin" />
                      ) : (
                        <div className="h-3 w-3" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
                <span className="text-[8px] font-mono text-slate-400 tracking-widest flex items-center gap-1.5 uppercase">
                  <Cpu className="h-3 w-3" /> PQC-Ready Sovereign Mesh Node: #01-STANFORD
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
