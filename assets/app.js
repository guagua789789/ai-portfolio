(() => {
  const dialog = document.querySelector('#player');
  const video = document.querySelector('#playerVideo');
  const title = document.querySelector('#playerTitle');
  const meta = document.querySelector('#playerMeta');
  const closeButton = document.querySelector('.player-close');
  const loader = document.querySelector('#videoLoader');
  const loaderText = loader.querySelector('p');
  const cards = document.querySelectorAll('.work-card');
  let lastFocused = null;

  const showLoader = (text = '正在加载…') => {
    loaderText.textContent = text;
    loader.classList.remove('is-hidden');
  };

  const hideLoader = () => loader.classList.add('is-hidden');

  video.addEventListener('waiting', () => showLoader('正在缓冲…'));
  video.addEventListener('stalled', () => showLoader('网络较慢，正在缓冲…'));
  video.addEventListener('canplay', hideLoader);
  video.addEventListener('playing', hideLoader);
  video.addEventListener('error', () => showLoader('视频加载失败，请刷新重试'));

  const closePlayer = () => {
    if (!dialog.open) return;
    video.pause();
    dialog.close();
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      lastFocused = card;
      const poster = card.querySelector('img');
      title.textContent = card.dataset.title || '作品播放';
      meta.textContent = card.dataset.meta || 'AI FILM';
      video.poster = poster ? poster.src : '';
      video.src = card.dataset.video;
      video.preload = 'auto';
      showLoader();
      document.body.classList.add('player-open');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      video.play().catch(() => {});
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', closePlayer);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closePlayer();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('player-open');
    video.removeAttribute('src');
    video.preload = 'none';
    video.load();
    hideLoader();
    if (lastFocused) lastFocused.focus();
  });

  const revealTargets = [
    ...document.querySelectorAll('.work-card'),
    document.querySelector('.statement'),
    document.querySelector('.section-head')
  ].filter(Boolean);
  revealTargets.forEach((element) => element.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }
})();


