"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
function renderTemplate(template, vars) {
    let result = template;
    const activeProducts = (vars.products || []).filter((p) => p.is_active);
    if (activeProducts.length > 0) {
        const productList = activeProducts
            .map((p) => `- ${p.name}`)
            .join('\n');
        result = result.replace(/\{products\}/g, productList);
    }
    else {
        result = result.replace(/\{products\}/g, '_Nenhum produto ativo no momento_');
    }
    return result;
}
