"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateManySuggestions = exports.generateOneOrder = exports.generateOneText = void 0;
var generate_one_text_1 = require("./app/generate-one-text");
Object.defineProperty(exports, "generateOneText", { enumerable: true, get: function () { return generate_one_text_1.generateOneText; } });
var generate_one_order_1 = require("./app/generate-one-order");
Object.defineProperty(exports, "generateOneOrder", { enumerable: true, get: function () { return generate_one_order_1.generateOneOrder; } });
var generate_many_1 = require("./app/generate-many");
Object.defineProperty(exports, "generateManySuggestions", { enumerable: true, get: function () { return generate_many_1.generateManySuggestions; } });
