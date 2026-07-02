// Project detail modal showing full information

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Users, BookOpen, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { CollaborationRequestForm } from '@/components/CollaborationRequestForm';
import { formatINR, usdToINR } from '@/lib/currency';

type ResearchProject = {
  id: number;
  title: string;
  description: string;
  funding_needed: number;
  trl_level: number;
  status: string;
  team_lead: string;
  team_size: number;
  publications_count: number;
  College_name: string;
  College_location: string;
  expertise_areas: string[];
  trl_prediction?: {
    estimatedMonthsToNext: number;
    stallRisk: number;
    bottlenecks: string[];
    confidenceScore: number;
  };
};

// ProjectDetailModal showing full information

export function ProjectDetailModal({ project, onClose, onNavigate }: {
  project: ResearchProject;
  onClose: () => void;
  onNavigate?: (section: any) => void;
}) {
  const [showRequestForm, setShowRequestForm] = useState(false);

  const formatCurrency = (amount: number) => {
    return formatINR(usdToINR(amount));
  };

  if (showRequestForm) {
    return (
      <CollaborationRequestForm
        projectId={project.id}
        projectTitle={project.title}
        onClose={() => setShowRequestForm(false)}
        onSuccess={onClose}
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-start justify-between border-b">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-3">{project.title}</CardTitle>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="font-semibold">{project.College_name}</span>
              <span>•</span>
              <span>{project.College_location}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Project Description</h3>
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Funding Needed</span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(project.funding_needed)}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg relative overflow-hidden group">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">TRL Level</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{project.trl_level}/9</p>
              {project.trl_prediction && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-[10px] font-black uppercase text-primary tracking-wider">
                    Next in {project.trl_prediction.estimatedMonthsToNext} months
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold">
                    Confidence: {(project.trl_prediction.confidenceScore * 100).toFixed(0)}%
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Team Size</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{project.team_size}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">Publications</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{project.publications_count}</p>
            </div>
          </div>

          {/* Intelligent TRL Forecast Details */}
          {project.trl_prediction && (
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
              <h3 className="font-bold text-primary flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5" />
                Intelligent TRL Forecast
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] tracking-widest">Potential Bottlenecks</p>
                  <ul className="space-y-1">
                    {project.trl_prediction.bottlenecks.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-gray-500 font-bold mb-1 uppercase text-[10px] tracking-widest">Execution Risk</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${project.trl_prediction.stallRisk > 0.5 ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{ width: `${project.trl_prediction.stallRisk * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-gray-700">{(project.trl_prediction.stallRisk * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">Based on budget utilization and team velocity.</p>
                </div>
              </div>
            </div>
          )}

          {/* Team Information */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Team Lead</h3>
            <p className="text-gray-700">{project.team_lead}</p>
          </div>

          {/* Expertise Areas */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Expertise Areas</h3>
            <div className="flex flex-wrap gap-2">
              {project.expertise_areas?.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded-md font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1" size="lg" onClick={() => setShowRequestForm(true)}>
              Initiate Collaboration Request
            </Button>
            <Button variant="outline" size="lg" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
