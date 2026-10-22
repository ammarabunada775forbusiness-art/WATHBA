#!/usr/bin/env node
// Readiness review only: never converts a feasibility price to a live offer.
const facts = require('./product-facts.json');
let documented = 0;
for (const [id, p] of Object.entries(facts.products)) {
  if (!Array.isArray(p.rows) || p.rows.some(r => ['ar','en'].some(l => !r.label[l] || !r.value[l]))) throw new Error(`Incomplete translations: ${id}`);
  if (p.rows.length) documented++;
  const missing = [];
  if (!p.rows.length) missing.push('model specifications');
  if (!p.commerce.priceConfirmed) missing.push('confirmed sale price');
  for (const key of ['availability','leadTime','delivery','warrantyReturns']) if (!facts.excludedCommerceFields?.includes(key) && !p.commerce[key]) missing.push(key);
  console.log(`${id}: ${p.rows.length} specification rows; pending ${missing.join(', ') || 'none'}`);
}
console.log(`\n${documented}/${Object.keys(facts.products).length} products have reference specifications. Product/Offer publishing is deferred until live sale data and original product images are confirmed. See PRODUCT-DATA.md.`);
