(function () {
  const MESSAGES = {
    el: {
      sending: 'Αποστολή…',
      success: 'Το μήνυμα εστάλη ✓',
      error: 'Σφάλμα αποστολής. Δοκιμάστε ξανά.',
      notConfigured: 'Η φόρμα δεν έχει ρυθμιστεί ακόμα. Επικοινωνήστε απευθείας στο info@gdsignaturehospitality.com',
      captchaRequired: 'Επιβεβαιώστε ότι δεν είστε ρομπότ.',
      captchaNotConfigured: 'Το reCAPTCHA δεν έχει ρυθμιστεί. Επικοινωνήστε απευθείας στο info@gdsignaturehospitality.com',
    },
    en: {
      sending: 'Sending…',
      success: 'Message Sent ✓',
      error: 'Failed to send. Please try again.',
      notConfigured: 'The form is not configured yet. Please email info@gdsignaturehospitality.com directly.',
      captchaRequired: 'Please complete the reCAPTCHA verification.',
      captchaNotConfigured: 'reCAPTCHA is not configured. Please email info@gdsignaturehospitality.com directly.',
    },
  };

  let recaptchaWidgetId = null;

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

  function isRecaptchaConfigured(config) {
    return config && !isPlaceholder(config.recaptchaSiteKey);
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

  function resetRecaptcha() {
    if (recaptchaWidgetId !== null && typeof grecaptcha !== 'undefined') {
      grecaptcha.reset(recaptchaWidgetId);
    }
  }

  function getRecaptchaResponse() {
    if (recaptchaWidgetId === null || typeof grecaptcha === 'undefined') return '';
    return grecaptcha.getResponse(recaptchaWidgetId);
  }

  function initRecaptcha(siteKey) {
    const container = document.getElementById('recaptcha-container');
    if (!container || !isRecaptchaConfigured({ recaptchaSiteKey: siteKey })) return;

    function renderWidget() {
      if (recaptchaWidgetId !== null) return;
      recaptchaWidgetId = grecaptcha.render(container, {
        sitekey: siteKey,
        theme: 'light',
      });
    }

    if (typeof grecaptcha !== 'undefined') {
      renderWidget();
      return;
    }

    window.onRecaptchaLoad = renderWidget;
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  function initContactForm() {
    const form = document.getElementById('contact-form');
    const btn = form && form.querySelector('.form-submit');
    if (!form || !btn || typeof emailjs === 'undefined') return;

    const config = window.EMAILJS_CONFIG || {};
    const msgs = getMessages();
    const origLabel = btn.textContent;

    emailjs.init({ publicKey: config.publicKey });
    initRecaptcha(config.recaptchaSiteKey);

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!isConfigured(config)) {
        alert(msgs.notConfigured);
        return;
      }

      if (!isRecaptchaConfigured(config)) {
        alert(msgs.captchaNotConfigured);
        return;
      }

      if (!form.reportValidity()) return;

      if (!getRecaptchaResponse()) {
        alert(msgs.captchaRequired);
        return;
      }

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
          resetRecaptcha();
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
          resetRecaptcha();
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
