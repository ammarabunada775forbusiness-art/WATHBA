// One category map for navigation, filters, static category pages and breadcrumbs.
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WathbaStructure=api;})(typeof window!=='undefined'?window:this,function(){
  const categories=[
    {key:'bars',ar:'بارات السحب',en:'Pull-up Bars',ids:['wall-pull-up-bar','monkey-bars']},
    {key:'parallettes',ar:'باراليتس',en:'Parallettes',ids:['steel-wood-parallettes','full-wooden-parallettes']},
    {key:'parallel-bars',ar:'متوازي وديب بار',en:'Parallel & Dip Bars',ids:['freestanding-parallel-bars-small','freestanding-parallel-bars-large','wall-mounted-dip-bars']},
    {key:'rings',ar:'حلقات جمباز',en:'Gymnastic Rings',ids:['gymnastic-rings']},
    {key:'accessories',ar:'إكسسوارات',en:'Accessories',ids:['hand-gripper','jump-rope','grip-tape','resistance-bands']},
    {key:'multi-rig',ar:'جهاز متعدد',en:'Multi Rig',ids:['multi-rig']},
    {key:'custom',ar:'طلبات مخصصة',en:'Custom Orders',ids:['custom-orders']}
  ];
  const categoryForProduct=id=>categories.find(c=>c.ids.includes(id));
  const categoryUrl=(key,lang)=>`category-${key}${lang==='en'?'-en':''}.html`;
  function practiceUrl(guide){
    if(guide.includes('#'))return guide;
    if(/^academy-first-pull-up/.test(guide))return guide+'#assisted';
    if(/^academy-parallettes/.test(guide))return guide+'#exercises';
    if(/^academy(?:-en)?\.html$/.test(guide))return guide+'#custom';
    return guide+'#progressions';
  }
  return {categories,categoryForProduct,categoryUrl,practiceUrl};
});
