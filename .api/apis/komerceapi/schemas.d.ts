declare const CalculateDomesticCost: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["origin", "destination", "weight", "courier"];
        readonly properties: {
            readonly origin: {
                readonly type: "string";
                readonly description: "The ID unique of postal code, sub district, or district for the origin location.";
            };
            readonly destination: {
                readonly type: "string";
                readonly description: "The ID unique of postal code, sub district, or district for the destination location.";
            };
            readonly weight: {
                readonly type: "integer";
                readonly description: "The weight of the package in grams (e.g., 1000 for 1kg).";
                readonly format: "int32";
                readonly minimum: -2147483648;
                readonly maximum: 2147483647;
            };
            readonly courier: {
                readonly type: "string";
                readonly description: "Colon-separated courier codes (e.g., jne:sicepat:jnt).";
            };
            readonly price: {
                readonly type: "string";
                readonly description: "Filter for price sorting (lowest or highest). Default is lowest.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly key: {
                    readonly type: "string";
                    readonly default: "YOUR_API_KEY";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "API key for authorization.";
                };
            };
            readonly required: readonly ["key"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Success Calculate Domestic Shipping cost"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [200];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["success"];
                        };
                    };
                };
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                                readonly examples: readonly ["Nusantara Card Semesta"];
                            };
                            readonly code: {
                                readonly type: "string";
                                readonly examples: readonly ["ncs"];
                            };
                            readonly service: {
                                readonly type: "string";
                                readonly examples: readonly ["DARAT"];
                            };
                            readonly description: {
                                readonly type: "string";
                                readonly examples: readonly ["Regular Darat"];
                            };
                            readonly cost: {
                                readonly type: "integer";
                                readonly default: 0;
                                readonly examples: readonly [8000];
                            };
                            readonly etd: {
                                readonly type: "string";
                                readonly examples: readonly ["6-7 day"];
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const CalculateInternationalCost: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["courier", "origin", "destination", "weight"];
        readonly properties: {
            readonly courier: {
                readonly type: "string";
                readonly description: "Colon-separated courier codes (e.g., tiki:lion:pos:expedito:jne).";
            };
            readonly origin: {
                readonly type: "string";
                readonly description: "The ID unique of the origin location";
            };
            readonly destination: {
                readonly type: "string";
                readonly description: "The ID unique of the destination location";
            };
            readonly weight: {
                readonly type: "integer";
                readonly description: "The package weight in grams (e.g., 500 for 500g).";
                readonly format: "int32";
                readonly minimum: -2147483648;
                readonly maximum: 2147483647;
            };
            readonly price: {
                readonly type: "string";
                readonly description: "Sort order for price (lowest or highest). Default is Random.";
            };
        };
        readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Success Calculate International Shipping Cost"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [200];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["success"];
                        };
                    };
                };
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly name: {
                                readonly type: "string";
                                readonly examples: readonly ["Rayspeed Indonesia"];
                            };
                            readonly code: {
                                readonly type: "string";
                                readonly examples: readonly ["ray"];
                            };
                            readonly service: {
                                readonly type: "string";
                                readonly examples: readonly ["Regular Service"];
                            };
                            readonly description: {
                                readonly type: "string";
                                readonly examples: readonly ["Retail"];
                            };
                            readonly currency: {
                                readonly type: "string";
                                readonly examples: readonly ["IDR"];
                            };
                            readonly cost: {
                                readonly type: "integer";
                                readonly default: 0;
                                readonly examples: readonly [55000];
                            };
                            readonly etd: {
                                readonly type: "string";
                                readonly examples: readonly [""];
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const SearchDestinationRajaongkir: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly search: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Keyword for searching the destination.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Maximum number of results to return. Default: 10.";
                };
                readonly offset: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The starting position for the results (for pagination). Default: 0.";
                };
            };
            readonly required: readonly ["search"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly key: {
                    readonly type: "string";
                    readonly default: "YOUR_API_KEY";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Every request to this endpoint must include a valid API key in the request header. Your API key is your unique identifier and ensures secure access to the service.";
                };
            };
            readonly required: readonly ["key"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Success Get Domestic Destinations"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [200];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["success"];
                        };
                    };
                };
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly id: {
                                readonly type: "integer";
                                readonly default: 0;
                                readonly examples: readonly [31555];
                            };
                            readonly label: {
                                readonly type: "string";
                                readonly examples: readonly ["SINDUHARJO, NGAGLIK, SLEMAN, DI YOGYAKARTA, 55581"];
                            };
                            readonly subdistrict_name: {
                                readonly type: "string";
                                readonly examples: readonly ["SINDUHARJO"];
                            };
                            readonly district_name: {
                                readonly type: "string";
                                readonly examples: readonly ["NGAGLIK"];
                            };
                            readonly city_name: {
                                readonly type: "string";
                                readonly examples: readonly ["SLEMAN"];
                            };
                            readonly province_name: {
                                readonly type: "string";
                                readonly examples: readonly ["DI YOGYAKARTA"];
                            };
                            readonly zip_code: {
                                readonly type: "string";
                                readonly examples: readonly ["55581"];
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Invalid Api key, key not found"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [400];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["failed"];
                        };
                    };
                };
                readonly data: {};
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "404": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Domestic Destinations Data not found"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [404];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["error"];
                        };
                    };
                };
                readonly data: {};
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "422": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["search: cannot be blank."];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [422];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["error"];
                        };
                    };
                };
                readonly data: {};
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const SearchInternationalDestination: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly search: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Keyword to search for an international destination.";
                };
                readonly limit: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Maximum number of results to return. Default: 10.";
                };
                readonly offset: {
                    readonly type: "integer";
                    readonly format: "int32";
                    readonly minimum: -2147483648;
                    readonly maximum: 2147483647;
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Starting position for the results, useful for pagination. Default: 0.";
                };
            };
            readonly required: readonly ["search"];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly key: {
                    readonly type: "string";
                    readonly default: "YOUR_API_KEY";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Your API authentication key.";
                };
            };
            readonly required: readonly ["key"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Success Get International Destination"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [200];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["success"];
                        };
                    };
                };
                readonly data: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "object";
                        readonly properties: {
                            readonly country_id: {
                                readonly type: "string";
                                readonly examples: readonly ["108"];
                            };
                            readonly country_name: {
                                readonly type: "string";
                                readonly examples: readonly ["Malaysia"];
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
declare const TrackingAirwaybills: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly awb: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The airwaybill (AWB) number of the package.";
                };
                readonly courier: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "The courier code (e.g., wahana).";
                };
            };
            readonly required: readonly [];
        }, {
            readonly type: "object";
            readonly properties: {
                readonly key: {
                    readonly type: "string";
                    readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
                    readonly description: "Your API authentication key.";
                };
            };
            readonly required: readonly [];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly meta: {
                    readonly type: "object";
                    readonly properties: {
                        readonly message: {
                            readonly type: "string";
                            readonly examples: readonly ["Success Get Waybill"];
                        };
                        readonly code: {
                            readonly type: "integer";
                            readonly default: 0;
                            readonly examples: readonly [200];
                        };
                        readonly status: {
                            readonly type: "string";
                            readonly examples: readonly ["success"];
                        };
                    };
                };
                readonly data: {
                    readonly type: "object";
                    readonly properties: {
                        readonly delivered: {
                            readonly type: "boolean";
                            readonly default: true;
                            readonly examples: readonly [true];
                        };
                        readonly summary: {
                            readonly type: "object";
                            readonly properties: {
                                readonly courier_code: {
                                    readonly type: "string";
                                    readonly examples: readonly ["wahana"];
                                };
                                readonly courier_name: {
                                    readonly type: "string";
                                    readonly examples: readonly ["Wahana Prestasi Logistik"];
                                };
                                readonly waybill_number: {
                                    readonly type: "string";
                                    readonly examples: readonly ["MT685U91"];
                                };
                                readonly service_code: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly waybill_date: {
                                    readonly type: "string";
                                    readonly examples: readonly ["2024-10-08"];
                                };
                                readonly shipper_name: {
                                    readonly type: "string";
                                    readonly examples: readonly ["TOKO ALAT LUKIS (08112XXXXXX)"];
                                };
                                readonly receiver_name: {
                                    readonly type: "string";
                                    readonly examples: readonly ["FIKRI EL SARA (085668XXXXXX)"];
                                };
                                readonly origin: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly destination: {
                                    readonly type: "string";
                                    readonly examples: readonly ["di Kota Sukabumi"];
                                };
                                readonly status: {
                                    readonly type: "string";
                                    readonly examples: readonly ["DELIVERED"];
                                };
                            };
                        };
                        readonly details: {
                            readonly type: "object";
                            readonly properties: {
                                readonly waybill_number: {
                                    readonly type: "string";
                                    readonly examples: readonly ["MT685U91"];
                                };
                                readonly waybill_date: {
                                    readonly type: "string";
                                    readonly examples: readonly ["2024-10-08"];
                                };
                                readonly waybill_time: {
                                    readonly type: "string";
                                    readonly examples: readonly ["11:14:29"];
                                };
                                readonly weight: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly origin: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly destination: {
                                    readonly type: "string";
                                    readonly examples: readonly ["di Kota Sukabumi"];
                                };
                                readonly shipper_name: {
                                    readonly type: "string";
                                    readonly examples: readonly ["TOKO ALAT LUKIS (08112XXXXXX)"];
                                };
                                readonly shipper_address1: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly shipper_address2: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly shipper_address3: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly shipper_city: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly receiver_name: {
                                    readonly type: "string";
                                    readonly examples: readonly ["FIKRI EL SARA (085668XXXXXX)"];
                                };
                                readonly receiver_address1: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly receiver_address2: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly receiver_address3: {
                                    readonly type: "string";
                                    readonly examples: readonly [""];
                                };
                                readonly receiver_city: {
                                    readonly type: "string";
                                    readonly examples: readonly ["di Kota Sukabumi"];
                                };
                            };
                        };
                        readonly delivery_status: {
                            readonly type: "object";
                            readonly properties: {
                                readonly status: {
                                    readonly type: "string";
                                    readonly examples: readonly ["DELIVERED"];
                                };
                                readonly pod_receiver: {
                                    readonly type: "string";
                                    readonly examples: readonly ["FIKRI EL SARA (085668XXXXXX)"];
                                };
                                readonly pod_date: {
                                    readonly type: "string";
                                    readonly examples: readonly ["2024-10-11"];
                                };
                                readonly pod_time: {
                                    readonly type: "string";
                                    readonly examples: readonly ["09:26:13"];
                                };
                            };
                        };
                        readonly manifest: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly manifest_code: {
                                        readonly type: "string";
                                        readonly examples: readonly [""];
                                    };
                                    readonly manifest_description: {
                                        readonly type: "string";
                                        readonly examples: readonly ["Diterima di Sales Counter AGEN WPL BANTUL NGESTIHARJO MADUMURTI 50"];
                                    };
                                    readonly manifest_date: {
                                        readonly type: "string";
                                        readonly examples: readonly ["2024-10-08"];
                                    };
                                    readonly manifest_time: {
                                        readonly type: "string";
                                        readonly examples: readonly ["11:14:29"];
                                    };
                                    readonly city_name: {
                                        readonly type: "string";
                                        readonly examples: readonly [""];
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {};
            readonly $schema: "https://json-schema.org/draft/2020-12/schema#";
        };
    };
};
export { CalculateDomesticCost, CalculateInternationalCost, SearchDestinationRajaongkir, SearchInternationalDestination, TrackingAirwaybills };
