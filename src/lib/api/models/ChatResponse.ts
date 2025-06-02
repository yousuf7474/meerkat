/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatResponse = {
    /**
     * AI response
     */
    response?: string;
    session_id?: string;
    message_id?: string;
    sources?: Array<{
        content?: string;
        metadata?: Record<string, any>;
    }>;
    approach_used?: string;
    processing_time_ms?: number;
};

