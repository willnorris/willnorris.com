if(!("fragmention"in window.location))(function(){function e(t,n){for(var r=t.childNodes,i=0,s,o=[];s=r[i];++i){if(s.nodeType===1&&(s.innerText||s.textContent||"").replace(/\s+/g," ").indexOf(n)!==-1){o=o.concat(e(s,n))}}return o.length?o:t}function t(){if(!/e/.test(document.readyState))return;var t=location.href.match(/#((?:#|%23)?)(.+)/)||[0,"",""],n=document.getElementById(t[1]+t[2]),r=decodeURIComponent(t[2]).replace(/\+/g," ").split("  ");location.fragmention=r[0];location.fragmentionIndex=parseFloat(r[1])||0;if(i){i.removeAttribute("fragmention");if(i.runtimeStyle){i.runtimeStyle.windows=i.runtimeStyle.windows}}if(!n&&location.fragmention){var s=e(document,location.fragmention),o=s.length,u=o&&location.fragmentionIndex%o,a=o&&u>=0?u:o+u;i=o&&s[a];if(i){i.scrollIntoView();i.setAttribute("fragmention","");if(i.runtimeStyle){i.runtimeStyle.windows=i.runtimeStyle.windows}}else{i=null}}}location.fragmention=location.fragmention||"";var n="addEventListener",r=n in window?[n,""]:["attachEvent","on"],i;window[r[0]](r[1]+"hashchange",t);document[r[0]](r[1]+"readystatechange",t);t()})()
