const slides = Array.from(document.querySelectorAll('.slide'));
const dotsNav = document.getElementById('dotsNav');
const progressBar = document.getElementById('progressBar');
let current = 0;
let locked = false;

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Слайд ' + (i + 1));
  b.addEventListener('click', () => goTo(i));
  dotsNav.appendChild(b);
});

const dots = Array.from(dotsNav.children);

function update() {
  dots.forEach((d, i) => d.classList.toggle('on', i === current));
  progressBar.style.width = ((current + 1) / slides.length * 100) + '%';
}

function goTo(i) {
  if (i < 0 || i >= slides.length || i === current && slides[i].classList.contains('active')) return;
  slides[current].classList.remove('active');
  current = i;
  slides[current].classList.add('active');
  slides[current].scrollTop = 0;
  revealSlide(current);
  update();
}

function next() { if (current < slides.length - 1) goTo(current + 1); }
function prev() { if (current > 0) goTo(current - 1); }

function revealSlide(i) {
  const els = slides[i].querySelectorAll('.card, .pop-stat, .gem, .res-row, .points li, .panel, .fact, .final-quote, .conclusion');
  els.forEach(el => el.classList.add('reveal'));
  setTimeout(() => {
    els.forEach((el, k) => setTimeout(() => el.classList.add('show'), k * 70));
  }, 150);
}

document.addEventListener('keydown', e => {
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); next(); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
  if (e.key === 'Home') goTo(0);
  if (e.key === 'End') goTo(slides.length - 1);
  if (e.key === 'f' || e.key === 'F') toggleFullscreen();
});

document.addEventListener('wheel', e => {
  if (locked) return;
  const slide = slides[current];
  const canScroll = slide.scrollHeight > slide.clientHeight + 4;
  if (canScroll) {
    const atTop = slide.scrollTop <= 2;
    const atBottom = slide.scrollTop + slide.clientHeight >= slide.scrollHeight - 4;
    if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) return;
  }
  locked = true;
  if (e.deltaY > 0) next(); else prev();
  setTimeout(() => { locked = false; }, 750);
}, { passive: true });

let touchX = 0, touchY = 0;
document.addEventListener('touchstart', e => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchX;
  const dy = e.changedTouches[0].clientY - touchY;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) next(); else prev();
  }
}, { passive: true });

const fsBtn = document.getElementById('fsBtn');

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

fsBtn.addEventListener('click', toggleFullscreen);

document.getElementById('startBtn').addEventListener('click', next);
document.getElementById('restartBtn').addEventListener('click', () => goTo(0));

function animateCount(el, target, dur) {
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString('ru-RU');
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

window.addEventListener('load', () => {
  animateCount(document.getElementById('countPop'), 672, 1600);
  animateCount(document.getElementById('countArea'), 2586, 1800);
  revealSlide(0);
  update();
});
