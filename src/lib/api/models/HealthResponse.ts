/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthResponse = {
    status?: string;
    timestamp?: string;
    services?: {
        bedrock?: string;
        opensearch?: string;
        dynamodb?: string;
        sqlite?: string;
    };
    version?: string;
};

