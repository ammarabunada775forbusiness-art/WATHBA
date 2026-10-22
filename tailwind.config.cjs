const fs=require('node:fs'),vm=require('node:vm');
const context=vm.createContext({window:{},tailwind:{}});
vm.runInContext(fs.readFileSync('./assets/js/tailwind-config.js','utf8'),context);
module.exports={...context.tailwind.config,content:['./*.html','./assets/js/*.js','!./assets/js/*.min.js','./scripts/*.js','./scripts/page-translations.json'],plugins:[require('@tailwindcss/forms'),require('@tailwindcss/container-queries')]};
