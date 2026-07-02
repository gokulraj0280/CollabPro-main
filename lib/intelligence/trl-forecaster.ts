/**
 * Predictive TRL (Technology Readiness Level) Forecaster
 * 
 * Uses survival analysis heuristics to estimate the time required for a 
 * research project to transition to the next TRL level.
 */

export interface TRLPrediction {
    currentTrl: number;
    estimatedMonthsToNext: number;
    confidenceScore: number; // 0.0 to 1.0
    stallRisk: number; // 0.0 to 1.0
    bottlenecks: string[];
}

export interface ProjectTrlData {
    trl_level: number;
    team_size: number;
    funding_allocated: number;
    budget_utilized: number;
    trl_history?: { trl: number; date: string }[];
    project_type: 'software' | 'hardware' | 'system' | 'process';
}

/**
 * Predicts the transition probability and timeline for a project's TRL level.
 */
export function predictTRLTransition(project: ProjectTrlData): TRLPrediction {
    const { trl_level: currentTrl, team_size, funding_allocated, budget_utilized, project_type } = project;

    // Base transition times (in months) per TRL level transition
    // Lower TRLs (1-3) usually move faster than higher TRLs (4-7)
    const baseTransitionMap: Record<number, number> = {
        1: 4, 2: 6, 3: 8, 4: 12, 5: 14, 6: 18, 7: 24, 8: 12
    };

    let estimatedMonths = baseTransitionMap[currentTrl] || 12;

    // Factors affecting transition speed

    // 1. Team Size Impact (Diminishing returns)
    const teamImpact = Math.max(0.7, 1.5 - (team_size / 10));
    estimatedMonths *= teamImpact;

    // 2. Budget Velocity
    const burnRate = budget_utilized / funding_allocated;
    if (burnRate > 0.8 && currentTrl < 7) {
        estimatedMonths *= 1.3; // Stalling due to low remaining funds
    }

    // 3. Project Type Complexity
    const typeComplexity: Record<string, number> = {
        'software': 0.8, // Faster iterations
        'process': 1.0,
        'system': 1.2,
        'hardware': 1.4 // Slower cycles
    };
    estimatedMonths *= (typeComplexity[project_type] || 1.0);

    // Calculate Stall Risk
    let stallRisk = 0.1;
    const bottlenecks: string[] = [];

    if (burnRate > 0.9) {
        stallRisk += 0.4;
        bottlenecks.push('Budget exhaustion');
    }
    if (team_size < 3) {
        stallRisk += 0.2;
        bottlenecks.push('Critical staffing shortage');
    }
    if (currentTrl >= 4 && currentTrl <= 6) {
        stallRisk += 0.15; // The "Valley of Death" in TRL progression
        bottlenecks.push('Transition to prototyping complexity');
    }

    return {
        currentTrl,
        estimatedMonthsToNext: Math.round(estimatedMonths),
        confidenceScore: Math.round((0.85 - (stallRisk * 0.5)) * 100) / 100,
        stallRisk: Math.min(0.95, stallRisk),
        bottlenecks: bottlenecks.length > 0 ? bottlenecks : ['No significant bottlenecks detected']
    };
}
