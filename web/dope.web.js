function s(n,t,e){let r=1n;for(n=n%e;t>0n;)t%2n===1n&&(r=r*n%e),n=n*n%e,t/=2n;return r}function w(n){let t=BigInt(n);if(t<2n)return!1;let e=t-1n,r=0n;for(;e%2n===0n||r===0n;)e/=2n,r+=1n;let f=r,u=[2n,3n,5n,7n,11n,13n],i=!1;for(let o of u){let l=BigInt(s(o,e,t));if(!(l==1n||l==(t-1n)%t)){let a=!1;for(let m=0n;m<f-1n;m++)if(l=l**2n%t,l===t-1n){a=!0;break}if(a==!1){i=!0;break}}if(i==!0)break}return!i}var p=w;function B(n,t){let e=null,r=null,f=0n,u=!1;n>t?(e=n,r=t):(e=t,r=n,u=!0);let i=1n,o=0n,l=0n,a=1n;for(;r!==0n;){let m=e/r,g=e%r;e=r,r=g,[i,o]=[o,i-m*o],[l,a]=[a,l-m*a]}return f=e,u?{gcd:f,x:l,y:i}:{gcd:f,x:i,y:l}}var c=B;function R(n=512n){n=BigInt(n);let t=d(n),e=d(n),r=t*e,f=(t-1n)*(e-1n),i=x([114689n,41117n,65537n]),o=c(i,f);if(o.gcd!==1n)throw new Error("Invalid e selected: Not coprime with \u03C6(N)");let l=o.x;return l<0&&(l=l+f),{p:t,q:e,N:r,phiN:f,e:i,d:l}}function d(n){let t=I(BigInt(n));for(;!P(t);)t=I(BigInt(n));return t}function I(n,t=!0){if(n<1)throw new Error("Bit range must be at least 1");let e=1n;for(let r=1;r<n;r++)Math.random()>.5&&(e|=1n<<BigInt(r));return t&&(e|=1n),e}function x(n){let t=Math.floor(Math.random()*n.length);return n[t]}function T(n,t,e){return s(BigInt(n),t,e)}function V(n,t,e,r){let f=s(BigInt(n),BigInt(t),BigInt(e)),u=s(BigInt(n),BigInt(t),BigInt(r)),o=c(r,e).x;o<0&&(o+=e);let l=(u+r*((f-u)*o%e))%(e*r);return l<0&&(l+=e*r),l}function h(n){let t=new Array(n+1).fill(!0);t[0]=t[1]=!1;for(let e=2;e*e<=n;e++)if(t[e])for(let r=e*e;r<=n;r+=e)t[r]=!1;return t.map((e,r)=>e?BigInt(r):null).filter(e=>e!==null)}function y(n){let t=h(1e3);for(let e of t)if(n%e===0n)return!1;return!0}function P(n){return y(n)?p(n):!1}export{V as CRTdecrypt,V as decrypt,T as encrypt,R as generation};
