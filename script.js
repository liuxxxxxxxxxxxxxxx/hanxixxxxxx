const viewer = document.querySelector('.viewer');
const player = viewer.querySelector('video');
const title = viewer.querySelector('.viewer-title');
const meta = viewer.querySelector('.viewer-meta');

function openViewer(item) {
  player.src = item.dataset.video;
  title.textContent = item.dataset.title;
  meta.textContent = item.dataset.meta;
  viewer.showModal();
  player.play().catch(() => {});
}

document.querySelectorAll('.project').forEach((project) => {
  project.querySelector('.project-media').addEventListener('click', () => openViewer(project));
});

function loadAndPreview(video) {
  if (!video.src) video.src = video.dataset.src;
  const stopAtTenSeconds = () => {
    if (video.currentTime >= 10) {
      video.pause();
      video.removeEventListener('timeupdate', stopAtTenSeconds);
    }
  };
  video.addEventListener('timeupdate', stopAtTenSeconds);
  video.play().catch(() => {});
}

const previewObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting || target.dataset.previewed) return;
    target.dataset.previewed = 'true';
    loadAndPreview(target);
    observer.unobserve(target);
  });
}, { rootMargin: '180px 0px', threshold: 0.01 });

document.querySelectorAll('.preview-video').forEach((video) => previewObserver.observe(video));

function closeViewer() {
  player.pause();
  player.removeAttribute('src');
  player.load();
  viewer.close();
}
viewer.querySelector('.close').addEventListener('click', closeViewer);
viewer.addEventListener('click', (event) => { if (event.target === viewer) closeViewer(); });
