import Dexie, { Table } from 'dexie';
import {
  ResearchProject,
  IndustryChallenge,
  College,
  CollaborationRequest,
  IPDisclosure,
  Negotiation,
  Agreement,
  Notification,
  StudentProfile,
  LicensingOpportunity,
  InterviewRequest,
  LicensingInquiry,
  ProjectDocument,
  CorporatePartner,
  ProjectScope,
} from './types';

export class CollabProDB extends Dexie {
  research_projects!: Table<ResearchProject>;
  industry_challenges!: Table<IndustryChallenge>;
  colleges!: Table<College>;
  collaboration_requests!: Table<CollaborationRequest>;
  ip_disclosures!: Table<IPDisclosure>;
  negotiations!: Table<Negotiation>;
  agreements!: Table<Agreement>;
  notifications!: Table<Notification>;
  student_profiles!: Table<StudentProfile>;
  licensing_opportunities!: Table<LicensingOpportunity>;
  interview_requests!: Table<InterviewRequest>;
  licensing_inquiries!: Table<LicensingInquiry>;
  project_documents!: Table<ProjectDocument>;
  corporate_partners!: Table<CorporatePartner>;
  project_scopes!: Table<ProjectScope>;

  constructor() {
    super('CollabProDB');
    this.version(1).stores({
      research_projects: '++id, title, status, college_name',
      industry_challenges: '++id, title, status, company_name',
      colleges: '++id, name, location',
      collaboration_requests: '++id, status, corporate_partner_id, research_project_id',
      ip_disclosures: '++id, title, status, active_project_id',
      negotiations: '++id, status, collaboration_request_id',
      agreements: '++id, status, collaboration_request_id',
      notifications: '++id, user_id, type, read, created_at',
      student_profiles: '++id, name, college',
      licensing_opportunities: '++id, status, ip_disclosure_id',
      interview_requests: '++id, student_profile_id, status',
      licensing_inquiries: '++id, licensing_opportunity_id, status',
      project_documents: '++id, project_id, file_name',
      corporate_partners: '++id, name, industry',
      project_scopes: '++id, collaboration_request_id, version_number',
    });
  }
}

export const db = new CollabProDB();
