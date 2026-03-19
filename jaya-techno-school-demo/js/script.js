document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const feedback = form.querySelector('.form-feedback') || document.createElement('p');
      feedback.className = 'form-feedback';
      feedback.style.margin = '0';
      feedback.style.color = '#1c8c5e';
      feedback.style.fontWeight = '700';
      feedback.textContent = 'Thank you. This demo enquiry form has no backend, but your message has been noted for presentation.';
      if (!form.querySelector('.form-feedback')) {
        form.appendChild(feedback);
      }
      form.reset();
    });
  });
});
