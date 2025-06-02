/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SessionStatusResponse = {
    session_id?: string;
    status?: SessionStatusResponse.status;
    created_at?: string;
    completed_at?: string | null;
    agents_used?: number;
    total_time_ms?: number;
    success?: boolean;
};
export namespace SessionStatusResponse {
    export enum status {
        RUNNING = 'running',
        COMPLETED = 'completed',
        FAILED = 'failed',
    }
}

