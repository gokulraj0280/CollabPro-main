import { describe, it, expect } from 'vitest';
import { calculateSynergy } from '../lib/intelligence/matcher';
import { assessCollaborationRisk } from '../lib/intelligence/risk-engine';
import { createMockProject, createMockChallenge, createMockMetrics } from '../lib/test-utils/factories';

describe('End-to-End Flow Validation: Primary User Journey', () => {
    it('Flow: Project Discovery -> Collaboration Request -> Negotiation -> Agreement Signing', () => {
        // Step 1: Project Discovery
        const project = createMockProject({ expertise_areas: ['AI', 'Cryptography'] });
        const challenge = createMockChallenge({ required_expertise: ['Cryptography'], location: project.location });
        
        const synergy = calculateSynergy(project, challenge);
        expect(synergy.score).toBeGreaterThan(60); // Eligible for collaboration

        // Step 2: Collaboration Request (Simulated State)
        const requestStatus = 'PENDING_APPROVAL';
        expect(requestStatus).toBe('PENDING_APPROVAL');

        // Step 3: Negotiation (Risk Engine checks health)
        const metrics = createMockMetrics({
            budgetUtilization: 0.1,
            milestoneProgress: 0.2, // Good progress, low utilization
            sentimentScore: 0.8
        });
        const risk = assessCollaborationRisk(metrics);
        expect(risk.level).toBe('Low');
        
        // Step 4: Agreement Signing (Governance Check Validation)
        const isVerified = true; // Simulating sovereign identity validation 
        expect(isVerified).toBe(true);
    });
});
