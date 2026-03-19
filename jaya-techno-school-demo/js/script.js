document.addEventListener('DOMContentLoaded', () => {
  const config = window.SITE_CONFIG || {};
  const integrations = config.integrations || {};
  const schoolDisplay = [config.schoolName, config.branch].filter(Boolean).join(' - ');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
  }

  applySchoolConfig(config, schoolDisplay);
  configureForms(integrations.googleAppsScriptUrl);
});

function applySchoolConfig(config, schoolDisplay) {
  if (!config || !schoolDisplay) {
    return;
  }

  const replacements = [
    ['Jaya Techno School - Hassan, Karnataka', config.fullAddress || `${schoolDisplay}, ${config.locationLabel || ''}`.replace(/^,\s*|\s*,\s*$/g, '')],
    ['Jaya Techno School - Hassan', schoolDisplay],
    ['Jaya Techno School', config.schoolName || 'Jaya Techno School'],
    ['+91 98765 43210', config.phoneDisplay || '+91 98765 43210'],
    ['admissions@jayatechnoschool.demo', config.email || 'admissions@jayatechnoschool.demo'],
    ['Hassan, Karnataka', config.locationLabel || 'Hassan, Karnataka'],
    ['Monday to Saturday, 9:00 AM to 5:00 PM', config.officeHours || 'Monday to Saturday, 9:00 AM to 5:00 PM'],
    ['2026-27', config.academicYear || '2026-27'],
    ['(c) 2026', `(c) ${config.copyrightYear || '2026'}`],
    ['Modern learning for a technology-driven future', config.tagline || 'Modern learning for a technology-driven future']
  ];

  replaceInTextNodes(document.body, replacements);

  document.title = replaceText(document.title, replacements);

  const description = document.querySelector('meta[name="description"]');
  if (description && description.content) {
    description.content = replaceText(description.content, replacements);
  }

  const whatsappLink = document.querySelector('.whatsapp-float');
  if (whatsappLink && config.whatsappNumber) {
    whatsappLink.href = `https://wa.me/${config.whatsappNumber}`;
    whatsappLink.setAttribute('aria-label', `WhatsApp ${schoolDisplay}`);
    whatsappLink.setAttribute('target', '_blank');
    whatsappLink.setAttribute('rel', 'noopener noreferrer');
  }
}

function replaceInTextNodes(root, replacements) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const original = node.nodeValue;
    const updated = replaceText(original, replacements);
    if (original !== updated) {
      node.nodeValue = updated;
    }
  });
}

function replaceText(text, replacements) {
  return replacements.reduce((current, [from, to]) => current.split(from).join(to), text);
}

function configureForms(endpoint) {
  document.querySelectorAll('form').forEach((form) => {
    const note = form.querySelector('.form-note');
    if (note) {
      note.textContent = endpoint
        ? 'This enquiry form is connected to Google Sheets and email notifications.'
        : 'This is a front-end demo form only. Add the Apps Script URL in js/site-config.js to make it live.';
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const feedback = form.querySelector('.form-feedback') || document.createElement('p');
      const payload = getFormPayload(form);

      feedback.className = 'form-feedback';
      if (!form.querySelector('.form-feedback')) {
        form.appendChild(feedback);
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {
        if (endpoint) {
          await sendToAppsScript(endpoint, payload);
          setFeedback(feedback, 'Thank you. Your enquiry has been sent successfully.', 'success');
        } else {
          setFeedback(feedback, 'Thank you. This demo enquiry form is ready to connect to Google Sheets and email.', 'success');
        }

        form.reset();
      } catch (error) {
        setFeedback(feedback, 'The enquiry could not be sent right now. Please try again after checking the Apps Script deployment URL.', 'error');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
        }
      }
    });
  });
}

function getFormPayload(form) {
  const formData = new FormData(form);
  return {
    source_page: window.location.pathname.split('/').pop() || 'index.html',
    name: (formData.get('name') || '').toString(),
    phone: (formData.get('phone') || '').toString(),
    email: (formData.get('email') || '').toString(),
    class_interest: (formData.get('class') || '').toString(),
    message: (formData.get('message') || '').toString()
  };
}

function sendToAppsScript(endpoint, payload) {
  const body = new URLSearchParams(payload);
  return fetch(endpoint, {
    method: 'POST',
    mode: 'no-cors',
    body
  });
}

function setFeedback(element, message, type) {
  element.textContent = message;
  element.dataset.state = type;
}
