import { IntelligenceConfig, ProjectSchema, ChallengeSchema } from './config';

export interface MatchSynergy {
    score: number;
    reasoning: string;
    technicalOverlap: string[];
    strategicFit: 'Transformative' | 'Standard' | 'Experimental';
}

function calculateSemanticOverlap(projectExpertise: string[], challengeExpertise: string[]): string[] {
    // Simulated semantic NLP overlap for nuanced synergy
    const pStr = projectExpertise.map(x => x.toLowerCase());
    const cStr = challengeExpertise.map(x => x.toLowerCase());
    
    // Exact matches
    const exactMatches = pStr.filter(x => cStr.includes(x));
    
    // Semantic/partial matches (simulate stemming/synonyms)
    const partialMatches = pStr.filter(p => cStr.some(c => c.includes(p) || p.includes(c)) && !exactMatches.includes(p));
    
    // Combine but capitalize correctly based on original
    return [...exactMatches, ...partialMatches].map(m => projectExpertise.find(p => p.toLowerCase() === m) || m);
}

export function calculateSynergy(rawProject: any, rawChallenge: any): MatchSynergy {
    // Validate inputs using Zod
    const project = ProjectSchema.parse(rawProject);
    const challenge = ChallengeSchema.parse(rawChallenge);

    const config = IntelligenceConfig.matcher;

    // 1. Calculate Technical Overlap
    const overlap = calculateSemanticOverlap(project.expertise_areas, challenge.required_expertise);

    // 2. Base Score Calculation
    let baseScore = config.baseScore;

    const overlapPercentage = challenge.required_expertise.length > 0
        ? (overlap.length / challenge.required_expertise.length)
        : 0;

    baseScore += Math.round(overlapPercentage * config.overlapWeight);

    // 3. Strategic Modifiers
    if (project.trl_level >= config.trlBonus.minLevel && project.trl_level <= config.trlBonus.maxLevel) {
        baseScore += config.trlBonus.score;
    }

    if (project.location === challenge.location) {
        baseScore += config.geoBonus;
    }

    if (project.institution_rating > config.ratingBonus.minRating) {
        baseScore += config.ratingBonus.score;
    }

    if (project.team_size > config.teamSizeBonus.minSize) {
        baseScore += config.teamSizeBonus.score;
    }

    // 4. Strategic Fit Classification
    let strategicFit: 'Transformative' | 'Standard' | 'Experimental' = 'Standard';
    if (baseScore > config.thresholds.transformative) strategicFit = 'Transformative';
    else if (baseScore < config.thresholds.experimental) strategicFit = 'Experimental';

    let reasoning = '';
    if (overlap.length > 0) {
        reasoning = `High alignment in key technical domains: ${overlap.join(', ')}. `;
        if (strategicFit === 'Transformative') {
            reasoning += `This partnership represents a rare synergy of high-TRL research and specific industrial needs, with potential for rapid commercialization.`;
        } else {
            reasoning += `The research team's proficiency aligns well with the challenge's core requirements, supported by a strong institutional success rate.`;
        }
    } else {
        reasoning = `While direct expertise overlap is emerging, the methodological approach and geographic synergy offer a novel perspective on this industrial challenge.`;
    }

    return {
        score: Math.min(100, baseScore),
        reasoning,
        technicalOverlap: overlap,
        strategicFit
    };
}
