const PROFILES = {
  'ahmed-essam': {
    name: 'Ahmed Essam',
    role: 'I-Mole Lab Marketing Moderator',
    phone: '+201111493951',
    email: 'ahmedesammohamed1122@gmail.com',
    links: [
      { label: 'Facebook', url: 'https://www.facebook.com/ahmed.essam.791595' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/22ahmed-essam' }
    ]
  },
  'hala-elfiky': {
    name: 'Hala G Elfiky',
    role: 'I-Mole Lab Analysis Moderator',
    phone: '+201128207463',
    email: 'halag.elfiky-Basic-science@spbu.edu.eg',
    links: []
  },
  'ahmed-soliman': {
    name: 'Ahmed G Soliman',
    role: 'I-Mole Lab CEO',
    phone: '+81 70-8975-1060',
    email: '',
    links: [
      { label: 'Website', url: 'https://sites.google.com/view/ahmed-g-soliman/home' }
    ]
  },
  'mennatallah-sayed': {
    name: 'Menna Tallah Sayed',
    role: 'Vice CEO',
    phone: '',
    email: '',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/menna-tallah-sayed-nady/' }
    ]
  }
};

function vCardString(p) {
  const parts = p.name.trim().split(' ');
  const first = parts.shift();
  const last = parts.join(' ');
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push(`N:${last};${first};;;`);
  lines.push(`FN:${p.name}`);
  lines.push('ORG:I-Mole Lab');
  lines.push(`TITLE:${p.role}`);
  if (p.phone) lines.push(`TEL;TYPE=CELL:${p.phone}`);
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET:${p.email}`);
  p.links.forEach(l => lines.push(`URL:${l.url}`));
  lines.push('END:VCARD');
  return lines.join('\n');
}

function initials(name) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

const ICONS = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 21h3M21 14v3"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>'
};

function buildContactListHTML(p) {
  let html = '';
  if (p.phone) html += `<li>${ICONS.phone}<a href="tel:${p.phone.replace(/\s/g, '')}">${p.phone}</a></li>`;
  if (p.email) html += `<li>${ICONS.email}<a href="mailto:${p.email}">${p.email}</a></li>`;
  p.links.forEach(l => { html += `<li>${ICONS.link}<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a></li>`; });
  return html;
}

/* ---------- Directory (index.html) ---------- */
function renderDirectory() {
  const grid = document.getElementById('directoryGrid');
  if (!grid) return;
  Object.entries(PROFILES).forEach(([id, p]) => {
    const pageUrl = new URL(id + '.html', window.location.href).href;

    const card = document.createElement('a');
    card.className = 'card';
    card.href = id + '.html';
    card.innerHTML = `
      <div class="avatar">${initials(p.name)}</div>
      <div class="card-body">
        <h2>${p.name}</h2>
        <p class="role">${p.role}</p>
        <p class="open-hint">${ICONS.arrow} Open profile page</p>
      </div>
      <div class="mini-qr" id="mini-${id}"></div>
    `;
    grid.appendChild(card);

    new QRCode(card.querySelector(`#mini-${id}`), {
      text: pageUrl, width: 120, height: 120,
      colorDark: '#0b1626', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M
    });
  });
}

/* ---------- Individual profile page ---------- */
function renderProfile(id) {
  const p = PROFILES[id];
  if (!p) return;

  document.getElementById('profileAvatar').textContent = initials(p.name);
  document.getElementById('profileName').textContent = p.name;
  document.getElementById('profileRole').textContent = p.role;
  document.getElementById('contactList').innerHTML = buildContactListHTML(p);

  const qrBox = document.getElementById('profileQr');
  // The QR encodes THIS page's own URL: scanning it opens this exact profile page.
  new QRCode(qrBox, {
    text: window.location.href, width: 220, height: 220,
    colorDark: '#0b1626', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M
  });

  document.getElementById('saveContactBtn').addEventListener('click', () => {
    const blob = new Blob([vCardString(p)], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.name.replace(/\s+/g, '-')}-I-Mole-Lab.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('downloadQrBtn').addEventListener('click', () => {
    const canvas = qrBox.querySelector('canvas');
    const a = document.createElement('a');
    a.download = `I-Mole-Lab-${id}-page-QR.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  });
}
