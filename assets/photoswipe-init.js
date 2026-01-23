import PhotoSwipeLightbox from './photoswipe-lightbox.esm.js';

const galleries = document.querySelectorAll('[data-product-gallery]');

const getThumbSrc = (itemData) => {
  if (itemData.element && itemData.element.dataset && itemData.element.dataset.pswpThumb) {
    return itemData.element.dataset.pswpThumb;
  }

  return itemData.msrc || itemData.src;
};

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const buildExternalVideoUrl = (host, id, loop) => {
  if (!host || !id) return '';

  if (host === 'youtube') {
    const params = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1' });
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', id);
    }
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }

  if (host === 'vimeo') {
    const params = new URLSearchParams({ autoplay: '1' });
    if (loop) params.set('loop', '1');
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }

  return '';
};

const buildVideoHtml = ({ src, mime, host, id, loop, title }) => {
  if (src) {
    const mimeAttr = mime ? ` type="${escapeHtml(mime)}"` : '';
    const loopAttr = loop ? ' loop' : '';
    return `<video class="pswp__video" controls playsinline autoplay${loopAttr}><source src="${escapeHtml(
      src,
    )}"${mimeAttr}></video>`;
  }

  const externalUrl = buildExternalVideoUrl(host, id, loop);
  if (externalUrl) {
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<div class="pswp__video-wrapper"><iframe class="pswp__video" src="${externalUrl}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"${titleAttr}></iframe></div>`;
  }

  return '';
};

const registerThumbStrip = (lightbox) => {
  lightbox.on('uiRegister', () => {
    lightbox.pswp.ui.registerElement({
      name: 'thumbs',
      order: 9,
      isButton: false,
      appendTo: 'root',
      className: 'pswp__thumbs pswp__hide-on-close',
      onInit: (el, pswp) => {
        const thumbs = [];
        const total = pswp.getNumItems();

        if (total < 2) {
          el.classList.add('pswp__thumbs--hidden');
          return;
        }

        el.setAttribute('aria-label', 'Image thumbnails');

        for (let index = 0; index < total; index += 1) {
          const itemData = pswp.getItemData(index);
          const thumbSrc = getThumbSrc(itemData);
          if (!thumbSrc) continue;

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'pswp__thumb';
          button.setAttribute('aria-label', `Go to image ${index + 1}`);
          button.addEventListener('click', () => pswp.goTo(index));

          const img = document.createElement('img');
          img.src = thumbSrc;
          img.alt = itemData.alt || '';
          img.loading = 'lazy';
          img.decoding = 'async';

          button.appendChild(img);
          el.appendChild(button);
          thumbs.push(button);
        }

        const setActiveThumb = () => {
          thumbs.forEach((thumb, thumbIndex) => {
            thumb.classList.toggle('is-active', thumbIndex === pswp.currIndex);
          });

          const activeThumb = thumbs[pswp.currIndex];
          if (activeThumb) {
            activeThumb.scrollIntoView({ block: 'nearest', inline: 'center' });
          }
        };

        pswp.on('change', setActiveThumb);
        setActiveThumb();
      },
    });
  });
};

galleries.forEach((gallery) => {
  const lightbox = new PhotoSwipeLightbox({
    gallery,
    children: 'a.pswp-item',
    pswpModule: () => import('./photoswipe.esm.js'),
    wheelToZoom: true,
    clickToCloseNonZoomable: false,
    tapAction: 'zoom',
    doubleTapAction: 'zoom',
    initialZoomLevel: 'fit',
    secondaryZoomLevel: 2,
    maxZoomLevel: 4,
  });

  lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
    if (!linkEl || linkEl.dataset.pswpType !== 'video') return itemData;

    const loop = linkEl.dataset.pswpVideoLoop === 'true';
    const title = linkEl.getAttribute('aria-label') || itemData.alt || '';
    const html = buildVideoHtml({
      src: linkEl.dataset.pswpVideoSrc,
      mime: linkEl.dataset.pswpVideoMime,
      host: linkEl.dataset.pswpVideoHost,
      id: linkEl.dataset.pswpVideoId,
      loop,
      title,
    });

    if (html) {
      itemData.type = 'html';
      itemData.html = html;
    }

    return itemData;
  });

  lightbox.on('contentDeactivate', (event) => {
    const contentEl = event?.content?.element;
    if (!contentEl) return;

    const video = contentEl.querySelector('video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    const iframe = contentEl.querySelector('iframe');
    if (iframe && iframe.src) {
      iframe.src = iframe.src;
    }
  });

  registerThumbStrip(lightbox);
  lightbox.init();
});
