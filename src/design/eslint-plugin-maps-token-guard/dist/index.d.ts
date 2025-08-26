/**
 * ESLint Plugin for MAPS Token Guard - Standalone Distribution
 *
 * Extracted from src/components/primitives/token-guard.tsx for:
 * - Industry-standard plugin distribution
 * - Reusability across projects
 * - Better IDE/ESLint integration
 * - NPM ecosystem compatibility
 */
interface ESLintNode {
    type: string;
    name?: {
        name: string;
    };
    key?: {
        name: string;
    };
    value?: {
        type: string;
        value?: string;
        expression?: {
            type: string;
            value?: string;
            callee?: {
                type: string;
                name?: string;
                property?: {
                    name: string;
                };
            };
            quasis?: Array<{
                value: {
                    cooked: string;
                };
            }>;
            properties?: Array<{
                value: {
                    type: string;
                };
                key?: {
                    name: string;
                };
            }>;
        };
    };
    source?: {
        value: string;
    };
}
interface ESLintContext {
    report: (args: {
        node: ESLintNode;
        message: string;
    }) => void;
    getFilename: () => string;
}
interface ESLintRule {
    meta: {
        type: 'problem' | 'suggestion' | 'layout';
        docs: {
            description: string;
            category?: string;
            recommended?: boolean;
        };
        schema?: unknown[];
        fixable?: 'code' | 'whitespace';
    };
    create: (ctx: ESLintContext) => Record<string, (node: ESLintNode) => void>;
}
declare const rules: Record<string, ESLintRule>;
declare const configs: {
    recommended: {
        plugins: string[];
        rules: {
            "maps-token-guard/no-raw-tailwind-in-components": string;
            "maps-token-guard/no-inline-style-hardcoded": string;
            "maps-token-guard/enforce-visually-hidden": string;
            "maps-token-guard/no-hardcoded-z-index": string;
            "maps-token-guard/require-dark-first": string;
            "maps-token-guard/enforce-token-imports": string;
        };
    };
    strict: {
        plugins: string[];
        rules: {
            "maps-token-guard/no-raw-tailwind-in-components": string;
            "maps-token-guard/no-inline-style-hardcoded": string;
            "maps-token-guard/enforce-visually-hidden": string;
            "maps-token-guard/no-hardcoded-z-index": string;
            "maps-token-guard/require-dark-first": string;
            "maps-token-guard/enforce-token-imports": string;
        };
    };
    "tokens-only": {
        plugins: string[];
        rules: {
            "maps-token-guard/no-raw-tailwind-in-components": string;
            "maps-token-guard/no-inline-style-hardcoded": string;
            "maps-token-guard/enforce-token-imports": string;
        };
    };
};
declare const plugin: {
    rules: Record<string, ESLintRule>;
    configs: {
        recommended: {
            plugins: string[];
            rules: {
                "maps-token-guard/no-raw-tailwind-in-components": string;
                "maps-token-guard/no-inline-style-hardcoded": string;
                "maps-token-guard/enforce-visually-hidden": string;
                "maps-token-guard/no-hardcoded-z-index": string;
                "maps-token-guard/require-dark-first": string;
                "maps-token-guard/enforce-token-imports": string;
            };
        };
        strict: {
            plugins: string[];
            rules: {
                "maps-token-guard/no-raw-tailwind-in-components": string;
                "maps-token-guard/no-inline-style-hardcoded": string;
                "maps-token-guard/enforce-visually-hidden": string;
                "maps-token-guard/no-hardcoded-z-index": string;
                "maps-token-guard/require-dark-first": string;
                "maps-token-guard/enforce-token-imports": string;
            };
        };
        "tokens-only": {
            plugins: string[];
            rules: {
                "maps-token-guard/no-raw-tailwind-in-components": string;
                "maps-token-guard/no-inline-style-hardcoded": string;
                "maps-token-guard/enforce-token-imports": string;
            };
        };
    };
};

export { configs, plugin as default, rules };
