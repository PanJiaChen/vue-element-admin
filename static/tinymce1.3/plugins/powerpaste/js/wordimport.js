/**
 * Word Import JavaScript Library
 * Copyright (c) 2013-2015 Ephox Corp. All rights reserved.
 * This software is provided "AS IS," without a warranty of any kind.
 */
function com_ephox_keurig_Keurig(){var Pb='',Qb='" for "gwt:onLoadErrorFn"',Rb='" for "gwt:onPropertyErrorFn"',Sb='"><\/script>',Tb='#',Ub='&',Vb='/',Wb='90BA12EED4B8175F02A135767FCD6360',Xb=':',Yb=':1',Zb=':2',$b=':3',_b=':4',ac=':5',bc=':6',cc=':7',dc=':8',ec=':9',fc='<script id="',gc='=',hc='?',ic='Bad handler "',jc='DOMContentLoaded',kc='SCRIPT',lc='Single-script hosted mode not yet implemented. See issue ',mc='Unexpected exception in locale detection, using default: ',nc='_',oc='__gwt_Locale',pc='__gwt_marker_com.ephox.keurig.Keurig',qc='base',rc='clear.cache.gif',sc='com.ephox.keurig.Keurig',tc='content',uc='default',vc='en',wc='gecko',xc='gecko1_8',yc='gwt.codesvr=',zc='gwt.hosted=',Ac='gwt.hybrid',Bc='gwt:onLoadErrorFn',Cc='gwt:onPropertyErrorFn',Dc='gwt:property',Ec='http://code.google.com/p/google-web-toolkit/issues/detail?id=2079',Fc='ie10',Gc='ie8',Hc='ie9',Ic='img',Jc='locale',Kc='locale=',Lc='meta',Mc='msie',Nc='name',Oc='safari',Pc='unknown',Qc='user.agent',Rc='webkit';var k=Pb,l=Qb,m=Rb,n=Sb,o=Tb,p=Ub,q=Vb,r=Wb,s=Xb,t=Yb,u=Zb,v=$b,w=_b,A=ac,B=bc,C=cc,D=dc,F=ec,G=fc,H=gc,I=hc,J=ic,K=jc,L=kc,M=lc,N=mc,O=nc,P=oc,Q=pc,R=qc,S=rc,T=sc,U=tc,V=uc,W=vc,X=wc,Y=xc,Z=yc,$=zc,_=Ac,ab=Bc,bb=Cc,cb=Dc,db=Ec,eb=Fc,fb=Gc,gb=Hc,hb=Ic,ib=Jc,jb=Kc,kb=Lc,lb=Mc,mb=Nc,nb=Oc,ob=Pc,pb=Qc,qb=Rc;var rb=window,sb=document,tb,ub,vb=k,wb={},xb=[],yb=[],zb=[],Ab=0,Bb,Cb;if(!rb.__gwt_stylesLoaded){rb.__gwt_stylesLoaded={}}if(!rb.__gwt_scriptsLoaded){rb.__gwt_scriptsLoaded={}}function Db(){var b=false;try{var c=rb.location.search;return (c.indexOf(Z)!=-1||(c.indexOf($)!=-1||rb.external&&rb.external.gwtOnLoad))&&c.indexOf(_)==-1}catch(a){}Db=function(){return b};return b}
function Eb(){if(tb&&ub){tb(Bb,T,vb,Ab)}}
function Fb(){var e,f=Q,g;sb.write(G+f+n);g=sb.getElementById(f);e=g&&g.previousSibling;while(e&&e.tagName!=L){e=e.previousSibling}function h(a){var b=a.lastIndexOf(o);if(b==-1){b=a.length}var c=a.indexOf(I);if(c==-1){c=a.length}var d=a.lastIndexOf(q,Math.min(c,b));return d>=0?a.substring(0,d+1):k}
;if(e&&e.src){vb=h(e.src)}if(vb==k){var i=sb.getElementsByTagName(R);if(i.length>0){vb=i[i.length-1].href}else{vb=h(sb.location.href)}}else if(vb.match(/^\w+:\/\//)){}else{var j=sb.createElement(hb);j.src=vb+S;vb=h(j.src)}if(g){g.parentNode.removeChild(g)}}
function Gb(){var b=document.getElementsByTagName(kb);for(var c=0,d=b.length;c<d;++c){var e=b[c],f=e.getAttribute(mb),g;if(f){if(f==cb){g=e.getAttribute(U);if(g){var h,i=g.indexOf(H);if(i>=0){f=g.substring(0,i);h=g.substring(i+1)}else{f=g;h=k}wb[f]=h}}else if(f==bb){g=e.getAttribute(U);if(g){try{Cb=eval(g)}catch(a){alert(J+g+m)}}}else if(f==ab){g=e.getAttribute(U);if(g){try{Bb=eval(g)}catch(a){alert(J+g+l)}}}}}}
function Hb(a,b){return b in xb[a]}
function Ib(a){var b=wb[a];return b==null?null:b}
function Jb(a,b){var c=zb;for(var d=0,e=a.length-1;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
function Kb(a){var b=yb[a](),c=xb[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(Cb){Cb(a,d,b)}throw null}
yb[ib]=function(){var b=null;var c=V;try{if(!b){var d=location.search;var e=d.indexOf(jb);if(e>=0){var f=d.substring(e+7);var g=d.indexOf(p,e);if(g<0){g=d.length}b=d.substring(e+7,g)}}if(!b){b=Ib(ib)}if(!b){b=rb[P]}if(b){c=b}while(b&&!Hb(ib,b)){var h=b.lastIndexOf(O);if(h<0){b=null;break}b=b.substring(0,h)}}catch(a){alert(N+a)}rb[P]=c;return b||V};xb[ib]={'default':0,en:1};yb[pb]=function(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(qb)!=-1}())return nb;if(function(){return b.indexOf(lb)!=-1&&sb.documentMode>=10}())return eb;if(function(){return b.indexOf(lb)!=-1&&sb.documentMode>=9}())return gb;if(function(){return b.indexOf(lb)!=-1&&sb.documentMode>=8}())return fb;if(function(){return b.indexOf(X)!=-1}())return Y;return ob};xb[pb]={gecko1_8:0,ie10:1,ie8:2,ie9:3,safari:4};com_ephox_keurig_Keurig.onScriptLoad=function(a){com_ephox_keurig_Keurig=null;tb=a;Eb()};if(Db()){alert(M+db);return}Fb();Gb();try{var Lb;Jb([V,Y],r);Jb([V,eb],r+t);Jb([V,fb],r+u);Jb([V,gb],r+v);Jb([V,nb],r+w);Jb([W,Y],r+A);Jb([W,eb],r+B);Jb([W,fb],r+C);Jb([W,gb],r+D);Jb([W,nb],r+F);Lb=zb[Kb(ib)][Kb(pb)];var Mb=Lb.indexOf(s);if(Mb!=-1){Ab=Number(Lb.substring(Mb+1))}}catch(a){return}var Nb;function Ob(){if(!ub){ub=true;Eb();if(sb.removeEventListener){sb.removeEventListener(K,Ob,false)}if(Nb){clearInterval(Nb)}}}
if(sb.addEventListener){sb.addEventListener(K,function(){Ob()},false)}var Nb=setInterval(function(){if(/loaded|complete/.test(sb.readyState)){Ob()}},50)}
com_ephox_keurig_Keurig();(function () {var $gwt_version = "2.6.1";var $wnd = window;var $doc = $wnd.document;var $moduleName, $moduleBase;var $stats = $wnd.__gwtStatsEvent ? function(a) {$wnd.__gwtStatsEvent(a)} : null;var $strongName = '90BA12EED4B8175F02A135767FCD6360';function A(){}
function Z(){}
function Wo(){}
function ub(){}
function uk(){}
function ik(){}
function mk(){}
function qk(){}
function yk(){}
function Jk(){}
function Ng(){}
function Xg(){}
function fh(){}
function Ah(){}
function Ch(){}
function $n(){}
function xg(a){}
function _b(){Kb()}
function md(){kd()}
function pd(){kd()}
function wd(){td()}
function jf(){hf()}
function pf(){of()}
function vf(){uf()}
function Ef(){Df()}
function Of(){Nf()}
function uh(){jh()}
function db(){bb(this)}
function Sl(){Ql(this)}
function _l(){Wl(this)}
function am(){Wl(this)}
function Mm(a){this.b=a}
function Zm(a){this.b=a}
function W(a){this.b=a}
function Gc(a){this.b=a}
function Lc(a){this.b=a}
function Rn(a){this.b=a}
function tn(a){this.c=a}
function Wd(a,b){a.i=b}
function yh(a,b){a.b+=b}
function Xd(a,b){a.h=a.i=b}
function Ic(a,b){yn(a.b,b)}
function Dg(){return zg}
function Ql(a){a.b=new Ah}
function Wl(a){a.b=new Ah}
function mc(){this.b=new Do}
function Jc(){this.b=new Fn}
function Do(){this.b=new Fn}
function fg(){fg=Wo;eg=new A}
function xb(){xb=Wo;wb=new _b}
function Ec(){Cc();return sc}
function cg(){Tj().w(this)}
function cl(){cg.call(this)}
function Fk(){cg.call(this)}
function Uk(){cg.call(this)}
function Wk(){cg.call(this)}
function Zk(){cg.call(this)}
function eo(){cg.call(this)}
function oo(){cg.call(this)}
function Gk(a){dg.call(this,a)}
function Xk(a){dg.call(this,a)}
function $k(a){dg.call(this,a)}
function gl(a){Xk.call(this,a)}
function hm(a){dg.call(this,a)}
function ae(a){this.b=xl(a+Ap)}
function ic(){this.c=(Cc(),wc)}
function Qo(a,b,c){Dm(a.b,b,c)}
function Sf(a,b){a.b[a.c++]=b}
function Ud(a,b){return a.i+=b}
function Pd(a,b){return a.f[b]}
function Io(a,b){return a.e[b]}
function Am(b,a){return b.f[Pp+a]}
function dk(b,a){return b.exec(a)}
function ak(a){return new $j[a]}
function bk(){return !!$stats}
function Dn(a){return Eh(a.b,a.c)}
function rn(a){return a.b<a.c.J()}
function Qd(a,b){return a.f[b]<=32}
function Gd(a,b){return Hd(a,b,a.k)}
function Kd(a,b){return Ld(a,b,a.k)}
function Rg(a){return Vg((Tj(),a))}
function Mo(a){No.call(this,a,0)}
function cn(a,b){this.c=a;this.b=b}
function jo(a,b){this.b=a;this.c=b}
function Rl(a,b){yh(a.b,b);return a}
function Xl(a,b){yh(a.b,b);return a}
function Co(a,b){yn(a.b,b);return b}
function Ln(a,b,c){a.splice(b,c)}
function Yl(a,b){return ll(a.b.b,b)}
function Fg(a,b){return Bh(a,b,null)}
function Dh(a){return Eh(a,a.length)}
function Wh(a){return a==null?null:a}
function Cm(b,a){return Pp+a in b.f}
function ol(b,a){return b.indexOf(a)}
function Gg(a){$wnd.clearTimeout(a)}
function dg(a){this.f=a;Tj().w(this)}
function Fn(){this.b=Hh(Mj,$o,0,0,0)}
function Tl(a){Ql(this);yh(this.b,a)}
function bm(a){Wl(this);yh(this.b,a)}
function T(a,b){L();this.c=a;this.b=b}
function Nc(a,b){return b<256&&a.b[b]}
function Qh(a,b){return a.cM&&a.cM[b]}
function Jo(a,b){return ek(a.c,a.b,b)}
function Al(a){return Hh(Oj,$o,1,a,0)}
function Sg(a){return parseInt(a)||-1}
function Cg(a){return a.$H||(a.$H=++tg)}
function Ph(a,b){return a.cM&&!!a.cM[b]}
function _c(a,b){return a.b[b>=128?0:b]}
function fk(a,b){return new RegExp(a,b)}
function Vh(a){return a.tM==Wo||Ph(a,1)}
function ll(b,a){return b.charCodeAt(a)}
function ln(a,b){(a<0||a>=b)&&on(a,b)}
function Th(a,b){return a!=null&&Ph(a,b)}
function ek(c,a,b){return a.replace(c,b)}
function pl(c,a,b){return c.indexOf(a,b)}
function ql(b,a){return b.lastIndexOf(a)}
function Yn(){Yn=Wo;Xn=new $n}
function Kg(){Kg=Wo;Jg=new Ng}
function Vo(){Vo=Wo;Uo=new So}
function Ll(){Ll=Wo;Il={};Kl={}}
function ge(){ge=Wo;fe=xl('class=')}
function Ve(){Ve=Wo;Ue=xl(yp);Te=xl(zp)}
function kd(){kd=Wo;ed();jd=xl('style=')}
function Qc(){Qc=Wo;Pc=xl('<v:imagedata ')}
function Re(){Re=Wo;Qe=xl('/*');Pe=xl('*/')}
function Sc(a,b){return Sd(a,b)&&Ed(a,62)}
function wl(c,a,b){return c.substr(a,b-a)}
function Zl(a,b,c){return zh(a.b,b,c,op),a}
function $l(a,b,c,d){zh(a.b,b,c,d);return a}
function An(a,b){ln(b,a.c);return a.b[b]}
function Ho(a){a.e=dk(a.c,a.b);return !!a.e}
function Pk(a){var b=$j[a.d];a=null;return b}
function jg(a){return a==null?null:a.name}
function ig(a){return a==null?null:a.message}
function To(a,b){return a!=null?a[b]:null}
function wg(a,b,c){return a.apply(b,c);var d}
function rl(c,a,b){return c.lastIndexOf(a,b)}
function El(a){return String.fromCharCode(a)}
function So(){this.b=new ho;new ho;new ho}
function De(a){Be();this.b=xe;this.b=a?ye:xe}
function Dc(a,b,c){this.d=a;this.c=c;this.b=b}
function Vd(a,b,c){a.f=b;a.k=c;a.h=a.i=0}
function Mn(a,b,c,d){a.splice(b,c,d)}
function Tf(a,b,c,d){fm(b,c,a.b,a.c,d);a.c+=d}
function yn(a,b){Jh(a.b,a.c++,b);return true}
function Wg(){try{null.a()}catch(a){return a}}
function og(a){var b;return b=a,Vh(b)?b.cZ:Ei}
function Qk(a){return typeof a=='number'&&a>0}
function vl(b,a){return b.substr(a,b.length-a)}
function Uh(a){return a!=null&&a.tM!=Wo&&!Ph(a,1)}
function zh(a,b,c,d){a.b=wl(a.b,0,b)+d+vl(a.b,c)}
function Hl(a,b){zl(a.length,b);return Cl(a,0,b)}
function Og(a,b){!a&&(a=[]);a[a.length]=b;return a}
function Tg(a,b){a.length>=b&&a.splice(0,b);return a}
function ue(){ue=Wo;te=xl(pp);se=xl('<\/span')}
function Ne(){Ne=Wo;Me=xl('xmlns');Le=xl('<html')}
function td(){td=Wo;ed();rd=xl('\n\r{');sd=xl(' \t,')}
function L(){L=Wo;J=(Yn(),Yn(),Xn);K=new W(J)}
function hf(){hf=Wo;oe();ue();cf();gf=new Oc('<\n\r')}
function Mh(){Mh=Wo;Kh=[];Lh=[];Nh(new Ch,Kh,Lh)}
function jh(){jh=Wo;Error.stackTraceLimit=128}
function Vf(a){this.b=Hh(Jj,cp,-1,a,1);this.c=0}
function Zc(a,b){var c;c=a.f;Vd(a,b.b,b.c);b.b=c;b.c=0}
function ng(a,b){var c;return c=a,Vh(c)?c.eQ(b):c===b}
function pg(a){var b;return b=a,Vh(b)?b.hC():Cg(b)}
function P(a,b){L();return new T(new W(a),new W(b))}
function Dm(a,b,c){return !b?Fm(a,c):Em(a,b,c,~~Cg(b))}
function go(a,b){return Wh(a)===Wh(b)||a!=null&&ng(a,b)}
function Eo(a,b){return Wh(a)===Wh(b)||a!=null&&ng(a,b)}
function on(a,b){throw new $k('Index: '+a+', Size: '+b)}
function de(){de=Wo;be=new Oc(Bp);ce=new Oc(' \t\r\n')}
function uf(){uf=Wo;oe();ue();cf();ge();tf=new Oc('<c\n\r')}
function cf(){cf=Wo;af=new Oc(' >\r\n\t');bf=new Oc(Bp)}
function Ad(){Ad=Wo;yd=xl(yp);xd=xl(zp);Re();zd=new wd}
function Ol(){if(Jl==256){Il=Kl;Kl={};Jl=0}++Jl}
function bb(a){if(!ab){ab=true;Vo();Qo(Uo,ci,a);cb(a)}}
function Eg(a){$wnd.setTimeout(function(){throw a},0)}
function Hg(){return Fg(function(){sg!=0&&(sg=0);vg=-1},10)}
function tl(c,a,b){b=Bl(b);return c.replace(RegExp(a,dq),b)}
function ml(a,b){if(!Th(b,1)){return false}return String(a)==b}
function Rh(a,b){if(a!=null&&!Qh(a,b)){throw new Uk}return a}
function sn(a){if(a.b>=a.c.J()){throw new oo}return a.c.T(a.b++)}
function em(a){$k.call(this,'String index out of range: '+a)}
function il(a,b,c){this.b=Rp;this.e=a;this.c=b;this.d=c}
function zb(a,b){xb();this.b=rb(new ub,a);this.c=b;this.d=true}
function Ko(a,b){var c;this.b=b;this.c=fk((c=a.b,c.source),dq)}
function Hh(a,b,c,d,e){var f;f=Gh(e,d);Ih(a,b,c,f);return f}
function Lk(a,b,c){var d;d=new Jk;d.e=a+b;Qk(c)&&Rk(c,d);return d}
function Ih(a,b,c,d){Mh();Oh(d,Kh,Lh);d.cZ=a;d.cM=b;d.qI=c;return d}
function nl(a,b,c,d){var e;for(e=0;e<b;++e){c[d++]=a.charCodeAt(e)}}
function Ag(a,b,c){var d;d=yg();try{return wg(a,b,c)}finally{Bg(d)}}
function xn(a,b,c){(b<0||b>a.c)&&on(b,a.c);Mn(a.b,b,0,c);++a.c}
function Uf(a){for(;a.c>0;a.c--){if(a.b[a.c-1]>32){break}}}
function Fm(a,b){var c;c=a.c;a.c=b;if(!a.d){a.d=true;++a.e}return c}
function Fh(a,b){var c,d;c=a;d=Gh(0,b);Ih(c.cZ,c.cM,c.qI,d);return d}
function of(){of=Wo;le();$e();Je();Ne();Qc();nf=new Oc('<x\n\r')}
function $e(){$e=Wo;Ze=xl('<![if');Ye=xl(Cp);Xe=xl('<![endif]>')}
function le(){le=Wo;ke=xl('<!--[if');je=xl(Cp);ie=xl('<![endif]-->')}
function qg(a){return a.toString?a.toString():'[JavaScriptObject]'}
function Xh(a){return ~~Math.max(Math.min(a,2147483647),-2147483648)}
function Sh(a){if(a!=null&&(a.tM==Wo||Ph(a,1))){throw new Uk}return a}
function zl(a,b){if(b<0){throw new em(b)}if(b>a){throw new em(b)}}
function Bn(a,b,c){for(;c<a.c;++c){if(Eo(b,a.b[c])){return c}}return -1}
function Cn(a,b){var c;c=(ln(b,a.c),a.b[b]);Ln(a.b,b,1);--a.c;return c}
function Nk(a,b){var c;c=new Jk;c.e=a+b;Qk(0)&&Rk(0,c);c.c=2;return c}
function Ok(a,b){var c;c=new Jk;c.e=op+a;Qk(b)&&Rk(b,c);c.c=1;return c}
function Eh(a,b){var c,d;c=a;d=c.slice(0,b);Ih(c.cZ,c.cM,c.qI,d);return d}
function xl(a){var b,c;c=a.length;b=Hh(Jj,cp,-1,c,1);nl(a,c,b,0);return b}
function Ao(a){var b;b=a.b.c;if(b>0){return An(a.b,b-1)}else{throw new eo}}
function Bo(a){var b;b=a.b.c;if(b>0){return Cn(a.b,b-1)}else{throw new eo}}
function gb(a,b,c){var d;d=hb(a,b,c);if(d>3*c){throw new Wk}else{return d}}
function Zb(a,b){var c,d;c=Ub(a,Gb,b,wp);d=Ub(a,Jb,c,xp);return d==null?b:d}
function xm(a,b){return b==null?a.d:Th(b,1)?Cm(a,Rh(b,1)):Bm(a,b,~~pg(b))}
function ym(a,b){return b==null?a.c:Th(b,1)?Am(a,Rh(b,1)):zm(a,b,~~pg(b))}
function R(a,b){return U(a.c.b,b.c.b)&&(L(),U(Rh(a.b.b,25),Rh(b.b.b,25)))}
function Nn(a,b,c,d){Array.prototype.splice.apply(a,[b,c].concat(d))}
function Oh(a,b,c){Mh();for(var d=0,e=b.length;d<e;++d){a[b[d]]=c[d]}}
function Nh(a,b,c){var d=0,e;for(var f in a){if(e=a[f]){b[d]=f;c[d]=e;++d}}}
function Gm(e,a,b){var c,d=e.f;a=Pp+a;a in d?(c=d[a]):++e.e;d[a]=b;return c}
function Mk(a,b,c,d){var e;e=new Jk;e.e=a+b;Qk(c)&&Rk(c,e);e.c=d?8:0;return e}
function G(a,b){var c,d;d=new am(a.length*b);for(c=0;c<b;c++){yh(d.b,a)}return d.b.b}
function Bh(a,b,c){var d=$wnd.setTimeout(function(){a();c!=null&&xg(c)},b);return d}
function Go(a,b,c){Rl(b,wl(a.b,a.d,a.e.index));yh(b.b,c);a.d=a.c.lastIndex;return a}
function ho(){this.b=[];this.f={};this.d=false;this.c=null;this.e=0}
function hg(a){fg();cg.call(this);this.b=op;this.c=a;this.b=op;Tj().u(this)}
function Bg(a){a&&Mg((Kg(),Jg));--sg;if(a){if(vg!=-1){Gg(vg);vg=-1}}}
function Yj(a){if(Th(a,24)){return a}return a==null?new hg(null):Wj(a)}
function re(a){if(!Yd(a)){return false}if(a.i==a.h){return false}a.h=a.i;return true}
function Ed(a,b){var c;for(c=a.i;c<a.k;c++){if(a.f[c]==b){a.i=c;return true}}return false}
function Jd(a,b){var c;for(c=a.i;c<a.k;c++){if(Nc(b,a.f[c])){a.i=c;return true}}return false}
function Fd(a,b,c){var d;for(d=a.i;d<c;d++){if(a.f[d]==b){a.i=d;return true}}return false}
function jm(a,b){var c;while(a.N()){c=a.O();if(b==null?c==null:ng(b,c)){return a}}return null}
function Mg(a){var b,c;if(a.c){c=null;do{b=a.c;a.c=null;c=Pg(b,c)}while(a.c);a.c=c}}
function Lg(a){var b,c;if(a.b){c=null;do{b=a.b;a.b=null;c=Pg(b,c)}while(a.b);a.b=c}}
function Pb(a){var b,c;b=a.b>1?' start="'+a.b+tp:op;c=a.c;return sp+c.b+b+c.c+'><li>'}
function Rm(a){var b;b=new Fn;a.d&&yn(b,new Zm(a));wm(a,b);vm(a,b);this.b=new tn(b)}
function X(a){var b,c,d;d=new Fn;for(c=new tn(a);c.b<c.c.J();){b=Rh(sn(c),25);zn(d,b)}return d}
function rb(a,b){var c,d;d=tl(b,'&#39;',"'");a.b=new bm(d);c=true;while(c){c=tb(a)}return a.b.b.b}
function mb(a,b){var c,d,e;e=pl(a,Fl(32),b);d=pl(a,Fl(62),b);c=e<d&&e!=-1?e:d;return wl(a,b,c)}
function U(a,b){if(a==null||b==null){throw new Xk('No nulls permitted')}return ng(a,b)}
function Ck(a,b,c){c&&(a=a.replace(new RegExp('\\.\\*',dq),'[\\s\\S]*'));return new RegExp(a,b)}
function ib(a,b,c){if(a.b.b.length>0&&a.b.b.charCodeAt(0)==b){zh(a.b,0,1,op);return c}else{return 0}}
function hb(a,b,c){var d;d=0;while(a.b.b.length>0&&a.b.b.charCodeAt(0)==b){zh(a.b,0,1,op);d+=c}return d}
function zn(a,b){var c,d;c=b.K();d=c.length;if(d==0){return false}Nn(a.b,a.c,0,c);a.c+=d;return true}
function We(a){if(!Sd(a,Ue)){return false}if(!Gd(a,Te)){return false}Xd(a,a.i+Te.length);return true}
function Se(a){if(!Sd(a,Qe)){return false}a.i+=2;if(!Gd(a,Pe)){return false}Xd(a,a.i+2);return true}
function Xj(a){var b;if(Th(a,13)){b=Rh(a,13);if(b.c!==(fg(),eg)){return b.c===eg?null:b.c}}return a}
function Wb(a){var b,c;b=new tn(a.b);while(b.b<b.c.J()){c=Rh(sn(b),11);if(Xb(c)){return false}}return true}
function Td(a,b,c){var d,e,f;for(e=0,f=c.length;e<f;++e){d=c[e];if(Rd(a,b,d)){return true}}return false}
function Kk(a,b,c,d){var e;e=new Jk;e.e=a+b;Qk(c!=0?-c:0)&&Rk(c!=0?-c:0,e);e.c=4;e.b=d;return e}
function Tj(){switch(Sj){case 0:case 5:return new fh;case 4:case 9:return new uh;}return new Xg}
function zg(c){return function(){try{return Ag(c,this,arguments);var b}catch(a){throw a}}}
function Wj(b){var c=b.__gwt$exception;if(!c){c=new hg(b);try{b.__gwt$exception=c}catch(a){}}return c}
function qe(a,b){var c;c=0;while(a.length>b+c&&null!=String.fromCharCode(a[b+c]).match(/[A-Z\d]/i)){++c}return c}
function _f(a){var b,c,d;c=Hh(Nj,$o,23,a.length,0);for(d=0,b=a.length;d<b;++d){if(!a[d]){throw new cl}c[d]=a[d]}}
function Wc(){Wc=Wo;Uc=Ih(Lj,$o,12,[new pf,new Ef,new vf,new jf]);Vc=Ih(Lj,$o,12,[new pf,new Of,new jf])}
function Df(){Df=Wo;cf();Ad();Cf=new De(false);de();Af=new md;Bf=new ae(Jp);zf=new Oc('<lsovwxp')}
function Nf(){Nf=Wo;cf();Ve();Mf=new De(true);de();Jf=new pd;Kf=new ae('class');Lf=new ae(Jp);If=new Oc('<lscovwxp')}
function Je(){Je=Wo;Fe=xl('<meta');Ge=xl('name=');Ie=xl('ProgId');Ee=xl('Generator');He=xl('Originator')}
function M(a){var b;b=yb(Rh(a.c.b,1));return P(b.c.b,X(new Rn(Ih(Mj,$o,0,[Rh(a.b.b,25),Rh(b.b.b,25)]))))}
function Lb(a,b){var c;if(Wb(b)){Jh(a.b,a.c++,b)}else{c=new tn(b.b);while(c.b<c.c.J()){yn(a,new Gc(Rh(sn(c),11).b))}}}
function wm(e,a){var b=e.f;for(var c in b){if(c.charCodeAt(0)==58){var d=new cn(e,c.substring(1));a.G(d)}}}
function Od(a,b){var c;c=b;for(;c>=0;c--){if(a.f[c]==62){return false}if(a.f[c]==60){a.i=c;return true}}return false}
function Yd(a){var b,c;for(c=a.i;c<a.k;c++){b=a.f[c];if(b!=32&&b!=9&&b!=13&&b!=10){a.i=c;return true}}return false}
function Nl(a){Ll();var b=Pp+a;var c=Kl[b];if(c!=null){return c}c=Il[b];c==null&&(c=Ml(a));Ol();return Kl[b]=c}
function Hk(a){if(a>=48&&a<58){return a-48}if(a>=97&&a<97){return a-97+10}if(a>=65&&a<65){return a-65+10}return -1}
function jb(a,b,c,d){if(a.b.b.length>1&&a.b.b.charCodeAt(0)==b&&a.b.b.charCodeAt(1)==c){zh(a.b,0,2,op);return d}else{return 0}}
function Ob(a,b){var c,d,e;e=new Ko(Db,b);e.e=dk(e.c,e.b);if(e.e){d=Io(e,e.e[1]==null?2:1);c=_k(d);return c==0?1:c}else{return a}}
function Ld(a,b,c){var d,e,f,g;for(g=a.i;g<c;g++){for(e=0,f=b.length;e<f;++e){d=b[e];if(d==a.f[g]){a.i=g;return true}}}return false}
function yg(){var a;if(sg!=0){a=(new Date).getTime();if(a-ug>2000){ug=a;vg=Hg()}}if(sg++==0){Lg((Kg(),Jg));return true}return false}
function gwtOnLoad(b,c,d,e){$moduleName=c;$moduleBase=d;Sj=e;if(b)try{mp(Vj)()}catch(a){b(c)}else{mp(Vj)()}}
function No(a,b){var c,d;this.b=(c=false,d=op,(b&1)!=0&&(d+='m'),(b&2)!=0&&(d+=Dp),(b&32)!=0&&(c=true),Ck(a,d,c))}
function Oc(a){var b;this.b=Hh(Pj,ap,-1,256,2);for(b=0;b<a.length;b++){a.charCodeAt(b)<256&&(this.b[a.charCodeAt(b)]=true)}}
function Zd(a){this.j=Ih(Qj,bp,2,[]);this.f=Hh(Jj,cp,-1,a.length,1);nl(a,a.length,this.f,0);this.k=a.length;this.h=this.i=0}
function En(a,b){var c;b.length<a.c&&(b=Fh(b,a.c));for(c=0;c<a.c;++c){Jh(b,c,a.b[c])}b.length>a.c&&Jh(b,a.c,null);return b}
function Sd(a,b){var c,d;c=b.length-1;if((d=a.i+c)>=a.k){return false}do{if(b[c--]!=a.f[d--]){return false}}while(c>=0);return true}
function Rd(a,b,c){var d,e;e=b;d=c.length-1;if((e+=d)>=a.k){return false}do{if(c[d--]!=a.f[e--]){return false}}while(d>=0);return true}
function ld(a,b,c){var d;if(!Sd(b,jd)){return false}d=b.h;if(!Od(b,d)){return false}b.i=d;return Md(b)&&fd(a,b,c,d,b.e,b.d,b.b)}
function tb(a){var b,c,d,e;c=a.b.b.b.indexOf('mso-number-format:');if(c<0){return false}d=c+18;b=sb(a,d);e=d-18;e>-1&&Zl(a.b,e,b);return true}
function Bl(a){var b;b=0;while(0<=(b=a.indexOf('\\',b))){a.charCodeAt(b+1)==36?(a=wl(a,0,b)+'$'+vl(a,++b)):(a=wl(a,0,b)+vl(a,++b))}return a}
function kh(a,b){var c;c=eh(a,b);if(c.length==0){return (new Xg).A(b)}else{c[0].indexOf('anonymous@@')==0&&(c=Tg(c,1));return c}}
function zm(h,a,b){var c=h.b[b];if(c){for(var d=0,e=c.length;d<e;++d){var f=c[d];var g=f.P();if(h.M(a,g)){return f.Q()}}}return null}
function Bm(h,a,b){var c=h.b[b];if(c){for(var d=0,e=c.length;d<e;++d){var f=c[d];var g=f.P();if(h.M(a,g)){return true}}}return false}
function kc(a,b){var c;if(b.c==(Cc(),uc)||b.c==Ac){if(Ho(new Ko(gc,a))||Ho(new Ko(cc,a))){c=fb(a);if(c==b.b+1){return true}}}return false}
function Id(a,b,c,d){var e,f,g;g=a.k-d+1;for(f=a.i;f<g;f++){for(e=0;e<d;e++){if(b[c+e]!=a.f[f+e]){break}}if(e==d){a.i=f;return true}}return false}
function Hd(a,b,c){var d,e,f,g;d=b.length;g=c-b.length+1;for(f=a.i;f<g;f++){for(e=0;e<d;e++){if(b[e]!=a.f[f+e]){break}}if(e==d){a.i=f;return true}}return false}
function vm(h,a){var b=h.b;for(var c in b){var d=parseInt(c,10);if(c==d){var e=b[d];for(var f=0,g=e.length;f<g;++f){a.G(e[f])}}}}
function eh(a,b){var c,d,e,f;e=Uh(b)?Sh(b):null;f=e&&e.stack?e.stack.split('\n'):[];for(c=0,d=f.length;c<d;c++){f[c]=a.v(f[c])}return f}
function Cl(a,b,c){var d=op;for(var e=b;e<c;){var f=Math.min(e+10000,c);d+=String.fromCharCode.apply(null,a.slice(e,f));e=f}return d}
function Oe(a,b){if(!Sd(a,Me)){return false}if(!Nd(a)){return false}if(!Rd(a,a.m,Le)){return false}if(!Md(a)){return false}Xd(a,a.b);Uf(b);return true}
function me(a){if(!Sd(a,ke)){return false}Ud(a,ke.length);if(!Gd(a,je)){return false}Ud(a,je.length);if(!Gd(a,ie)){return false}Xd(a,a.i+ie.length);return true}
function hn(a,b){var c,d;for(c=0,d=a.b.length;c<d;++c){if(b==null?(ln(c,a.b.length),a.b[c])==null:ng(b,(ln(c,a.b.length),a.b[c]))){return c}}return -1}
function Uj(){switch(Sj){case 4:case 9:return new yk;case 1:case 6:return new mk;case 3:case 8:return new uk;case 2:case 7:return new qk;}return new ik}
function yl(c){if(c.length==0||c[0]>fq&&c[c.length-1]>fq){return c}var a=c.replace(/^([\u0000-\u0020]*)/,op);var b=a.replace(/[\u0000-\u0020]*$/,op);return b}
function Gh(a,b){var c=new Array(b);if(a==3){for(var d=0;d<b;++d){c[d]={l:0,m:0,h:0}}}else if(a>0&&a<3){var e=a==1?0:false;for(var d=0;d<b;++d){c[d]=e}}return c}
function sl(d,a,b){var c;if(a<256){c=al(a);c='\\x'+'00'.substring(c.length)+c}else{c=String.fromCharCode(a)}return d.replace(RegExp(c,dq),String.fromCharCode(b))}
function Rk(a,b){var c;b.d=a;if(a==2){c=String.prototype}else{if(a>0){var d=Pk(b);if(d){c=d.prototype}else{d=$j[a]=function(){};d.cZ=b;return}}else{return}}c.cZ=b}
function Fl(a){var b,c;if(a>=65536){b=55296+(~~(a-65536)>>10&1023)&65535;c=56320+(a-65536&1023)&65535;return El(b)+El(c)}else{return String.fromCharCode(a&65535)}}
function Ro(a){var b,c,d,e,f;f=ul(a,'\\.',0);e=$wnd;b=0;for(c=f.length-1;b<c;b++){if(!ml(f[b],'client')){e[f[b]]||(e[f[b]]={});e=To(e,f[b])}}d=To(e,f[b]);return d}
function sb(a,b){var c,d,e,f,g,h;e=b;f=b-18>-1;d=false;g=0;while(f){c=Yl(a.b,e);c==34&&g!=92&&(d=!d);(h=c==59&&!d,e==a.b.b.b.length-1||h)&&(f=false);++e;g=c}return e}
function oe(){oe=Wo;ne=new ad(Ih(Oj,$o,1,['font','span','b',Dp,'u','sub','sup','em','strong','samp','acronym','cite','code','dfn','kbd','tt','s','ins','del','var']))}
function el(){el=Wo;dl=Ih(Jj,cp,-1,[48,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122])}
function Be(){Be=Wo;ze=xl('<link');Ae=xl('rel=');xe=Ih(Qj,bp,2,[xl(Ep),xl(Fp),xl(Gp),xl(Hp),xl(Ip)]);ye=Ih(Qj,bp,2,[xl(Ep),xl(Fp),xl(Gp),xl(Hp),xl(Ip),xl('stylesheet')])}
function al(a){var b,c,d;b=Hh(Jj,cp,-1,8,1);c=(el(),dl);d=7;if(a>=0){while(a>15){b[d--]=c[a&15];a>>=4}}else{while(d>0){b[d--]=c[a&15];a>>=4}}b[d]=c[a&15];return Cl(b,d,8)}
function yb(a){var b,c,d;c='Content before importing MS-Word lists:\r\n'+a;d=Qb(wb,a);b='Content after importing MS-Word lists:\r\n'+d;return P(d,new Rn(Ih(Oj,$o,1,[c,b])))}
function km(a){var b,c,d,e;d=new Sl;b=null;yh(d.b,Sp);c=a.I();while(c.N()){b!=null?(yh(d.b,b),d):(b=gq);e=c.O();yh(d.b,e===a?'(this Collection)':op+e)}yh(d.b,Tp);return d.b.b}
function Ub(a,b,c,d){var e,f,g,h;f=new Ko(b,c);f.e=dk(f.c,f.b);if(f.e){e=f.e[1];h=f.e[2];g=ek(f.c,f.b,sp+d+e+"><li style='list-style: none;'><"+d+h+vp);return Zb(a,g)}return c}
function _e(a,b){var c,d;if(!Sd(a,Ze)){return false}if(!Gd(a,Ye)){return false}c=a.i+Ye.length;if(!Gd(a,Xe)){return false}d=a.i;Tf(b,a.f,c,d-c);Xd(a,a.i+Xe.length);return true}
function _d(a,b,c){if(!Sd(b,a.b)){return false}if(!Od(b,b.h)){return false}if(!Qd(b,b.h-1)){return false}b.i=b.h+a.b.length-1;if(!Md(b)){return false}Uf(c);b.h=b.i=b.b;return true}
function Xc(a,b){Wc();var c,d,e,f,g;c=new Zd(a);e=new Vf(a.length);g=b==1?Vc:Uc;d=g.length-1;for(f=0;f<d;f++){Yc(c,e,g[f]);Zc(c,e)}while(Yc(c,e,g[d])){Zc(c,e)}return Hl(e.b,e.c)}
function gg(a){var b;if(a.d==null){b=a.c===eg?null:a.c;a.e=b==null?Lp:Uh(b)?jg(Sh(b)):Th(b,1)?Mp:og(b).e;a.b=a.b+Kp+(Uh(b)?ig(Sh(b)):b+op);a.d=Np+a.e+') '+(Uh(b)?Rg(Sh(b)):op)+a.b}}
function Sb(a,b){var c,d,e;e=new _l;for(c=0;c<a;c++){d=Rh(Bo(b.b),6).c;yh(e.b,'<\/');Xl(e,d.b);e.b.b+=vp;(b.b.b.c==0?(hc(),fc):Rh(Ao(b.b),6))!=(hc(),fc)&&(yh(e.b,up),e)}return e.b.b}
function Vg(b){var c=op;try{for(var d in b){if(d!='name'&&d!='message'&&d!='toString'){try{var e=d!='__gwt$exception'?b[d]:'<skipped>';c+='\n '+d+Kp+e}catch(a){}}}}catch(a){}return c}
function ck(a){return $stats({moduleName:$moduleName,sessionId:$sessionId,subSystem:'startup',evtGroup:'moduleStartup',millis:(new Date).getTime(),type:'onModuleLoadStart',className:a})}
function Qg(a){var b,c,d;d=op;a=yl(a);b=a.indexOf(Np);c=a.indexOf('function')==0?8:0;if(b==-1){b=ol(a,Fl(64));c=a.indexOf('function ')==0?9:0}b!=-1&&(d=yl(wl(a,c,b)));return d.length>0?d:Op}
function Pg(b,c){var d,e,f,g;for(e=0,f=b.length;e<f;e++){g=b[e];try{g[1]?g[0].U()&&(c=Og(c,g)):g[0].U()}catch(a){a=Yj(a);if(Th(a,24)){d=a;Eg(Th(d,13)?Rh(d,13).s():d)}else throw Xj(a)}}return c}
function Qb(a,b){var c,d,e;c=(d=new Ko(new No('<\/?u[0-9]:p>',33),b),ek(d.c,d.b,op));c=Rb(a,c);c=Jo(new Ko(Ib,c),'$1');c=(e=new Ko(new No('style *?=[\'"](;?)[\'"]',32),c),ek(e.c,e.b,op));return c}
function Tb(a,b,c){var d,e;if(b>0){for(d=0;d<b;d++){Co(c.b,a)}return G(Pb(a),b)}else{if(ml(a.c.b,(c.b.b.c==0?(hc(),fc):Rh(Ao(c.b),6)).c.b)){return '<li>'}else{e=Sb(1,c)+Pb(a);Co(c.b,a);return e}}}
function $b(a,b,c,d,e){var f,g,h;h=b;g=new _l;if(b>=c){yh(g.b,up);Xl(g,Sb(b-c,a))}f=a.b.b.c==0?(hc(),fc):Rh(Ao(a.b),6);if(b==c&&f.c!=e.c){Xl(g,Sb(b,a));h=0}Xl(g,Tb(e,c-h,a));yh(g.b,d);return g.b.b}
function Ce(a,b){if(!Sd(b,ze)){return false}Wd(b,b.h+ze.length);if(!Nd(b)){return false}if(!Hd(b,Ae,b.l)){return false}if(!Md(b)){return false}if(!Td(b,b.e,a.b)){return false}Xd(b,b.l+1);return true}
function ee(a,b){var c,d;c=a.f;d=a.h;if(c[d+1]!=58){return false}if(!Nc(be,c[d])){return false}if(!Nc(ce,c[d-1])){return false}if(!Nd(a)){return false}if(!Md(a)){return false}Xd(a,a.b);Uf(b);return true}
function Yb(a){var b,c,d,e,f,g;e=a;if(a.indexOf(pp)==0){c=a.indexOf(rp);if(c>0){d=ol(a,Fl(62))+1;b=wl(a,d,c);g=new Mo('^(?:&nbsp;|\\s)*$');f=new Ko(g,b);f.e=dk(f.c,f.b);!!f.e&&(e=vl(a,c+7))}}return e}
function Ml(a){var b,c,d,e;b=0;d=a.length;e=d-4;c=0;while(c<e){b=a.charCodeAt(c+3)+31*(a.charCodeAt(c+2)+31*(a.charCodeAt(c+1)+31*(a.charCodeAt(c)+31*b)))|0;c+=4}while(c<d){b=b*31+ll(a,c++)}return b|0}
function Em(j,a,b,c){var d=j.b[c];if(d){for(var e=0,f=d.length;e<f;++e){var g=d[e];var h=g.P();if(j.M(a,h)){var i=g.Q();g.R(b);return i}}}else{d=j.b[c]=[]}var g=new jo(a,b);d.push(g);++j.e;return null}
function nb(a){var b,c,d,e;c=new Mo('(class=)([^>[ \\t\\n\\x0B\\f\\r]]*)');b=new Ko(c,a);e=new Sl;while(b.e=dk(b.c,b.b),!!b.e){d=b.e[2];d=d.toLowerCase();Go(b,e,b.e[1]+d)}Rl(e,vl(b.b,b.d));return e.b.b}
function Jh(a,b,c){if(c!=null){if(a.qI>0&&!Qh(c,a.qI)){throw new Fk}else if(a.qI==-1&&(c.tM==Wo||Ph(c,1))){throw new Fk}else if(a.qI<-1&&!(c.tM!=Wo&&!Ph(c,1))&&!Qh(c,-a.qI)){throw new Fk}}return a[b]=c}
function hc(){hc=Wo;bc=new Mo('([\xB7\xA7\u2022\u2043\u25A1o-]|\xD8|&middot;|<img[^>]*>)');gc=new Mo('[A-Z]+');cc=new Mo('[a-z]+');ec=new Mo('X?(?:IX|IV|V?I{0,3})');dc=new Mo('x?(?:ix|iv|v?i{0,3})');fc=new ic}
function _j(a,b,c){var d=$j[a];if(d&&!d.cZ){_=d.prototype}else{!d&&(d=$j[a]=function(){});_=d.prototype=b<0?{}:ak(b);_.cM=c}for(var e=3;e<arguments.length;++e){arguments[e].prototype=_}if(d.cZ){_.cZ=d.cZ;d.cZ=null}}
function Nd(a){for(a.m=a.i;a.m>=0;a.m--){if(a.f[a.m]==62){return false}if(a.f[a.m]==60){break}}if(a.m<0){return false}for(a.l=a.i;a.l<a.k;a.l++){if(a.f[a.l]==60){return false}if(a.f[a.l]==62){return true}}return false}
function fb(a){var b,c,d,e,f;f=a.toLowerCase();if(f.length==0){return 1}else if(f.length==1){c=f.charCodeAt(0);e=c+1-97}else{e=0;for(d=0;d<f.length;d++){c=ll(f,f.length-1-d);b=fb(String.fromCharCode(c))*Xh(Math.pow(26,d));e+=b}}return e}
function Ke(a){var b,c;if(!Sd(a,Fe)){return false}if(!Ed(a,62)){return false}b=a.i;Wd(a,a.h+Fe.length);if(!Hd(a,Ge,b)){return false}c=a.i+Ge.length;a.f[c]==34&&++c;if(Rd(a,c,Ie)||Rd(a,c,Ee)||Rd(a,c,He)){a.h=a.i=b+1;return true}return false}
function ef(a){var b,c;if((a.i>=a.k?0:a.f[a.i])!=64){return false}b=a.h;a.i+=1;c=a.f[b+1];if(!(null!=String.fromCharCode(c).match(/[A-Z]/i))&&c!=95){return false}if(!Ed(a,123)){return false}if(!Ed(a,125)){return false}Xd(a,a.i+1);return true}
function vd(a,b,c){var d,e,f,g;e=c;a.i=b;if(!Fd(a,46,c)){return}do{a.i+=1}while(Fd(a,46,c));d=a.i;Ld(a,sd,c)&&(e=a.i);if(e==d){return}f=a.j;g=f.length;a.j=Hh(Qj,bp,2,g+1,0);g!=0&&fm(f,0,a.j,0,g);a.j[g]=Hh(Jj,cp,-1,e-d,1);fm(a.f,d,a.j[g],0,e-d)}
function Xb(a){var b,c,d,e,f,g,h;c=a.b;g=new Ko(Hb,c);g.e=dk(g.c,g.b);if(g.e){f=g.e[2];h=new Ko(Eb,f);h.e=dk(h.c,h.b);if(h.e){e=h.e[1];b=h.e[2];d=new Ko(new Mo('^\\d\\.'),e);d.e=dk(d.c,d.b);if(!!d.e&&f.indexOf(e+b)!=-1){return true}}}return false}
function ob(b,c,d){var e,f,g;try{g=b?(Wc(),Tc):1;e=Xc(d,g);e=pb(e);b&&!c&&(e=nb(e));return L(),L(),new T(new W(e),K)}catch(a){a=Yj(a);if(Th(a,20)){f=a;return L(),P(op,new Rn(Ih(Oj,$o,1,['Failed to clean MS Office HTML.\n'+f.r()])))}else throw Xj(a)}}
function Cd(a,b){var c,d,e,f,g;if(!Sd(a,yd)){return false}g=a.i;if(!Gd(a,xd)){return false}c=a.i+xd.length;d=b.c;Tf(b,yd,0,yd.length);e=a.k;Vd(a,a.f,a.i);Xd(a,g+yd.length);f=Bd(a,b);Vd(a,a.f,e);if(f){Tf(b,xd,0,xd.length);a.h=a.i=c}else{b.c=d;a.h=a.i=g}return f}
function ad(a){var b,c,d,e,f,g,h;this.b=Hh(Rj,$o,3,128,0);for(c=0,d=a.length;c<d;++c){b=a[c];g=xl(b);e=g[0];e>=128&&(e=0);if(this.b[e]==null){this.b[e]=Ih(Qj,bp,2,[g])}else{h=this.b[e];f=h.length;this.b[e]=Hh(Qj,bp,2,f+1,0);fm(h,0,this.b[e],0,f);this.b[e][f]=g}}}
function Rc(a,b){var c,d,e,f;if(!Sc(a,Pc)){return false}d=a.i;c=a.h+Pc.length;a.i=c;a.h=a.i=c;e=xl('<img ');Tf(b,e,0,e.length);f=xl('o:title="');if(!Hd(a,f,d)){return true}Tf(b,a.f,c,a.i-c);Wd(a,a.i+f.length);if(!Fd(a,34,d)){return true}Wd(a,a.i+1);Xd(a,a.i);return true}
function Vb(a){var b,c,d,e;e=new Fn;d=null;for(c=0;c<a.c;c++){b=(ln(c,a.c),Rh(a.b[c],10));if(Th(b,8)){if(!Ho(new Ko(Fb,Rh(b,8).b))||c+1>=a.c||!Th((ln(c+1,a.c),a.b[c+1]),11)||!d){if(d){Lb(e,d);d=null}Jh(e.b,e.c++,b)}}else{!d&&(d=new Jc);Ic(d,Rh(b,11))}}!!d&&Lb(e,d);return e}
function he(a,b){var c,d;if(a.j.length==0){return false}if(!Sd(a,fe)){return false}if(!Nd(a)){return false}if(!Md(a)){return false}c=a.d-a.e;for(d=0;d<a.j.length;d++){if(a.j[d].length==c){if(Rd(a,a.e,a.j[d])){break}}}if(d==a.j.length){return false}Xd(a,a.b);Uf(b);return true}
function Bd(a,b){var c,d,e,f;d=false;f=32;c=a.i>=a.k?0:a.f[a.i];while(c!=0){e=false;switch(c){case 64:e=ef(a);break;case 47:e=Se(a);}!e&&(f==10||f==13)&&(e=ud(zd,a,b));if(e){d=true;f=b.c==0?0:b.b[b.c-1];a.i=a.h;c=a.i>=a.k?0:a.f[a.i]}else{Sf(b,f=c);c=(a.i=++a.h)>=a.k?0:a.f[a.i]}}return d}
function Mb(a,b,c,d,e){var f,g,h,i,j;i=sl(yl(e),10,32);i.lastIndexOf(rp)!=-1&&i.lastIndexOf(rp)==i.length-rp.length&&(i=wl(i,0,i.length-7));while(i.indexOf(sp)==0){h=ol(i,Fl(62));i=vl(i,h+1)}g=ol(i,Fl(60));i=vl(i,g);i=Yb(i);f=new Ko(Cb,i);i=ek(f.c,f.b,op);j=new jc('-',(hc(),fc));Xl(c,$b(a,b,d,i,j))}
function lh(a,b){var c,d,e,f,g,h,i,j,k,l;l=Hh(Nj,$o,23,b.length,0);for(f=0,g=l.length;f<g;f++){k=ul(b[f],Qp,0);i=-1;c=-1;e=Rp;if(k.length==2&&k[1]!=null){j=k[1];h=ql(j,Fl(58));d=rl(j,Fl(58),h-1);e=wl(j,0,d);if(h!=-1&&d!=-1){i=Sg(wl(j,d+1,h));c=Sg(vl(j,h+1))}}l[f]=new il(k[0],e+np+c,a.C(i<0?-1:i))}_f(l)}
function _k(a){var b,c,d,e,f;if(a==null){throw new gl(Lp)}d=a.length;e=d>0&&(a.charCodeAt(0)==45||a.charCodeAt(0)==43)?1:0;for(b=e;b<d;b++){if(Hk(a.charCodeAt(b))==-1){throw new gl(eq+a+tp)}}f=parseInt(a,10);c=f<-2147483648;if(isNaN(f)){throw new gl(eq+a+tp)}else if(c||f>2147483647){throw new gl(eq+a+tp)}return f}
function ve(a,b){var c,d,e,f;if(!Sd(a,te)){return false}f=a.h+te.length;for(;f<a.k;f++){c=a.f[f];if(c==62){break}if(c!=32&&c!=10&&c!=9&&c!=13){return false}}e=a.i=f+1;if(!Gd(a,se)){return false}d=a.i;a.i=e;if(Hd(a,te,d)){return false}Wd(a,d+se.length);if(!Ed(a,62)){return false}Tf(b,a.f,e,d-e);Xd(a,a.i+1);return true}
function ed(){ed=Wo;dd=new ad(Ih(Oj,$o,1,['font-color','horiz-align','language','list-image-','mso-','page:','separator-image','tab-stops','tab-interval','text-underline','text-effect','text-line-through','table-border-color-dark','table-border-color-light','vert-align','vnd.ms-excel.']));cd=new ad(Ih(Oj,$o,1,['mso-list']))}
function Yc(a,b,c){var d,e,f,g,h,i,j;j=a.k;e=a.f;a.h=a.i=0;f=32;d=c.p();h=0;i=0;g=false;while(i<j){for(;h<j;h++){f=e[h];if(f<256&&d[f]){break}}if(h>=j){fm(e,i,b.b,b.c,j-i);b.c+=j-i;break}(f==10||f==13)&&++h;h!=i&&(fm(e,i,b.b,b.c,h-i),b.c+=h-i);if(h==j){break}a.i=a.h=h;if(c.q(a,b,f)){g=true;i=h=a.i=a.h}else{i=h;f!=10&&f!=13&&++h}}return g}
function fd(a,b,c,d,e,f,g){var h,i,j,k,l,m;l=d;m=e;k=c.c;b.i=e;i=false;j=false;while(m<f){if(!Yd(b)||b.i>=f){break}h=a.o(b);if(h){i=true;m!=l&&Tf(c,b.f,l,m-l);if(Fd(b,59,f)){l=m=b.i+=1}else{l=f;break}}else{j=true;if(Fd(b,59,f)){m=b.i+=1}else{break}}}if(j&&!i){return false}if(j&&i){g!=l&&Tf(c,b.f,l,g-l)}else{c.c=k;Uf(c)}b.h=b.i=g;return true}
function Cc(){Cc=Wo;wc=new Dc('NO_TYPE',op,op);zc=new Dc('UNORDERED',xp,op);yc=new Dc('SQUARE',xp,' type="square"');tc=new Dc('CIRCLE',xp,' type="circle"');xc=new Dc('NUMERIC',wp,op);Bc=new Dc('UPPER_ROMAN',wp,' type="I"');vc=new Dc('LOWER_ROMAN',wp,' type="i"');Ac=new Dc('UPPER_ALPHA',wp,' type="A"');uc=new Dc('LOWER_ALPHA',wp,' type="a"');sc=Ih(Kj,$o,7,[wc,zc,yc,tc,xc,Bc,vc,Ac,uc])}
function ud(a,b,c){var d,e,f,g,h,i,j,k,l;i=b.i;if(b.f[b.i+-1]!=10&&b.f[b.i+-1]!=13){return false}d=b.i>=b.k?0:b.f[b.i];if(d==123||d==125){return false}f=b.i;if(!Kd(b,rd)){return false}e=b.i;if((b.i>=b.k?0:b.f[b.i])!=123){if(!Yd(b)){return false}if((b.i>=b.k?0:b.f[b.i])!=123){return false}}l=b.i+1;if(!Ed(b,125)){return false}j=b.i;k=j+1;g=c.c;h=fd(a,b,c,i,l,j,k);h&&c.c<=g&&vd(b,f,e);return h}
function pe(a){var b,c,d,e,f,g;d=a.h+1;b=a.f[d];if(b>127){return false}g=ne.b[b];if(g==null){return false}f=qe(a.f,d);for(c=0;c<g.length;c++){if(Rd(a,d,g[c])&&f==g[c].length){break}}if(c==g.length){return false}e=g[c];a.i=d+e.length;if(!Ed(a,62)){return false}d=a.i+1;if(a.f[d++]!=60||a.f[d++]!=47){return false}if(!Rd(a,d,e)){return false}a.i=d+e.length;if(!Ed(a,62)){return false}Xd(a,a.i+1);return true}
function df(a,b){var c,d,e,f,g,h;f=a.h;if(a.f[f+2]!=58||a.f[f]!=60){return false}if(!Nc(bf,a.f[f+1])){return false}h=f+1;a.i=f+3;if(!Jd(a,af)){return false}g=a.i-h;if(!Ed(a,62)){return false}if(Pd(a,a.i-1)==47){Xd(a,a.i+1);return true}e=a.i+1;while(Id(a,a.f,h,g)){d=a.i-1;c=a.f[d];if(c==60){return false}if(c==47&&Pd(a,--d)==60){if(!Ed(a,62)){return false}Tf(b,a.f,e,d-e);Xd(a,a.i+1);return true}++a.i}return false}
function ul(l,a,b){var c=new RegExp(a,dq);var d=[];var e=0;var f=l;var g=null;while(true){var h=c.exec(f);if(h==null||f==op||e==b-1&&b>0){d[e]=f;break}else{d[e]=f.substring(0,h.index);f=f.substring(h.index+h[0].length,f.length);c.lastIndex=0;if(g==f){d[e]=f.substring(0,1);f=f.substring(1)}g=f;e++}}if(b==0&&l.length>0){var i=d.length;while(i>0&&d[i-1]==op){--i}i<d.length&&d.splice(i,d.length-i)}var j=Al(d.length);for(var k=0;k<d.length;++k){j[k]=d[k]}return j}
function Md(a){var b,c;for(b=a.i;b<a.k;b++){if(a.f[b]==62){return false}if(a.f[b]==61){break}}if(b==a.k){return false}a.c=++b;c=a.f[b];if(c==34||c==39){a.e=++b;for(;b<a.k;b++){if(a.f[b]==62){return false}if(a.f[b]==c){break}}if(b==a.k){return false}a.d=b;a.b=b+1;a.i=a.e;return true}else{a.e=a.c;for(;b<a.k;b++){if(a.f[b]==62){break}if(a.f[b]==32){break}if(a.f[b]==9){break}if(a.f[b]==13){break}if(a.f[b]==10){break}}if(b==a.k){return false}a.d=a.b=b;return true}}
function kb(b){var c,d,e,f,g,h,i;d=0;c=new Tl(b.toLowerCase());e=false;try{d=(f=(g=0,g+=gb(c,109,1000),g+=jb(c,99,109,900),g+=ib(c,100,500),g+=jb(c,99,100,400),g),f=(h=f,h+=gb(c,99,100),h+=jb(c,120,99,90),h+=ib(c,108,50),h+=jb(c,120,108,40),h),f=(i=f,i+=gb(c,120,10),i+=jb(c,105,120,9),i+=ib(c,118,5),i+=jb(c,105,118,4),i),f+=gb(c,105,1),f)}catch(a){a=Yj(a);if(Th(a,21)){e=true}else throw Xj(a)}if(e||c.b.b.length>0){throw new Xk(b+' is not a parsable roman numeral')}return d}
function Vj(){var a,b,c;bk()&&ck('com.google.gwt.useragent.client.UserAgentAsserter');a=Rh(Uj(),15);b=a.D();c=a.F();ml(b,c)||($wnd.alert('ERROR: Possible problem with your *.gwt.xml module file.\nThe compile time user.agent value ('+b+') does not match the runtime user.agent value ('+c+'). Expect more errors.\n'),undefined);bk()&&ck('com.google.gwt.user.client.DocumentModeAsserter');gk();bk()&&ck('com.ephox.keurig.client.Keurig');Vo();new db;$wnd.gwtInited&&$wnd.gwtInited()}
function pb(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,q;d=new bm(a);b=d.b.b.length;while(b>-1){b=rl(d.b.b,'<p',b);c=pl(d.b.b,'<\/p>',b);if(b>-1&&c>-1){q=wl(d.b.b,b,c);m=q.indexOf(pp);if(m>-1){l=ol(q,Fl(62));if(l+1==m){f=pl(q,Fl(62),m);n=wl(q,m,f+1);e=n.indexOf(qp);if(e>-1){h=q.lastIndexOf(rp);if(7+h==q.length){i=wl(q,0,ol(q,Fl(62))+1);k=i.indexOf(qp);if(k>-1){j=mb(q,k);o=mb(n,e);if(!ml(j,o)){g=q.length-7;$l(d,g+b,q.length+b,op);$l(d,m+b,m+n.length+b,op);$l(d,k+b,k+j.length+b,o)}}}}}}}--b}return d.b.b}
function Rb(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,q,r,s,t,u,v;g=Nb(b);v=Vb(g);s=new mc;u=new _l;for(f=new tn(v);f.b<f.c.J();){e=Rh(sn(f),10);if(Th(e,8)){Xl(u,Rh(e,8).b)}else{h=new tn(Rh(e,9).b);j=0;k=new _l;i=(hc(),fc);while(h.b<h.c.J()){r=Rh(sn(h),11);q=new Ko(Hb,r.b);q.e=dk(q.c,q.b);if(q.e){c=q.e[1];m=Ob(j,c);t=q.e[2];n=new Ko(Eb,t);n.e=dk(n.c,n.b);if(n.e){d=n.e[1];l=Jo(new Ko(Bb,n.e[2]),op);o=new jc(d,i);i=o;Xl(k,$b(s,j,m,l,o))}else{Mb(s,j,k,m,t)}j=m}}yh(k.b,up);Xl(k,Sb(j,s));Xl(u,Zb(a,k.b.b))}}return u.b.b}
function fm(a,b,c,d,e){var f,g,h,i,j,k,l,m,n;if(a==null||c==null){throw new cl}m=og(a);i=og(c);if((m.c&4)==0||(i.c&4)==0){throw new Gk('Must be array types')}l=m.b;g=i.b;if(!((l.c&1)!=0?l==g:(g.c&1)==0)){throw new Gk('Array types must match')}n=a.length;j=c.length;if(b<0||d<0||e<0||b+e>n||d+e>j){throw new Zk}if(((l.c&1)==0||(l.c&4)!=0)&&m!=i){k=Rh(a,22);f=Rh(c,22);if(Wh(a)===Wh(c)&&b<d){b+=e;for(h=d+e;h-->d;){Jh(f,h,k[--b])}}else{for(h=d+e;d<h;){Jh(f,d++,k[b++])}}}else{Array.prototype.splice.apply(c,[d,e].concat(a.slice(b,b+e)))}}
function Nb(a){var b,c,d,e,f,g,h,i,j;e=new Fn;h=new Ko(Hb,a);f=0;while(h.e=dk(h.c,h.b),!!h.e){j=h.e[1];b=new Ko(Db,j);b.e=dk(b.c,b.b);if(b.e){i=!h.e||h.e.length<1?-1:h.e.index;if(i>f){d=new Gc(wl(a,f,i));Jh(e.b,e.c++,d)}g=new Lc(wl(a,!h.e||h.e.length<1?-1:h.e.index,!h.e||h.e.length<1?-1:h.e.index+h.e[0].length));Jh(e.b,e.c++,g)}else{c=(!h.e||h.e.length<1?-1:h.e.index)>f?f:!h.e||h.e.length<1?-1:h.e.index;d=new Gc(wl(a,c,!h.e||h.e.length<1?-1:h.e.index+h.e[0].length));Jh(e.b,e.c++,d)}f=!h.e||h.e.length<1?-1:h.e.index+h.e[0].length}if(f<a.length){d=new Gc(vl(a,f));Jh(e.b,e.c++,d)}return e}
function cb(h){var e=(Vo(),Ro('com.ephox.keurig.WordCleaner'));var f,g=h;$wnd.com.ephox.keurig.WordCleaner=mp(function(){var a,b=this,c=arguments;c.length==1&&g.n(c[0])?(a=c[0]):c.length==0&&(a=new Z);b.g=a;a['__gwtex_wrap']=b;return b});f=$wnd.com.ephox.keurig.WordCleaner.prototype=new Object;$wnd.com.ephox.keurig.WordCleaner.cleanDocument=mp(function(a,b){var c,d;return c=new zb(a,b),d=M(ob(c.c,c.d,c.b)),Rh(d.c.b,1)});$wnd.com.ephox.keurig.WordCleaner.yury=mp(function(a,b){var c;return c=b?(Wc(),Tc):1,Xc(a,c)});if(e)for(p in e)$wnd.com.ephox.keurig.WordCleaner[p]===undefined&&($wnd.com.ephox.keurig.WordCleaner[p]=e[p])}
function jc(a,b){hc();var c,d,e,f,g,h;f=new Ko(bc,a);f.e=dk(f.c,f.b);if(f.e){g=f.e[1];this.c=ml(g,'\xA7')?(Cc(),yc):ml(g,'o')?(Cc(),tc):(Cc(),zc)}else{e=new Ko(new Mo('\\(?(\\d+|[a-zA-Z]+)(?:\\)|\\.)?'),a);e.e=dk(e.c,e.b);if(e.e){c=e.e[1];if(kc(c,b)){this.c=Ho(new Ko(gc,c))?(Cc(),Ac):(Cc(),uc);this.b=fb(c)}else{d=new Ko(dc,c);d.e=dk(d.c,d.b);if(!!d.e&&d.e[0].length!=0){this.c=(Cc(),vc);this.b=kb(c)}else{h=new Ko(ec,c);h.e=dk(h.c,h.b);if(!!h.e&&h.e[0].length!=0){this.c=(Cc(),Bc);this.b=kb(c)}else{if(Ho(new Ko(cc,c))){this.c=(Cc(),uc);this.b=fb(c)}else if(Ho(new Ko(gc,c))){this.c=(Cc(),Ac);this.b=fb(c)}else{this.c=(Cc(),xc);this.b=_k(c)}}}}}else{this.c=(Cc(),zc)}}}
function Kb(){Kb=Wo;Ib=new No('mso\\-list:.*?([;"\'])',32);Db=new No('style=["\'].*?mso\\-list:(?:([0-9]+)|.*?level([0-9]+)).*?["\']',32);Gb=new Mo('<ol([^>]*)><li><ol([^>]*)>');Jb=new Mo('<ul([^>]*)><li><ul([^>]*)>');Eb=new No('^[ \\t\\n\\x0B\\f\\r]*(?:<[^>]*>)*?(?:<span[^>]*>[ \\t\\n\\x0B\\f\\r]*){0,3}(?:&nbsp;|\\s)*(?:<\/span[^>]*>[ \\t\\n\\x0B\\f\\r]*)?([\xB7\xA7\u2022\u2043\u25A1o-]|\xD8|&middot;|<img[^>]*>|\\(?(?:\\d+|[a-zA-z]+)(?:\\)|\\.)?)(?:&nbsp;|\\s)*(?:<span[^>]*>[ \\t\\n\\x0B\\f\\r]*)?(?:&nbsp;|\\s)*(?:<\/span[^>]*>[ \\t\\n\\x0B\\f\\r]*){0,3}(.*?)$',32);Hb=new No('<p([^>]*)>(.*?)<\/p>[ \\t\\n\\x0B\\f\\r]*',32);Fb=new Mo('<p[^>]*>(?:<[^>]*>|[ \\t\\n\\x0B\\f\\r])*&nbsp;(?:<[^>]*>|[ \\t\\n\\x0B\\f\\r])*<\/p>');Cb=new Mo('^(?:<\/[^>]+>)*');Bb=new Mo('<a\\sname="OLE_LINK\\d">|<\/a>')}
function gk(){var a,b,c;b=$doc.compatMode;a=Ih(Oj,$o,1,[Vp]);for(c=0;c<a.length;c++){if(ml(a[c],b)){return}}a.length==1&&ml(Vp,a[0])&&ml('BackCompat',b)?"GWT no longer supports Quirks Mode (document.compatMode=' BackCompat').<br>Make sure your application's host HTML page has a Standards Mode (document.compatMode=' CSS1Compat') doctype,<br>e.g. by using &lt;!doctype html&gt; at the start of your application's HTML page.<br><br>To continue using this unsupported rendering mode and risk layout problems, suppress this message by adding<br>the following line to your*.gwt.xml module file:<br>&nbsp;&nbsp;&lt;extend-configuration-property name=\"document.compatMode\" value=\""+b+'"/&gt;':"Your *.gwt.xml module configuration prohibits the use of the current doucment rendering mode (document.compatMode=' "+b+"').<br>Modify your application's host HTML page doctype, or update your custom 'document.compatMode' configuration property settings."}
var op='',fq=' ',tp='"',Np='(',Up=')',gq=', ',Pp=':',Kp=': ',sp='<',up='<\/li>',rp='<\/span>',zp='<\/style>',pp='<span',yp='<style',Ap='=',vp='>',np='@',Qp='@@',Vp='CSS1Compat',Fp='Edit-Time-Data',Ep='File-List',eq='For input string: "',Gp='Ole-Object-Data',Hp='Original-File',Ip='Preview',Mp='String',Rp='Unknown',Sp='[',jq='[Ljava.lang.',Tp=']',Cp=']>',Op='anonymous',qq='com.ephox.functional.data.immutable.',oq='com.ephox.keurig.client.',pq='com.ephox.tord.guts.',sq='com.ephox.tord.lists.',uq='com.ephox.tord.lists.data.',rq='com.ephox.tord.wordhtmlfilter.',iq='com.google.gwt.core.client.',lq='com.google.gwt.core.client.impl.',kq='com.google.gwt.useragent.client.',qp='dir=',dq='g',bq='gecko',Wp='gecko1_8',Dp='i',$p='ie10',aq='ie8',_p='ie9',hq='java.lang.',nq='java.util.',tq='java.util.regex.',Jp='lang',Zp='msie',Lp='null',wp='ol',mq='org.timepedia.exporter.client.',Bp='ovwxp',Yp='safari',xp='ul',cq='unknown',Xp='webkit';var _,$j={},bp={3:1,16:1,22:1},cp={2:1,16:1},ip={26:1},kp={27:1},_o={4:1},lp={16:1,25:1},Zo={},ap={16:1},gp={16:1,20:1,21:1,24:1},dp={12:1},ep={16:1,20:1,24:1},fp={15:1},$o={16:1,22:1},jp={28:1},hp={17:1};_j(1,-1,Zo,A);_.eQ=function B(a){return this===a};_.gC=function C(){return this.cZ};_.hC=function D(){return Cg(this)};_.tS=function F(){return this.cZ.e+np+al(this.hC())};_.toString=function(){return this.tS()};_.tM=Wo;_j(4,1,{});_j(5,1,_o);_.eQ=function N(a){return Th(a,4)&&R(this,Rh(a,4))};_.hC=function O(){return 42};_.tS=function Q(){return 'value: '+this.c.b+', log: '+Rh(this.b.b,25)};var J,K;_j(8,5,_o,T);_j(10,4,{},W);_j(13,1,{5:1},Z);_j(14,1,{},db);_.n=function eb(a){return a!=null&&Th(a,5)};var ab=false;_j(16,1,{});_.c=false;_.d=false;_j(17,1,{},ub);_j(18,16,{},zb);var wb;_j(19,1,{},_b);var Bb,Cb,Db,Eb,Fb,Gb,Hb,Ib,Jb;_j(20,1,{6:1},ic,jc);_.b=0;var bc,cc,dc,ec,fc,gc;_j(21,1,{},mc);_j(23,1,{16:1,18:1,19:1});_.eQ=function pc(a){return this===a};_.hC=function qc(){return Cg(this)};_.tS=function rc(){return this.d};_j(22,23,{7:1,16:1,18:1,19:1},Dc);var sc,tc,uc,vc,wc,xc,yc,zc,Ac,Bc;_j(24,1,{8:1,10:1},Gc);_j(25,1,{9:1,10:1},Jc);_j(26,1,{10:1,11:1},Lc);_j(27,1,{},Oc);var Pc;var Tc=0,Uc,Vc;_j(30,1,{},ad);_j(31,1,{});_.o=function gd(a){var b,c,d;c=a.i>=a.k?0:a.f[a.i];d=_c(cd,c);if(d!=null&&Td(a,a.i,d)){return false}b=_c(dd,c);return b!=null&&Td(a,a.i,b)};var cd,dd;_j(32,31,{},md);var jd;_j(33,32,{},pd);_.o=function od(a){var b,c;b=a.i>=a.k?0:a.f[a.i];c=_c((ed(),cd),b);return c==null||!Td(a,a.i,c)};_j(34,31,{},wd);var rd,sd;var xd,yd,zd;_j(36,1,{},Zd);_.b=0;_.c=0;_.d=0;_.e=0;_.h=0;_.i=0;_.k=0;_.l=0;_.m=0;_j(37,1,{},ae);var be,ce;var fe;var ie,je,ke;var ne;var se,te;_j(44,1,{},De);var xe,ye,ze,Ae;var Ee,Fe,Ge,He,Ie;var Le,Me;var Pe,Qe;var Te,Ue;var Xe,Ye,Ze;var af,bf;_j(52,1,dp,jf);_.p=function kf(){return gf.b};_.q=function lf(a,b,c){switch(c){case 60:if(pe(a)){return true}a.i=a.h;if(ve(a,b)){return true}a.i=a.h;return df(a,b);case 13:case 10:return re(a);}return false};var gf;_j(53,1,dp,pf);_.p=function qf(){return nf.b};_.q=function rf(a,b,c){switch(c){case 60:if(Rc(a,b)){return true}a.i=a.h;if(me(a)){return true}a.i=a.h;if(_e(a,b)){return true}a.i=a.h;return Ke(a);case 120:return Oe(a,b);case 13:case 10:return re(a);}return false};var nf;_j(54,1,dp,vf);_.p=function wf(){return tf.b};_.q=function xf(a,b,c){switch(c){case 60:if(pe(a)){return true}a.i=a.h;if(ve(a,b)){return true}a.i=a.h;return df(a,b);case 13:case 10:return re(a);case 99:return he(a,b);}return false};var tf;_j(55,1,dp,Ef);_.p=function Ff(){return zf.b};_.q=function Gf(a,b,c){switch(c){case 60:if(df(a,b)){return true}a.i=a.h;if(Cd(a,b)){return true}a.i=a.h;if(Ce(Cf,a)){return true}a.i=a.h;return false;case 111:case 118:case 119:case 120:case 112:return ee(a,b);case 115:return ld(Af,a,b);case 108:return _d(Bf,a,b);}return false};var zf,Af,Bf,Cf;_j(56,1,dp,Of);_.p=function Pf(){return If.b};_.q=function Qf(a,b,c){switch(c){case 60:if(df(a,b)){return true}a.i=a.h;if(We(a)){return true}a.i=a.h;if(Ce(Mf,a)){return true}a.i=a.h;return false;case 115:return ld(Jf,a,b);case 99:return _d(Kf,a,b);case 108:return _d(Lf,a,b);case 111:case 118:case 119:case 120:case 112:return ee(a,b);}return false};var If,Jf,Kf,Lf,Mf;_j(57,1,{},Vf);_.tS=function Wf(){return Hl(this.b,this.c)};_.c=0;_j(63,1,{16:1,24:1});_.r=function ag(){return this.f};_.tS=function bg(){var a,b;a=this.cZ.e;b=this.r();return b!=null?a+Kp+b:a};_j(62,63,ep);_j(61,62,ep);_j(60,61,{13:1,16:1,20:1,24:1},hg);_.r=function kg(){gg(this);return this.d};_.s=function lg(){return this.c===eg?null:this.c};var eg;_j(67,1,{});var sg=0,tg=0,ug=0,vg=-1;_j(69,67,{},Ng);var Jg;_j(72,1,{},Xg);_.t=function Yg(){var a={};var b=[];var c=arguments.callee.caller.caller;while(c){var d=this.v(c.toString());b.push(d);var e=Pp+d;var f=a[e];if(f){var g,h;for(g=0,h=f.length;g<h;g++){if(f[g]===c){return b}}}(f||(a[e]=[])).push(c);c=c.caller}return b};_.u=function Zg(a){var b,c,d,e;d=this.A(a.c===(fg(),eg)?null:a.c);e=Hh(Nj,$o,23,d.length,0);for(b=0,c=e.length;b<c;b++){e[b]=new il(d[b],null,-1)}_f(e)};_.v=function $g(a){return Qg(a)};_.w=function _g(a){var b,c,d,e;d=Tj().t();e=Hh(Nj,$o,23,d.length,0);for(b=0,c=e.length;b<c;b++){e[b]=new il(d[b],null,-1)}_f(e)};_.A=function ah(a){return []};_j(74,72,{},fh);_.t=function gh(){return Tg(this.A(Wg()),this.B())};_.A=function hh(a){return eh(this,a)};_.B=function ih(){return 2};_j(73,74,{});_.t=function mh(){var a;a=Tg(kh(this,Wg()),3);a.length==0&&(a=Tg((new Xg).t(),1));return a};_.u=function nh(a){var b;b=kh(this,a.c===(fg(),eg)?null:a.c);lh(this,b)};_.v=function oh(a){var b,c,d,e;if(a.length==0){return Op}e=yl(a);e.indexOf('at ')==0&&(e=vl(e,3));c=e.indexOf(Sp);c!=-1&&(e=yl(wl(e,0,c))+yl(vl(e,e.indexOf(Tp,c)+1)));c=e.indexOf(Np);if(c==-1){c=e.indexOf(np);if(c==-1){d=e;e=op}else{d=yl(vl(e,c+1));e=yl(wl(e,0,c))}}else{b=e.indexOf(Up,c);d=wl(e,c+1,b);e=yl(wl(e,0,c))}c=ol(e,Fl(46));c!=-1&&(e=vl(e,c+1));return (e.length>0?e:Op)+Qp+d};_.w=function ph(a){var b;b=Tj().t();lh(this,b)};_.A=function qh(a){return kh(this,a)};_.C=function rh(a){return a};_.B=function sh(){return 3};_j(75,73,{},uh);_.C=function vh(a){return -1};_j(76,1,{});_j(77,76,{},Ah);_.b=op;_j(81,1,{},Ch);_.qI=0;var Kh,Lh;var Sj=-1;_j(95,1,fp,ik);_.D=function jk(){return Wp};_.F=function kk(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Xp)!=-1}())return Yp;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=10}())return $p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=9}())return _p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=8}())return aq;if(function(){return b.indexOf(bq)!=-1}())return Wp;return cq};_j(96,1,fp,mk);_.D=function nk(){return $p};_.F=function ok(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Xp)!=-1}())return Yp;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=10}())return $p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=9}())return _p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=8}())return aq;if(function(){return b.indexOf(bq)!=-1}())return Wp;return cq};_j(97,1,fp,qk);_.D=function rk(){return aq};_.F=function sk(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Xp)!=-1}())return Yp;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=10}())return $p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=9}())return _p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=8}())return aq;if(function(){return b.indexOf(bq)!=-1}())return Wp;return cq};_j(98,1,fp,uk);_.D=function vk(){return _p};_.F=function wk(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Xp)!=-1}())return Yp;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=10}())return $p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=9}())return _p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=8}())return aq;if(function(){return b.indexOf(bq)!=-1}())return Wp;return cq};_j(99,1,fp,yk);_.D=function zk(){return Yp};_.F=function Ak(){var b=navigator.userAgent.toLowerCase();var c=function(a){return parseInt(a[1])*1000+parseInt(a[2])};if(function(){return b.indexOf(Xp)!=-1}())return Yp;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=10}())return $p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=9}())return _p;if(function(){return b.indexOf(Zp)!=-1&&$doc.documentMode>=8}())return aq;if(function(){return b.indexOf(bq)!=-1}())return Wp;return cq};_j(100,1,{});_.tS=function Dk(){return qg(this.b)};_j(101,61,ep,Fk,Gk);_j(103,1,{},Jk);_.tS=function Sk(){return ((this.c&2)!=0?'interface ':(this.c&1)!=0?op:'class ')+this.e};_.c=0;_.d=0;_j(104,61,ep,Uk);_j(105,61,gp,Wk,Xk);_j(106,61,ep,Zk,$k);_j(110,61,ep,cl);var dl;_j(112,105,gp,gl);_j(113,1,{16:1,23:1},il);_.tS=function jl(){return this.b+'.'+this.e+Np+(this.c!=null?this.c:'Unknown Source')+(this.d>=0?Pp+this.d:op)+Up};_.d=0;_=String.prototype;_.cM={1:1,16:1,17:1,18:1};_.eQ=function Dl(a){return ml(this,a)};_.hC=function Gl(){return Nl(this)};_.tS=_.toString;var Il,Jl=0,Kl;_j(115,1,hp,Sl,Tl);_.tS=function Ul(){return this.b.b};_j(116,1,hp,_l,am,bm);_.tS=function cm(){return this.b.b};_j(117,106,ep,em);_j(119,61,ep,hm);_j(120,1,{});_.G=function lm(a){throw new hm('Add not supported on this collection')};_.H=function mm(a){var b;b=jm(this.I(),a);return !!b};_.K=function nm(){return this.L(Hh(Mj,$o,0,this.J(),0))};_.L=function om(a){var b,c,d;d=this.J();a.length<d&&(a=Fh(a,d));c=this.I();for(b=0;b<d;++b){Jh(a,b,c.O())}a.length>d&&Jh(a,d,null);return a};_.tS=function pm(){return km(this)};_j(122,1,ip);_.eQ=function sm(a){var b,c,d,e,f;if(a===this){return true}if(!Th(a,26)){return false}e=Rh(a,26);if(this.e!=e.e){return false}for(c=new Rm((new Mm(e)).b);rn(c.b);){b=Rh(sn(c.b),27);d=b.P();f=b.Q();if(!(d==null?this.d:Th(d,1)?Cm(this,Rh(d,1)):Bm(this,d,~~pg(d)))){return false}if(!Eo(f,d==null?this.c:Th(d,1)?Am(this,Rh(d,1)):zm(this,d,~~pg(d)))){return false}}return true};_.hC=function tm(){var a,b,c;c=0;for(b=new Rm((new Mm(this)).b);rn(b.b);){a=Rh(sn(b.b),27);c+=a.hC();c=~~c}return c};_.tS=function um(){var a,b,c,d;d='{';a=false;for(c=new Rm((new Mm(this)).b);rn(c.b);){b=Rh(sn(c.b),27);a?(d+=gq):(a=true);d+=op+b.P();d+=Ap;d+=op+b.Q()}return d+'}'};_j(121,122,ip);_.M=function Hm(a,b){return Wh(a)===Wh(b)||a!=null&&ng(a,b)};_.d=false;_.e=0;_j(124,120,jp);_.eQ=function Km(a){var b,c,d;if(a===this){return true}if(!Th(a,28)){return false}c=Rh(a,28);if(c.b.e!=this.J()){return false}for(b=new Rm(c.b);rn(b.b);){d=Rh(sn(b.b),27);if(!this.H(d)){return false}}return true};_.hC=function Lm(){var a,b,c;a=0;for(b=this.I();b.N();){c=b.O();if(c!=null){a+=pg(c);a=~~a}}return a};_j(123,124,jp,Mm);_.H=function Nm(a){var b,c,d;if(Th(a,27)){b=Rh(a,27);c=b.P();if(xm(this.b,c)){d=ym(this.b,c);return go(b.Q(),d)}}return false};_.I=function Om(){return new Rm(this.b)};_.J=function Pm(){return this.b.e};_j(125,1,{},Rm);_.N=function Sm(){return rn(this.b)};_.O=function Tm(){return Rh(sn(this.b),27)};_j(127,1,kp);_.eQ=function Wm(a){var b;if(Th(a,27)){b=Rh(a,27);if(Eo(this.P(),b.P())&&Eo(this.Q(),b.Q())){return true}}return false};_.hC=function Xm(){var a,b;a=0;b=0;this.P()!=null&&(a=pg(this.P()));this.Q()!=null&&(b=pg(this.Q()));return a^b};_.tS=function Ym(){return this.P()+Ap+this.Q()};_j(126,127,kp,Zm);_.P=function $m(){return null};_.Q=function _m(){return this.b.c};_.R=function an(a){return Fm(this.b,a)};_j(128,127,kp,cn);_.P=function dn(){return this.b};_.Q=function en(){return Am(this.c,this.b)};_.R=function fn(a){return Gm(this.c,this.b,a)};_j(129,120,{25:1});_.S=function jn(a,b){throw new hm('Add not supported on this list')};_.G=function kn(a){this.S(this.J(),a);return true};_.eQ=function mn(a){var b,c,d,e,f;if(a===this){return true}if(!Th(a,25)){return false}f=Rh(a,25);if(this.J()!=f.J()){return false}d=this.I();e=f.I();while(d.b<d.c.J()){b=sn(d);c=sn(e);if(!(b==null?c==null:ng(b,c))){return false}}return true};_.hC=function nn(){var a,b,c;b=1;a=this.I();while(a.b<a.c.J()){c=sn(a);b=31*b+(c==null?0:pg(c));b=~~b}return b};_.I=function pn(){return new tn(this)};_j(130,1,{},tn);_.N=function un(){return rn(this)};_.O=function vn(){return sn(this)};_.b=0;_j(131,129,lp,Fn);_.S=function Gn(a,b){xn(this,a,b)};_.G=function Hn(a){return yn(this,a)};_.H=function In(a){return Bn(this,a,0)!=-1};_.T=function Jn(a){return An(this,a)};_.J=function Kn(){return this.c};_.K=function On(){return Dn(this)};_.L=function Pn(a){return En(this,a)};_.c=0;_j(132,129,lp,Rn);_.H=function Sn(a){return hn(this,a)!=-1};_.T=function Tn(a){return ln(a,this.b.length),this.b[a]};_.J=function Un(){return this.b.length};_.K=function Vn(){return Dh(this.b)};_.L=function Wn(a){var b,c;c=this.b.length;a.length<c&&(a=Fh(a,c));for(b=0;b<c;++b){Jh(a,b,this.b[b])}a.length>c&&Jh(a,c,null);return a};var Xn;_j(134,129,lp,$n);_.H=function _n(a){return false};_.T=function ao(a){throw new Zk};_.J=function bo(){return 0};_j(135,61,ep,eo);_j(136,121,{16:1,26:1},ho);_j(137,127,kp,jo);_.P=function ko(){return this.b};_.Q=function lo(){return this.c};_.R=function mo(a){var b;b=this.c;this.c=a;return b};_j(138,61,ep,oo);_j(140,129,lp);_.S=function ro(a,b){xn(this.b,a,b)};_.G=function so(a){return yn(this.b,a)};_.H=function to(a){return Bn(this.b,a,0)!=-1};_.T=function uo(a){return An(this.b,a)};_.I=function vo(){return new tn(this.b)};_.J=function wo(){return this.b.c};_.K=function xo(){return Dn(this.b)};_.L=function yo(a){return En(this.b,a)};_.tS=function zo(){return km(this.b)};_j(139,140,lp,Do);_j(142,1,{},Ko);_.b=null;_.d=0;_j(143,100,{},Mo,No);_j(145,1,{});_j(144,145,{},So);var Uo;var mp=Dg();var bj=Lk(hq,'Object',1),Fi=Lk(iq,'Scheduler',67),Ei=Lk(iq,'JavaScriptObject$',64),Mj=Kk(jq,'Object;',150,bj),Ij=Ok('boolean',' Z'),Pj=Kk(op,'[Z',152,Ij),ij=Lk(hq,'Throwable',63),Yi=Lk(hq,'Exception',62),cj=Lk(hq,'RuntimeException',61),dj=Lk(hq,'StackTraceElement',113),Nj=Kk(jq,'StackTraceElement;',153,dj),Ni=Lk('com.google.gwt.lang.','SeedUtil',88),Xi=Lk(hq,'Enum',23),Yh=Ok('char',' C'),Jj=Kk(op,'[C',154,Yh),Wi=Lk(hq,'Class',103),hj=Lk(hq,Mp,2),Oj=Kk(jq,'String;',151,hj),Vi=Lk(hq,'ClassCastException',104),Di=Lk(iq,'JavaScriptException',60),fj=Lk(hq,'StringBuilder',116),Ui=Lk(hq,'ArrayStoreException',101),Oi=Lk(kq,'UserAgentImplGecko1_8',95),Si=Lk(kq,'UserAgentImplSafari',99),Pi=Lk(kq,'UserAgentImplIe10',96),Ri=Lk(kq,'UserAgentImplIe9',98),Qi=Lk(kq,'UserAgentImplIe8',97),_i=Lk(hq,'NullPointerException',110),Zi=Lk(hq,'IllegalArgumentException',105),Mi=Lk(lq,'StringBufferImpl',76),Hj=Lk(mq,'ExporterBaseImpl',145),Gj=Lk(mq,'ExporterBaseActual',144),Ki=Lk(lq,'StackTraceCreator$Collector',72),Ji=Lk(lq,'StackTraceCreator$CollectorMoz',74),Ii=Lk(lq,'StackTraceCreator$CollectorChrome',73),Hi=Lk(lq,'StackTraceCreator$CollectorChromeNoSourceMap',75),Li=Lk(lq,'StringBufferImplAppend',77),Gi=Lk(lq,'SchedulerImpl',69),tj=Lk(nq,'AbstractMap',122),pj=Lk(nq,'AbstractHashMap',121),kj=Lk(nq,'AbstractCollection',120),uj=Lk(nq,'AbstractSet',124),mj=Lk(nq,'AbstractHashMap$EntrySet',123),lj=Lk(nq,'AbstractHashMap$EntrySetIterator',125),sj=Lk(nq,'AbstractMapEntry',127),nj=Lk(nq,'AbstractHashMap$MapEntryNull',126),oj=Lk(nq,'AbstractHashMap$MapEntryString',128),zj=Lk(nq,'HashMap',136),bi=Lk(oq,'WordCleaner_ExporterImpl',14),ci=Lk(oq,'WordCleaner',13),Aj=Lk(nq,'MapEntryImpl',137),ej=Lk(hq,'StringBuffer',115),rj=Lk(nq,'AbstractList',129),vj=Lk(nq,'ArrayList',131),qj=Lk(nq,'AbstractList$IteratorImpl',130),di=Lk(pq,'OfficeImportFunction',16),fi=Lk(pq,'WordImportFunction',18),_h=Lk(qq,'Logged',5),$h=Lk(qq,'Logged$6',8),Zh=Lk('com.ephox.functional.closures.','Thunk',4),wi=Nk(rq,'ReplacementRuleSet'),Lj=Kk('[Lcom.ephox.tord.wordhtmlfilter.','ReplacementRuleSet;',155,wi),jj=Lk(hq,'UnsupportedOperationException',119),yi=Lk(rq,'StepOne',53),Ai=Lk(rq,'StepTwoFilterStyles',55),zi=Lk(rq,'StepThree',54),xi=Lk(rq,'StepLast',52),Bi=Lk(rq,'StepTwoRemoveStyles',56),Qj=Kk(op,'[[C',156,Jj),ti=Lk(rq,'ReadBuffer',36),Ci=Lk(rq,'WriteBuffer',57),ei=Lk(pq,'Scrub',17),gi=Lk(sq,'ListImporter',19),Ti=Lk('com.googlecode.gwtx.java.util.impl.client.','PatternImpl',100),Fj=Lk(tq,'Pattern',143),Ej=Lk(tq,'Matcher',142),xj=Lk(nq,'Collections$EmptyList',134),ai=Lk('com.ephox.functional.factory.','Thunks$1',10),wj=Lk(nq,'Arrays$ArrayList',132),ni=Lk(rq,'CharMap',27),vi=Lk(rq,'RemoveLink',44),pi=Lk(rq,'ModifySingleStyle',31),ri=Lk(rq,'ModifyStyleAttribute',32),ui=Lk(rq,'RemoveAttributeByName',37),qi=Lk(rq,'ModifyStyleAttributeOnlyUsingMustKeepList',33),$i=Lk(hq,'IndexOutOfBoundsException',106),Bj=Lk(nq,'NoSuchElementException',138),gj=Lk(hq,'StringIndexOutOfBoundsException',117),Rj=Kk(op,'[[[C',157,Qj),oi=Lk(rq,'IndexedStrings',30),si=Lk(rq,'ModifyStyleDefinition',34),hi=Lk(sq,'ListInfoStack',21),ii=Lk(sq,'ListInfo',20),mi=Lk(uq,'ListItemData',26),ki=Lk(uq,'ContentData',24),li=Lk(uq,'ListAggregationData',25),aj=Lk(hq,'NumberFormatException',112),ji=Mk(sq,'ListTagAndType',22,Ec),Kj=Kk('[Lcom.ephox.tord.lists.','ListTagAndType;',158,ji),Dj=Lk(nq,'Vector',140),Cj=Lk(nq,'Stack',139),yj=Lk(nq,'EmptyStackException',135);if (com_ephox_keurig_Keurig) com_ephox_keurig_Keurig.onScriptLoad(gwtOnLoad);})();
