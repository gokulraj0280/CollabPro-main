/**
 * Quantum-Ready Metrics Engine
 * 
 * Generates futuristic KPIs for industrial-academic collaborations.
 */

export interface QuantumMetrics {
    cryptoAgility: number; // 0-100
    entanglementFactor: number; // 0-1.0
    innovationVelocity: number; // 0-10
    resourceResilience: number; // 0-100
    readinessScore: number; // 0-100
}

/**
 * Simulates real-time quantum readiness metrics based on project state.
 */
export function calculateQuantumReadiness(projectData: any): QuantumMetrics {
    // Weighted deterministic simulation for demo purposes
    const teamSize = projectData.team_size || 5;
    const funding = projectData.funding_allocated || 100000;

    const cryptoAgility = Math.min(100, 40 + (teamSize * 2));
    const entanglementFactor = Math.min(1.0, 0.3 + (funding / 500000));
    const innovationVelocity = Math.min(10, 2 + (teamSize / 2));
    const resourceResilience = Math.min(100, 60 + (funding / 10000));

    const readinessScore = Math.round(
        (cryptoAgility * 0.3) +
        (entanglementFactor * 100 * 0.3) +
        (innovationVelocity * 10 * 0.2) +
        (resourceResilience * 0.2)
    );

    return {
        cryptoAgility,
        entanglementFactor,
        innovationVelocity,
        resourceResilience,
        readinessScore
    };
}

export function generateLivePulseData() {
    const types = ['system', 'alert', 'match', 'quantum'];
    const messages = [
        "Quantum-Safe tunnel established with primary node.",
        "Neural sync efficiency reached 99.4%.",
        "Detected unauthorized access attempt from legacy IP (blocked).",
        "Probabilistic outcome for Project-Alpha favored by 82%.",
        "Sovereign data-mesh re-indexing complete.",
        "Entanglement detected between parallel research tracks."
    ];

    return {
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.ms'
    };
}
