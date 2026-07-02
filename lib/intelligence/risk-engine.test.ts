import { describe, it, expect } from 'vitest';
import { assessCollaborationRisk } from './risk-engine';
import { createMockMetrics } from '../test-utils/factories';

describe('assessCollaborationRisk', () => {
    it('identifies healthy collaboration out of the box', () => {
        const metrics = createMockMetrics();
        const result = assessCollaborationRisk(metrics);
        expect(result.level).toBe('Low');
        expect(result.factors).toHaveLength(0);
    });

    it('flags critical risk when budget heavily outpaces progress and communication decays', () => {
        const metrics = createMockMetrics({
            budgetUtilization: 0.9,
            milestoneProgress: 0.3,
            communicationFrequency: 1,
            daysSinceLastMilestone: 50,
            sentimentScore: -0.5
        });
        
        const result = assessCollaborationRisk(metrics);
        expect(result.level).toBe('Critical');
        expect(result.factors.length).toBe(4);
        expect(result.score).toBeGreaterThan(75);
    });
    
    it('throws error when budgetUtilization out of range', () => {
        const metrics = createMockMetrics({
            budgetUtilization: 1.5 // > 1
        });
        expect(() => assessCollaborationRisk(metrics)).toThrow();
    });
});
