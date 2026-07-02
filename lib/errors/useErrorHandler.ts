import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppError, ErrorCodes } from './AppError';

export function useErrorHandler() {
    const { toast } = useToast();

    const handleError = useCallback((error: unknown) => {
        let message = 'An unexpected error occurred';
        let title = 'Error';

        if (error instanceof AppError) {
            message = error.message;
            switch (error.code) {
                case ErrorCodes.DATABASE_ERROR:
                    title = 'Database Connection Issue';
                    break;
                case ErrorCodes.VALIDATION_ERROR:
                    title = 'Input Validation Error';
                    break;
                case ErrorCodes.UNAUTHORIZED:
                    title = 'Authorization Required';
                    break;
                case ErrorCodes.NOT_FOUND:
                    title = 'Item Not Found';
                    break;
                case ErrorCodes.NETWORK_ERROR:
                    title = 'Network Connection Lost';
                    break;
                default:
                    title = `${error.code} Error`;
            }
        } else if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }

        console.error('[ErrorHandler]', error);

        toast({
            title,
            description: message,
            variant: 'destructive',
        });
    }, [toast]);

    return { handleError };
}
