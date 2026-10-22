// Pre-render the same product markup used by the browser to avoid a layout swap.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
module.exports = function renderProductShell(root,id,lang) {
  const node = {innerHTML:''};
  const document = {
    body:{dataset:{wathbaProductId:id}},
    getElementById:key=>key==='productDetailsRoot'?node:null,
    querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){}
  };
  const window = {location:{search:'',href:`https://wathba.invalid/equipment-${id}.html`},WathbaStructure:require('../assets/js/site-structure.js')};
  const ctx = vm.createContext({window,document,localStorage:{getItem:()=>lang},URL,URLSearchParams,setTimeout:()=>0});
  for (const name of ['products-data','product-details']) vm.runInContext(fs.readFileSync(path.join(root,`assets/js/${name}.js`),'utf8'),ctx);
  return node.innerHTML;
};
