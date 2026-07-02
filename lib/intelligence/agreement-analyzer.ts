/**
 * AI Agreement Risk Analyzer
 * 
 * Performs categorical risk analysis on collaboration agreement sections.
 */

export type RiskCategory = 'Legal' | 'Financial' | 'Intellectual Property' | 'Operational' | 'Compliance';

export interface SectionRisk {
    category: RiskCategory;
    score: number; // 0 to 10
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    label: string;
    description: string;
    mitigation: string;
}

export interface AnalysisResult {
    sections: Record<string, SectionRisk[]>;
    overallRiskScore: number;
    topRisks: SectionRisk[];
}

/**
 * Analyzes a text block for potential risks based on keywords and patterns.
 */
export function analyzeSectionRisk(_sectionId: string, title: string, content: string): SectionRisk[] {
    const risks: SectionRisk[] = [];
    const text = content.toLowerCase();

    // Log context for debugging (simulating usage of sectionId)
    // console.log(`Analyzing section ${sectionId}: ${title}`);

    // 1. IP Risks
    if (title.toLowerCase().includes('intellectual property') || title.toLowerCase().includes('ip')) {
        if (!text.includes('background ip') || !text.includes('foreground ip')) {
            risks.push({
                category: 'Intellectual Property',
                score: 7,
                severity: 'High',
                label: 'Ambiguous IP Definitions',
                description: 'The agreement lacks clear distinction between Background and Foreground IP.',
                mitigation: 'Explicitly define IP ownership for pre-existing and newly created assets.'
            });
        }
        if (text.includes('irrevocable') && text.includes('exclusive')) {
            risks.push({
                category: 'Intellectual Property',
                score: 8,
                severity: 'High',
                label: 'Aggressive IP Transfer',
                description: 'Clause demands exclusive, irrevocable transfer of ownership which may restrict future research.',
                mitigation: 'Negotiate for non-exclusive licenses for internal research purposes.'
            });
        }
    }

    // 2. Financial Risks
    if (text.includes('payment') || text.includes('fee') || text.includes('budget')) {
        if (text.includes('within 90 days') || text.includes('net 90')) {
            risks.push({
                category: 'Financial',
                score: 5,
                severity: 'Medium',
                label: 'Extended Payment Terms',
                description: 'Payment window exceeds industry standard (30-45 days), impacting cash flow.',
                mitigation: 'Request Net 30 or Net 45 payment terms.'
            });
        }
        if (text.includes(' uncapped') && text.includes('liability')) {
            risks.push({
                category: 'Financial',
                score: 9,
                severity: 'Critical',
                label: 'Uncapped Liability',
                description: 'Terms suggest unlimited financial exposure in case of dispute.',
                mitigation: 'Propose a liability cap tied to the total contract value.'
            });
        }
    }

    // 3. Operational Risks
    if (text.includes('audit') && text.includes('any time')) {
        risks.push({
            category: 'Operational',
            score: 4,
            severity: 'Low',
            label: 'Intrusive Audit Clause',
            description: 'Audit rights are too broad and could disrupt laboratory operations.',
            mitigation: 'Limit audits to once per year with 30-day prior notice.'
        });
    }

    // 4. Compliance/Legal
    if (text.includes('terminate') && text.includes('without cause')) {
        risks.push({
            category: 'Legal',
            score: 6,
            severity: 'Medium',
            label: 'Asymmetric Termination',
            description: 'Partner can terminate the project without cause, risking sunk research costs.',
            mitigation: 'Add a "Termination for Convenience" fee to cover wind-down costs.'
        });
    }

    return risks;
}

export function calculateOverallRisk(allRisks: SectionRisk[]): number {
    if (allRisks.length === 0) return 0;
    const totalScore = allRisks.reduce((sum, r) => sum + r.score, 0);
    return Math.min(100, Math.round((totalScore / (allRisks.length * 10)) * 100));
}
