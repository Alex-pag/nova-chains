(() => {
  const config = window.NOVA_CONFIG;
  if (!config) return;

  const whatsapp = message => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const messages = {
    general: `Hola, encontré ${config.brand} en su página web y me gustaría conocer las cadenas disponibles.`,
    collection: `Hola, vi las cadenas de ${config.brand} en su página web. Me interesa una de las fotos; ¿me ayudas a identificar el modelo y confirmarme el precio y la disponibilidad?`,
    project: config.developmentContactMessage
  };

  document.querySelectorAll('.js-whatsapp').forEach(link => {
    const messageType = link.dataset.message || 'general';
    link.href = whatsapp(messages[messageType] || messages.general);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const gallery = document.querySelector('#collection-gallery');
  gallery.innerHTML = config.collectionImages.map((item, index) => `
    <figure class="collection-photo collection-photo-${index + 1}">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false">
      <div class="collection-placeholder" hidden aria-hidden="true"><span>FOTO PRÓXIMAMENTE</span></div>
    </figure>
  `).join('') + `
    <div class="gallery-note" aria-hidden="true"><span>NC&nbsp; / &nbsp;ESTILO PERSONAL</span><span class="gallery-note-mark">✳</span></div>
  `;

  const serviceIcons = {
    web: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 13h8M8 16h5"/>',
    app: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M10 5h4M11 18.5h2"/>',
    api: '<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    tools: '<path d="M14 6a5 5 0 0 0-6.4 6.4L3 17l4 4 4.6-4.6A5 5 0 0 0 18 10l-3 3-4-4 3-3Z"/><path d="m15 17 4 4"/>',
    ai: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="4"/>',
    custom: '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8"/>'
  };
  const serviceGrid = document.querySelector('#service-grid');
  serviceGrid.innerHTML = config.developmentServices.map((service, index) => `
    <article class="service-card">
      <div class="service-card-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${serviceIcons[service.icon] || serviceIcons.custom}</svg><span>${String(index + 1).padStart(2, '0')}</span></div>
      <h4>${service.title}</h4>
      <p>${service.description}</p>
    </article>
  `).join('');

  document.querySelector('#year').textContent = new Date().getFullYear();
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => {
    if (!event.target.closest('a')) return;
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
  });
})();
