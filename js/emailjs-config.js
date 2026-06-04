/**
 * EmailJS credentials — replace with values from https://dashboard.emailjs.com/
 *
 * Template variables (add these to your EmailJS email template):
 *   {{first_name}}, {{last_name}}, {{email}}, {{phone}}, {{property_area}},
 *   {{property_type}}, {{property_size}}, {{message}}
 *
 * reCAPTCHA — create keys at https://www.google.com/recaptcha/admin (reCAPTCHA v2 "I'm not a robot")
 * Use the site key here. Optionally add the secret key under EmailJS → Account → Security.
 */
window.EMAILJS_CONFIG = {
  publicKey: 'YOUR_PUBLIC_KEY',
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID',
  recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY',
};
