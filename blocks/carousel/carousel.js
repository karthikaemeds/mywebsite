import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

const placeholders = await fetchPlaceholders(getMetadata('locale'));
const { btnNxt, btnPre } = placeholders;

export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row, r) => {
    if (r === 0) {
      const nextBtn = document.createElement('button');
      nextBtn.classList.add('btn', 'btn-next');
      nextBtn.append(document.createTextNode(btnNxt));
      row.replaceWith(nextBtn);
      return;
    }

    if (r === rows.length - 1) {
      const prevBtn = document.createElement('button');
      prevBtn.classList.add('btn', 'btn-prev');
      prevBtn.append(document.createTextNode(btnPre));
      row.replaceWith(prevBtn);
      return;
    }

    row.classList.add('slide');
    [...row.children].forEach((col, c) => {
      if (c === 1) {
        col.classList.add('slide-text');
      }
    });
  });

  const slides = block.querySelectorAll('.slide');

  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${index * 100}%)`;
  });

  const nextSlide = block.querySelector('.btn-next');
  const prevSlide = block.querySelector('.btn-prev');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  nextSlide.addEventListener('click', () => {
    curSlide = curSlide === maxSlide ? 0 : curSlide + 1;

    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  });

  prevSlide.addEventListener('click', () => {
    curSlide = curSlide === 0 ? maxSlide : curSlide - 1;

    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - curSlide)}%)`;
    });
  });
}
