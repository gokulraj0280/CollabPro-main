import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Building2,
    Search,
    MapPin,
    Globe,
    Users,
    GraduationCap,
    Sparkles,
    ExternalLink,
    MessageSquare
} from 'lucide-react';
import { useColleges, useCorporatePartners } from '@/hooks/useDatabase';
import { CorporatePartner } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence } from 'framer-motion';
import { FadeInUp, StaggerContainer } from '@/components/ui/animation-wrapper';

export function PartnerShowcase({ onNavigate }: { onNavigate?: (section: any) => void }) {
    const { data: colleges, loading: collegesLoading } = useColleges();
    const { data: corporates, loading: corporatesLoading } = useCorporatePartners();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'colleges' | 'corporates'>('colleges');
    const { toast } = useToast();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const filteredColleges = (colleges || []).filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCorporates = (corporates as CorporatePartner[] || []).filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Building2 className="h-10 w-10 text-primary" />
                            Partner Ecosystem
                        </h1>
                        <p className="text-slate-500 font-bold text-lg mt-2">
                            Discover institutions and enterprises driving innovation
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                        <TabsList className="grid w-[400px] grid-cols-2 bg-slate-50 p-1 rounded-xl h-11">
                            <TabsTrigger value="colleges" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Academic
                            </TabsTrigger>
                            <TabsTrigger value="corporates" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-wider">
                                <Building2 className="h-4 w-4 mr-2" />
                                Corporate
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'colleges' ? 'institutions' : 'companies'} by name, location, or expertise...`}
                        className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 placeholder:text-slate-400 transition-all font-bold shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-black uppercase">
                                {activeTab === 'colleges' ? filteredColleges.length : filteredCorporates.length} Results
                            </Badge>
                        </div>
                    )}
                </div>

                <TabsContent value="colleges" className="mt-0 focus-visible:outline-none">
                    <AnimatePresence mode="wait">
                        {collegesLoading ? (
                            <div key="loading-colleges" className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <LoaderIcon className="h-10 w-10 text-primary animate-spin mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Academic Network...</p>
                            </div>
                        ) : (
                            <StaggerContainer key="colleges-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredColleges.map((college, idx) => (
                                    <FadeInUp key={college.id} delay={idx * 0.05}>
                                        <Card className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-slate-200 bg-white border group rounded-2xl overflow-hidden cursor-pointer relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500" />
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-14 w-14 ring-4 ring-slate-50 shadow-md">
                                                        <AvatarFallback className="bg-primary text-white text-lg font-black">
                                                            {getInitials(college.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-xl font-black text-slate-900 truncate group-hover:text-primary transition-colors">
                                                            {college.name}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">
                                                            <MapPin className="h-3.5 w-3.5" />
                                                            {college.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                                    <div className="text-center">
                                                        <p className="text-lg font-black text-green-600">{college.success_rate}%</p>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Success</p>
                                                    </div>
                                                    <div className="text-center border-x border-slate-200">
                                                        <p className="text-lg font-black text-primary">{college.active_projects_count}</p>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Projects</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-black text-indigo-600">{college.past_partnerships_count}</p>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Partners</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                                            <Sparkles className="h-3 w-3 text-primary" /> Core Strengths
                                                        </p>
                                                        <p className="text-xs text-slate-600 font-bold leading-relaxed line-clamp-2">
                                                            {college.research_strengths}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 text-[9px] font-black uppercase shadow-sm">
                                                            R&D Focused
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 text-[9px] font-black uppercase shadow-sm">
                                                            Accredited
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2 border-t border-slate-50">
                                                    <Button
                                                        className="flex-1 h-10 bg-primary hover:bg-primary/90 text-white font-black text-xs rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95"
                                                        onClick={() => onNavigate?.('projects')}
                                                    >
                                                        View Portfolio
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 border-slate-200 text-slate-400 hover:text-primary hover:bg-slate-50 active:scale-95 rounded-xl transition-all"
                                                        onClick={() => {
                                                            toast({
                                                                title: "Institutional Website",
                                                                description: `Opening ${college.name} website...`,
                                                            });
                                                        }}
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </FadeInUp>
                                ))}
                            </StaggerContainer>
                        )}
                    </AnimatePresence>
                </TabsContent>

                <TabsContent value="corporates" className="mt-0 focus-visible:outline-none">
                    <AnimatePresence mode="wait">
                        {corporatesLoading ? (
                            <div key="loading-corporates" className="flex flex-col items-center justify-center py-20 animate-pulse">
                                <LoaderIcon className="h-10 w-10 text-secondary animate-spin mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapping Industrial Ties...</p>
                            </div>
                        ) : (
                            <StaggerContainer key="corporates-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCorporates.map((corp, idx) => (
                                    <FadeInUp key={corp.id} delay={idx * 0.05}>
                                        <Card className="hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 border-slate-200 bg-white border group rounded-2xl overflow-hidden cursor-pointer relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-bl-full transition-opacity duration-500" />
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-14 w-14 ring-4 ring-slate-50 shadow-md">
                                                        <AvatarFallback className="bg-secondary text-white text-lg font-black">
                                                            {getInitials(corp.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-xl font-black text-slate-900 truncate group-hover:text-secondary transition-colors">
                                                            {corp.name}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">
                                                            <Building2 className="h-3.5 w-3.5" />
                                                            {corp.industry}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-slate-400 flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Location</span>
                                                        <span className="text-slate-600">{corp.location}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-slate-400 flex items-center gap-1.5"><Users className="h-3 w-3" /> Size</span>
                                                        <span className="text-slate-600">{corp.company_size}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-slate-400 flex items-center gap-1.5"><Globe className="h-3 w-3" /> Website</span>
                                                        <span className="text-primary hover:underline">{corp.website}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-1 opacity-10">
                                                        <Sparkles className="h-12 w-12 text-secondary" />
                                                    </div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Active Engagement Areas</p>
                                                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                                                        Focused on integrating R&D solutions within the {corp.industry} sector.
                                                    </p>
                                                </div>

                                                <div className="flex gap-2 pt-2 border-t border-slate-50">
                                                    <Button
                                                        className="flex-1 h-10 bg-secondary hover:bg-secondary/90 text-white font-black text-xs rounded-xl shadow-lg shadow-secondary/10 transition-all active:scale-95"
                                                        onClick={() => onNavigate?.('challenges')}
                                                    >
                                                        View Challenges
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-10 w-10 border-slate-200 text-slate-400 hover:text-secondary hover:bg-slate-50 active:scale-95 rounded-xl transition-all"
                                                        onClick={() => {
                                                            toast({
                                                                title: "Opening Connection",
                                                                description: `Connecting to ${corp.name} portal...`,
                                                            });
                                                        }}
                                                    >
                                                        <MessageSquare className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </FadeInUp>
                                ))}
                            </StaggerContainer>
                        )}
                    </AnimatePresence>
                </TabsContent>
            </Tabs>

            {!collegesLoading && !corporatesLoading &&
                ((activeTab === 'colleges' && filteredColleges.length === 0) ||
                    (activeTab === 'corporates' && filteredCorporates.length === 0)) && (
                    <FadeInUp>
                        <Card className="border-slate-200 bg-white rounded-3xl border shadow-sm">
                            <CardContent className="p-20 text-center">
                                <Search className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">
                                    No matching partners found
                                </h3>
                                <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto">
                                    Try refining your search terms or switch between academic and corporate views.
                                </p>
                            </CardContent>
                        </Card>
                    </FadeInUp>
                )}
        </div>
    );
}

function LoaderIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2v4" />
            <path d="m16.2 7.8 2.9-2.9" />
            <path d="M18 12h4" />
            <path d="m16.2 16.2 2.9 2.9" />
            <path d="M12 18v4" />
            <path d="m4.9 19.1 2.9-2.9" />
            <path d="M2 12h4" />
            <path d="m4.9 4.9 2.9 2.9" />
        </svg>
    );
}
