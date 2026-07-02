import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    History,
    MessageSquare,
    ArrowLeftRight,
    Plus,
    ArrowRight,
    PenTool,
    Send,
    AlertCircle,
    ShieldAlert,
    BadgeCheck,
    Info
} from 'lucide-react';
import { useAgreement } from '@/hooks/useDatabase';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { analyzeSectionRisk, SectionRisk, calculateOverallRisk } from '@/lib/intelligence/agreement-analyzer';

type AgreementVersion = {
    id: number;
    agreement_id: number;
    version_number: string;
    created_at: string;
    created_by: string;
    change_summary?: string;
};

type AgreementSection = {
    id: number;
    agreement_version_id: number;
    section_id: string;
    title: string;
    content: string;
    display_order: number;
};

type AgreementComment = {
    id: number;
    agreement_id: number;
    section_id: string;
    author: string;
    comment_text: string;
    created_at: string;
};

export function AgreementCompareReview({
    collaborationRequestId = 1,
    onNavigate
}: {
    collaborationRequestId?: number;
    onNavigate?: (section: any) => void;
}) {
    const { data: agreementData, loading: loadingAgreement } = useAgreement(collaborationRequestId);
    const agreementId = agreementData?.id;

    // State for versions, sections, and comments
    const [versions, setVersions] = useState<AgreementVersion[]>([]);
    const [comments, setComments] = useState<AgreementComment[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    const [v1Version, setV1Version] = useState<string>('');
    const [v2Version, setV2Version] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [v1Sections, setV1Sections] = useState<AgreementSection[]>([]);
    const [v2Sections, setV2Sections] = useState<AgreementSection[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);

    // Comment form state
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // AI Risk Analysis State
    const [sectionRisks, setSectionRisks] = useState<Record<string, SectionRisk[]>>({});
    const [overallRisk, setOverallRisk] = useState<number>(0);
    const [showAIOverlay, setShowAIOverlay] = useState(true);

    // Load versions when agreementId is available
    useEffect(() => {
        const loadVersions = async () => {
            if (!agreementId) return;

            setLoadingVersions(true);
            try {
                const { data, error } = await supabase
                    .from('agreement_versions')
                    .select('*')
                    .eq('agreement_id', agreementId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) setVersions(data);
            } catch (error) {
                console.error('Error loading versions:', error);
            } finally {
                setLoadingVersions(false);
            }
        };

        loadVersions();
    }, [agreementId]);

    // Load comments when agreementId is available
    useEffect(() => {
        const loadComments = async () => {
            if (!agreementId) return;

            setLoadingComments(true);
            try {
                const { data, error } = await supabase
                    .from('agreement_comments')
                    .select('*')
                    .eq('agreement_id', agreementId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) setComments(data);
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setLoadingComments(false);
            }
        };

        loadComments();
    }, [agreementId]);

    // Set default versions when versions load
    useEffect(() => {
        if (versions && versions.length > 0 && !v1Version) {
            const firstVersion = versions[0].version_number;
            setV1Version(firstVersion);
            setV2Version(firstVersion);
        }
    }, [versions, v1Version]);

    // Load sections when versions change
    useEffect(() => {
        const loadSections = async () => {
            if (!versions || versions.length === 0) return;

            const v1 = versions.find(v => v.version_number === v1Version);
            const v2 = versions.find(v => v.version_number === v2Version);

            if (!v1 || !v2) return;

            setLoadingSections(true);
            try {
                const [v1Result, v2Result] = await Promise.all([
                    supabase
                        .from('agreement_sections')
                        .select('*')
                        .eq('agreement_version_id', v1.id)
                        .order('display_order', { ascending: true }),
                    supabase
                        .from('agreement_sections')
                        .select('*')
                        .eq('agreement_version_id', v2.id)
                        .order('display_order', { ascending: true })
                ]);

                if (v1Result.error) throw v1Result.error;
                if (v2Result.error) throw v2Result.error;

                if (v1Result.data) setV1Sections(v1Result.data);
                if (v2Result.data) setV2Sections(v2Result.data);

                // Run AI Risk Analysis
                if (v2Result.data) {
                    const newRisks: Record<string, SectionRisk[]> = {};
                    let allRisksList: SectionRisk[] = [];
                    (v2Result.data as any[]).forEach((section: any) => {
                        const risks = analyzeSectionRisk(section.section_id, section.title, section.content);
                        newRisks[section.section_id] = risks;
                        allRisksList = [...allRisksList, ...risks];
                    });
                    setSectionRisks(newRisks);
                    setOverallRisk(calculateOverallRisk(allRisksList));
                }
            } catch (error) {
                console.error('Error loading sections:', error);
            } finally {
                setLoadingSections(false);
            }
        };

        loadSections();
    }, [v1Version, v2Version, versions]);

    const getCommentsForSection = (sectionId: string): AgreementComment[] => {
        if (!comments) return [];
        return comments.filter(c => c.section_id === sectionId);
    };

    const refetchComments = async () => {
        if (!agreementId) return;

        try {
            const { data, error } = await supabase
                .from('agreement_comments')
                .select('*')
                .eq('agreement_id', agreementId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            if (data) setComments(data);
        } catch (error) {
            console.error('Error refetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newCommentText.trim() || !selectedSection || !agreementId) return;

        setSubmittingComment(true);
        try {
            const { error } = await supabase
                .from('agreement_comments')
                .insert({
                    agreement_id: agreementId,
                    section_id: selectedSection,
                    author: 'Current User', // In production, get from auth context
                    comment_text: newCommentText.trim()
                });

            if (error) throw error;

            // Refetch comments to get the new one
            await refetchComments();

            // Reset form
            setNewCommentText('');
            setIsAddingComment(false);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loadingAgreement || loadingVersions) {
        return <div className="p-8 text-slate-400 animate-pulse">Synchronizing version matrix...</div>;
    }

    if (!agreementData || !versions || versions.length === 0) {
        return <div className="p-8 text-slate-400">No archival agreement data found for request {collaborationRequestId}.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-100 font-inter">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111114]">
                <div>
                    <h1 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tight">
                        <FileText className="h-6 w-6 text-blue-500" />
                        Version Control Matrix
                    </h1>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Compare encrypted agreement blocks</p>
                </div>
                <div className="flex items-center gap-4 bg-[#1a1a1e] p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Base:</span>
                        <select
                            value={v1Version}
                            onChange={(e) => setV1Version(e.target.value)}
                            className="bg-transparent border-none text-xs focus:ring-0 text-blue-400 font-black cursor-pointer uppercase"
                        >
                            {versions.map((v) => (
                                <option key={v.id} value={v.version_number} className="bg-[#1a1a1e]">{v.version_number}</option>
                            ))}
                        </select>
                    </div>
                    <ArrowLeftRight className="h-4 w-4 text-slate-600" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Compare:</span>
                        <select
                            value={v2Version}
                            onChange={(e) => setV2Version(e.target.value)}
                            className="bg-transparent border-none text-xs focus:ring-0 text-purple-400 font-black cursor-pointer uppercase"
                        >
                            {versions.map((v) => (
                                <option key={v.id} value={v.version_number} className="bg-[#1a1a1e]">{v.version_number}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end mr-4">
                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Exposure Score</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${overallRisk > 60 ? 'text-red-500' : overallRisk > 30 ? 'text-amber-500' : 'text-green-500'}`}>
                                {overallRisk}%
                            </span>
                            <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${overallRisk > 60 ? 'bg-red-500' : overallRisk > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                                    style={{ width: `${overallRisk}%` }}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAIOverlay(!showAIOverlay)}
                        className={`border-white/10 text-[10px] font-black uppercase tracking-widest gap-2 h-9 px-4 ${showAIOverlay ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/10' : 'bg-transparent text-slate-500'}`}
                    >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        AI Analysis: {showAIOverlay ? 'Enabled' : 'Disabled'}
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Version History Sidebar */}
                <div className="w-64 border-r border-white/10 bg-[#0d0d10] p-4 hidden xl:block">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History className="h-3 w-3" />
                        Archival Log
                    </h3>
                    <div className="space-y-2">
                        {versions.map((v) => (
                            <div
                                key={v.id}
                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${v1Version === v.version_number || v2Version === v.version_number
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                onClick={() => setV2Version(v.version_number)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-black text-slate-200">{v.version_number}</span>
                                    <Badge variant="outline" className="text-[8px] font-black py-0 h-4 border-white/10 text-slate-500 uppercase">
                                        {formatTimestamp(v.created_at)}
                                    </Badge>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate">{v.created_by}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Comparison View */}
                <div className="flex-1 overflow-auto bg-[#0a0a0c] p-8 space-y-8 custom-scrollbar">
                    {loadingSections ? (
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest text-center py-12 animate-pulse">Decompiling specific clauses...</div>
                    ) : (
                        v1Sections.map((v1Section) => {
                            const v2Section = v2Sections.find(s => s.section_id === v1Section.section_id) || v1Section;
                            const hasChanges = v1Section.content !== v2Section.content;

                            return (
                                <Card
                                    key={v1Section.id}
                                    className={`bg-[#111114] border-white/5 hover:border-white/20 transition-all cursor-pointer overflow-hidden ${selectedSection === v1Section.section_id ? 'ring-2 ring-blue-500/50 scale-[1.005]' : ''
                                        }`}
                                    onClick={() => setSelectedSection(v1Section.section_id)}
                                >
                                    <CardHeader className="py-4 px-6 border-b border-white/5 flex flex-row items-center justify-between bg-white/[0.02]">
                                        <div>
                                            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                {v1Section.title}
                                            </CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {hasChanges && (
                                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px] font-black uppercase tracking-widest">
                                                    Delta Detected
                                                </Badge>
                                            )}
                                            {showAIOverlay && sectionRisks[v1Section.section_id]?.length > 0 && (
                                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase tracking-widest animate-pulse">
                                                    {sectionRisks[v1Section.section_id].length} Risk Markers
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="flex divide-x divide-white/5 h-full">
                                            {/* Version 1 Text */}
                                            <div className="flex-1 p-6 bg-blue-500/[0.03]">
                                                <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                                    {v1Section.content}
                                                </p>
                                            </div>
                                            {/* Version 2 Text */}
                                            <div className={`flex-1 p-6 ${hasChanges ? 'bg-purple-500/[0.06]' : 'bg-transparent'}`}>
                                                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                                    {v2Section.content}
                                                    {hasChanges && (
                                                        <span className="inline-flex ml-2 h-2 w-2 rounded-full bg-purple-500 animate-pulse shadow-lg shadow-purple-500/50" />
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Annotations & Comments Sidebar */}
                <div className="w-80 border-l border-white/10 bg-[#0d0d10] flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-[#111114]">
                        <h3 className="text-[11px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            Security Context
                        </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {selectedSection ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-6"
                                >
                                    {/* AI Risk Summary for Section */}
                                    {showAIOverlay && sectionRisks[selectedSection]?.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                                <AlertCircle className="h-3 w-3" />
                                                Detected Exposure points
                                            </h4>
                                            {sectionRisks[selectedSection].map((risk, idx) => (
                                                <div key={idx} className="p-3 bg-red-950/20 border-l-2 border-red-500/50 rounded-r-xl relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover:opacity-100 transition-opacity">
                                                        <Info className="h-3 w-3 text-red-400 cursor-help" />
                                                    </div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[10px] font-black text-red-400 uppercase tracking-tight">{risk.label}</span>
                                                        <Badge className={`text-[8px] h-3.5 font-black uppercase tracking-widest ${risk.severity === 'Critical' ? 'bg-red-500' :
                                                            risk.severity === 'High' ? 'bg-orange-500' : 'bg-amber-500'
                                                            }`}>
                                                            {risk.severity}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-[10px] text-slate-300 leading-normal mb-2 font-medium italic opacity-80">
                                                        {risk.description}
                                                    </p>
                                                    <div className="pt-2 border-t border-red-500/10">
                                                        <p className="text-[9px] text-green-400 font-extrabold uppercase tracking-tight flex items-center gap-1">
                                                            <BadgeCheck className="h-2.5 w-2.5" />
                                                            Countermeasure: {risk.mitigation}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="p-3 bg-blue-500/[0.05] border border-blue-500/20 rounded-xl">
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Target Clause</p>
                                        <p className="text-xs text-slate-200 font-bold uppercase tracking-tight">
                                            {v1Sections.find(s => s.section_id === selectedSection)?.title}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            Collaborator Feedback
                                        </h4>
                                        {loadingComments ? (
                                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center py-4 animate-pulse">Updating feed...</div>
                                        ) : (
                                            getCommentsForSection(selectedSection).map((comment) => (
                                                <div key={comment.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{comment.author}</span>
                                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{formatTimestamp(comment.created_at)}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{comment.comment_text}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {isAddingComment ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                placeholder="Inject secure annotation..."
                                                className="w-full p-4 bg-white/5 border-2 border-white/10 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-none font-medium h-32"
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleAddComment}
                                                    disabled={!newCommentText.trim() || submittingComment}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest h-10 shadow-lg shadow-blue-500/20"
                                                >
                                                    <Send className="h-3 w-3 mr-2" />
                                                    {submittingComment ? 'Transmitting...' : 'Commit'}
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setIsAddingComment(false);
                                                        setNewCommentText('');
                                                    }}
                                                    variant="ghost"
                                                    className="text-[10px] font-black uppercase tracking-widest h-10 text-slate-500 hover:text-slate-200"
                                                >
                                                    Abort
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setIsAddingComment(true)}
                                            variant="ghost"
                                            className="w-full justify-start text-[10px] font-black uppercase tracking-[0.15em] border-2 border-dashed border-white/5 text-slate-600 hover:text-slate-300 hover:bg-white/[0.02] h-12 rounded-xl"
                                        >
                                            <Plus className="h-3 w-3 mr-2" />
                                            Add Annotation Node
                                        </Button>
                                    )}
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <MessageSquare className="h-12 w-12 text-white/5 mb-4" />
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Select a logical block to audit</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-4 border-t border-white/10 bg-[#111114]">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 h-12 group"
                            onClick={() => onNavigate?.('digital-signature')}
                        >
                            <PenTool className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            Finalize Agreement
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
