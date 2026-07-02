-- Schema Migration for CollabSync Pro
-- Execute this in the Supabase SQL Editor

-- Users and Sessions
CREATE TABLE public.user_sessions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    organization TEXT,
    organization_type TEXT CHECK (organization_type IN ('college', 'corporate', 'student')),
    role TEXT
);

-- Research Projects
CREATE TABLE public.research_projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    funding_needed NUMERIC,
    trl_level INTEGER,
    status TEXT,
    team_lead TEXT,
    team_size INTEGER,
    publications_count INTEGER,
    college_name TEXT,
    college_location TEXT,
    expertise_areas TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Industry Challenges
CREATE TABLE public.industry_challenges (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    budget_min NUMERIC,
    budget_max NUMERIC,
    timeline_months INTEGER,
    status TEXT,
    company_name TEXT,
    industry TEXT,
    company_location TEXT,
    required_expertise TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Colleges
CREATE TABLE public.colleges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    website TEXT,
    research_strengths TEXT,
    available_resources TEXT,
    success_rate NUMERIC,
    past_partnerships_count INTEGER,
    active_projects_count INTEGER
);

-- Collaboration Requests
CREATE TABLE public.collaboration_requests (
    id SERIAL PRIMARY KEY,
    status TEXT,
    research_project_id INTEGER REFERENCES public.research_projects(id),
    industry_challenge_id INTEGER REFERENCES public.industry_challenges(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE public.student_profiles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    college TEXT,
    skills TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active Projects
CREATE TABLE public.active_projects (
    id SERIAL PRIMARY KEY,
    collaboration_request_id INTEGER REFERENCES public.collaboration_requests(id),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IP Disclosures
CREATE TABLE public.ip_disclosures (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT,
    active_project_id INTEGER REFERENCES public.active_projects(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Negotiations
CREATE TABLE public.negotiations (
    id SERIAL PRIMARY KEY,
    collaboration_request_id INTEGER REFERENCES public.collaboration_requests(id),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agreements
CREATE TABLE public.agreements (
    id SERIAL PRIMARY KEY,
    collaboration_request_id INTEGER REFERENCES public.collaboration_requests(id),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_sessions(user_id),
    type TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Licensing Opportunities
CREATE TABLE public.licensing_opportunities (
    id SERIAL PRIMARY KEY,
    ip_disclosure_id INTEGER REFERENCES public.ip_disclosures(id),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow all for public reads (Demo purpose)
CREATE POLICY "Public Read" ON public.research_projects FOR SELECT USING (true);
CREATE POLICY "Public Read" ON public.industry_challenges FOR SELECT USING (true);

-- Enable realtime on feeds/notifications
alter publication supabase_realtime add table notifications;
