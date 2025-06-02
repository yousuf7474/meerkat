/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MegaChatResponse = {
    /**
     * Session identifier
     */
    session_id?: string;
    /**
     * Synthesized final answer
     */
    final_answer?: string;
    agents_used?: Array<{
        id?: string;
        name?: string;
        success?: boolean;
        execution_time_ms?: number;
        tools_used?: Array<string>;
        sources_used?: Array<string>;
        error?: string | null;
    }>;
    tools_used?: Array<string>;
    sources_used?: Array<string>;
    execution_summary?: {
        planning_time_ms?: number;
        execution_time_ms?: number;
        synthesis_time_ms?: number;
        total_candidates?: number;
        successful_agents?: number;
        failed_agents?: number;
        token_count?: number;
        truncated?: boolean;
    };
    total_time_ms?: number;
};

