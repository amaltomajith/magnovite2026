import { initNavigation } from './navigation';

export interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select';
  required: boolean;
  options?: string[];
}

interface RegisterResponse {
  success?: boolean;
  chestNumber?: string;
  error?: string;
}

// In-Memory Form State (No localStorage/sessionStorage used)
let formSchema: SchemaField[] = [];
let isSubmitting = false;

// Get dynamic API URL endpoint from URL query string
function getApiUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  const api = urlParams.get('api');
  return api ? api.trim() : null;
}

async function fetchFormSchema() {
  const statusContainer = document.getElementById('registration-status');
  const formWrapper = document.getElementById('registration-form-wrapper');

  if (!statusContainer || !formWrapper) return;

  const apiUrl = getApiUrl();

  // If no api param is present, show clear error state asking user to select an event
  if (!apiUrl) {
    statusContainer.style.display = 'block';
    formWrapper.style.display = 'none';
    statusContainer.innerHTML = `
      <div class="status-error" style="text-align: center; padding: 3rem 1.5rem;">
        <div style="margin-bottom: 1.25rem;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <p style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">
          No event selected — please register through the Events page
        </p>
        <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.75rem;">
          Each competition has a dedicated registration schema. Pick an event from the schedule to open its custom form.
        </p>
        <a href="/events.html" class="btn-primary" style="display: inline-flex; justify-content: center;">
          Browse Events Schedule
        </a>
      </div>
    `;
    return;
  }

  statusContainer.style.display = 'block';
  formWrapper.style.display = 'none';

  statusContainer.innerHTML = `
    <div class="status-loading">
      <div class="spinner"></div>
      <p>Fetching dynamic registration fields...</p>
    </div>
  `;

  try {
    const fetchUrl = apiUrl.indexOf('?') !== -1 ? `${apiUrl}&action=fields` : `${apiUrl}?action=fields`;
    const response = await fetch(fetchUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!Array.isArray(data)) {
      throw new Error("Invalid schema format: Expected an array of field definitions.");
    }

    formSchema = data;
    statusContainer.style.display = 'none';
    formWrapper.style.display = 'block';
    renderDynamicForm();
  } catch (err) {
    console.error('[Registration Schema Fetch Error]', err);

    // If fetch failed on a demo/mock endpoint URL, load fallback demo schema for testing
    if (apiUrl.includes('DEMO') || apiUrl.includes('demo') || apiUrl.includes('localhost') || apiUrl.includes('example')) {
      console.info('[Registration] Demo endpoint detected or network offline. Rendering demo schema for testing.');
      formSchema = [
        { key: "fullName", label: "Full Name", type: "text", required: true },
        { key: "email", label: "Email Address", type: "email", required: true },
        { key: "phone", label: "Phone Number", type: "tel", required: true },
        { key: "college", label: "College / University Name", type: "text", required: true },
        { key: "teamName", label: "Team Name", type: "text", required: false },
        { key: "experienceLevel", label: "Experience Level", type: "select", required: true, options: ["Beginner", "Intermediate", "Advanced"] }
      ];
      statusContainer.style.display = 'none';
      formWrapper.style.display = 'block';
      renderDynamicForm();
      return;
    }

    statusContainer.innerHTML = `
      <div class="status-error">
        <p><strong>Failed to load registration fields.</strong></p>
        <p style="font-size: 0.85rem; margin-top: 0.4rem; opacity: 0.8;">
          ${(err as Error).message}
        </p>
        <button id="schema-retry-btn" class="retry-btn">Try Again</button>
      </div>
    `;

    document.getElementById('schema-retry-btn')?.addEventListener('click', () => {
      fetchFormSchema();
    });
  }
}

