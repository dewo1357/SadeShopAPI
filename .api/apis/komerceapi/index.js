"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'komerceapi/unknown (api/6.1.2)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
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
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
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
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
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
    SDK.prototype.searchDestinationRajaongkir = function (metadata) {
        return this.core.fetch('/destination/domestic-destination', 'get', metadata);
    };
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
    SDK.prototype.searchInternationalDestination = function (metadata) {
        return this.core.fetch('/destination/international-destination', 'get', metadata);
    };
    /**
     * Calculate Domestic Cost
     *
     * @throws FetchError<400, types.CalculateDomesticCostResponse400> 400
     */
    SDK.prototype.calculateDomesticCost = function (body, metadata) {
        return this.core.fetch('/calculate/domestic-cost', 'post', body, metadata);
    };
    /**
     * Calculate International Cost
     *
     * @throws FetchError<400, types.CalculateInternationalCostResponse400> 400
     */
    SDK.prototype.calculateInternationalCost = function (body) {
        return this.core.fetch('/calculate/international-cost', 'post', body);
    };
    /**
     * Tracking Airwaybills
     *
     * @throws FetchError<400, types.TrackingAirwaybillsResponse400> 400
     */
    SDK.prototype.trackingAirwaybills = function (metadata) {
        return this.core.fetch('/track/waybill', 'post', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
