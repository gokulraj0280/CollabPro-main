import { db } from './db';
import {
  ResearchProject,
  IndustryChallenge,
  Notification,
  College,
  CorporatePartner
} from './types';

export const DUMMY_CORPORATES: Omit<CorporatePartner, 'id'>[] = [
  {
    name: "Tesla Energy",
    industry: "Renewable Energy",
    location: "Austin, TX",
    website: "https://tesla.com/energy",
    company_size: "10,000+ Employees",
    created_at: new Date().toISOString(),
  },
  {
    name: "NVIDIA Industrial",
    industry: "Semiconductors",
    location: "Santa Clara, CA",
    website: "https://nvidia.com/industrial",
    company_size: "5,000-10,000 Employees",
    created_at: new Date().toISOString(),
  },
  {
    name: "SpaceX R&D",
    industry: "Aerospace",
    location: "Hawthorne, CA",
    website: "https://spacex.com",
    company_size: "1,000-5,000 Employees",
    created_at: new Date().toISOString(),
  },
  {
    name: "Novartis BioLab",
    industry: "Biotechnology",
    location: "Cambridge, MA",
    website: "https://novartis.com",
    company_size: "10,000+ Employees",
    created_at: new Date().toISOString(),
  }
];

export const DUMMY_PROJECTS: Omit<ResearchProject, 'id'>[] = [
  {
    title: "Quantum-Enhanced Vaccine Delivery Systems",
    description: "Utilizing quantum dots and neural mesh protocols to optimize micro-delivery of mRNA sequences in harsh climates.",
    funding_needed: 2500000,
    trl_level: 4,
    status: "in_progress",
    team_lead: "Dr. Sarah Chen",
    team_size: 12,
    publications_count: 8,
    college_name: "Stanford Institute of Technology",
    college_location: "Palo Alto, CA",
    expertise_areas: ["Biotech", "Quantum Computing", "Nanomedicine"],
    created_at: new Date().toISOString(),
  },
  {
    title: "Sovereign AI for Smart City Infrastructure",
    description: "Developing decentralized, sovereign AI nodes that manage power grids without centralized cloud dependency.",
    funding_needed: 5000000,
    trl_level: 6,
    status: "completed",
    team_lead: "Prof. Marcus Vane",
    team_size: 24,
    publications_count: 15,
    college_name: "MIT CSAIL",
    college_location: "Cambridge, MA",
    expertise_areas: ["AI/ML", "Cybersecurity", "Smart Grid"],
    created_at: new Date().toISOString(),
  },
  {
    title: "Eco-Synthetic Polymer Synthesis",
    description: "Creating zero-waste polymers that biodegrade into nitrogen-rich soil supplements within 90 days of oceanic exposure.",
    funding_needed: 1200000,
    trl_level: 3,
    status: "pending",
    team_lead: "Dr. Elena Rossi",
    team_size: 6,
    publications_count: 3,
    college_name: "ETH Zurich",
    college_location: "Zurich, Switzerland",
    expertise_areas: ["Sustainability", "Material Science", "Chemistry"],
    created_at: new Date().toISOString(),
  },
  {
    title: "Graphene-Based Neural Interfaces",
    description: "Low-latency, high-bandwidth neural link using biocompatible graphene sheets for neuro-rehabilitation.",
    funding_needed: 3800000,
    trl_level: 5,
    status: "in_progress",
    team_lead: "Dr. Kenji Tanaka",
    team_size: 18,
    publications_count: 12,
    college_name: "University of Tokyo",
    college_location: "Tokyo, Japan",
    expertise_areas: ["Neuroscience", "Nanotechnology", "Graphene"],
    created_at: new Date().toISOString(),
  }
];

export const DUMMY_CHALLENGES: Omit<IndustryChallenge, 'id'>[] = [
  {
    title: "Next-Gen Carbon Capture Scalability",
    description: "Seeking research partners to reduce the energy overhead of atmospheric carbon scrubbing by 40% using novel catalysts.",
    budget_min: 500000,
    budget_max: 2000000,
    timeline_months: 18,
    status: "open",
    company_name: "Tesla Energy",
    industry: "Renewable Energy",
    company_location: "Austin, TX",
    required_expertise: ["Carbon Capture", "Thermodynamics", "Chemical Engineering"],
    corporate_partner_id: 1,
    created_at: new Date().toISOString(),
  },
  {
    title: "Privacy-Preserving Edge Computing",
    description: "Challenge to implement zero-knowledge proofs on lightweight ARM-based IoT sensors for industrial monitoring.",
    budget_min: 250000,
    budget_max: 1000000,
    timeline_months: 12,
    status: "in_progress",
    company_name: "NVIDIA Industrial",
    industry: "Semiconductors",
    company_location: "Santa Clara, CA",
    required_expertise: ["Cryptography", "Edge AI", "IoT"],
    corporate_partner_id: 2,
    created_at: new Date().toISOString(),
  },
  {
    title: "Biodegradable Computing Substrates",
    description: "Looking for materials that can serve as PCB bases but dissolve safely in organic compost after 5 years.",
    budget_min: 800000,
    budget_max: 3000000,
    timeline_months: 24,
    status: "open",
    company_name: "Apple R&D",
    industry: "Consumer Electronics",
    company_location: "Cupertino, CA",
    required_expertise: ["Material Science", "Electronics", "Biology"],
    corporate_partner_id: 1,
    created_at: new Date().toISOString(),
  }
];

