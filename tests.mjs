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

// Production Cycle 1: one new guide, with its examples checked against the unchanged calculators.
const guideRoute='/guides/ebay-sold-comps/';
const guide=fs.readFileSync(`dist${guideRoute}index.html`,'utf8');
if(!fs.readFileSync('dist/guides/index.html','utf8').includes(`href="${guideRoute}"`)||!pageUrls.has(origin+guideRoute))throw new Error('Sold comps guide is not discoverable');
if((guide.match(/<h1>/g)||[]).length!==1||/<(?:form|input)\b/.test(guide))throw new Error('Guide structure regressed');
if(!guide.includes('Illustrative numbers only')||!guide.includes('https://www.ebay.com/sch/ebayadvsearch')||!guide.includes('https://www.ebay.com/help/selling/selling-tools/product-research?id=4853'))throw new Error('Guide example disclosure or sources missing');
const renderCalculation=(kind,values)=>vm.runInContext(`calc(${JSON.stringify(kind)},${JSON.stringify(values)})`,sandbox);
for(const [sale,expected] of [[38,'$14.76'],[40,'$16.50']]){
 const result=renderCalculation('max-buy',{sale,feePct:13,fixed:0.3,shipping:6,targetProfit:12,targetRoi:0});
 if(!result.includes(expected)||!guide.includes(expected))throw new Error('Sold comps worked example mismatch');
}
const calculatorCases=[
 ['profit',{sale:80,cost:24,feePct:13,fixed:0.3,shipping:8.5,pack:1.2,ad:2,prep:0,other:0},'$33.60'],
 ['roi',{investment:30,profit:25},'83.33%'],
 ['break-even',{cost:24,fixed:0.3,shipping:8.5,other:1.2,feePct:15},'$40.00'],
 ['max-buy',{sale:38,feePct:13,fixed:0.3,shipping:6,targetProfit:12,targetRoi:0},'$14.76'],
 ['marketplace-fee',{sale:80,cost:24,feePct:13,fixed:0.3,shipping:8.5,other:1.2},'$35.60'],
 ['offer',{list:90,offer:72,cost:24,feePct:13,fixed:0.3,shipping:8.5,other:1.2,minProfit:20,minRoi:0},'MEETS TARGET']
];
for(const [kind,values,expected] of calculatorCases){
 if(!renderCalculation(kind,values).includes(expected))throw new Error(`Normal scenario failed: ${kind}`);
 const zero=Object.fromEntries(Object.keys(values).map(key=>[key,0]));
 if(/NaN|Infinity/.test(renderCalculation(kind,zero)))throw new Error(`Zero boundary failed: ${kind}`);
 for(const key of Object.keys(values))for(const invalid of [NaN,Infinity,-Infinity])if(isValidInput(kind,key,invalid))throw new Error(`Nonfinite input accepted: ${kind}/${key}`);
 for(const key of Object.keys(values))if(!(kind==='roi'&&key==='profit')&&isValidInput(kind,key,-1))throw new Error(`Negative input accepted: ${kind}/${key}`);
 if(['break-even','max-buy'].includes(kind))for(const feePct of [100,101])if(!renderCalculation(kind,{...values,feePct}).includes('Not possible'))throw new Error(`Reverse fee guard failed: ${kind}`);
}
console.log('PASS: sold comps guide discovery, sources, illustrative examples; six calculator normal/zero/nonfinite/negative checks and reverse-fee boundaries.');
