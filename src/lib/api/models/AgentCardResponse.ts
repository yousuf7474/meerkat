/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AgentCardResponse = {
    /**
     * Agent card ID
     */
    id?: string;
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
     * Agent status
     */
    status?: AgentCardResponse.status;
    created_at?: string;
    updated_at?: string;
    /**
     * Creator user ID
     */
    created_by?: string;
    /**
     * Agent tags
     */
    tags?: Array<string>;
    /**
     * Agent priority
     */
    priority?: number;
    /**
     * Additional metadata
     */
    metadata?: Record<string, any>;
};
export namespace AgentCardResponse {
    /**
     * Agent status
     */
    export enum status {
        ACTIVE = 'active',
        INACTIVE = 'inactive',
        DRAFT = 'draft',
    }
}

