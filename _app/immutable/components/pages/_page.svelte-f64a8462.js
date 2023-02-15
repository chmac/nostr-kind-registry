import{S as X,i as Z,s as $,k as b,q as A,a as C,l as v,m as g,r as K,h as i,c as H,n as D,b as F,D as l,J as M,K as ee,C as N,L as te,u as Q,M as ae}from"../../chunks/index-ec3efac2.js";import{l as S,e as se}from"../../chunks/singletons-4c3466b4.js";S.disable_scroll_handling;const le=S.goto;S.invalidate;S.invalidateAll;S.preload_data;S.preload_code;S.before_navigate;S.after_navigate;function U(m,a,e){const r=m.slice();return r[6]=a[e],r}function W(m,a){let e,r,d=a[6].kind+"",_,u,o,k=a[6].seen.toDateString()+"",s,c,p,x;function w(){return a[5](a[6])}return{key:m,first:null,c(){e=b("tr"),r=b("td"),_=A(d),u=C(),o=b("td"),s=A(k),c=C(),this.h()},l(E){e=v(E,"TR",{class:!0});var h=g(e);r=v(h,"TD",{class:!0});var y=g(r);_=K(y,d),y.forEach(i),u=H(h),o=v(h,"TD",{class:!0});var f=g(o);s=K(f,k),f.forEach(i),c=H(h),h.forEach(i),this.h()},h(){D(r,"class","border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-1"),D(o,"class","border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-1"),D(e,"class","hover:bg-slate-200 hover:cursor-pointer"),this.first=e},m(E,h){F(E,e,h),l(e,r),l(r,_),l(e,u),l(e,o),l(o,s),l(e,c),p||(x=M(e,"click",w),p=!0)},p(E,h){a=E,h&1&&d!==(d=a[6].kind+"")&&Q(_,d),h&1&&k!==(k=a[6].seen.toDateString()+"")&&Q(s,k)},d(E){E&&i(e),p=!1,x()}}}function re(m){let a,e,r,d,_,u,o,k,s,c,p,x,w,E,h,y,f=[],R=new Map,I,V,O=m[0];const J=t=>t[6].kind;for(let t=0;t<O.length;t+=1){let n=U(m,O,t),T=J(n);R.set(T,f[t]=W(T,n))}return{c(){a=b("div"),e=b("h1"),r=A("All Kinds Ever Seen"),d=A(`
	This page lists every kind our crawlers have ever seen, along with the date of the first sighting.
	Click on a table row to get more information about that kind.`),_=C(),u=b("div"),o=b("table"),k=b("thead"),s=b("tr"),c=b("th"),p=A("Kind"),x=C(),w=b("th"),E=A("First Seen"),h=C(),y=b("tbody");for(let t=0;t<f.length;t+=1)f[t].c();this.h()},l(t){a=v(t,"DIV",{class:!0});var n=g(a);e=v(n,"H1",{class:!0});var T=g(e);r=K(T,"All Kinds Ever Seen"),T.forEach(i),d=K(n,`
	This page lists every kind our crawlers have ever seen, along with the date of the first sighting.
	Click on a table row to get more information about that kind.`),n.forEach(i),_=H(t),u=v(t,"DIV",{class:!0});var P=g(u);o=v(P,"TABLE",{class:!0});var q=g(o);k=v(q,"THEAD",{});var Y=g(k);s=v(Y,"TR",{});var B=g(s);c=v(B,"TH",{class:!0});var j=g(c);p=K(j,"Kind"),j.forEach(i),x=H(B),w=v(B,"TH",{class:!0});var z=g(w);E=K(z,"First Seen"),z.forEach(i),B.forEach(i),Y.forEach(i),h=H(q),y=v(q,"TBODY",{});var G=g(y);for(let L=0;L<f.length;L+=1)f[L].l(G);G.forEach(i),q.forEach(i),P.forEach(i),this.h()},h(){D(e,"class","font-semibold"),D(a,"class","max-w-prose"),D(c,"class","border border-slate-300 hover:bg-slate-200 hover:cursor-pointer"),D(w,"class","border border-slate-300 hover:bg-slate-200 hover:cursor-pointer"),D(o,"class","table-fixed border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm"),D(u,"class","my-2 max-w-xl")},m(t,n){F(t,a,n),l(a,e),l(e,r),l(a,d),F(t,_,n),F(t,u,n),l(u,o),l(o,k),l(k,s),l(s,c),l(c,p),l(s,x),l(s,w),l(w,E),l(o,h),l(o,y);for(let T=0;T<f.length;T+=1)f[T].m(y,null);I||(V=[M(c,"click",m[3]),M(w,"click",m[4])],I=!0)},p(t,[n]){n&1&&(O=t[0],f=ee(f,n,J,1,t,O,R,y,ae,W,null,U))},i:N,o:N,d(t){t&&i(a),t&&i(_),t&&i(u);for(let n=0;n<f.length;n+=1)f[n].d();I=!1,te(V)}}}function oe(m,a,e){let{data:r}=a,d=r.kinds;function _(s){switch(s){case"kind":e(0,d=d.sort((c,p)=>c.kind-p.kind));break;case"seen":e(0,d=d.sort((c,p)=>c.seen.valueOf()-p.seen.valueOf()));break}}const u=()=>_("kind"),o=()=>_("seen"),k=s=>le(`${se}/kinds/${s.kind}`);return m.$$set=s=>{"data"in s&&e(2,r=s.data)},[d,_,r,u,o,k]}class de extends X{constructor(a){super(),Z(this,a,oe,re,$,{data:2})}}export{de as default};