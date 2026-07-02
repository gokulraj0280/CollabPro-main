// Industry challenges board where corporate partners can post problems

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Building2, DollarSign, Clock } from 'lucide-react';
import { CreateChallengeDialog } from '@/components/CreateChallengeDialog';
import { formatINRCompact, usdToINR } from '@/lib/currency';
import { useChallenges } from '@/hooks/useDatabase';
import { useToast } from "@/hooks/use-toast";
import { IndustryChallenge } from '@/lib/types';

export function IndustryChallengesBoard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: allChallenges, loading, error } = useChallenges();
  
  const challenges = (allChallenges || []).filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return formatINRCompact(usdToINR(amount));
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Industry Challenges</h1>
          <p className="text-slate-500 font-medium">Post problems and find research solutions</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-primary hover:bg-primary/90 text-white font-bold">
          <Plus className="h-4 w-4 mr-2" />
          Post Challenge
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 border-slate-200 bg-white shadow-sm border">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Challenges List */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading challenges...</p>
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
        <div className="space-y-4">
          {challenges.map((challenge: IndustryChallenge) => (
            <Card key={challenge.id} className="hover:shadow-md transition-all duration-300 border-slate-200 bg-white border group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-3 font-semibold uppercase tracking-tight">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{challenge.company_name}</span>
                      </div>
                      <span>•</span>
                      <span>{challenge.industry}</span>
                      <span>•</span>
                      <span>{challenge.company_location}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold uppercase tracking-wider text-[10px] h-6 px-3">{challenge.status}</Badge>
                </div>

                <p className="text-slate-600 mb-4 leading-relaxed font-medium">
                  {challenge.description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg shadow-inner shadow-slate-900/5">
                  <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      <DollarSign className="h-3 w-3" />
                      <span>Budget Range</span>
                    </div>
                    <p className="font-bold text-slate-900">
                      {formatCurrency(challenge.budget_min)} - {formatCurrency(challenge.budget_max)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      <Clock className="h-3 w-3" />
                      <span>Timeline</span>
                    </div>
                    <p className="font-bold text-slate-900">
                      {challenge.timeline_months} months
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Posted</p>
                    <p className="font-bold text-slate-900">
                      {challenge.created_at ? new Date(challenge.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                {challenge.required_expertise && challenge.required_expertise.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {challenge.required_expertise.map((expertise, idx) => (
                        <Badge key={idx} variant="outline">
                          {expertise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary border-primary/20 hover:bg-primary/5 font-bold"
                  onClick={() => {
                    toast({
                      title: "Matching Projects",
                      description: `Finding projects compatible with ${challenge.title}...`,
                    });
                  }}
                >
                  View Matching Projects
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && challenges.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges found</h3>
            <p className="text-gray-600 mb-4">Be the first to post an industry challenge</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post Challenge
            </Button>
          </CardContent>
        </Card>
      )}

      {showCreateDialog && (
        <CreateChallengeDialog
          onClose={() => setShowCreateDialog(false)}
          onSuccess={() => {
            setShowCreateDialog(false);
          }}
        />
      )}
    </div>
  );
}
