import{i as g}from"./navigation-D_aGExbN.js";let d=[],u=!1;async function b(){const t=document.getElementById("registration-status"),o=document.getElementById("registration-form-wrapper");if(!(!t||!o)){t.style.display="block",o.style.display="none",t.innerHTML=`
    <div class="status-loading">
      <div class="spinner"></div>
      <p>Fetching dynamic registration fields...</p>
    </div>
  `;{console.info("[Registration] API_URL not configured. Loading schema demo."),d=[{key:"fullName",label:"Full Name",type:"text",required:!0},{key:"email",label:"Email Address",type:"email",required:!0},{key:"phone",label:"Phone Number",type:"tel",required:!0},{key:"college",label:"College / University Name",type:"text",required:!0},{key:"eventChoice",label:"Select Event",type:"select",required:!0,options:["Robo Soccer","Code Relay","Battle of the Bands","Acapella","Reverse Coding","Chamber of Secrets","CAD Design","Spark Tank"]}],t.style.display="none",o.style.display="block",y();return}}}function y(){const t=document.getElementById("registration-form-wrapper");if(!t)return;if(!d||d.length===0){t.innerHTML=`
      <div class="status-empty">
        <p>No fields found in schema.</p>
      </div>
    `;return}const o=d.map(e=>{const s=e.required?"required":"",a=e.required?'<span style="color: var(--accent-orange);">*</span>':"";let l="";if(e.type==="select"){const m=(e.options||[]).map(i=>`<option value="${n(i)}">${n(i)}</option>`).join("");l=`
          <select 
            id="field-${n(e.key)}" 
            name="${n(e.key)}" 
            class="form-control" 
            ${s}
          >
            <option value="">-- Choose ${n(e.label)} --</option>
            ${m}
          </select>
        `}else l=`
          <input 
            type="${n(e.type||"text")}" 
            id="field-${n(e.key)}" 
            name="${n(e.key)}" 
            class="form-control" 
            placeholder="Enter ${n(e.label)}" 
            ${s}
          />
        `;return`
        <div class="form-group">
          <label for="field-${n(e.key)}" class="form-label">
            ${n(e.label)} ${a}
          </label>
          ${l}
        </div>
      `}).join("");t.innerHTML=`
    <form id="dynamic-reg-form" class="registration-form" novalidate>
      <div id="form-error-banner" class="form-error-banner" style="display: none;"></div>
      
      <div class="form-fields-grid">
        ${o}
      </div>

      <div class="form-actions" style="margin-top: 2rem;">
        <button type="submit" id="submit-reg-btn" class="btn-primary" style="width: 100%; justify-content: center;">
          <span class="btn-text">Submit Registration</span>
          <div class="btn-spinner spinner" style="display: none; width: 18px; height: 18px; border-width: 2px;"></div>
        </button>
      </div>
    </form>
  `;const r=document.getElementById("dynamic-reg-form");r&&r.addEventListener("submit",v)}async function v(t){if(t.preventDefault(),u)return;const o=t.currentTarget,r=document.getElementById("submit-reg-btn"),e=r==null?void 0:r.querySelector(".btn-text"),s=r==null?void 0:r.querySelector(".btn-spinner"),a=document.getElementById("form-error-banner");a&&(a.style.display="none");const l=new FormData(o),p={};let m=!1;if(d.forEach(i=>{const f=(l.get(i.key)||"").trim();if(p[i.key]=f,i.required&&!f){m=!0;const c=document.getElementById(`field-${i.key}`);c&&c.classList.add("input-error")}else{const c=document.getElementById(`field-${i.key}`);c&&c.classList.remove("input-error")}}),m){a&&(a.innerHTML="<p>Please fill in all required fields marked with *.</p>",a.style.display="block");return}u=!0,r&&(r.disabled=!0),e&&(e.textContent="Registering..."),s&&(s.style.display="inline-block");{setTimeout(()=>{const i="MAG"+String(Math.floor(100+Math.random()*900));u=!1,h(i,p)},1e3);return}}function h(t,o){var s;const r=document.getElementById("registration-form-wrapper");if(!r)return;const e=o.fullName||o.name||"Participant";r.innerHTML=`
    <div class="confirmation-card" style="text-align: center; padding: 2.5rem 1.5rem;">
      <div class="success-icon-badge">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>

      <span class="badge" style="margin-top: 1.25rem;">REGISTRATION CONFIRMED</span>
      <h2 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: #fff; margin-top: 0.5rem;">You're Registered!</h2>
      <p style="color: var(--text-secondary); margin-top: 0.5rem; font-size: 1rem;">
        Thank you, <strong>${n(e)}</strong>. Your entry for Magnovite '26 is confirmed.
      </p>

      <div class="chest-number-container" style="margin: 2rem 0; padding: 1.5rem; background: rgba(249, 115, 22, 0.08); border: 2px dashed rgba(249, 115, 22, 0.4); border-radius: var(--radius-md);">
        <span style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; color: var(--text-secondary); text-transform: uppercase;">YOUR ASSIGNED CHEST NUMBER</span>
        <div class="chest-number-val" style="font-family: var(--font-heading), monospace; font-size: 3.5rem; font-weight: 900; color: #ff9d5c; text-shadow: 0 0 20px rgba(249, 115, 22, 0.5); margin-top: 0.4rem; letter-spacing: 0.05em;">
          ${n(t)}
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
          Please present or reference this chest number at the event registration desk on arrival.
        </p>
      </div>

      <div class="confirmation-actions" style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button id="register-another-btn" class="btn-primary">Register Another Participant</button>
        <a href="/events.html" class="btn-primary" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); box-shadow: none;">View Events Schedule</a>
      </div>
    </div>
  `,(s=document.getElementById("register-another-btn"))==null||s.addEventListener("click",()=>{y()})}function n(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}document.addEventListener("DOMContentLoaded",()=>{b(),g()});
