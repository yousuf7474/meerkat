/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateAgentCardRequest = {
    /**
     * Agent name (unique)
     */
    name: string;
    /**
     * Agent description and specialization
     */
    description: string;
    /**
     * List of tool names agent can use
     */
    allowed_tools?: Array<string>;
    /**
     * List of data sources agent can access
     */
    allowed_sources?: Array<string>;
    /**
     * Agent configuration (model, temperature, etc.)
     */
    config?: Record<string, any>;
    /**
     * Tags for categorization
     */
    tags?: Array<string>;
    /**
     * Agent priority
     */
    priority?: number;
    /**
     * Creator user ID
     */
    created_by?: string;
};

