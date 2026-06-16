const BACKEND = 'http://localhost:5000';
let btn = null;
let bubble = null;

function removeUI() {
  if (btn) { btn.remove(); btn = null; }
  if (bubble) { bubble.remove(); bubble = null; }
}

document.addEventListener('mouseup', () => {
  const sel = window.getSelection();
  const text = sel ? sel.toString().trim() : '';
  if (!text || text.length < 10) { removeUI(); return; }
  removeUI();
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  btn = document.createElement('button');
  btn.className = 'factflow-btn';
  btn.textContent = '⚡ FactFlow';
  btn.style.top = `${rect.top + window.scrollY - 40}px`;
  btn.style.left = `${rect.left + window.scrollX}px`;
  document.body.appendChild(btn);

  btn.addEventListener('click', async () => {
    btn.textContent = 'Checking…';
    btn.disabled = true;
    try {
      const res = await fetch(`${BACKEND}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: text }] }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || 'No response';
      bubble = document.createElement('div');
      bubble.className = 'factflow-bubble';
      bubble.innerHTML = `<div class="factflow-header"><strong>⚡ FactFlow</strong><button class="factflow-close">✕</button></div><p class="factflow-claim">"${text.slice(0, 80)}${text.length > 80 ? '…' : ''}"</p><p class="factflow-response">${reply}</p>`;
      bubble.style.top = `${rect.bottom + window.scrollY + 8}px`;
      bubble.style.left = `${rect.left + window.scrollX}px`;
      document.body.appendChild(bubble);
      bubble.querySelector('.factflow-close').addEventListener('click', removeUI);
    } catch {
      btn.textContent = 'Error — is backend running?';
    }
  });
});

document.addEventListener('mousedown', (e) => {
  if (btn && !btn.contains(e.target) && (!bubble || !bubble.contains(e.target))) removeUI();
});
