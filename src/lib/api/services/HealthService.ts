/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthResponse } from '../models/HealthResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthService {
    /**
     * API Root
     * Get API information and available endpoints
     * @returns any API information
     * @throws ApiError
     */
    public static get(): CancelablePromise<{
        message?: string;
        version?: string;
        status?: string;
        features?: {
            rag?: boolean;
            multi_agent?: boolean;
            streaming?: boolean;
            websocket?: boolean;
        };
        endpoints?: {
            health?: string;
            docs?: string;
            redoc?: string;
            openapi?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Health Check
     * Check API health and connectivity to all services
     * @returns HealthResponse Health status
     * @throws ApiError
     */
    public static getHealth(): CancelablePromise<HealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
}
