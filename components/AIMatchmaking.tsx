// AI-powered matchmaking view showing scored matches

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useProjects, useChallenges, useCollaborationRequests } from '@/hooks/useDatabase';

type MatchmakingScore = {
  id: number;
  compatibility_score: number;
  reasoning: string;
  project_id: number;
  project_title: string;
  project_description: string;
  trl_level: number;
  college_name: string;
  challenge_id: number;
  challenge_title: string;
  challenge_description: string;
  company_name: string;
  project_expertise: string[];
  challenge_expertise: string[];
  strategic_fit: string;
  technical_overlap: string[];
  alignment_pillars: {
    technical: number;
    trl: number;
    strategic: number;
    resource: number;
  };
};

export function AIMatchmaking() {
  const { toast } = useToast();
  const [minScore, setMinScore] = useState(70);
  
  const { data: projects, loading: loadingProjects } = useProjects();
  const { data: challenges, loading: loadingChallenges } = useChallenges();
  const { create: createRequest } = useCollaborationRequests();
  const [initiatingId, setInitiatingId] = useState<number | null>(null);

  const loading = loadingProjects || loadingChallenges;

  const matches = useMemo(() => {
    if (!projects || !challenges) return [];
    
    // Generate matches for demo purposes
    const results: MatchmakingScore[] = [];
    projects.forEach((p, pIdx) => {
      challenges.forEach((c, cIdx) => {
        // Simple deterministic score for demo
        const score = 75 + ((pIdx + cIdx) % 20);
        if (score >= minScore) {
          results.push({
            id: p.id! * 1000 + c.id!,
            compatibility_score: score,
            reasoning: `High technical alignment between ${p.title} and ${c.company_name}'s focus on ${c.industry}. The project's TRL level of ${p.trl_level} provides a stable foundation for industrial integration.`,
            project_id: p.id!,
            project_title: p.title,
            project_description: p.description,
            trl_level: p.trl_level,
            college_name: p.college_name,
            challenge_id: c.id!,
            challenge_title: c.title,
            challenge_description: c.description,
            company_name: c.company_name,
            project_expertise: p.expertise_areas,
            challenge_expertise: c.required_expertise,
            strategic_fit: score > 90 ? 'Transformative' : score > 80 ? 'Strategic' : 'Experimental',
            technical_overlap: p.expertise_areas.filter(exp => c.required_expertise.includes(exp)),
            alignment_pillars: {
              technical: score - 5,
              trl: 70 + (p.trl_level * 3),
              strategic: score - 2,
              resource: 85
            }
          });
        }
      });
    });
    return results.sort((a, b) => b.compatibility_score - a.compatibility_score);
  }, [projects, challenges, minScore]);

  const handleInitiateCollaboration = async (match: MatchmakingScore) => {
    try {
      setInitiatingId(match.id);
      await createRequest({
        corporate_partner_id: 1,
        research_project_id: match.project_id,
        industry_challenge_id: match.challenge_id,
        project_brief: match.reasoning,
        budget_proposed: 1000000,
        timeline_proposed: '6 months',
        status: 'pending'
      });

      toast({
        title: "Collaboration Initiated",
        description: `Request sent to ${match.college_name} for ${match.project_title}`,
      });
    } catch (err: any) {
      toast({
        title: "Initiation Failed",
        description: err.message || "Failed to send collaboration request",
        variant: "destructive"
      });
    } finally {
      setInitiatingId(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Matchmaking</h1>
        </div>
        <p className="text-gray-600">
          Intelligent matching between research projects and industry challenges
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">
                Minimum Compatibility Score: {minScore}%
              </Label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{matches.length}</p>
              <p className="text-sm text-gray-600">Matches Found</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500">Analyzing matches...</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-6">
          {matches.map((match: MatchmakingScore) => (
            <Card key={match.id} className="overflow-hidden border-slate-200">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(match.compatibility_score)}`}
                    >
                      {match.compatibility_score}%
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Compatibility Score</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={match.compatibility_score} className="w-32" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="text-sm bg-purple-100 text-purple-700">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Matched
                    </Badge>
                    <Badge variant="outline" className={`font-bold ${match.strategic_fit === 'Transformative' ? 'border-purple-500 text-purple-700 bg-purple-50' :
                      match.strategic_fit === 'Strategic' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                        'border-orange-500 text-orange-700 bg-orange-50'
                      }`}>
                      {match.strategic_fit} Synergy
                    </Badge>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-100 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            AI Reasoning
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {match.reasoning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 border-l pl-6 border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Strategic Alignment</p>
                      <div className="space-y-3">
                        {[
                          { label: 'Technical Overlap', value: match.alignment_pillars.technical, color: 'bg-blue-500' },
                          { label: 'TRL Synergy', value: match.alignment_pillars.trl, color: 'bg-emerald-500' },
                          { label: 'Strategic Fit', value: match.alignment_pillars.strategic, color: 'bg-purple-500' },
                          { label: 'Resource Resilience', value: match.alignment_pillars.resource, color: 'bg-amber-500' },
                        ].map((pillar) => (
                          <div key={pillar.label} className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold uppercase tracking-tight text-slate-600">
                              <span>{pillar.label}</span>
                              <span>{Math.round(pillar.value)}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${pillar.color} transition-all duration-1000`}
                                style={{ width: `${pillar.value}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-blue-600 rounded" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        Research Project
                      </h3>
                    </div>
                    <div className="pl-4 space-y-2">
                      <h4 className="font-semibold text-blue-900">{match.project_title}</h4>
                      <p className="text-sm text-gray-700">{match.college_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {match.project_description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-green-600 rounded" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        Industry Challenge
                      </h3>
                    </div>
                    <div className="pl-4 space-y-2">
                      <h4 className="font-semibold text-green-900">
                        {match.challenge_title}
                      </h4>
                      <p className="text-sm text-gray-700">{match.company_name}</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {match.challenge_description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex gap-3">
                  <Button
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleInitiateCollaboration(match)}
                    disabled={initiatingId === match.id}
                  >
                    {initiatingId === match.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4 mr-2" />
                    )}
                    {initiatingId === match.id ? 'Initiating...' : 'Initiate Collaboration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No matches found
            </h3>
            <p className="text-gray-600">
              Try adjusting the minimum compatibility score
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
