(function () {
  const MESSAGES = {
    el: {
      sending: 'Αποστολή…',
      success: 'Το μήνυμα εστάλη ✓',
      error: 'Σφάλμα αποστολής. Δοκιμάστε ξανά.',
      notConfigured: 'Η φόρμα δεν έχει ρυθμιστεί ακόμα. Επικοινωνήστε απευθείας στο info@gdsignature.com',
    },
    en: {
      sending: 'Sending…',
      success: 'Message Sent ✓',
      error: 'Failed to send. Please try again.',
      notConfigured: 'The form is not configured yet. Please email info@gdsignature.com directly.',
    },
  };

  function isPlaceholder(value) {
    return !value || String(value).includes('YOUR_');
  }

  function isConfigured(config) {
    return (
      config &&
      !isPlaceholder(config.publicKey) &&
      !isPlaceholder(config.serviceId) &&
      !isPlaceholder(config.templateId)
    );
  }

  function getMessages() {
    const lang = (document.documentElement.lang || 'en').slice(0, 2);
    return MESSAGES[lang] || MESSAGES.en;
  }

  function setButtonState(btn, { text, background, color, disabled }) {
    btn.textContent = text;
    btn.style.background = background || '';
    btn.style.color = color || '';
    btn.disabled = disabled;
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    const btn = form && form.querySelector('.form-submit');
    if (!form || !btn || typeof emailjs === 'undefined') return;

    const config = window.EMAILJS_CONFIG;
    const msgs = getMessages();
    const origLabel = btn.textContent;

    emailjs.init({ publicKey: config.publicKey });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!isConfigured(config)) {
        alert(msgs.notConfigured);
        return;
      }

      if (!form.reportValidity()) return;

      setButtonState(btn, {
        text: msgs.sending,
        background: '',
        color: '',
        disabled: true,
      });

      emailjs
        .sendForm(config.serviceId, config.templateId, form)
        .then(function () {
          setButtonState(btn, {
            text: msgs.success,
            background: '#3E6B4F',
            color: '#fff',
            disabled: false,
          });
          form.reset();
          setTimeout(function () {
            setButtonState(btn, {
              text: origLabel,
              background: '',
              color: '',
              disabled: false,
            });
          }, 3000);
        })
        .catch(function (err) {
          console.error('EmailJS error:', err);
          setButtonState(btn, {
            text: msgs.error,
            background: '#8B3A3A',
            color: '#fff',
            disabled: false,
          });
          setTimeout(function () {
            setButtonState(btn, {
              text: origLabel,
              background: '',
              color: '',
              disabled: false,
            });
          }, 4000);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
