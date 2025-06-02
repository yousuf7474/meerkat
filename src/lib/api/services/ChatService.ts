/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChatRequest } from '../models/ChatRequest';
import type { ChatResponse } from '../models/ChatResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * Chat with RAG
     * Chat with RAG pipeline and conversation management
     * @param requestBody
     * @returns ChatResponse Chat response
     * @throws ApiError
     */
    public static postV1Chat(
        requestBody?: ChatRequest,
    ): CancelablePromise<ChatResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/chat/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters`,
            },
        });
    }
}
