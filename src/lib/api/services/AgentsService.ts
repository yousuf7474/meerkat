/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AgentCardListResponse } from '../models/AgentCardListResponse';
import type { AgentCardResponse } from '../models/AgentCardResponse';
import type { CreateAgentCardRequest } from '../models/CreateAgentCardRequest';
import type { SearchAgentCardsRequest } from '../models/SearchAgentCardsRequest';
import type { SearchAgentCardsResponse } from '../models/SearchAgentCardsResponse';
import type { SourceListResponse } from '../models/SourceListResponse';
import type { ToolListResponse } from '../models/ToolListResponse';
import type { UpdateAgentCardRequest } from '../models/UpdateAgentCardRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AgentsService {
    /**
     * List Agent Cards
     * Get all agent cards with optional filtering and pagination
     * @param statusFilter Filter by status
     * @param limit Number of cards to return
     * @param lastEvaluatedKey Pagination key for next page
     * @returns AgentCardListResponse List of agent cards
     * @throws ApiError
     */
    public static getV1AgentsCards(
        statusFilter?: 'active' | 'inactive' | 'draft',
        limit: number = 50,
        lastEvaluatedKey?: string,
    ): CancelablePromise<AgentCardListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/agents/cards',
            query: {
                'status_filter': statusFilter,
                'limit': limit,
                'last_evaluated_key': lastEvaluatedKey,
            },
        });
    }
    /**
     * Create Agent Card
     * Create a new specialized agent with specific capabilities
     * @param requestBody
     * @returns AgentCardResponse Agent card created successfully
     * @throws ApiError
     */
    public static postV1AgentsCards(
        requestBody?: CreateAgentCardRequest,
    ): CancelablePromise<AgentCardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/agents/cards',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request parameters`,
            },
        });
    }
    /**
     * Get Agent Card
     * Retrieve a specific agent card by ID
     * @param cardId Agent card ID
     * @returns AgentCardResponse Agent card details
     * @throws ApiError
     */
    public static getV1AgentsCards1(
        cardId: string,
    ): CancelablePromise<AgentCardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/agents/cards/{card_id}',
            path: {
                'card_id': cardId,
            },
            errors: {
                404: `Agent card not found`,
            },
        });
    }
    /**
     * Update Agent Card
     * Update an existing agent card
     * @param cardId Agent card ID
     * @param requestBody
     * @returns AgentCardResponse Agent card updated successfully
     * @throws ApiError
     */
    public static putV1AgentsCards(
        cardId: string,
        requestBody?: UpdateAgentCardRequest,
    ): CancelablePromise<AgentCardResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/v1/agents/cards/{card_id}',
            path: {
                'card_id': cardId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Agent card not found`,
            },
        });
    }
    /**
     * Delete Agent Card
     * Permanently delete an agent card
     * @param cardId Agent card ID
     * @returns void
     * @throws ApiError
     */
    public static deleteV1AgentsCards(
        cardId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/v1/agents/cards/{card_id}',
            path: {
                'card_id': cardId,
            },
            errors: {
                404: `Agent card not found`,
            },
        });
    }
    /**
     * Search Agent Cards
     * Search agent cards using vector similarity
     * @param requestBody
     * @returns SearchAgentCardsResponse Search results
     * @throws ApiError
     */
    public static postV1AgentsCardsSearch(
        requestBody?: SearchAgentCardsRequest,
    ): CancelablePromise<SearchAgentCardsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/agents/cards/search',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Activate Agent Card
     * Activate an agent card for selection
     * @param cardId Agent card ID
     * @returns AgentCardResponse Agent card activated
     * @throws ApiError
     */
    public static postV1AgentsCardsActivate(
        cardId: string,
    ): CancelablePromise<AgentCardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/agents/cards/{card_id}/activate',
            path: {
                'card_id': cardId,
            },
            errors: {
                404: `Agent card not found`,
            },
        });
    }
    /**
     * Deactivate Agent Card
     * Deactivate an agent card
     * @param cardId Agent card ID
     * @returns AgentCardResponse Agent card deactivated
     * @throws ApiError
     */
    public static postV1AgentsCardsDeactivate(
        cardId: string,
    ): CancelablePromise<AgentCardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/agents/cards/{card_id}/deactivate',
            path: {
                'card_id': cardId,
            },
            errors: {
                404: `Agent card not found`,
            },
        });
    }
    /**
     * List Available Tools
     * Get all tools that agents can use
     * @returns ToolListResponse List of available tools
     * @throws ApiError
     */
    public static getV1AgentsTools(): CancelablePromise<ToolListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/agents/tools',
        });
    }
    /**
     * List Available Sources
     * Get all data sources that agents can access
     * @returns SourceListResponse List of available sources
     * @throws ApiError
     */
    public static getV1AgentsSources(): CancelablePromise<SourceListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/agents/sources',
        });
    }
}
