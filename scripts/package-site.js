const fs=require('node:fs'),path=require('node:path');
module.exports=function packageSite(root){
 const output=path.join(root,'dist');
 fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output);
 for(const file of fs.readdirSync(root)){
  if(/\.html$/.test(file)||/^(robots\.txt|sitemap\.xml|favicon\.[a-z]+)$/.test(file))fs.copyFileSync(path.join(root,file),path.join(output,file));
 }
 fs.cpSync(path.join(root,'assets'),path.join(output,'assets'),{recursive:true});
};
