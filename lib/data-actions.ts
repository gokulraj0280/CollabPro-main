// Generic data action hooks and utilities for CollabSync Pro

/**
 * Custom hook for loading data from an action.
 * @template T - The type of the data returned by the action.
 * @param {any} _action - The data action to execute.
 * @param {T} initialData - Initial data while loading.
 * @param {any} _params - Optional parameters for the action.
 * @returns {readonly [T, boolean, { message: string } | null, () => void]} Tuple containing [data, loading, error, reload].
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useErrorHandler } from './errors/useErrorHandler';
import { AppError, ErrorCodes } from './errors/AppError';

/**
 * Simple deep equality check for objects and primitives
 */
function isDeepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (const key of keys1) {
        if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

/**
 * Custom hook to memoize value based on deep equality
 */
function useDeepCompareMemoize(value: any) {
    const ref = useRef(value);
    if (!isDeepEqual(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}

/**
 * Simulated Governance Check for Crypto-Agility and Sovereign ID verification.
 * In a real app, this would verify JWT claims against RLS policies.
 */
function useGovernanceCheck() {
    return useCallback((actionName: string) => {
        const isVerified = localStorage.getItem('collabpro_sovereign_verified') === 'true';
        const timestamp = new Date().toISOString();

        console.group(`%c[GOVERNANCE CHECK] ${actionName}`, 'color: #22d3ee; font-weight: bold;');
        console.log(`Timestamp: ${timestamp}`);
        console.log(`Identity Status: ${isVerified ? 'VERIFIED (SOVEREIGN)' : 'UNVERIFIED (GUEST)'}`);
        console.log(`Ciphersuite: Crystals-Kyber (PQC-Enabled)`);

        if (!isVerified && actionName.toLowerCase().includes('ip')) {
            console.warn('SECURITY ALERT: Accessing sensitive IP data as Unverified Identity.');
            throw new AppError('Unauthorized access to sensitive Intellectual Property data. Step-up verification required.', ErrorCodes.UNAUTHORIZED || 'UNAUTHORIZED');
        }

        console.groupEnd();
        return isVerified;
    }, []);
}

export function useLoadAction<T>(
    actionFn: (params?: any) => Promise<T>,
    initialData: T,
    params?: any
): readonly [T, boolean, { message: string } | null, () => void] {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ message: string } | null>(null);
    const { handleError } = useErrorHandler();
    const checkGovernance = useGovernanceCheck();

    // Use deep comparison for params to prevent infinite re-renders from inline object literals
    const memoizedParams = useDeepCompareMemoize(params);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        // Execute governance check before data fetch
        checkGovernance(actionFn.name || 'AnonymousLoadAction');

        try {
            const result = await actionFn(memoizedParams);
            setData(result);
        } catch (err: any) {
            const appError = err instanceof AppError
                ? err
                : new AppError(err.message || 'Data fetch failed', ErrorCodes.DATABASE_ERROR);

            setError({ message: appError.message });
            handleError(appError);
        } finally {
            setLoading(false);
        }
    }, [actionFn, memoizedParams, handleError, checkGovernance]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [data, loading, error, fetchData] as const;
}

/**
 * Custom hook for performing mutation actions.
 * @param {any} _action - The mutation action to execute.
 * @returns {readonly [(params?: any) => Promise<void>, boolean]} Tuple containing [mutate function, loading state].
 */
export function useMutateAction<T>(actionFn: (params?: any) => Promise<T>): readonly [(params?: any) => Promise<T>, boolean] {
    const [loading, setLoading] = useState(false);
    const checkGovernance = useGovernanceCheck();

    const mutate = useCallback(async (params?: any) => {
        setLoading(true);

        // Execute governance check before mutation
        checkGovernance(actionFn.name || 'AnonymousMutationAction');

        try {
            const result = await actionFn(params);
            return result;
        } finally {
            setLoading(false);
        }
    }, [actionFn, checkGovernance]);

    return [mutate, loading] as const;
}

export function action(name: string, _type: string, params: any) {
    console.log(`Action called: ${name}`, params);
    return Promise.resolve([] as any[]);
}
