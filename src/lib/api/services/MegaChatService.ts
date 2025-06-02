/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MegaChatHealthResponse } from '../models/MegaChatHealthResponse';
import type { MegaChatRequest } from '../models/MegaChatRequest';
import type { MegaChatResponse } from '../models/MegaChatResponse';
import type { SessionStatusResponse } from '../models/SessionStatusResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MegaChatService {
    /**
     * Execute Mega Chat
     * Run complex queries using multiple specialized agents with automatic selection and synthesis
     * @param requestBody
     * @returns MegaChatResponse Mega chat response
     * @throws ApiError
     */
    public static postV1MegaChat(
        requestBody?: MegaChatRequest,
    ): CancelablePromise<MegaChatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/mega_chat/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters`,
                503: `No agents available`,
            },
        });
    }
    /**
     * Mega Chat Health Check
     * Check the health and status of the multi-agent system
     * @returns MegaChatHealthResponse Multi-agent system health status
     * @throws ApiError
     */
    public static getV1MegaChatHealth(): CancelablePromise<MegaChatHealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/mega_chat/health',
        });
    }
    /**
     * Session Status
     * Get status of a specific mega chat session
     * @param sessionId Mega chat session ID
     * @returns SessionStatusResponse Session status
     * @throws ApiError
     */
    public static getV1MegaChatSessionsStatus(
        sessionId: string,
    ): CancelablePromise<SessionStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/mega_chat/sessions/{session_id}/status',
            path: {
                'session_id': sessionId,
            },
            errors: {
                404: `Session not found`,
            },
        });
    }
}
