import PhotoSwipeLightbox from './photoswipe-lightbox.esm.js';

const galleries = document.querySelectorAll('[data-product-gallery]');

const getThumbSrc = (itemData) => {
  if (itemData.element && itemData.element.dataset && itemData.element.dataset.pswpThumb) {
    return itemData.element.dataset.pswpThumb;
  }

  return itemData.msrc || itemData.src;
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
  });

  registerThumbStrip(lightbox);
  lightbox.init();
});
