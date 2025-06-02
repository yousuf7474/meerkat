/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ToolListResponse = {
    tools?: Array<{
        name?: string;
        kind?: string;
        description?: string;
        input_schema?: Record<string, any>;
        output_schema?: Record<string, any>;
        tags?: Array<string>;
        timeout_seconds?: number;
    }>;
    total_count?: number;
};

