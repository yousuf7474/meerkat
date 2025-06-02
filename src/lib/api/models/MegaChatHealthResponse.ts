/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type MegaChatHealthResponse = {
    status?: string;
    services?: {
        agent_planner?: {
            status?: string;
            agents_available?: number;
        };
        agent_executor?: {
            status?: string;
            max_concurrent?: number;
        };
        synthesiser?: {
            status?: string;
            strategies?: Array<string>;
        };
        tool_registry?: {
            status?: string;
            tools_available?: number;
        };
        source_registry?: {
            status?: string;
            sources_available?: number;
        };
    };
    active_sessions?: number;
    total_executions?: number;
};

