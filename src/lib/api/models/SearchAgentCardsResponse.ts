/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SearchAgentCardsResponse = {
    candidates?: Array<{
        id?: string;
        name?: string;
        description?: string;
        score?: number;
        allowed_tools?: Array<string>;
        allowed_sources?: Array<string>;
        priority?: number;
    }>;
    total_found?: number;
    query?: string;
};

