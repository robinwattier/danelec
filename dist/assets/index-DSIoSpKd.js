(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function r(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=r(o);fetch(o.href,s)}})();const g=document.getElementById("header");function L(){window.scrollY>50||document.documentElement.scrollTop>50?g.classList.add("scrolled"):g.classList.remove("scrolled")}window.addEventListener("scroll",L);window.addEventListener("load",L);L();const d=document.getElementById("mobile-toggle"),h=document.getElementById("nav-links");function k(){h.classList.remove("active"),g.classList.remove("nav-open"),d.querySelector("i").classList.add("ri-menu-line"),d.querySelector("i").classList.remove("ri-close-line")}d.addEventListener("click",e=>{e.stopPropagation();const t=h.classList.toggle("active");g.classList.toggle("nav-open",t),d.querySelector("i").classList.toggle("ri-menu-line"),d.querySelector("i").classList.toggle("ri-close-line")});document.addEventListener("click",e=>{h.classList.contains("active")&&!h.contains(e.target)&&!d.contains(e.target)&&k()});document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",function(t){t.preventDefault();const r=document.querySelector(this.getAttribute("href"));r&&(k(),window.scrollTo({top:r.offsetTop-80,behavior:"smooth"}))})});const I={threshold:.1},T=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&t.target.classList.add("reveal")})},I);document.querySelectorAll("section, .card, .comparison-image, .product-card").forEach(e=>{e.style.opacity="0",e.style.transform="translateY(30px)",e.style.transition="all 0.8s ease-out",T.observe(e)});const S=document.createElement("style");S.innerHTML=`
    .reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(13, 2, 2, 0.98); /* Updated to match new dark red theme */
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }
        
        .nav-links.active li {
            font-size: 1.5rem;
            margin-bottom: 2rem;
        }

        .nav-links.active a {
            color: #F1FAEE !important;
        }

        .nav-links.active .nav-tel {
            border-color: #FFC107 !important;
            color: #FFC107 !important;
        }

        .nav-links.active .nav-tel:hover {
            background-color: #FFC107 !important;
            color: #1A0505 !important;
        }
    }
`;document.head.appendChild(S);const f=document.getElementById("contact-form"),u=document.getElementById("form-feedback");let y=0;const E=3e4,l=document.getElementById("message");if(l){const e=document.createElement("span");e.className="char-counter",e.style.cssText="font-size:0.8rem;color:var(--text-dim);text-align:right;display:block;margin-top:4px;",e.textContent="0 / 2000",l.parentNode.appendChild(e),l.addEventListener("input",()=>{const t=l.value.length;e.textContent=`${t} / 2000`,e.style.color=t>1800?"var(--accent)":"var(--text-dim)"})}f&&f.addEventListener("submit",async e=>{e.preventDefault();const t=Date.now();if(t-y<E){const o=Math.ceil((E-(t-y))/1e3);b(`Veuillez patienter ${o}s avant de renvoyer.`,"error");return}const r=document.getElementById("submit-btn"),i=r.innerHTML;r.innerHTML='<span>Envoi en cours...</span><i class="ri-loader-4-line ri-spin"></i>',r.disabled=!0,w();try{const o=new FormData(f),s=o.get("Nom ou Société")||"",n=o.get("Téléphone")||"",a=`Demande de Devis - ${s}${n?" - Tél: "+n:""}`;o.set("subject",a);const m=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{Accept:"application/json"},body:o}),c=await m.json();if(m.ok&&c.success){if(y=Date.now(),b("✅ Votre demande a été envoyée avec succès ! Nous vous contacterons très prochainement.","success"),f.reset(),l){const v=l.parentNode.querySelector(".char-counter");v&&(v.textContent="0 / 2000")}u.scrollIntoView({behavior:"smooth",block:"nearest"}),setTimeout(w,1e4)}else throw new Error(c.message||"Erreur lors de l'envoi.")}catch(o){b("❌ Erreur lors de l'envoi. Veuillez réessayer ou nous appeler directement au 065 34 01 03.","error"),console.error("Form submission error:",o)}finally{r.innerHTML=i,r.disabled=!1}});function b(e,t){u.textContent=e,u.className=`form-feedback ${t}`,u.style.display="block"}function w(){u.style.display="none",u.className="form-feedback"}function p(e){const t=document.getElementById(e);if(!t)return;const r=t.querySelectorAll(".carousel-slides img"),i=t.querySelectorAll(".dot"),o=t.querySelector(".next"),s=t.querySelector(".prev");let n=0;function a(c){r[n].classList.remove("active"),i[n].classList.remove("active"),n=(c+r.length)%r.length,r[n].classList.add("active"),i[n].classList.add("active")}o.addEventListener("click",c=>{c.stopPropagation(),a(n+1)}),s.addEventListener("click",c=>{c.stopPropagation(),a(n-1)}),i.forEach((c,v)=>{c.addEventListener("click",x=>{x.stopPropagation(),a(v)})});let m=setInterval(()=>a(n+1),5e3);t.addEventListener("mouseenter",()=>clearInterval(m)),t.addEventListener("mouseleave",()=>{m=setInterval(()=>a(n+1),5e3)})}document.addEventListener("DOMContentLoaded",()=>{p("ksenia-carousel"),p("caddx-carousel"),p("vanderbilt-carousel"),p("hikvision-carousel"),p("limotec-carousel")});
