import{R as n}from"./constants-0acff733.js";const x=async()=>{console.log("#tuKsxI Starting fetch");const t=await fetch(`${n}/kinds/kindsList.txt`,{cache:"reload"});return t.status,console.log("#x7yAAo Fetch finished 200",Array.from(t.headers.entries())),(await t.text()).trim().split(`
`).map(s=>{const[e,a]=s.split(","),o=parseInt(e),c=new Date(a);return{kind:o,seen:c}}).sort((s,e)=>s.seen.getTime()-e.seen.getTime())},g=async()=>{const t=await fetch(`${n}/relays/relaysList.txt`);return t.status!==200?[]:(await t.text()).trim().split(`
`)};export{g as a,x as g};
