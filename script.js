document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.nav-dots');
  let currentSlide = 0;

  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Manage past/future states for animation
    slides.forEach((slide, i) => {
      if (i < index) {
        slide.classList.add('past');
      } else {
        slide.classList.remove('past');
      }
    });

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    slides[currentSlide].classList.remove('past');
    dots[currentSlide].classList.add('active');
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
      goToSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
      goToSlide(currentSlide - 1);
    }
  });

  // Quiz reveal logic
  window.revealQuiz = function() {
    const answer = document.getElementById('quiz-answer');
    if (answer) {
      answer.classList.toggle('show');
    }
  };
});
