/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export interface CrawlRequest {
    /**
     * URL to crawl
     */
    root_url: string;
    /**
     * Maximum crawl depth
     */
    depth?: number;
    /**
     * Maximum number of pages to crawl
     */
    max_pages?: number;
    /**
     * Whether to follow links
     */
    follow_links?: boolean;
    /**
     * Additional metadata
     */
    metadata?: Record<string, any>;
}

