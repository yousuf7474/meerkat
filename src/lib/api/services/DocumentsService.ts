/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CrawlRequest } from '../models/CrawlRequest';
import type { CrawlResponse } from '../models/CrawlResponse';
import type { DocumentUploadResponse } from '../models/DocumentUploadResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DocumentsService {
    /**
     * Upload Document
     * Upload and process documents for indexing
     * @param formData
     * @returns DocumentUploadResponse Document uploaded successfully
     * @throws ApiError
     */
    public static postV1Documents(
        formData?: {
            /**
             * Document file (PDF, DOCX, TXT)
             */
            file: Blob;
        },
    ): CancelablePromise<DocumentUploadResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/documents/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid file format or size`,
                413: `File too large (>50MB)`,
            },
        });
    }
    /**
     * Crawl Website
     * Crawl and index website content
     * @param requestBody
     * @returns CrawlResponse Crawling started successfully
     * @throws ApiError
     */
    public static postV1DocumentsCrawl(
        requestBody?: CrawlRequest,
    ): CancelablePromise<CrawlResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/documents/crawl',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid URL or parameters`,
            },
        });
    }
}
