/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MegaChatRequest = {
    /**
     * User query to process
     */
    query: string;
    /**
     * Specific agent IDs to use (null for auto-selection)
     */
    agent_ids?: Array<string> | null;
    /**
     * Enable streaming response
     */
    stream?: boolean;
    /**
     * Maximum agents to use
     */
    max_agents?: number;
    /**
     * Selection strategy
     */
    strategy?: MegaChatRequest.strategy;
    /**
     * Synthesis strategy
     */
    synthesis_strategy?: MegaChatRequest.synthesis_strategy;
};
export namespace MegaChatRequest {
    /**
     * Selection strategy
     */
    export enum strategy {
        AUTO = 'auto',
        SINGLE_BEST = 'single_best',
        PARALLEL = 'parallel',
    }
    /**
     * Synthesis strategy
     */
    export enum synthesis_strategy {
        AUTO = 'auto',
        MERGE = 'merge',
        BEST = 'best',
        CONSENSUS = 'consensus',
    }
}

