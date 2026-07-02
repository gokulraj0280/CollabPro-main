import { User } from './store';

/**
 * Maps the raw user role or organization type to a professional display label.
 */
export function getRoleLabel(user: User | null): string {
    if (!user) return 'Guest';

    // Specific role mapping
    const roleMappings: Record<string, string> = {
        'admin': 'System Administrator',
        'faculty': 'Faculty Coordinator',
        'student': 'Project Contributor',
        'corporate': 'Industry Partner',
        'researcher': 'Lead Researcher',
        'manager': 'Project Manager',
        'director': 'Research Director',
        'pi': 'Principal Investigator',
    };

    // Check role first (case insensitive)
    const roleKey = user.role.toLowerCase();
    if (roleMappings[roleKey]) return roleMappings[roleKey];

    // Fallback to organization type if role is not mapped
    switch (user.organization_type) {
        case 'college':
            return 'Academic Partner';
        case 'corporate':
            return 'Industry Partner';
        case 'student':
            return 'Student Researcher';
        default:
            return user.role || 'Partner';
    }
}

/**
 * Extracts initials from a name string.
 */
export function getInitials(name: string | undefined): string {
    if (!name) return '??';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '??';

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
