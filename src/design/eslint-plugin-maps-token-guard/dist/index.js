// src/index.ts
function isCnOrCva(node) {
  return node && node.type === "CallExpression" && (node.value?.expression?.callee?.type === "Identifier" && (node.value.expression.callee.name === "cn" || node.value.expression.callee.name === "cva") || node.value?.expression?.callee?.type === "MemberExpression" && node.value.expression.callee.property?.name === "cn");
}
function extractClassStrings(node) {
  if (node?.value?.type === "Literal" && typeof node.value.value === "string") {
    return [node.value.value];
  }
  if (node?.value?.type === "JSXExpressionContainer" && node.value.expression?.type === "TemplateLiteral") {
    return node.value.expression.quasis?.map((q) => q.value.cooked).filter(Boolean) || [];
  }
  if (node?.value?.type === "JSXExpressionContainer" && node.value.expression?.type === "Literal" && typeof node.value.expression.value === "string") {
    return [node.value.expression.value];
  }
  return [];
}
var RAW_TW = /\b(bg|text|border|shadow|ring|p|m|space|gap|w|h|rounded|z|inset|top|left|right|bottom)-[A-Za-z0-9:/.-]+\b/;
var ARBITRARY_TW = /\[[^\]]+\]/;
var IMPORTANT_TW = /(^|\s)![A-Za-z0-9-:/[\]]+/;
var LIGHT_ONLY = /\b(bg-white|text-black|border-gray-200)\b/;
var SR_ONLY_USAGE = /\bsr-only\b/;
var rules = {
  "no-raw-tailwind-in-components": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow raw Tailwind in components; use tokens/CVA",
        category: "Best Practices",
        recommended: true
      }
    },
    create(ctx) {
      return {
        JSXAttribute(node) {
          if (node.name?.name !== "className") return;
          if (node.value?.type === "JSXExpressionContainer" && isCnOrCva(node)) return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (RAW_TW.test(chunk)) {
              if (ARBITRARY_TW.test(chunk) || IMPORTANT_TW.test(chunk)) {
                ctx.report({
                  node,
                  message: "\u274C Arbitrary/important Tailwind detected. Use ENHANCED_DESIGN_TOKENS instead."
                });
              } else {
                ctx.report({
                  node,
                  message: "\u26A0\uFE0F Raw Tailwind detected. Use tokenized CVA variants instead."
                });
              }
            }
          }
        }
      };
    }
  },
  "no-inline-style-hardcoded": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow style={{ ... }} with hardcoded values in components",
        category: "Best Practices",
        recommended: true
      }
    },
    create(ctx) {
      return {
        JSXAttribute(node) {
          if (node.name?.name !== "style") return;
          if (node.value?.type === "JSXExpressionContainer" && node.value.expression?.type === "ObjectExpression") {
            for (const prop of node.value.expression.properties || []) {
              if (prop.value?.type === "Literal") {
                ctx.report({
                  node,
                  message: "\u274C Inline style literal detected. Use className with ENHANCED_DESIGN_TOKENS."
                });
              }
            }
          }
        }
      };
    }
  },
  "require-dark-first": {
    meta: {
      type: "suggestion",
      docs: {
        description: "Disallow light-only classes; enforce dark-first tokens",
        category: "Stylistic Issues",
        recommended: false
      }
    },
    create(ctx) {
      return {
        JSXAttribute(node) {
          if (node.name?.name !== "className") return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (LIGHT_ONLY.test(chunk)) {
              ctx.report({
                node,
                message: "\u26A0\uFE0F Light-only utility found. Use dark-first tokens (ENHANCED_DESIGN_TOKENS)."
              });
            }
          }
        }
      };
    }
  },
  "enforce-visually-hidden": {
    meta: {
      type: "suggestion",
      docs: {
        description: "Require <VisuallyHidden> component instead of sr-only class",
        category: "Accessibility",
        recommended: true
      }
    },
    create(ctx) {
      return {
        JSXAttribute(node) {
          if (node.name?.name !== "className") return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (SR_ONLY_USAGE.test(chunk)) {
              ctx.report({
                node,
                message: "\u{1F6AB} Use <VisuallyHidden> from @/components/primitives instead of sr-only class."
              });
            }
          }
        }
      };
    }
  },
  "enforce-token-imports": {
    meta: {
      type: "suggestion",
      docs: {
        description: "Components must import SSOT tokens",
        category: "Best Practices",
        recommended: false
      }
    },
    create(ctx) {
      let hasTokensImport = false;
      return {
        ImportDeclaration(node) {
          const src = node.source?.value || "";
          if (typeof src === "string" && (src.includes("/tokens") || src.includes("/enhanced-tokens") || src.includes("ENHANCED_DESIGN_TOKENS"))) {
            hasTokensImport = true;
          }
        },
        "Program:exit"(node) {
          const filename = ctx.getFilename();
          if (filename.includes("/components/") && !hasTokensImport) {
            ctx.report({
              node,
              message: "\u26A0\uFE0F Missing tokens import in component file. Import ENHANCED_DESIGN_TOKENS."
            });
          }
        }
      };
    }
  },
  "no-hardcoded-z-index": {
    meta: {
      type: "problem",
      docs: {
        description: "Disallow hardcoded z-index values; use z-index orchestrator",
        category: "Best Practices",
        recommended: true
      }
    },
    create(ctx) {
      return {
        JSXAttribute(node) {
          if (node.name?.name !== "className") return;
          const chunks = extractClassStrings(node);
          for (const chunk of chunks) {
            if (/z-\[[0-9]+\]/.test(chunk)) {
              ctx.report({
                node,
                message: "\u274C Hardcoded z-index detected. Use useZIndex() hook for layer management."
              });
            }
          }
        },
        Property(node) {
          if (node.key?.name === "zIndex" && node.value?.type === "Literal") {
            ctx.report({
              node,
              message: "\u274C Hardcoded z-index in style object. Use useZIndex() hook instead."
            });
          }
        }
      };
    }
  }
};
var configs = {
  recommended: {
    plugins: ["maps-token-guard"],
    rules: {
      "maps-token-guard/no-raw-tailwind-in-components": "error",
      "maps-token-guard/no-inline-style-hardcoded": "error",
      "maps-token-guard/enforce-visually-hidden": "warn",
      "maps-token-guard/no-hardcoded-z-index": "error",
      "maps-token-guard/require-dark-first": "warn",
      "maps-token-guard/enforce-token-imports": "warn"
    }
  },
  strict: {
    plugins: ["maps-token-guard"],
    rules: {
      "maps-token-guard/no-raw-tailwind-in-components": "error",
      "maps-token-guard/no-inline-style-hardcoded": "error",
      "maps-token-guard/enforce-visually-hidden": "error",
      "maps-token-guard/no-hardcoded-z-index": "error",
      "maps-token-guard/require-dark-first": "error",
      "maps-token-guard/enforce-token-imports": "error"
    }
  },
  "tokens-only": {
    plugins: ["maps-token-guard"],
    rules: {
      "maps-token-guard/no-raw-tailwind-in-components": "error",
      "maps-token-guard/no-inline-style-hardcoded": "error",
      "maps-token-guard/enforce-token-imports": "error"
    }
  }
};
var plugin = {
  rules,
  configs
};
var index_default = plugin;
if (typeof module !== "undefined" && module.exports) {
  module.exports = plugin;
  module.exports.default = plugin;
}
export {
  configs,
  index_default as default,
  rules
};
//# sourceMappingURL=index.js.map