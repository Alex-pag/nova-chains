(() => {
  const config = window.NOVA_CONFIG;
  if (!config) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;
  const pad = number => String(number).padStart(2, '0');
  const easing = 'cubic-bezier(.2,.7,.2,1)';
  // Animación puntual (Web Animations API): no hace nada si el usuario pidió menos movimiento.
  const animate = (element, keyframes, options) => {
    if (reduceMotion || !element.animate) return;
    element.animate(keyframes, { duration: 320, easing, ...options });
  };

  const soldOutStamp = '<span class="sold-out-stamp" aria-hidden="true"><strong>AGOTADO</strong><small>NOVA CHAINS</small></span>';
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
      <div class="customer-photo-frame"><img src="${photo.image}" alt="${photo.alt}" loading="lazy" decoding="async"><span>CLIENTE NOVA · ${pad(index + 1)}</span></div>
      <figcaption>${photo.caption}</figcaption>
    </figure>
  `).join('');

  const braceletGrid = document.querySelector('#bracelet-grid');
  braceletGrid.innerHTML = (config.bracelets || []).map((bracelet, index) => `
    <article class="bracelet-card${bracelet.soldOut ? ' is-sold-out' : ''}">
      <div class="bracelet-image">
        <div class="bracelet-image-placeholder" aria-hidden="true"><span>NC</span><small>PULSERA NOVA · 0${index + 1}</small></div>
        <img src="${bracelet.image}" alt="${bracelet.alt}" loading="lazy" decoding="async">
        ${bracelet.referencePrice && !bracelet.soldOut ? '<span class="bracelet-offer-badge">OFERTA</span>' : ''}<span class="bracelet-number">0${index + 1}</span>
        ${bracelet.soldOut ? soldOutStamp : ''}
      </div>
      <div class="bracelet-info"><div><p class="bracelet-kicker">${bracelet.soldOut ? 'AGOTADO · GRACIAS POR TU PREFERENCIA' : bracelet.referencePrice ? 'OFERTA NOVA · PRECIO ESPECIAL' : 'COLECCIÓN NOVA'}</p><h3>${bracelet.name}</h3><p class="bracelet-price">${bracelet.referencePrice ? `<del>$${bracelet.referencePrice}</del>` : ''}<strong>$${bracelet.price}</strong> <span>MXN</span></p></div>${bracelet.soldOut ? '<span class="sold-out-label">Agotado</span>' : `<a class="bracelet-order" href="${whatsapp(`Hola, quiero comprar la pulsera ${bracelet.name} de NOVA CHAINS${bracelet.referencePrice ? ` en oferta, antes $${bracelet.referencePrice} y ahora $${bracelet.price}` : ` por $${bracelet.price}`} MXN. ¿Está disponible?`)}" target="_blank" rel="noopener noreferrer" aria-label="Comprar por WhatsApp la pulsera ${bracelet.name} por $${bracelet.price} MXN">Comprar <span aria-hidden="true">↗</span></a>`}</div>
    </article>
  `).join('');
  braceletGrid.querySelectorAll('.bracelet-image img').forEach(image => {
    const showImage = () => {
      image.previousElementSibling.hidden = true;
      image.classList.add('is-loaded');
    };
    image.addEventListener('load', showImage, { once: true });
    image.addEventListener('error', () => { image.hidden = true; }, { once: true });
    if (image.complete && image.naturalWidth > 0) showImage();
  });

  const perfumeGrid = document.querySelector('#perfume-grid');
  perfumeGrid.innerHTML = (config.perfumes || []).map((perfume, index) => `
    <article class="perfume-card">
      <div class="perfume-image"><img src="${perfume.image}" alt="${perfume.alt}" loading="lazy" decoding="async"><span class="perfume-index">NOVA · FRAGANCIA 0${index + 1}</span><span class="perfume-edition">NUEVO ARTÍCULO<br>DE TEMPORADA</span></div>
      <div class="perfume-info"><div><p class="perfume-kicker">DECANT DE PERFUME · 5 ML</p><h3>${perfume.name}</h3><p class="perfume-description">${perfume.description}</p></div><p class="perfume-price"><strong>$${perfume.price}</strong><span>MXN</span></p></div>
      <a class="button button-dark perfume-order" href="${whatsapp(`Hola, me interesa el decant de perfume ${perfume.name} de 5 ml, artículo nuevo de temporada, a $${perfume.price} MXN. ¿Está disponible?`)}" target="_blank" rel="noopener noreferrer">Pedir por WhatsApp <span aria-hidden="true">↗</span></a>
    </article>
  `).join('');

  const gallery = document.querySelector('#chain-grid');
  document.querySelector('#gift-image').src = config.giftImage;
  const goldCrossOffer = config.goldCrossOffer;
  const goldCrossImage = document.querySelector('#gold-cross-image');
  goldCrossImage.src = goldCrossOffer.image;
  goldCrossImage.alt = goldCrossOffer.alt;
  const goldCrossOrder = document.querySelector('#gold-cross-order');
  if (goldCrossOffer.soldOut) {
    document.querySelector('#gold-cross-offer').classList.add('is-sold-out');
    goldCrossImage.insertAdjacentHTML('afterend', soldOutStamp);
    const soldOutButton = document.createElement('span');
    soldOutButton.className = 'button gold-cross-order';
    soldOutButton.setAttribute('aria-disabled', 'true');
    soldOutButton.textContent = 'Agotado por ahora';
    goldCrossOrder.replaceWith(soldOutButton);
  } else {
    goldCrossOrder.href = whatsapp(`Hola, me interesa la oferta NOVA: ${goldCrossOffer.name} por $${goldCrossOffer.price} MXN. ¿Está disponible?`);
  }
  gallery.innerHTML = config.collectionImages.map((item, index) => `
    <article class="chain-card${item.soldOut ? ' is-sold-out' : ''}" data-chain-index="${index}">
      <div class="chain-card-photo">
        <button class="gallery-trigger" type="button" data-gallery-index="${index}" aria-label="Ampliar ${item.name}${item.soldOut ? ' (agotada)' : ''}">
          <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async" width="853" height="1280">
          <span class="chain-card-number">${pad(index + 1)}</span>
          <span class="gallery-zoom" aria-hidden="true">↗</span>
        </button>
        ${item.soldOut ? soldOutStamp : ''}
      </div>
      <div class="chain-card-info">
        <div><p class="chain-card-label">NOVA · ${pad(index + 1)}</p><h3>${item.name}</h3></div>
        <p class="chain-card-price"><del>$${config.referencePrice}</del><strong>$${config.unitPrice}</strong><span>MXN</span></p>
      </div>
      ${item.soldOut
        ? '<button class="chain-select" type="button" disabled>Agotada</button>'
        : `<button class="chain-select" type="button" data-select-index="${index}" aria-pressed="false">+ Agregar a mi selección</button>`}
    </article>
  `).join('');

  // Selección de cadenas, progreso del regalo y barra fija de pedido.
  const selectedChains = new Set();
  const selectionPanel = document.querySelector('.selection-panel');
  const selectionCount = document.querySelector('#selection-count');
  const selectionTotal = document.querySelector('#selection-total');
  const selectionMessage = document.querySelector('#selection-message');
  const sendSelection = document.querySelector('#send-selection');
  const giftProgress = document.querySelector('#gift-progress');
  const selectionBar = document.querySelector('#selection-bar');
  const selectionBarCount = document.querySelector('#selection-bar-count');
  const selectionBarHint = document.querySelector('#selection-bar-hint');
  const selectionBarSend = document.querySelector('#selection-bar-send');
  const floatingContact = document.querySelector('.floating-contact');
  let panelInView = false;
  let barVisible = false;

  const syncFloating = () => {
    floatingContact.classList.toggle('is-visible', window.scrollY > 520 && !barVisible);
  };
  // La barra fija aparece cuando hay cadenas elegidas y el panel de selección no está a la vista.
  const syncSelectionBar = () => {
    barVisible = selectedChains.size > 0 && !panelInView;
    selectionBar.classList.toggle('is-visible', barVisible);
    selectionBar.inert = !barVisible;
    syncFloating();
  };
  const updateSelection = (animated = false) => {
    const count = selectedChains.size;
    const total = count * config.unitPrice;
    const remaining = config.giftAtQuantity - count;
    const selectedNames = [...selectedChains].sort((a, b) => a - b).map(index => `Cadena ${pad(index + 1)} (${config.collectionImages[index].name})`);
    selectionCount.textContent = count === 1 ? '1 cadena seleccionada' : `${count} cadenas seleccionadas`;
    selectionTotal.textContent = `Total: $${total} MXN`;
    const qualifiesForGift = remaining <= 0;
    selectionMessage.textContent = qualifiesForGift
      ? '¡Listo! Tu selección incluye el dije de cruz de regalo.'
      : `Elige ${remaining} más para llevarte el dije de cruz de regalo.`;
    giftProgress.style.transform = `scaleX(${Math.min(count / config.giftAtQuantity, 1)})`;
    giftProgress.parentElement.classList.toggle('is-complete', qualifiesForGift);
    sendSelection.setAttribute('aria-disabled', String(count === 0));
    sendSelection.classList.toggle('is-disabled', count === 0);
    const giftLine = qualifiesForGift ? ' Quiero aprovechar la promoción de compra 3 y recibir el dije de cruz de regalo.' : '';
    const message = `Hola, quisiera pedir estas cadenas: ${selectedNames.join(', ')}. El precio es $${config.unitPrice} MXN cada una.${giftLine} ¿Me confirmas si están disponibles?`;
    sendSelection.href = count ? whatsapp(message) : '#';
    selectionBarCount.textContent = `${count === 1 ? '1 cadena' : `${count} cadenas`} · $${total} MXN`;
    selectionBarHint.textContent = qualifiesForGift ? 'Incluye tu dije de cruz de regalo' : `Elige ${remaining} más y llévate el dije de regalo`;
    selectionBarSend.href = sendSelection.href;
    syncSelectionBar();
    if (animated) {
      const bump = [{ transform: 'scale(1)' }, { transform: 'scale(1.07)' }, { transform: 'scale(1)' }];
      animate(selectionCount, bump);
      animate(selectionTotal, bump);
      animate(selectionBarCount, bump);
    }
  };
  gallery.addEventListener('click', event => {
    const selectButton = event.target.closest('[data-select-index]');
    if (!selectButton) return;
    const index = Number(selectButton.dataset.selectIndex);
    if (selectedChains.has(index)) selectedChains.delete(index);
    else selectedChains.add(index);
    const selected = selectedChains.has(index);
    const card = selectButton.closest('.chain-card');
    selectButton.setAttribute('aria-pressed', String(selected));
    selectButton.textContent = selected ? '✓ Agregada · Quitar' : '+ Agregar a mi selección';
    card.classList.toggle('is-selected', selected);
    if (selected) animate(card, [{ transform: 'scale(1)' }, { transform: 'scale(.97)' }, { transform: 'scale(1)' }], { duration: 340 });
    updateSelection(true);
  });
  sendSelection.addEventListener('click', event => {
    if (selectedChains.size) return;
    event.preventDefault();
  });
  if (canObserve) {
    new IntersectionObserver(entries => {
      panelInView = entries[entries.length - 1].isIntersecting;
      syncSelectionBar();
    }).observe(selectionPanel);
  }
  updateSelection();

  // Visor de fotos.
  const viewer = document.querySelector('#gallery-viewer');
  const viewerImage = viewer.querySelector('.viewer-image');
  const viewerCount = viewer.querySelector('.viewer-count');
  const thumbnails = viewer.querySelector('.viewer-thumbnails');
  let currentPhoto = 0;
  let lastTrigger = null;
  const showPhoto = (index, direction = 0) => {
    const length = config.collectionImages.length;
    currentPhoto = (index + length) % length;
    const photo = config.collectionImages[currentPhoto];
    viewerImage.src = photo.image;
    viewerImage.alt = photo.alt;
    viewerCount.textContent = `${pad(currentPhoto + 1)} / ${pad(length)} · ${photo.alt}`;
    thumbnails.querySelectorAll('button').forEach((button, i) => {
      button.setAttribute('aria-current', String(i === currentPhoto));
    });
    if (viewer.open) {
      animate(viewerImage, [{ opacity: 0, transform: `translateX(${direction * 22}px) scale(.985)` }, { opacity: 1, transform: 'none' }], { duration: 300 });
    }
  };
  thumbnails.innerHTML = config.collectionImages.map((photo, index) => `
    <button type="button" aria-label="Ver foto ${index + 1}: ${photo.alt}" aria-current="false" data-photo-index="${index}"><img src="${photo.image}" alt="" loading="lazy" decoding="async"></button>
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
  viewer.querySelector('.viewer-prev').addEventListener('click', () => showPhoto(currentPhoto - 1, -1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => showPhoto(currentPhoto + 1, 1));
  thumbnails.addEventListener('click', event => {
    const button = event.target.closest('[data-photo-index]');
    if (!button) return;
    const target = Number(button.dataset.photoIndex);
    if (target !== currentPhoto) showPhoto(target, target > currentPhoto ? 1 : -1);
  });
  viewer.addEventListener('close', () => lastTrigger?.focus());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1, -1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1, 1);
  });
  let touchStartX = null;
  viewer.addEventListener('touchstart', event => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  viewer.addEventListener('touchend', event => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 45) showPhoto(currentPhoto + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
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
      <div class="service-card-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${serviceIcons[service.icon] || serviceIcons.custom}</svg><span>${pad(index + 1)}</span></div>
      <h4>${service.title}</h4>
      <p>${service.description}</p>
    </article>
  `).join('');

  // Menú.
  document.querySelector('#year').textContent = new Date().getFullYear();
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const setMenu = open => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    nav.classList.toggle('is-open', open);
  };
  const menuIsOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.addEventListener('click', () => setMenu(!menuIsOpen()));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('click', event => {
    if (menuIsOpen() && !event.target.closest('.site-header')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuIsOpen()) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  // Desplazamiento: un solo manejador pasivo, limitado a una ejecución por fotograma.
  const scrollProgress = document.querySelector('.scroll-progress');
  let scrollQueued = false;
  const onScroll = () => {
    scrollQueued = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('is-scrolled', y > 10);
    scrollProgress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    syncFloating();
  };
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  if (canObserve) {
    // Pausa las animaciones continuas de las secciones que no están en pantalla.
    const pauseObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-paused', !entry.isIntersecting);
    }), { rootMargin: '80px 0px' });
    document.querySelectorAll('main > section, .marquee').forEach(section => pauseObserver.observe(section));

    // Resalta en el menú la sección que cruza el centro de la pantalla.
    const sectionLinks = new Map([...nav.querySelectorAll('a[href^="#"]')].map(link => [link.getAttribute('href').slice(1), link]));
    const spyObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      sectionLinks.get(entry.target.id)?.classList.toggle('is-active', entry.isIntersecting);
    }), { rootMargin: '-45% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => spyObserver.observe(section));
  }

  // Aparición al desplazarse: los elementos que entran juntos se escalonan.
  if (canObserve && !reduceMotion) {
    const revealItems = document.querySelectorAll('.section-heading, .chain-card, .gift-promo, .gold-cross-offer, .selection-panel, .bracelet-card, .perfume-card, .customer-photo, .customer-invite, .manifesto-mark, .manifesto-copy, .manifesto-side, .faq-list details, .closing > :not(.closing-star), .developer-intro > div, .services-heading, .service-card, .developer-signature');
    revealItems.forEach(item => item.classList.add('will-reveal'));
    const revealObserver = new IntersectionObserver(entries => {
      let order = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const item = entry.target;
        const delay = Math.min(order++, 5) * 70;
        item.style.transitionDelay = `${delay}ms`;
        item.classList.add('is-revealed');
        revealObserver.unobserve(item);
        // Al terminar se retiran las clases para devolver al elemento sus transiciones propias (hover, selección).
        setTimeout(() => {
          item.classList.remove('will-reveal', 'is-revealed');
          item.style.transitionDelay = '';
        }, delay + 1400);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  // Paralaje del arte del hero: solo con ratón, nunca en pantallas táctiles.
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.hero');
    const heroArt = document.querySelector('.hero-art');
    let pointerFrame = 0;
    hero.addEventListener('pointermove', event => {
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = hero.getBoundingClientRect();
        heroArt.style.setProperty('--px', ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
        heroArt.style.setProperty('--py', ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => {
      heroArt.style.setProperty('--px', 0);
      heroArt.style.setProperty('--py', 0);
    });
  }

  document.querySelectorAll('.faq details').forEach(detail => detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq details').forEach(other => { if (other !== detail) other.open = false; });
  }));
})();