export const DUMMY_NOTIFICATIONS: Omit<Notification, 'id'>[] = [
  {
    user_id: "user_1",
    title: "Match Found!",
    message: "Tesla Energy's Carbon Capture challenge matches your Quantum Nanomedicine research via the Neural Mesh.",
    type: "success",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    user_id: "user_1",
    title: "Agreement Signed",
    message: "MIT CSAIL and NVIDIA have finalized the Edge Computing protocol.",
    type: "info",
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    user_id: "user_1",
    title: "Risk Alert",
    message: "Substrate biodegradability project shows 15% increase in failure probability due to supply chain latency.",
    type: "warning",
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const DUMMY_COLLEGES: Omit<College, 'id'>[] = [
  {
    name: "Stanford Institute of Technology",
    location: "Palo Alto, CA",
    website: "https://sit.stanford.edu",
    research_strengths: "Quantum Systems, Biophotonics, Neural Mesh",
    available_resources: "Quantum Cleanroom, 100-Petaflop Supercomputer",
    success_rate: 98.4,
    past_partnerships_count: 142,
    active_projects_count: 24,
    created_at: new Date().toISOString(),
  },
  {
    name: "MIT CSAIL",
    location: "Cambridge, MA",
    website: "https://csail.mit.edu",
    research_strengths: "Artificial Intelligence, Cryptography, Robotics",
    available_resources: "Stargate AI Cluster, Robotics Sandbox",
    success_rate: 96.2,
    past_partnerships_count: 210,
    active_projects_count: 45,
    created_at: new Date().toISOString(),
  }
];

export const DUMMY_IP_DISCLOSURES: any[] = [
    {
      id: 1,
      active_project_id: 2,
      title: "Decentralized Grid Management Algorithm",
      description: "A self-healing protocol for smart grids using sovereign AI nodes.",
      invention_type: "Software/Algorithm",
      inventors: ["Prof. Marcus Vane", "Alex Rivera"],
      disclosure_date: new Date(Date.now() - 2592000000).toISOString(),
      status: "filed",
      created_at: new Date(Date.now() - 2592000000).toISOString(),
    },
    {
      id: 2,
      active_project_id: 1,
      title: "Photonic mRNA Encapsulation",
      description: "Method for protecting mRNA using light-sensitive quantum dots.",
      invention_type: "Biotech/Process",
      inventors: ["Dr. Sarah Chen"],
      disclosure_date: new Date().toISOString(),
      status: "draft",
      created_at: new Date().toISOString(),
    }
];

export const DUMMY_STUDENTS: any[] = [
    {
      name: "Alex Rivera",
      college: "Stanford Institute of Technology",
      degree: "PhD in Neural Physics",
      skills: ["Python", "Quantum Systems", "C++"],
      availability: "Part-time",
      gpa: 3.9,
      projects: ["Neural Link v2", "Mesh Protocols"],
      bio: "Focusing on decentralized intelligence and biological interfaces.",
      created_at: new Date().toISOString(),
    },
    {
      name: "Sarah Jenkins",
      college: "MIT CSAIL",
      degree: "MSc in Cybersecurity",
      skills: ["Rust", "Zero-Knowledge Proofs", "Cryptography"],
      availability: "Full-time",
      gpa: 4.0,
      projects: ["Secure Edge", "Stellar Shield"],
      bio: "Advancing privacy-preserving protocols for industrial IoT.",
      created_at: new Date().toISOString(),
    }
];

export const DUMMY_LICENSING: any[] = [
    {
      id: 1,
      ip_disclosure_id: 1,
      anonymized_title: "Self-Healing Grid Protocol (SHGP)",
      anonymized_description: "Ready for licensing to tier-1 utility providers.",
      asking_price: 1500000,
      industry_sectors: "Energy, Smart City",
      inquiries_count: 5,
      status: "available",
      created_at: new Date().toISOString(),
      invention_category: "Software/Algorithm",
    }
];

export const DUMMY_COLLABORATIONS: any[] = [
    {
      id: 1,
      corporate_partner_id: 1,
      research_project_id: 1,
      project_brief: "Integration of quantum dots into mRNA sequences for climate-resilient vaccine delivery.",
      budget_proposed: 1500000,
      timeline_proposed: "12 months",
      status: "pending",
      created_at: new Date().toISOString(),
      company_name: "Tesla Energy",
      industry: "Renewable Energy",
      project_title: "Quantum-Enhanced Vaccine Delivery Systems",
      College_name: "Stanford Institute of Technology",
    },
    {
      id: 2,
      corporate_partner_id: 2,
      research_project_id: 2,
      industry_challenge_id: 2,
      project_brief: "Deploying sovereign AI nodes for resilient edge monitoring in energy grids.",
      budget_proposed: 2800000,
      timeline_proposed: "18 months",
      status: "approved",
      created_at: new Date(Date.now() - 432000000).toISOString(),
      company_name: "NVIDIA Industrial",
      industry: "Semiconductors",
      project_title: "Sovereign AI for Smart City Infrastructure",
      College_name: "MIT CSAIL",
      challenge_title: "Privacy-Preserving Edge Computing",
    }
];

export async function initializeDatabase() {
  const projectCount = await db.research_projects.count();
  if (projectCount > 0) return;

  console.log("Initializing high-fidelity demo data...");

  await db.research_projects.bulkAdd(DUMMY_PROJECTS as any);
  await db.industry_challenges.bulkAdd(DUMMY_CHALLENGES as any);
  await db.notifications.bulkAdd(DUMMY_NOTIFICATIONS as any);
  await db.colleges.bulkAdd(DUMMY_COLLEGES as any);
  await db.corporate_partners.bulkAdd(DUMMY_CORPORATES as any);

  // Add some students
  await db.student_profiles.bulkAdd(DUMMY_STUDENTS as any);

  // Add initial collaborations
  await db.collaboration_requests.bulkAdd(DUMMY_COLLABORATIONS as any);

  // Add IP disclosures
  await db.ip_disclosures.bulkAdd(DUMMY_IP_DISCLOSURES);

  // Add Negotiations
  await db.negotiations.bulkAdd([
    {
      collaboration_request_id: 1,
      status: "active",
      messages: [
        {
          id: "msg_1",
          sender: "Dr. Sarah Chen",
          message: "We need an additional 200k for quantum cleanroom access.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: "proposal"
        }
      ],
      created_at: new Date().toISOString()
    }
  ] as any);

  // Add Agreements
  await db.agreements.bulkAdd([
    {
      collaboration_request_id: 2,
      status: "signed",
      current_version: "v1.0.2",
      versions: [
        {
          version_number: "v1.0.2",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          created_by: "System Optimizer",
          content: "Full Collaboration Agreement for Sovereign AI Grid Management...",
          sections: [
            { id: "s1", title: "IP Ownership", text: "Joint ownership of neural mesh protocols..." }
          ]
        }
      ],
      college_signed_at: new Date(Date.now() - 43200000).toISOString(),
      corporate_signed_at: new Date(Date.now() - 86400000).toISOString(),
      college_approval_status: true,
      corporate_approval_status: true,
      college_signatory: "Dr. Jonathan Reed",
      corporate_signatory: "Elena Vance",
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ] as any);

  // Add Licensing Opportunities
  await db.licensing_opportunities.bulkAdd([
    {
      ip_disclosure_id: 1,
      title: "Self-Healing Grid Protocol (SHGP)",
      description: "Ready for licensing to tier-1 utility providers.",
      price_range: "$500k - $2M",
      license_type: "Exclusive / Worldwide",
      status: "available",
      created_at: new Date().toISOString()
    }
  ] as any);

  // Add Interview Requests
  await db.interview_requests.bulkAdd([
    {
      collaboration_request_id: 2,
      candidate_name: "Elena Vance",
      position: "Lead AI Researcher",
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      status: "scheduled",
      created_at: new Date().toISOString()
    }
  ] as any);

  // Add Licensing Inquiries
  await db.licensing_inquiries.bulkAdd([
    {
      licensing_opportunity_id: 1,
      inquirer_name: "Jane Smith",
      inquirer_email: "jane@apple.com",
      inquirer_organization: "Apple R&D",
      message: "Interested in the SHGP protocol for consumer devices.",
      status: "pending",
      created_at: new Date().toISOString()
    }
  ] as any);

  console.log("Seeding complete.");
}
