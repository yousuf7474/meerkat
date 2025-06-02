/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateAgentCardRequest = {
    /**
     * Agent name
     */
    name?: string;
    /**
     * Agent description
     */
    description?: string;
    /**
     * Allowed tool names
     */
    allowed_tools?: Array<string>;
    /**
     * Allowed source names
     */
    allowed_sources?: Array<string>;
    /**
     * Agent configuration
     */
    config?: Record<string, any>;
    /**
     * Agent tags
     */
    tags?: Array<string>;
    /**
     * Agent priority
     */
    priority?: number;
};

