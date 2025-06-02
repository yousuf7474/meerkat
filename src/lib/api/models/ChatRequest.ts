/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ChatRequest = {
    /**
     * User message
     */
    message: string;
    /**
     * Session identifier
     */
    session_id?: string;
    /**
     * Chat approach
     */
    approach?: ChatRequest.approach;
    /**
     * Enable streaming response
     */
    stream?: boolean;
    /**
     * Include source references
     */
    include_sources?: boolean;
};
export namespace ChatRequest {
    /**
     * Chat approach
     */
    export enum approach {
        COMPREHENSIVE = 'comprehensive',
        FOCUSED = 'focused',
        CREATIVE = 'creative',
    }
}

