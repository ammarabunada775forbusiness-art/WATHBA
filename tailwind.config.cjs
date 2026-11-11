const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const context=vm.createContext({window:{},tailwind:{}});
vm.runInContext(fs.readFileSync(path.join(__dirname,'site/assets/js/tailwind-config.js'),'utf8'),context);
const at=pattern=>path.join(__dirname,pattern).split(path.sep).join('/');
module.exports={...context.tailwind.config,content:[at('site/*.html'),at('site/assets/js/*.js'),'!'+at('site/assets/js/*.min.js'),at('scripts/**/*.js'),at('content/*.js'),at('content/page-translations.json')],plugins:[require('@tailwindcss/forms'),require('@tailwindcss/container-queries')]};
