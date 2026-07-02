// lib/test-utils/factories.ts

export const createMockProject = (overrides = {}) => ({
    id: `proj_${Math.random().toString(36).substr(2, 9)}`,
    title: 'Quantum Materials Research',
    description: 'Advanced research in quantum-resistant materials.',
    expertise_areas: ['Quantum Physics', 'Materials Science', 'Cryptography'],
    trl_level: 5,
    location: 'Zurich, CH',
    institution_rating: 4.8,
    team_size: 12,
    ...overrides
});

export const createMockChallenge = (overrides = {}) => ({
    id: `chal_${Math.random().toString(36).substr(2, 9)}`,
    title: 'Secure IoT Communications',
    description: 'Need a way to secure edge devices with quantum-safe methods.',
    required_expertise: ['Cryptography', 'IoT', 'Materials Science'],
    location: 'Zurich, CH',
    ...overrides
});

export const createMockMetrics = (overrides = {}) => ({
    daysSinceLastMilestone: 10,
    budgetUtilization: 0.4,
    milestoneProgress: 0.45,
    communicationFrequency: 5,
    sentimentScore: 0.8,
    ...overrides
});
