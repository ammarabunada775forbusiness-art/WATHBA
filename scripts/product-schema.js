// Commerce markup uses the same prices, images and options as the visible shop.
// Group membership is explicit: unrelated designs and custom quotes are not variants.
const groups = require('./product-groups.json');
const page = (id, lang) => `equipment-${id}${lang === 'en' ? '-en' : ''}.html`;
const positivePrice = price => typeof price === 'number' && Number.isFinite(price) && price > 0;
const availability = ['InStock','OutOfStock','PreOrder','BackOrder','LimitedAvailability','Discontinued','OnlineOnly','InStoreOnly','SoldOut'];

function blockers(product, facts) {
  const entry = facts.products[product.id];
  const pending = [];
  if (!entry?.specificationsConfirmed) pending.push('specifications');
  if (!entry?.commerce?.priceConfirmed) pending.push('sale price approval');
  if (!product.images?.some(i => i.temporary === false)) pending.push('original product image');
  if (product.variants?.length > 1) {
    if (!groups.singlePage[product.id]) pending.push('variant model');
    if (!product.variants.every(v => positivePrice(v.price))) pending.push('variant prices');
  } else if (!positivePrice(product.variants?.[0]?.price ?? product.price)) pending.push('sale price');
  if (entry?.commerce?.availability && !availability.includes(entry.commerce.availability)) pending.push('valid availability');
  return pending;
}

function productNode(product, variantIndex, definition, lang, origin, facts, selectVariant) {
  const variant = product.variants?.[variantIndex];
  const url = `${origin}/${page(product.id, lang)}${selectVariant ? `?variant=${variantIndex}` : ''}`;
  const price = variant?.price ?? product.price;
  const images = product.images.filter(i => i.temporary === false).map(i => new URL(i.src, origin + '/').href);
  const node = {
    '@type': 'Product', '@id': url + '#product', url,
    name: product.name[lang] + (selectVariant ? ' — ' + variant[lang] : ''),
    description: product.description[lang], image: images,
    sku: definition?.sku || product.id,
    brand: {'@type':'Brand', name:'WATHBA'},
    offers: {'@type':'Offer', url, price, priceCurrency:'JOD', seller:{'@id':origin + '/#organization'}}
  };
  const rows = facts.products[product.id].rows;
  if (rows?.length) node.additionalProperty = rows.map(row => ({'@type':'PropertyValue',name:row.label[lang],value:row.value[lang]}));
  for (const key of ['size','material','color']) if (definition?.[key]?.[lang]) node[key] = definition[key][lang];
  const state = facts.products[product.id].commerce.availability;
  if (state) node.offers.availability = 'https://schema.org/' + state;
  return node;
}

function buildProduct(product, lang, origin, catalog, facts) {
  if (blockers(product, facts).length || product.id === 'custom-orders') return null;
  const single = groups.singlePage[product.id];
  if (single) {
    if (single.variants.length !== product.variants.length || new Set(single.variants.map(v => v.index)).size !== product.variants.length || single.variants.some(v => !product.variants[v.index] || !v.sku || single.variesBy.some(k => !v[k]?.[lang]))) throw Error(`Variant mapping out of date: ${product.id}`);
    const url = `${origin}/${page(product.id, lang)}`;
    const group = {'@type':'ProductGroup','@id':url + '#product-group',url,
      name:product.name[lang],description:product.description[lang],
      productGroupID:product.id, variesBy:single.variesBy.map(v => 'https://schema.org/' + v),
      brand:{'@type':'Brand', name:'WATHBA'}};
    group.hasVariant = single.variants.map(v => ({...productNode(product,v.index,v,lang,origin,facts,true),isVariantOf:{'@id':group['@id']}}));
    return group;
  }
  const family = groups.multiPage.find(g => g.members.some(v => v.productId === product.id));
  if (family) {
    // Publish a complete group on both pages only when all member data is ready.
    if (family.members.some(v => !catalog.find(p => p.id === v.productId) || blockers(catalog.find(p => p.id === v.productId),facts).length)) return null;
    const id = `${origin}/#product-group-${family.id}-${lang}`;
    return {'@type':'ProductGroup','@id':id,name:family.name[lang],productGroupID:family.id,
      variesBy:family.variesBy.map(v => 'https://schema.org/' + v),brand:{'@type':'Brand',name:'WATHBA'},
      hasVariant:family.members.map(v => ({...productNode(catalog.find(p => p.id === v.productId),v.index,v,lang,origin,facts,false),isVariantOf:{'@id':id}}))};
  }
  return productNode(product,0,null,lang,origin,facts,false);
}
module.exports = {buildProduct,blockers,availability};
