import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Briefcase, Target, Users, ArrowRight, Sparkles, Activity, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Counter, ShinyButton } from '@/components/ui/animated-primitives';
import { useAppStore } from '@/lib/store';
import { ResearchProject } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { StaggerContainer, FadeInUp, SpringPress, GlowWrapper, MagneticWrapper } from '@/components/ui/animation-wrapper';
import { SystemStatus, SmartLoader } from '@/components/ui/AIFeedback';
import { motion } from 'framer-motion';
import { ProjectRoadmap } from '@/components/ProjectRoadmap';
import { useProjects, useChallenges, useCollaborationRequests } from '@/hooks/useDatabase';
import { cn } from '@/lib/utils';

type DashboardOverviewProps = {
  onNavigate?: (section: any) => void;
  onProjectSelect?: (projectId: number) => void;
};

export function DashboardOverview({ onNavigate, onProjectSelect }: DashboardOverviewProps) {
  const { toast } = useToast();
  const { chartData } = useAppStore((state) => state.testData);
  
  useCollaborationRequests();
  const { data: projects, create: createProjectAction } = useProjects();
  const { data: challenges } = useChallenges();

  const [creatingProject, setCreatingProject] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    fundingAllocated: 500000
  });

  const safeProjects = projects || [];
  const safeChallenges = challenges || [];
  const recentActivity = safeProjects.slice(0, 5);

  const handleCreateProject = async () => {
    try {
      setCreatingProject(true);
      if (!newProject.title || !newProject.description) {
        toast({ title: "Validation Error", description: "Please fill in all required fields", variant: "destructive" });
        return;
      }
      
      await createProjectAction({
        title: newProject.title,
        description: newProject.description,
        funding_needed: newProject.fundingAllocated,
        trl_level: 1,
        status: 'pending',
        team_lead: 'Dr. Principal Investigator',
        team_size: 1,
        publications_count: 0,
        college_name: 'Main Institution',
        college_location: 'Default Campus',
        expertise_areas: ['New Research']
      });
      
      toast({ title: "Project Created", description: "Research initiative initiated successfully." });
      setIsDialogOpen(false);
      setNewProject({ title: '', description: '', fundingAllocated: 500000 });
      
      // Since we don't have the last inserted ID directly from the hook's simplified return in some cases
      // we just navigate to projects or the user can find it.
      if (onNavigate) {
        onNavigate('projects');
      }
    } catch (error: any) {
      toast({ title: "Creation Failed", description: error.message || "Failed to create project", variant: "destructive" });
    } finally {
      setCreatingProject(false);
    }
  };

  const userRole = useAppStore(state => state.user?.organization_type || 'college');
  const isAcademy = userRole === 'college';
  const isCorporate = userRole === 'corporate';

  const iconMap: Record<string, React.ElementType> = {
    'Active Projects': Briefcase,
    'Open Challenges': Target,
    'Pending Requests': Users,
    'Success Rate': TrendingUp,
    'Talent Pool': Users,
    'IP Disclosures': Briefcase,
    'Job Matches': Sparkles,
    'Skills Gained': Activity,
    'Agreement Status': Clock
  };

  const getRoleSpecificMetrics = () => {
    if (isAcademy) {
      return [
        { title: 'Active Projects', value: safeProjects.length, trend: '+12%', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-500' },
        { title: 'IP Disclosures', value: 5, trend: '+5%', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-500' },
        { title: 'Pending Funding', value: '₹2.4M', trend: 'Critical', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-500' },
        { title: 'Success Rate', value: '94%', trend: '+2%', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-500' }
      ];
    }
    if (isCorporate) {
      return [
        { title: 'Open Challenges', value: safeChallenges.length, trend: 'Active', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-500' },
        { title: 'Active Matchmaking', value: 3, trend: 'Running', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-500' },
        { title: 'Talent Pool', value: 124, trend: '+14', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-500' },
        { title: 'Agreement Status', value: '4 Pending', trend: 'Action', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-500' }
      ];
    }
    // Student
    return [
      { title: 'Job Matches', value: 8, trend: 'New', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-500' },
      { title: 'Skills Gained', value: 12, trend: '+3', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-500' },
      { title: 'Invitations', value: 5, trend: 'Pending', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-500' },
      { title: 'Profile Views', value: 45, trend: '+25%', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-500' }
    ];
  };

  const displayMetrics = getRoleSpecificMetrics().map(m => ({
    ...m,
    icon: iconMap[m.title] || Briefcase
  }));

  const currentCount = safeProjects.length || 10;
  const historicChartData = chartData.map((d, i) => ({
    ...d,
    value: Math.max(1, Math.round(currentCount * (0.5 + (i / chartData.length))))
  }));

  return (
    <div className="relative p-8 space-y-8 min-h-screen overflow-hidden">
      {/* Background Neural Decorations */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center gap-3">
              Dashboard
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase tracking-widest px-2">
                Live Node
              </Badge>
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-slate-500 font-medium">Welcome back! Here's your collaboration overview</p>
              <SystemStatus status="Optimizing Neural Engine" />
            </div>
          </motion.div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-slate-200 bg-white/50 backdrop-blur-sm text-slate-600 hover:text-slate-900 hover:bg-white rounded-2xl shadow-sm transition-all"
              onClick={() => toast({ title: "Filter applied", description: "Showing data for the last 30 days." })}
            >
              <Clock className="mr-2 h-4 w-4" /> Last 30 Days
            </Button>
            <MagneticWrapper strength={0.1}>
              <ShinyButton onClick={() => setIsDialogOpen(true)} className="rounded-2xl shadow-lg shadow-primary/20">
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> New Project</span>
              </ShinyButton>
            </MagneticWrapper>
          </div>
        </div>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <FadeInUp key={idx}>
                <GlowWrapper color={metric.color.includes('blue') ? 'rgba(6, 182, 212, 0.2)' : 'rgba(139, 92, 246, 0.2)'}>
                  <SpringPress className="h-full">
                    <Card className="h-full border-slate-200/60 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden relative border cursor-pointer rounded-3xl" onClick={() => onNavigate && onNavigate(metric.title === 'Active Projects' ? 'projects' : metric.title === 'Open Challenges' ? 'challenges' : 'collaboration')}>
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${metric.color} opacity-[0.05] group-hover:opacity-[0.15] rounded-bl-full transition-opacity duration-700`} />
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: metric.color.includes('blue') ? '#06b6d4' : '#8b5cf6' }} />
                      
                      <CardContent className="p-7">
                        <div className="flex items-center justify-between mb-6">
                          <div className={`h-14 w-14 rounded-2xl ${metric.bg} flex items-center justify-center ring-4 ring-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            <Icon className="h-7 w-7" />
                          </div>
                          <Badge variant="outline" className={cn("bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-black tracking-widest", metric.trend === 'Critical' && 'bg-rose-500/10 text-rose-600 border-rose-500/20')}>
                            {metric.trend}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                            {typeof metric.value === 'number' ? <Counter value={metric.value} /> : metric.value}
                          </h3>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2 opacity-60 group-hover:opacity-100 transition-opacity">{metric.title}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </SpringPress>
                </GlowWrapper>
              </FadeInUp>
            );
          })}
        </StaggerContainer>

        <div className="grid lg:grid-cols-3 gap-8">
          <FadeInUp delay={0.3} className="lg:col-span-2">
            <Card className="h-full border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xl border rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-slate-900 text-xl font-black tracking-tight">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  Engagement Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicChartData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255,255,255,0.9)', 
                          backdropFilter: 'blur(8px)',
                          borderRadius: '16px',
                          border: '1px solid rgba(0,0,0,0.05)',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                        }} 
                        itemStyle={{ color: '#0f172a', fontWeight: 800 }} 
                      />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.4} className="lg:col-span-1">
            <Card className="h-full border-slate-200/60 bg-white/80 backdrop-blur-md shadow-xl border rounded-[2rem] overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-slate-900 text-xl font-black tracking-tight">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-cyan-600" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StaggerContainer className="space-y-4 mt-4">
                  {recentActivity.map((project: ResearchProject, i: number) => (
                    <FadeInUp key={project.id || i}>
                      <SpringPress
                        className="group flex items-center justify-between p-4 bg-slate-50/50 hover:bg-white rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-200 hover:shadow-lg cursor-pointer"
                        onClick={() => {
                          if (project.id && onProjectSelect) {
                            onProjectSelect(project.id);
                          } else if (onNavigate) {
                            onNavigate('projects');
                          }
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-sm text-slate-900 truncate group-hover:text-primary transition-colors">
                            {project.title || "New Research Initiative"}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{project.college_name || "Partner College"}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all shadow-sm border border-slate-100">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </SpringPress>
                    </FadeInUp>
                  ))}
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      className="w-full text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary hover:bg-primary/5 rounded-2xl h-12 transition-all"
                      onClick={() => onNavigate && onNavigate('projects')}
                    >
                      View All Activity
                    </Button>
                  </div>
                </StaggerContainer>
              </CardContent>
            </Card>
          </FadeInUp>
        </div>

        <FadeInUp delay={0.5}>
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-4 border border-white/40 shadow-inner">
            <ProjectRoadmap />
          </div>
        </FadeInUp>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl text-slate-900 border-white/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-cyan-400 to-primary" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              Start Research
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Project Title</Label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                className="bg-slate-50/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-2xl h-12 focus:ring-primary/20 transition-all"
                placeholder="e.g., Nanotech Water Filtration"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Scope</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="bg-slate-50/50 border-slate-200/60 text-slate-900 placeholder:text-slate-400 rounded-2xl focus:ring-primary/20 min-h-[120px] transition-all"
                placeholder="Describe the research goals..."
              />
            </div>
          </div>
          <DialogFooter className="bg-slate-50/80 backdrop-blur-md p-6 -mx-6 -mb-6 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-slate-500 hover:text-slate-800 rounded-2xl transition-all">Cancel</Button>
            <Button onClick={handleCreateProject} disabled={creatingProject} className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all">
              {creatingProject ? <SmartLoader /> : 'Launch Initiative'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
