/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health check. */
        get: operations["health_check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/continue/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Verify user's email and complete sign-in process. */
        get: operations["continue_signin"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/auth/signin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign in the user and send a sign-in email. */
        post: operations["signin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Retrieve a user's profile. */
        get: operations["me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AuthSignInBody: {
            email: string;
        };
        AuthenticatedUser: {
            /**
             * @description Email address of the user.
             * @example user@example.com
             */
            email: string;
            /**
             * Format: date-time
             * @description Whether the user's email address has been verified.
             * @example 2019-12-13T13:46:41Z
             */
            email_verified?: string | null;
            /**
             * Format: uuid
             * @description Unique identifier for the user.
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            id: string;
            /**
             * @description URL of the user's profile image.
             * @example https://example.com/image.jpg
             */
            image?: string | null;
            /** @description Role of the user. */
            role: components["schemas"]["UserRole"];
        };
        MessageResponse: {
            /** @description A message describing the result of the operation. */
            message: string;
        };
        /** @enum {string} */
        UserRole: "User" | "Admin";
        VerifiedEmailResponse: {
            /**
             * @description Access token for the user.
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
             */
            access_token: string;
            /**
             * @description Refresh token for the user.
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
             */
            refresh_token: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    health_check: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
        };
    };
    continue_signin: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Token used to verify email */
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerifiedEmailResponse"];
                };
            };
        };
    };
    signin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AuthSignInBody"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
        };
    };
    me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthenticatedUser"];
                };
            };
        };
    };
}
