import{a as s,g as a}from"./crawlerApi-a3edcecd.js";function l(t){for(;;){let o=Math.floor(Math.random()*9900+100);if(!t.find(i=>i===o))return o}}function d(t){for(let n=t.length-1;n>0;n--){const e=Math.floor(Math.random()*n),o=t[n];t[n]=t[e],t[e]=o}return t}const m=async()=>{const t=d(await s()),n=await a(),e=l(n.map(({kind:o})=>o));return{relays:t,kinds:n,randomKind:e}},r=Object.freeze(Object.defineProperty({__proto__:null,load:m},Symbol.toStringTag,{value:"Module"}));export{r as _,m as l};