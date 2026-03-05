/**
 * Supervisor Controls Widget
 * Allows supervisors to update WxCC Global Variables from the agent desktop.
 * Based on: Cisco "Supervisor - Voice Flow changes from Desktop" (From Features to Solutions, p52+)
 */

// Configurable - change for different regions (eu1, eu2, na1, etc.)
const WXCC_API_BASE = "https://api.wxcc-eu1.cisco.com";
const SUCCESS_MSG_DURATION_MS = 4000;
const MAX_STRING_LENGTH = 256;

// Momentum Design tokens (Cisco Webex design system)
const MD = {
  primary: "#00A0D1",
  primaryHover: "#007AA3",
  gray70: "rgba(0,0,0,0.7)",
  gray50: "rgba(0,0,0,0.5)",
  gray16: "rgba(0,0,0,0.16)",
  gray12: "rgba(0,0,0,0.12)",
  white: "#FFFFFF",
  error: "#D72E15",
};

const style = document.createElement("style");
style.textContent = `
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
*, *::before, *::after { box-sizing: border-box; }

:host {
  font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: ${MD.gray70};
}

.row { display: flex; flex-wrap: wrap; gap: 24px; }
.column { flex: 1; min-width: 300px; }
.loading, .error { padding: 24px; text-align: center; }

/* Momentum-style cards */
.md-card {
  background: ${MD.white};
  border-radius: 8px;
  box-shadow: 0 2px 4px ${MD.gray12};
  padding: 20px;
  margin-bottom: 16px;
}
.md-card__title {
  font-size: 12px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.5px; color: ${MD.gray50};
  margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 1px solid ${MD.gray12};
}

/* Control row */
.control-row {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 12px 0; border-bottom: 1px solid ${MD.gray12};
}
.control-row:last-child { border-bottom: none; }
.control-label { flex: 1; font-weight: 400; line-height: 1.5; }

/* Momentum-style toggle (inspired by md-toggle-switch) */
.md-toggle {
  position: relative; width: 44px; height: 24px; flex-shrink: 0;
  -webkit-user-select: none; user-select: none;
}
.md-toggle__input { position: absolute; opacity: 0; margin: 0; width: 0; height: 0; }
.md-toggle__track {
  display: block; width: 100%; height: 100%; cursor: pointer;
  border-radius: 24px; border: none; transition: background 250ms;
  background: ${MD.gray16};
}
.md-toggle__track::after {
  content: ''; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
  background: ${MD.white}; border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0,0,0,0.32); transition: transform 250ms;
}
.md-toggle__input:checked + .md-toggle__track {
  background: ${MD.primary};
}
.md-toggle__input:checked + .md-toggle__track::after {
  transform: translateX(20px);
}
.md-toggle__input:focus + .md-toggle__track {
  outline: none; box-shadow: 0 0 0 2px ${MD.primary};
}

/* Momentum-style button */
.md-btn {
  padding: 8px 16px; font-size: 14px; font-weight: 500;
  border: none; border-radius: 4px; cursor: pointer;
  transition: background 150ms;
}
.md-btn--primary { background: ${MD.primary}; color: ${MD.white}; }
.md-btn--primary:hover:not(:disabled) { background: ${MD.primaryHover}; }
.md-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.md-btn--secondary { background: ${MD.gray16}; color: ${MD.gray70}; }
.md-btn--secondary:hover:not(:disabled) { background: ${MD.gray12}; }
.md-btn--has-changes { background: ${MD.primary}; color: ${MD.white}; }

/* Textarea */
.md-input {
  width: 100%; min-height: 100px; padding: 12px;
  font-family: inherit; font-size: 14px; line-height: 1.5;
  border: 1px solid ${MD.gray16}; border-radius: 4px;
  resize: vertical; transition: border-color 150ms;
}
.md-input:focus { outline: none; border-color: ${MD.primary}; }
.md-input--error { border-color: ${MD.error}; }
.char-count { font-size: 12px; color: ${MD.gray50}; margin-top: 4px; }
.char-count--over { color: ${MD.error}; }

.msg-feedback { min-height: 24px; margin-top: 12px; font-size: 13px; }

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loading::before {
  content: ""; display: inline-block; width: 20px; height: 20px;
  border: 2px solid ${MD.primary}; border-top-color: transparent;
  border-radius: 50%; animation: spin 0.8s linear infinite;
  margin-right: 8px; vertical-align: middle;
}
`;

