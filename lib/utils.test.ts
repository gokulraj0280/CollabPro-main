import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
    it('cn should merge class names', () => {
        expect(cn('a', 'b')).toBe('a b');
        expect(cn('a', { b: true })).toBe('a b');
        expect(cn('a', { b: false })).toBe('a');
    });
});