function renderDynamicForm() {
  const formWrapper = document.getElementById('registration-form-wrapper');
  if (!formWrapper) return;

  if (!formSchema || formSchema.length === 0) {
    formWrapper.innerHTML = `
      <div class="status-empty">
        <p>No fields found in schema.</p>
      </div>
    `;
    return;
  }

  const fieldsHtml = formSchema
    .map((field) => {
      const isRequired = field.required ? 'required' : '';
      const reqAsterisk = field.required ? '<span style="color: var(--accent-orange);">*</span>' : '';

      let inputElementHtml = '';

      if (field.type === 'select') {
        const opts = field.options || [];
        const optionsHtml = opts
          .map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`)
          .join('');

        inputElementHtml = `
          <select 
            id="field-${escapeHtml(field.key)}" 
            name="${escapeHtml(field.key)}" 
            class="form-control" 
            ${isRequired}
          >
            <option value="">-- Choose ${escapeHtml(field.label)} --</option>
            ${optionsHtml}
          </select>
        `;
      } else {
        inputElementHtml = `
          <input 
            type="${escapeHtml(field.type || 'text')}" 
            id="field-${escapeHtml(field.key)}" 
            name="${escapeHtml(field.key)}" 
            class="form-control" 
            placeholder="Enter ${escapeHtml(field.label)}" 
            ${isRequired}
          />
        `;
      }

      return `
        <div class="form-group">
          <label for="field-${escapeHtml(field.key)}" class="form-label">
            ${escapeHtml(field.label)} ${reqAsterisk}
          </label>
          ${inputElementHtml}
        </div>
      `;
    })
    .join('');

  formWrapper.innerHTML = `
    <form id="dynamic-reg-form" class="registration-form" novalidate>
      <div id="form-error-banner" class="form-error-banner" style="display: none;"></div>
      
      <div class="form-fields-grid">
        ${fieldsHtml}
      </div>

      <div class="form-actions" style="margin-top: 2rem;">
        <button type="submit" id="submit-reg-btn" class="btn-primary" style="width: 100%; justify-content: center;">
          <span class="btn-text">Submit Registration</span>
          <div class="btn-spinner spinner" style="display: none; width: 18px; height: 18px; border-width: 2px;"></div>
        </button>
      </div>
    </form>
  `;

  const formEl = document.getElementById('dynamic-reg-form') as HTMLFormElement;
  if (formEl) {
    formEl.addEventListener('submit', handleFormSubmit);
  }
}

async function handleFormSubmit(e: Event) {
  e.preventDefault();
  if (isSubmitting) return;

  const formEl = e.currentTarget as HTMLFormElement;
  const submitBtn = document.getElementById('submit-reg-btn') as HTMLButtonElement;
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnSpinner = submitBtn?.querySelector('.btn-spinner') as HTMLElement;
  const errorBanner = document.getElementById('form-error-banner');

  if (errorBanner) errorBanner.style.display = 'none';

  // Gather Form Values
  const formData = new FormData(formEl);
  const payload: Record<string, string> = {};

  let missingRequired = false;

  formSchema.forEach((field) => {
    const val = (formData.get(field.key) as string || '').trim();
    payload[field.key] = val;

    if (field.required && !val) {
      missingRequired = true;
      const inputEl = document.getElementById(`field-${field.key}`);
      if (inputEl) inputEl.classList.add('input-error');
    } else {
      const inputEl = document.getElementById(`field-${field.key}`);
      if (inputEl) inputEl.classList.remove('input-error');
    }
  });

  if (missingRequired) {
    if (errorBanner) {
      errorBanner.innerHTML = `<p>Please fill in all required fields marked with *.</p>`;
      errorBanner.style.display = 'block';
    }
    return;
  }

  // Set Submitting State
  isSubmitting = true;
  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Registering...';
  if (btnSpinner) btnSpinner.style.display = 'inline-block';

  const apiUrl = getApiUrl();

  // Demo Fallback Submission when apiUrl is a demo or testing endpoint
  if (!apiUrl || apiUrl.includes('DEMO') || apiUrl.includes('demo') || apiUrl.includes('localhost') || apiUrl.includes('example')) {
    setTimeout(() => {
      const demoChestNum = "MAG" + String(Math.floor(100 + Math.random() * 900));
      isSubmitting = false;
      renderConfirmationView(demoChestNum, payload);
    }, 800);
    return;
  }

  try {
    const postUrl = apiUrl.indexOf('?') !== -1 ? `${apiUrl}&action=register` : `${apiUrl}?action=register`;
    
    /**
     * CRITICAL WORKAROUND:
     * Send POST request with Content-Type: "text/plain;charset=utf-8"
     * to avoid triggering CORS preflight OPTIONS request in Google Apps Script Web Apps.
     */
    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData: RegisterResponse = await response.json();

    if (resData.error || resData.success === false) {
      throw new Error(resData.error || 'Registration processing failed.');
    }

    const chestNumber = resData.chestNumber || "MAG001";
    isSubmitting = false;
    renderConfirmationView(chestNumber, payload);

  } catch (err) {
    console.error('[Registration Submit Error]', err);
    isSubmitting = false;
    
    if (submitBtn) submitBtn.disabled = false;
    if (btnText) btnText.textContent = 'Submit Registration';
    if (btnSpinner) btnSpinner.style.display = 'none';

    if (errorBanner) {
      errorBanner.innerHTML = `<p><strong>Registration failed:</strong> ${(err as Error).message}</p>`;
      errorBanner.style.display = 'block';
    }
  }
}

function renderConfirmationView(chestNumber: string, payload: Record<string, string>) {
  const formWrapper = document.getElementById('registration-form-wrapper');
  if (!formWrapper) return;

  const participantName = payload.fullName || payload.name || "Participant";

  formWrapper.innerHTML = `
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
        Thank you, <strong>${escapeHtml(participantName)}</strong>. Your entry for Magnovite '26 is confirmed.
      </p>

      <div class="chest-number-container" style="margin: 2rem 0; padding: 1.5rem; background: rgba(249, 115, 22, 0.08); border: 2px dashed rgba(249, 115, 22, 0.4); border-radius: var(--radius-md);">
        <span style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; color: var(--text-secondary); text-transform: uppercase;">YOUR ASSIGNED CHEST NUMBER</span>
        <div class="chest-number-val" style="font-family: var(--font-heading), monospace; font-size: 3.5rem; font-weight: 900; color: #ff9d5c; text-shadow: 0 0 20px rgba(249, 115, 22, 0.5); margin-top: 0.4rem; letter-spacing: 0.05em;">
          ${escapeHtml(chestNumber)}
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
  `;

  document.getElementById('register-another-btn')?.addEventListener('click', () => {
    renderDynamicForm();
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  fetchFormSchema();
  initNavigation();
});
