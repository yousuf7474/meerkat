/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SearchAgentCardsRequest = {
    /**
     * Search query for agent matching
     */
    query: string;
    /**
     * Number of results to return
     */
    'k'?: number;
    /**
     * Minimum similarity score
     */
    score_threshold?: number;
    /**
     * Filter by status
     */
    status_filter?: SearchAgentCardsRequest.status_filter;
};
export namespace SearchAgentCardsRequest {
    /**
     * Filter by status
     */
    export enum status_filter {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
    }
}

