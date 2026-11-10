(() => {
  const config = window.NOVA_CONFIG;
  if (!config) return;

  const whatsapp = message => `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const messages = {
    general: 'Hola, quisiera saber si me podría vender alguna cadena, cuáles quedan?',
    collection: 'Hola, quisiera saber si me podría vender alguna cadena, cuáles quedan?',
    perfume: 'Hola, me interesa el perfume Le Beau de $160 MXN. ¿Está disponible?',
    'customer-photo': 'Hola, ya tengo una cadena de NOVA CHAINS y me gustaría compartir una foto para su galería de clientes.',
    project: config.developmentContactMessage
  };

  document.querySelectorAll('.js-whatsapp').forEach(link => {
    const messageType = link.dataset.message || 'general';
    link.href = whatsapp(messages[messageType] || messages.general);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const customerGallery = document.querySelector('#customer-gallery');
  customerGallery.innerHTML = (config.customerPhotos || []).map((photo, index) => `
    <figure class="customer-photo">
      <div class="customer-photo-frame"><img src="${photo.image}" alt="${photo.alt}" loading="lazy"><span>CLIENTE NOVA · ${String(index + 1).padStart(2, '0')}</span></div>
      <figcaption>${photo.caption}</figcaption>
    </figure>
  `).join('');

  const perfumeGrid = document.querySelector('#perfume-grid');
  perfumeGrid.innerHTML = (config.perfumes || []).map((perfume, index) => `
    <article class="perfume-card">
      <div class="perfume-image"><img src="${perfume.image}" alt="${perfume.alt}" loading="lazy"><span class="perfume-index">NOVA · FRAGANCIA 0${index + 1}</span><span class="perfume-edition">NUEVO ARTÍCULO<br>DE TEMPORADA</span></div>
      <div class="perfume-info"><div><p class="perfume-kicker">DECANT DE PERFUME · 5 ML</p><h3>${perfume.name}</h3><p class="perfume-description">${perfume.description}</p></div><p class="perfume-price"><strong>$${perfume.price}</strong><span>MXN</span></p></div>
      <a class="button button-dark perfume-order" href="${whatsapp(`Hola, me interesa el decant de perfume ${perfume.name} de 5 ml, artículo nuevo de temporada, a $${perfume.price} MXN. ¿Está disponible?`)}" target="_blank" rel="noopener noreferrer">Pedir por WhatsApp <span aria-hidden="true">↗</span></a>
    </article>
  `).join('');
  const gallery = document.querySelector('#chain-grid');
  document.querySelector('#gift-image').src = config.giftImage;
  gallery.innerHTML = config.collectionImages.map((item, index) => `
    <article class="chain-card" data-chain-index="${index}">
      <div class="chain-card-photo">
        <button class="gallery-trigger" type="button" data-gallery-index="${index}" aria-label="Ampliar ${item.name}">
          <img src="${item.image}" alt="${item.alt}" loading="lazy">
          <span class="chain-card-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="gallery-zoom" aria-hidden="true">↗</span>
        </button>
      </div>
      <div class="chain-card-info">
        <div><p class="chain-card-label">NOVA · ${String(index + 1).padStart(2, '0')}</p><h3>${item.name}</h3></div>
        <p class="chain-card-price"><del>$${config.referencePrice}</del><strong>$${config.unitPrice}</strong><span>MXN</span></p>
      </div>
      <button class="chain-select" type="button" data-select-index="${index}" aria-pressed="false">+ Agregar a mi selección</button>
    </article>
  `).join('');

  const selectedChains = new Set();
  const selectionCount = document.querySelector('#selection-count');
  const selectionTotal = document.querySelector('#selection-total');
  const selectionMessage = document.querySelector('#selection-message');
  const sendSelection = document.querySelector('#send-selection');
  const updateSelection = () => {
    const count = selectedChains.size;
    const selectedNames = [...selectedChains].sort((a, b) => a - b).map(index => `Cadena ${String(index + 1).padStart(2, '0')} (${config.collectionImages[index].name})`);
    selectionCount.textContent = count === 1 ? '1 cadena seleccionada' : `${count} cadenas seleccionadas`;
    selectionTotal.textContent = `Total: $${count * config.unitPrice} MXN`;
    const qualifiesForGift = count >= config.giftAtQuantity;
    selectionMessage.textContent = qualifiesForGift
      ? '¡Listo! Tu selección incluye el dije de cruz de regalo.'
      : `Elige ${config.giftAtQuantity - count} más para llevarte el dije de cruz de regalo.`;
    sendSelection.setAttribute('aria-disabled', String(count === 0));
    sendSelection.classList.toggle('is-disabled', count === 0);
    const giftLine = qualifiesForGift ? ' Quiero aprovechar la promoción de compra 3 y recibir el dije de cruz de regalo.' : '';
    const message = `Hola, quisiera pedir estas cadenas: ${selectedNames.join(', ')}. El precio es $${config.unitPrice} MXN cada una.${giftLine} ¿Me confirmas si están disponibles?`;
    sendSelection.href = count ? whatsapp(message) : '#';
  };
  gallery.addEventListener('click', event => {
    const selectButton = event.target.closest('[data-select-index]');
    if (!selectButton) return;
    const index = Number(selectButton.dataset.selectIndex);
    if (selectedChains.has(index)) selectedChains.delete(index);
    else selectedChains.add(index);
    const selected = selectedChains.has(index);
    selectButton.setAttribute('aria-pressed', String(selected));
    selectButton.textContent = selected ? '✓ Agregada · Quitar' : '+ Agregar a mi selección';
    selectButton.closest('.chain-card').classList.toggle('is-selected', selected);
    updateSelection();
  });
  sendSelection.addEventListener('click', event => {
    if (selectedChains.size) return;
    event.preventDefault();
  });
  updateSelection();

  const viewer = document.querySelector('#gallery-viewer');
  const viewerImage = viewer.querySelector('.viewer-image');
  const viewerCount = viewer.querySelector('.viewer-count');
  const thumbnails = viewer.querySelector('.viewer-thumbnails');
  let currentPhoto = 0;
  let lastTrigger = null;
  const showPhoto = index => {
    const length = config.collectionImages.length;
    currentPhoto = (index + length) % length;
    const photo = config.collectionImages[currentPhoto];
    viewerImage.src = photo.image;
    viewerImage.alt = photo.alt;
    viewerCount.textContent = `${String(currentPhoto + 1).padStart(2, '0')} / ${String(length).padStart(2, '0')} · ${photo.alt}`;
    thumbnails.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-current', String(i === currentPhoto));
    });
  };
  thumbnails.innerHTML = config.collectionImages.map((photo, index) => `
    <button type="button" aria-label="Ver foto ${index + 1}: ${photo.alt}" aria-current="false" data-photo-index="${index}"><img src="${photo.image}" alt="" loading="lazy"></button>
  `).join('');
  gallery.addEventListener('click', event => {
    const trigger = event.target.closest('.gallery-trigger');
    if (!trigger) return;
    lastTrigger = trigger;
    showPhoto(Number(trigger.dataset.galleryIndex));
    viewer.showModal();
    viewer.querySelector('.viewer-close').focus();
  });
  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  thumbnails.addEventListener('click', event => {
    const button = event.target.closest('[data-photo-index]');
    if (button) showPhoto(Number(button.dataset.photoIndex));
  });
  viewer.addEventListener('close', () => lastTrigger?.focus());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });
  let touchStartX = null;
  viewer.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  viewer.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 45) showPhoto(currentPhoto + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });

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

  document.addEventListener('click', event => {
    if (menuToggle.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      menuToggle.focus();
    }
  });

  const floatingContact = document.querySelector('.floating-contact');
  const revealContact = () => floatingContact.classList.toggle('is-visible', window.scrollY > 520);
  window.addEventListener('scroll', revealContact, { passive: true });
  revealContact();

  const revealItems = document.querySelectorAll('.chain-card, .gift-promo, .perfume-card, .customer-photo, .customer-invite, .manifesto-copy, .service-card, .faq-list details');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealItems.forEach(item => item.classList.add('will-reveal'));
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  document.querySelectorAll('.faq details').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq details').forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
