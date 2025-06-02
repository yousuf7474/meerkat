/* Custom service for Crawler API endpoints */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export interface CrawlSiteRequest {
  url: string;
  max_depth?: number;
  max_pages?: number;
  schedule?: string;
}

export interface CrawlSiteResponse {
  id: string;
  url: string;
  max_depth: number;
  max_pages: number;
  status: string;
  last_crawled?: string;
  pages_crawled: number;
  schedule?: string;
  created_at: string;
}

export class CrawlerService {
  /**
   * List Crawled Sites
   * Get all crawled sites
   * @returns CrawlSiteResponse[] List of crawled sites
   * @throws ApiError
   */
  public static listSites(): CancelablePromise<CrawlSiteResponse[]> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/v1/crawler/sites',
      errors: {
        500: 'Failed to list sites',
      },
    });
  }

  /**
   * Add Site to Crawl
   * Add a new site to crawl
   * @param requestBody Site data
   * @returns CrawlSiteResponse Site added successfully
   * @throws ApiError
   */
  public static addSite(
    requestBody: CrawlSiteRequest,
  ): CancelablePromise<CrawlSiteResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/v1/crawler/sites',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        500: 'Failed to add site',
      },
    });
  }

  /**
   * Delete Crawled Site
   * Delete a crawled site and its data
   * @param siteId Site ID to delete
   * @throws ApiError
   */
  public static deleteSite(siteId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: `/v1/crawler/sites/${siteId}`,
      errors: {
        404: 'Site not found',
        500: 'Failed to delete site',
      },
    });
  }

  /**
   * Recrawl Site
   * Re-crawl an existing site
   * @param siteId Site ID to recrawl
   * @returns CrawlSiteResponse Recrawl initiated successfully
   * @throws ApiError
   */
  public static recrawlSite(siteId: string): CancelablePromise<CrawlSiteResponse> {
    return __request(OpenAPI, {
      method: 'POST',
      url: `/v1/crawler/sites/${siteId}/run`,
      errors: {
        400: 'Document is not a crawled website',
        404: 'Site not found',
        500: 'Failed to recrawl site',
      },
    });
  }
} 