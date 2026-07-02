import { z } from 'zod';

export const IntelligenceConfig = {
    matcher: {
        baseScore: 40,
        overlapWeight: 40,
        trlBonus: {
            minLevel: 4,
            maxLevel: 7,
            score: 10
        },
        geoBonus: 5,
        ratingBonus: {
            minRating: 4.5,
            score: 5
        },
        teamSizeBonus: {
            minSize: 8,
            score: 5
        },
        thresholds: {
            transformative: 85,
            experimental: 60
        }
    },
    riskEngine: {
        baseScore: 20,
        budgetProgressionGap: {
            threshold: 0.2,
            penalty: 25,
            impact: 8
        },
        engagementDecay: {
            minFrequency: 2,
            penalty: 20,
            impact: 6
        },
        timelineStagnation: {
            maxDays: 45,
            penalty: 15,
            impact: 5
        },
        sentimentFriction: {
            minScore: 0,
            penalty: 10,
            impact: 4
        },
        thresholds: {
            critical: 75,
            high: 50,
            medium: 35
        }
    }
};

// Zod schemas for input validation
export const ProjectSchema = z.object({
    id: z.string().optional(),
    expertise_areas: z.array(z.string()).default([]),
    trl_level: z.number().min(1).max(9).default(1),
    location: z.string().optional(),
    institution_rating: z.number().min(0).max(5).default(0),
    team_size: z.number().min(1).default(1),
    title: z.string().optional(),
    description: z.string().optional()
}).passthrough();

export const ChallengeSchema = z.object({
    id: z.string().optional(),
    required_expertise: z.array(z.string()).default([]),
    location: z.string().optional(),
    description: z.string().optional()
}).passthrough();

export const CollaborationMetricsSchema = z.object({
    daysSinceLastMilestone: z.number().min(0),
    budgetUtilization: z.number().min(0).max(1),
    milestoneProgress: z.number().min(0).max(1),
    communicationFrequency: z.number().min(0),
    sentimentScore: z.number().min(-1).max(1)
});
