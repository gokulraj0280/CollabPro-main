// Seed the IndexedDB database with initial test data

import { db } from './db';

const defaultTestData = {
    projects: [],
    challenges: [],
    colleges: [
        {
            name: "Indian Institute of Technology, Bombay",
            location: "Mumbai, Maharashtra",
            website: "www.iitb.ac.in",
            research_strengths: "AI, Robotics, Nanotechnology",
            available_resources: "Supercomputing cluster, Nanofabrication lab",
            success_rate: 95,
            past_partnerships_count: 120,
            active_projects_count: 15
        },
        {
            name: "Indian Institute of Science",
            location: "Bengaluru, Karnataka",
            website: "www.iisc.ac.in",
            research_strengths: "Biotechnology, Aerospace, Materials Science",
            available_resources: "Wind tunnel, Bio-imaging center",
            success_rate: 98,
            past_partnerships_count: 150,
            active_projects_count: 25
        },
        {
            name: "Delhi Technological University",
            location: "New Delhi, Delhi",
            website: "dtu.ac.in",
            research_strengths: "Renewable Energy, Automotive Engineering",
            available_resources: "Solar research center, EV lab",
            success_rate: 88,
            past_partnerships_count: 80,
            active_projects_count: 10
        }
    ],
    notifications: [],
    student_profiles: [],
    licensing_opportunities: [],
};

export async function seedDatabase() {
    try {
        // Check if database is already seeded
        const projectCount = await db.research_projects.count();

        if (projectCount > 0) {
            console.log('Database already seeded');
            return;
        }

        console.log('Seeding database with initial data...');

        // Seed research projects
        await db.research_projects.bulkAdd(defaultTestData.projects);

        // Seed industry challenges
        await db.industry_challenges.bulkAdd(defaultTestData.challenges);

        // Seed colleges
        await db.colleges.bulkAdd(defaultTestData.colleges);

        // Seed notifications
        await db.notifications.bulkAdd(defaultTestData.notifications);

        // Seed student profiles
        if (defaultTestData.student_profiles) {
            await db.student_profiles.bulkAdd(defaultTestData.student_profiles);
        }

        // Seed licensing opportunities
        if (defaultTestData.licensing_opportunities) {
            await db.licensing_opportunities.bulkAdd(defaultTestData.licensing_opportunities);
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

export async function resetDatabase() {
    try {
        await db.delete();
        window.location.reload();
    } catch (error) {
        console.error('Error resetting database:', error);
    }
}
