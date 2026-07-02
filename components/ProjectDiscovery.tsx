// Project Discovery page with filterable research projects grid

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';
import { formatINRCompact, usdToINR } from '@/lib/currency';
import { Skeleton } from '@/components/ui/skeleton';
import { useProjects } from '@/hooks/useDatabase';
import { ResearchProject } from '@/lib/types';

export function ProjectDiscovery({ onNavigate }: { onNavigate?: (section: any) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);

  const { data: allProjects, loading, error } = useProjects();
  
  const projects = (allProjects || []).filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.college_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return formatINRCompact(usdToINR(amount));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Research Projects</h1>
        <p className="text-slate-500">Discover cutting-edge College research available for collaboration</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by title..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Projects Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white border border-slate-200 overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading projects: {(error as any)?.message || 'Unknown error'}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: ResearchProject) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-slate-200 group">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 text-slate-900 group-hover:text-primary transition-colors">{project.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-2 font-medium">
                  <Briefcase className="h-4 w-4" />
                  <span>{project.college_name}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed font-medium">
                  {project.description}
                </p>

                <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Funding Needed
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(project.funding_needed)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      TRL Level
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="h-6 px-2 bg-slate-50 text-slate-900 font-bold border-slate-200">
                        {project.trl_level}/9
                      </Badge>
                      {project.trl_prediction && (
                        <span className="text-[10px] text-primary font-bold">
                          Next in {project.trl_prediction.estimatedMonthsToNext}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.expertise_areas?.slice(0, 3).map((area, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-transparent text-[10px] font-bold uppercase tracking-wider h-6"
                    >
                      {area}
                    </Badge>
                  ))}
                  {project.expertise_areas?.length > 3 && (
                    <Badge variant="outline" className="h-6 text-[10px] font-bold border-slate-200 text-slate-500">
                      +{project.expertise_areas.length - 3} more
                    </Badge>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
