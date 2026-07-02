import { describe, it, expect } from 'vitest';
import { calculateSynergy } from './matcher';
import { createMockProject, createMockChallenge } from '../test-utils/factories';

describe('calculateSynergy', () => {
    it('returns a high score for perfectly aligned project and challenge', () => {
        const project = createMockProject({
            expertise_areas: ['AI', 'Quantum Computing'],
            trl_level: 5,
            institution_rating: 5,
            team_size: 10,
            location: 'Remote'
        });
        const challenge = createMockChallenge({
            required_expertise: ['AI', 'Quantum Computing'],
            location: 'Remote'
        });

        const result = calculateSynergy(project, challenge);
        expect(result.score).toBeGreaterThan(80);
        expect(result.strategicFit).toBe('Transformative');
        expect(result.technicalOverlap).toContain('AI');
    });

    it('returns a lower score and Experimental fit with zero overlap', () => {
        const project = createMockProject({ 
            expertise_areas: ['Biology'],
            trl_level: 1, 
            institution_rating: 3, 
            team_size: 2, 
            location: 'Remote' 
        });
        const challenge = createMockChallenge({ 
            required_expertise: ['Quantum Computing'],
            location: 'Office' 
        });
        
        const result = calculateSynergy(project, challenge);
        expect(result.technicalOverlap.length).toBe(0);
        expect(result.strategicFit).toBe('Experimental');
    });

    it('identifies partial semantic overlap', () => {
        const project = createMockProject({ expertise_areas: ['Machine Learning', 'Data Science'] });
        const challenge = createMockChallenge({ required_expertise: ['Learning', 'Science'] });
        const result = calculateSynergy(project, challenge);
        expect(result.technicalOverlap.length).toBeGreaterThan(0);
    });
    
    it('throws error on missing fields safely caught by zod (optional if testing validation)', () => {
        const project = { expertise_areas: ['Data'], trl_level: 0 }; // INVALID TRL
        const challenge = createMockChallenge();
        expect(() => calculateSynergy(project, challenge)).toThrow();
    });
});
