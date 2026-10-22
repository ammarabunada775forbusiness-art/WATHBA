// Local diagnostics only: no analytics requests, identifiers, cookies or storage.
import {onCLS,onINP,onLCP} from './web-vitals.js';
window.WATHBA_VITALS = {scope:'current page visit',CLS:null,LCP:null,INP:null};
const diagnostics = document.createElement('meta');
diagnostics.name = 'wathba-vitals';
document.head.append(diagnostics);
diagnostics.content = JSON.stringify(window.WATHBA_VITALS);
const record = metric => {
  window.WATHBA_VITALS[metric.name] = {value:metric.value,rating:metric.rating};
  diagnostics.content = JSON.stringify(window.WATHBA_VITALS);
};
onCLS(record,{reportAllChanges:true});
onINP(record,{reportAllChanges:true});
onLCP(record,{reportAllChanges:true});
