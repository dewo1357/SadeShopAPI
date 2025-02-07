import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    auth(...values: string[] | number[]): this;
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    server(url: string, variables?: {}): void;
    /**
     * The Search Destination Endpoint is designed to help you locate specific destinations
     * within Indonesia based on search keywords. It provides detailed information about
     * destinations, including their city and province. This feature is ideal for building
     * applications like shipping calculators, e-commerce checkout systems, or any service that
     * requires precise location-based data.  This guide explains how to utilize the endpoint,
     * covering setup, request parameters, responses, and practical examples.
     *
     * @summary Search Domestics Destination
     * @throws FetchError<400, types.SearchDestinationRajaongkirResponse400> 400
     * @throws FetchError<404, types.SearchDestinationRajaongkirResponse404> 404
     * @throws FetchError<422, types.SearchDestinationRajaongkirResponse422> 422
     */
    searchDestinationRajaongkir(metadata: types.SearchDestinationRajaongkirMetadataParam): Promise<FetchResponse<200, types.SearchDestinationRajaongkirResponse200>>;
    /**
     * The Search International Destination Endpoint is designed to simplify the process of
     * finding international destinations based on a search keyword. This endpoint is
     * particularly useful for businesses that operate across borders, such as e-commerce
     * platforms, shipping companies, or logistics providers. By providing access to
     * international destination data, the API ensures accurate and efficient processing of
     * global shipping needs.
     *
     * @summary Search International Destination
     * @throws FetchError<400, types.SearchInternationalDestinationResponse400> 400
     */
    searchInternationalDestination(metadata: types.SearchInternationalDestinationMetadataParam): Promise<FetchResponse<200, types.SearchInternationalDestinationResponse200>>;
    /**
     * Calculate Domestic Cost
     *
     * @throws FetchError<400, types.CalculateDomesticCostResponse400> 400
     */
    calculateDomesticCost(body: types.CalculateDomesticCostBodyParam, metadata: types.CalculateDomesticCostMetadataParam): Promise<FetchResponse<200, types.CalculateDomesticCostResponse200>>;
    /**
     * Calculate International Cost
     *
     * @throws FetchError<400, types.CalculateInternationalCostResponse400> 400
     */
    calculateInternationalCost(body: types.CalculateInternationalCostBodyParam): Promise<FetchResponse<200, types.CalculateInternationalCostResponse200>>;
    /**
     * Tracking Airwaybills
     *
     * @throws FetchError<400, types.TrackingAirwaybillsResponse400> 400
     */
    trackingAirwaybills(metadata?: types.TrackingAirwaybillsMetadataParam): Promise<FetchResponse<200, types.TrackingAirwaybillsResponse200>>;
}
declare const createSDK: SDK;
export = createSDK;
