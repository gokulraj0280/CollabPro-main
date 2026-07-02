// TypeScript types for the CollabPro application

export interface ResearchProject {
  id?: number;
  title: string;
  description: string;
  funding_needed: number;
  trl_level: number;
  status: string;
  team_lead: string;
  team_size: number;
  publications_count: number;
  college_name: string;
  college_location: string;
  expertise_areas: string[];
  created_at?: string;
  project_name?: string; // Aliases for consistency with legacy code
  funding_allocated?: number;
  budget_utilized?: number;
  start_date?: string;
  end_date?: string;
  milestones?: {
    id: number;
    title: string;
    description: string;
    due_date: string;
    status: string;
    deliverables: string;
  }[];
  team_members?: {
    id: number;
    name: string;
    role: string;
    email: string;
    organization: string;
  }[];
  risk_assessment?: {
    score: number;
    level: string;
    factors: { label: string; impact: number; description: string }[];
    recommendation: string;
  };
  trl_prediction?: {
    estimatedMonthsToNext: number;
    stallRisk: number;
    bottlenecks: string[];
    confidenceScore: number;
  };
}

export interface ProjectDocument {
  id?: number;
  project_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  description: string;
}

export interface IndustryChallenge {
  id?: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  timeline_months: number;
  status: string;
  company_name: string;
  industry: string;
  company_location: string;
  required_expertise: string[];
  corporate_partner_id: number;
  created_at?: string;
}

export interface College {
  id?: number;
  name: string;
  location: string;
  website: string;
  research_strengths: string;
  available_resources: string;
  success_rate: number;
  past_partnerships_count: number;
  active_projects_count: number;
  created_at?: string;
}

export interface CollaborationRequest {
  id?: number;
  corporate_partner_id: number;
  research_project_id: number;
  industry_challenge_id?: number;
  project_brief: string;
  budget_proposed: number;
  timeline_proposed: string;
  status: string;
  created_at?: string;
}

export interface IPDisclosure {
  id?: number;
  active_project_id: number;
  title: string;
  description: string;
  invention_type: string;
  inventors: string[];
  disclosure_date: string;
  status: string;
  created_at?: string;
}

export interface NegotiationMessage {
  id: string;
  sender_name: string;
  sender_organization: string;
  content: string;
  created_at: string;
  message_type: 'text' | 'proposal' | 'counter-proposal' | string;
}

export interface Negotiation {
  id?: number;
  collaboration_request_id: number;
  messages: NegotiationMessage[];
  status: string;
  created_at?: string;
}

export interface ProjectScope {
  id?: number;
  collaboration_request_id: number;
  version_number: number;
  scope_description: string;
  deliverables: string;
  timeline: string;
  budget: number;
  created_by: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export interface AgreementSection {
  id: string;
  title: string;
  text: string;
}

export interface AgreementVersion {
  version_number: string;
  created_at: string;
  created_by: string;
  content: string;
  sections: AgreementSection[];
}

export interface Agreement {
  id?: number;
  collaboration_request_id: number;
  versions: AgreementVersion[];
  current_version: string;
  status: string;
  college_signed_at: string | null;
  corporate_signed_at: string | null;
  college_approval_status: boolean;
  corporate_approval_status: boolean;
  college_signatory: string | null;
  corporate_signatory: string | null;
  created_at?: string;
}

export interface Notification {
  id?: number;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at?: string;
}

export interface CorporatePartner {
  id?: number;
  name: string;
  industry: string;
  location: string;
  website: string;
  company_size: string;
  created_at?: string;
}

export interface StudentProfile {
  id?: number;
  name: string;
  college: string;
  degree: string;
  skills: string[];
  availability: string;
  gpa: number;
  projects: string[];
  bio: string;
  created_at?: string;
}

export interface LicensingOpportunity {
  id?: number;
  ip_disclosure_id: number;
  title: string;
  description: string;
  price_range: string;
  license_type: string;
  status: string;
  created_at?: string;
}

export interface InterviewRequest {
  id?: number;
  student_profile_id: number;
  requester_name: string;
  requester_email: string;
  requester_organization: string;
  status: string;
  created_at?: string;
}

export interface LicensingInquiry {
  id?: number;
  licensing_opportunity_id: number;
  inquirer_name: string;
  inquirer_email: string;
  inquirer_organization: string;
  message: string;
  status: string;
  created_at?: string;
}
