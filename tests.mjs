import fs from 'node:fs';import vm from 'node:vm';import {execSync} from 'node:child_process';execSync('node build.mjs',{stdio:'inherit'});const origin='https://marginflips.reselltools.workers.dev',oldHost='chatgpt'+'.site';const must=['dist/index.html','dist/tools/profit/index.html','dist/tools/roi/index.html','dist/tools/break-even/index.html','dist/tools/max-buy/index.html','dist/tools/marketplace-fee/index.html','dist/tools/offer/index.html','dist/guides/index.html','dist/404/index.html','dist/robots.txt','dist/sitemap.xml'];for(const f of must)if(!fs.existsSync(f))throw new Error(`Missing ${f}`);const js=fs.readFileSync('dist/assets/app.js','utf8');new vm.Script(js);const document={querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}};const sandbox={document,window:{},globalThis:null,Intl,Number,FormData:class{}};sandbox.globalThis=sandbox;vm.createContext(sandbox);vm.runInContext(js,sandbox);const {calculateROI,isValidInput}=sandbox.MarginFlipsTest;if(calculateROI(100,-20)!==-20)throw new Error('ROI loss test failed');if(calculateROI(0,-20)!==null)throw new Error('Zero investment guard failed');if(!isValidInput('roi','profit',-20))throw new Error('ROI negative Net Profit validation failed');if(isValidInput('roi','investment',-100)||isValidInput('profit','cost',-20))throw new Error('Nonnegative input guards regressed');if(isValidInput('roi','profit',NaN)||isValidInput('roi','profit',Infinity))throw new Error('NaN/Infinity guard failed');const html=fs.readFileSync('dist/index.html','utf8');if(!html.includes('https://payhip.com/b/pTi34'))throw new Error('Missing Payhip URL');for(const f of must.filter(x=>x.endsWith('index.html'))){const s=fs.readFileSync(f,'utf8');if(!s.includes(`rel="canonical" href="${origin}`)||!s.includes(`property="og:url" content="${origin}`))throw new Error(`Public SEO URL missing in ${f}`);for(const a of [...s.matchAll(/href="(\/[^"#?]*)"/g)].map(x=>x[1])){if(a.startsWith('/assets/'))continue;const target=a==='/'?'dist/index.html':`dist${a}index.html`;if(!fs.existsSync(target))throw new Error(`Broken internal link ${a} in ${f}`)}}const seoFiles=['build.mjs',...fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html')||f==='sitemap.xml'||f==='robots.txt').map(f=>`dist/${f}`)];for(const f of seoFiles)if(fs.readFileSync(f,'utf8').includes(oldHost))throw new Error(`Old Site host remains in ${f}`);if(fs.readFileSync('dist/robots.txt','utf8').trimEnd()!==`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml`)throw new Error('robots.txt sitemap URL mismatch');if(!fs.readFileSync('dist/sitemap.xml','utf8').includes(`<loc>${origin}/</loc>`))throw new Error('sitemap origin mismatch');console.log('PASS: full regression and public SEO URL consistency verified; no old Site host remains.');
// Migration checks cover every generated page and the files recreated by a clean build.
const verification='googlec73a8467744961cf.html';
if(fs.readFileSync(`dist/${verification}`,'utf8')!==`google-site-verification: ${verification}`)throw new Error('Google verification content mismatch');
if(fs.readFileSync('dist/404.html','utf8')!==fs.readFileSync('dist/404/index.html','utf8'))throw new Error('Custom 404 content mismatch');
const config=JSON.parse(fs.readFileSync('wrangler.jsonc','utf8'));
if(config.name!=='marginflips'||config.compatibility_date!=='2026-09-11'||config.assets.directory!=='./dist'||config.assets.not_found_handling!=='404-page'||config.assets.html_handling!=='auto-trailing-slash')throw new Error('Cloudflare assets configuration mismatch');
if(fs.existsSync('dist/_redirects')&&/^\s*\S+\s+\S+\s+404\s*$/m.test(fs.readFileSync('dist/_redirects','utf8')))throw new Error('Unsupported 404 rewrite');
const pageUrls=new Set();
for(const file of fs.readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.html')&&f!==verification)){
 const page=fs.readFileSync(`dist/${file}`,'utf8');
 const route=file.replaceAll('\\','/');
 const expected=origin+(route==='404.html'?'/404/':'/'+route.replace(/index\.html$/,''));
 const canonical=page.match(/rel="canonical" href="([^"]+)"/)?.[1];
 const og=page.match(/property="og:url" content="([^"]+)"/)?.[1];
 const data=JSON.parse(page.match(/<script type="application\/ld\+json">(.*?)<\/script>/)?.[1]??'null');
 if(canonical!==expected||og!==expected||data?.url!==expected)throw new Error(`SEO mismatch: ${file}`);
 if(!route.startsWith('404'))pageUrls.add(expected);
 for(const [,link] of page.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)){
  const target=`dist${link}${link.endsWith('/')?'index.html':''}`;
  if(!fs.existsSync(target))throw new Error(`Broken internal link ${link} in ${file}`);
 }
}
const sitemapUrls=[...fs.readFileSync('dist/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
if(sitemapUrls.length!==pageUrls.size||sitemapUrls.some(url=>!pageUrls.has(url)))throw new Error('Sitemap page URLs mismatch');
const retiredHosts=['marginflips'+'.vercel.app',oldHost];
for(const file of fs.readdirSync('.',{recursive:true}).filter(f=>!f.split(/[\\/]/).some(p=>p==='node_modules'||p==='.git'))){
 if(fs.statSync(file).isFile()&&retiredHosts.some(host=>fs.readFileSync(file,'utf8').includes(host)))throw new Error(`Retired host remains: ${file}`);
}
console.log(`PASS: ${pageUrls.size} sitemap pages; all page SEO and internal links; Google verification; custom 404; Cloudflare configuration; source/dist retired-host scan.`);