const template = document.createElement("template");
template.innerHTML = `
  <div id="loading" class="loading" style="display:none">Loading...</div>
  <div id="error" class="error" style="display:none"></div>
  <div id="content" style="display:none">
    <div class="row">
      <div class="column">
        <div id="table-container"></div>
      </div>
      <div class="column">
        <div id="table-container-string"></div>
      </div>
    </div>
    <div class="msg-feedback" id="submitted"></div>
  </div>
`;

class SupervisorControls extends HTMLElement {
  static get observedAttributes() {
    return ["access-token", "org-id", "user-id", "user"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._state = {
      accessToken: null,
      variables: [],
      savedValues: [],
    };
  }

  _getAttr(name, prop) {
    return this[prop] ?? this.getAttribute(name) ?? "";
  }

  connectedCallback() {
    this.shadowRoot.appendChild(style.cloneNode(true));
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Token and org from Desktop layout STORE: access-token ($STORE.auth.accessToken), org-id ($STORE.agent.orgId)
    const token = this._getAttr("access-token", "accessToken");
    const org = this._getAttr("org-id", "orgId");
    const username = this._getAttr("user-id", "userId") || this._getAttr("user", "User") || null;

    if (!token) {
      this._showError("Missing access-token. Set accessToken: $STORE.auth.accessToken in the Desktop layout properties.");
      return;
    }
    if (!org) {
      this._showError("Missing org-id. Set orgId: $STORE.agent.orgId in the Desktop layout properties.");
      return;
    }

    this._showLoading();
    this._fetchGlobalVariables(org, username, token)
      .then((result) => this._render(result))
      .catch((err) => {
        console.error("[SupervisorControls] ERROR:", err);
        this._showError(err.message || "Failed to load");
      });
  }

  _showLoading() {
    this.shadowRoot.getElementById("loading").style.display = "block";
    this.shadowRoot.getElementById("error").style.display = "none";
    this.shadowRoot.getElementById("content").style.display = "none";
  }

  _showError(msg) {
    this.shadowRoot.getElementById("loading").style.display = "none";
    this.shadowRoot.getElementById("content").style.display = "none";
    const el = this.shadowRoot.getElementById("error");
    el.textContent = msg;
    el.style.display = "block";
  }

  _showContent() {
    this.shadowRoot.getElementById("loading").style.display = "none";
    this.shadowRoot.getElementById("error").style.display = "none";
    this.shadowRoot.getElementById("content").style.display = "block";
  }

  async _safeJson(res, context = "") {
    const text = await res.text();
    if (!text || !text.trim()) {
      throw new Error(`${context}: Empty response (${res.status})`);
    }
    const first = text.trim()[0];
    if (first !== "{" && first !== "[") {
      const preview = text.slice(0, 80).replace(/\s+/g, " ");
      throw new Error(`${context}: Expected JSON but got ${res.status}. Response: ${preview}…`);
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      throw new Error(`${context}: Invalid JSON. ${e.message}`);
    }
  }

  async _fetchGlobalVariables(org, username, token) {
    const search = username ? `?search=${encodeURIComponent(username)}` : "";
    const url = `${WXCC_API_BASE}/organization/${org}/v2/cad-variable${search}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      redirect: "follow",
    });
    const result = await this._safeJson(res, "WxCC API");
    if (result.error) throw new Error(result.error.message?.[0]?.description || "API error");
    return { token, result };
  }

  _render({ token, result }) {
    const context = this.shadowRoot;
    const data = result.data;
    const total = result.meta?.totalRecords ?? 0;

    const booleandata = [];
    const stringdata = [];
    const state = {
      agentEditable: [], variableType: [], agentViewable: [], reportable: [],
      active: [], defaultValue: [], gvid: [], gvname: [], description: [], savedtext: [],
      checkboxname: [], submitname: [], textareaname: [], remainingname: [],
    };

    for (let i = 0; i < total; i++) {
      const v = data[i];
      state.agentEditable[i] = v.agentEditable;
      state.variableType[i] = v.variableType;
      state.agentViewable[i] = v.agentViewable;
      state.reportable[i] = v.reportable;
      state.active[i] = v.active;
      state.defaultValue[i] = v.defaultValue;
      state.gvid[i] = v.id;
      state.gvname[i] = v.name;
      state.savedtext[i] = v.defaultValue;
      state.description[i] = v.description || v.name || "";
      state.checkboxname[i] = `checkbox${i}`;
      state.submitname[i] = `submit${i}`;
      state.textareaname[i] = `textarea${i}`;
      state.remainingname[i] = `remaining${i}`;

      if (v.variableType === "Boolean" && v.active) {
        booleandata.push({
          index: i,
          name: state.description[i],
          value: v.defaultValue,
          checkName: state.checkboxname[i],
          submitName: state.submitname[i],
        });
      }
      if (v.variableType === "String" && v.active) {
        const truncated = this._truncateToMax(v.defaultValue, MAX_STRING_LENGTH);
        state.defaultValue[i] = truncated;
        state.savedtext[i] = truncated;
        stringdata.push({
          index: i,
          name: state.description[i],
          value: truncated,
          textAreaName: state.textareaname[i],
          submitName: state.submitname[i],
          remainingName: state.remainingname[i],
        });
      }
    }

    context.getElementById("table-container").innerHTML = this._generateBooleanTable(booleandata);
    context.getElementById("table-container-string").innerHTML = this._generateStringTable(stringdata);

    // Initialise character counts for string fields
    for (let i = 0; i < total; i++) {
      if (state.variableType[i] === "String") {
        const ta = context.getElementById(state.textareaname[i]);
        const span = context.getElementById(state.remainingname[i]);
        if (ta && span) this._updateCharCount(span, ta.value.length);
      }
    }

    // Event delegation
    context.addEventListener("click", (e) => this._onClick(e, state, token));
    context.addEventListener("keyup", (e) => this._onKeyup(e, state));
    context.addEventListener("paste", (e) => this._onPaste(e, state), true);

    this._state = { ...this._state, ...state, token };
    this._showContent();
  }

  _generateBooleanTable(data) {
    if (!data.length) {
      return `<div class="md-card"><div class="md-card__title">Demo Controls</div><p>No boolean variables</p></div>`;
    }
    let html = '<div class="md-card"><div class="md-card__title">Demo Controls</div>';
    data.forEach((item) => {
      const checked = item.value === "true" ? " checked" : "";
      html += `<div class="control-row">
        <span class="control-label">${this._escape(item.name)}</span>
        <div class="md-toggle">
          <input type="checkbox" class="md-toggle__input" tabindex="0" data-index="${item.index}" id="${item.checkName}"${checked}>
          <label class="md-toggle__track" for="${item.checkName}"></label>
        </div>
        <button type="button" class="md-btn md-btn--secondary" data-index="${item.index}" id="${item.submitName}" disabled>Apply</button>
      </div>`;
    });
    return html + "</div>";
  }

  _generateStringTable(data) {
    if (!data.length) {
      return `<div class="md-card"><div class="md-card__title">Messages</div><p>No string variables</p></div>`;
    }
    let html = '<div class="md-card"><div class="md-card__title">Messages</div>';
    data.forEach((item) => {
      const safeValue = this._truncateToMax(item.value, MAX_STRING_LENGTH);
      html += `<div class="control-row">
        <div style="flex:1">
          <div class="control-label" style="margin-bottom:8px">${this._escape(item.name)}</div>
          <textarea class="md-input" rows="5" maxlength="${MAX_STRING_LENGTH}" id="${item.textAreaName}" data-index="${item.index}">${this._escape(safeValue)}</textarea>
          <div class="char-count" id="${item.remainingName}"></div>
        </div>
        <button type="button" class="md-btn md-btn--secondary" data-index="${item.index}" id="${item.submitName}" disabled>Apply</button>
      </div>`;
    });
    return html + "</div>";
  }

  _truncateToMax(str, max) {
    if (str == null) return "";
    const s = String(str);
    return s.length > max ? s.slice(0, max) : s;
  }

  _updateCharCount(span, len) {
    if (!span) return;
    span.textContent = `${len}/${MAX_STRING_LENGTH}`;
    span.classList.toggle("char-count--over", len > MAX_STRING_LENGTH);
  }

  _escape(str) {
    if (str == null) return "";
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
  }

  _getIndexFromTarget(el, state) {
    const index = el?.dataset?.index ?? el?.id?.replace(/\D/g, "");
    return index !== "" ? parseInt(index, 10) : -1;
  }

  _onClick(e, state, token) {
    const btn = e.target.closest("button[type=button]");
    const cb = e.target.closest("input[type=checkbox]") || (e.target.closest("label[for]") && this.shadowRoot.getElementById(e.target.htmlFor));
    if (btn) {
      const index = this._getIndexFromTarget(btn, state);
      if (index >= 0) this._handleSubmit(btn, index, state, token);
      return;
    }
    if (cb && cb.type === "checkbox") {
      const index = this._getIndexFromTarget(cb, state);
      if (index >= 0) this._handleCheckboxChange(cb, index, state);
    }
  }

  _handleCheckboxChange(checkbox, index, state) {
    const submitBtn = this.shadowRoot.getElementById(state.submitname[index]);
    if (!submitBtn) return;
    state.defaultValue[index] = checkbox.checked ? "true" : "false";
    const hasChanges = state.defaultValue[index] !== state.savedtext[index];
    submitBtn.disabled = !hasChanges;
    submitBtn.className = "md-btn " + (hasChanges ? "md-btn--has-changes" : "md-btn--secondary");
  }

  _handleSubmit(btn, index, state, token) {
    const org = this._getAttr("org-id", "orgId");
    btn.disabled = true;
    btn.className = "md-btn md-btn--secondary";
    state.savedtext[index] = state.defaultValue[index];

    const payload = {
      agentEditable: state.agentEditable[index],
      variableType: state.variableType[index],
      agentViewable: state.agentViewable[index],
      reportable: state.reportable[index],
      active: state.active[index],
      defaultValue: state.defaultValue[index],
      id: state.gvid[index],
      name: state.gvname[index],
      description: state.description[index],
      sensitive: false,
    };

    fetch(`${WXCC_API_BASE}/organization/${org}/cad-variable/${state.gvid[index]}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      redirect: "follow",
    })
      .then((r) => this._safeJson(r, "Update"))
      .then((result) => this._showUpdateResult(result))
      .catch((err) => {
        console.error("[SupervisorControls] Update failed:", err);
        this._showUpdateResult({ error: { message: [{ description: err.message }] } });
      });
  }

  _showUpdateResult(result) {
    const el = this.shadowRoot.getElementById("submitted");
    if (result?.error) {
      el.textContent = "Error: " + (result.error.message?.[0]?.description ?? "Unknown error");
      el.style.color = "#c00";
    } else {
      el.textContent = `Successfully updated ${result.description} to ${result.defaultValue}`;
      el.style.color = "#000";
      if (SUCCESS_MSG_DURATION_MS > 0) {
        setTimeout(() => { el.textContent = ""; }, SUCCESS_MSG_DURATION_MS);
      }
    }
  }

  _onKeyup(e, state) {
    const ta = e.target.closest("textarea");
    if (!ta) return;
    const index = this._getIndexFromTarget(ta, state);
    if (index < 0) return;

    const span = this.shadowRoot.getElementById(state.remainingname[index]);
    this._updateCharCount(span, ta.value.length);

    state.defaultValue[index] = ta.value;
    const submitBtn = this.shadowRoot.getElementById(state.submitname[index]);
    if (submitBtn) {
      const hasChanges = ta.value !== state.savedtext[index];
      submitBtn.disabled = !hasChanges;
      submitBtn.className = "md-btn " + (hasChanges ? "md-btn--has-changes" : "md-btn--secondary");
    }
  }

  _onPaste(e, state) {
    const ta = e.target.closest("textarea");
    if (!ta) return;
    const index = this._getIndexFromTarget(ta, state);
    if (index < 0) return;

    // Value updates after paste; defer character count
    setTimeout(() => {
      const span = this.shadowRoot.getElementById(state.remainingname[index]);
      this._updateCharCount(span, ta.value.length);
    }, 0);
  }
}

customElements.define("supervisor-controls", SupervisorControls);

if (customElements.get("supervisor-controls")) {
  console.log("✅ supervisor-controls component registered");
} else {
  console.error("❌ supervisor-controls component NOT registered");
}
