import { IntelligenceConfig, CollaborationMetricsSchema } from './config';

export interface RiskAssessment {
    score: number; // 0 to 100
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: {
        label: string,
        impact: number; // -10 to +10
        description: string;
    }[];
    recommendation: string;
}

export interface CollaborationMetrics {
    daysSinceLastMilestone: number;
    budgetUtilization: number; // ratio 0.0 to 1.0
    milestoneProgress: number; // ratio 0.0 to 1.0
    communicationFrequency: number; // messages per week
    sentimentScore: number; // -1.0 to 1.0
}

export function assessCollaborationRisk(rawMetrics: any): RiskAssessment {
    const metrics = CollaborationMetricsSchema.parse(rawMetrics);
    const config = IntelligenceConfig.riskEngine;
    
    const {
        daysSinceLastMilestone,
        budgetUtilization,
        milestoneProgress,
        communicationFrequency,
        sentimentScore
    } = metrics;

    let riskScore = config.baseScore;
    const factors: RiskAssessment['factors'] = [];

    // 1. Budget vs Progress Alignment
    const progressionGap = budgetUtilization - milestoneProgress;
    if (progressionGap > config.budgetProgressionGap.threshold) {
        riskScore += config.budgetProgressionGap.penalty;
        factors.push({
            label: 'Budget Overrun',
            impact: config.budgetProgressionGap.impact,
            description: `Budget consumption (${(budgetUtilization * 100).toFixed(0)}%) is significantly outpacing milestone progress (${(milestoneProgress * 100).toFixed(0)}%).`
        });
    }

    // 2. Engagement Decay
    if (communicationFrequency < config.engagementDecay.minFrequency) {
        riskScore += config.engagementDecay.penalty;
        factors.push({
            label: 'Engagement Decay',
            impact: config.engagementDecay.impact,
            description: `Communication frequency has dropped below the critical threshold of ${config.engagementDecay.minFrequency} updates per week.`
        });
    }

    // 3. Timeline Stagnation
    if (daysSinceLastMilestone > config.timelineStagnation.maxDays) {
        riskScore += config.timelineStagnation.penalty;
        factors.push({
            label: 'Timeline Stagnation',
            impact: config.timelineStagnation.impact,
            description: `No milestone updates or completions recorded in the last ${daysSinceLastMilestone} days.`
        });
    }

    // 4. Sentiment Analysis
    if (sentimentScore < config.sentimentFriction.minScore) {
        riskScore += config.sentimentFriction.penalty;
        factors.push({
            label: 'Interpersonal Friction',
            impact: config.sentimentFriction.impact,
            description: 'AI sentiment analysis of negotiation and workspace chat indicates rising friction.'
        });
    }

    // Determine Level
    let level: RiskAssessment['level'] = 'Low';
    if (riskScore > config.thresholds.critical) level = 'Critical';
    else if (riskScore > config.thresholds.high) level = 'High';
    else if (riskScore > config.thresholds.medium) level = 'Medium';

    // Recommendation logic
    let recommendation = 'Collaboration is healthy. Continue with current roadmap.';
    if (level === 'Critical') {
        recommendation = 'IMMEDIATE MEDIATION REQUIRED. Schedule a strategic alignment meeting within 48 hours to prevent total partnership failure.';
    } else if (level === 'High') {
        recommendation = 'Adjust project scope or increase team allocation to address the budget-progress gap.';
    } else if (level === 'Medium') {
        recommendation = 'Monitor engagement closely. Consider a brief status sync to re-align on near-term deliverables.';
    }

    return {
        score: Math.min(100, Math.max(0, riskScore)),
        level,
        factors,
        recommendation
    };
}
