/**
 * OPTIMI Form Handler — POST leads to GHL Inbound Webhook
 *
 * Usage:
 *   OPTIMI.submitLead({
 *     firstName, lastName, email, phone,
 *     source, formName, tags, leadScore,
 *     city, nbBiens, objectif, budgetRange, timeline,
 *     message, redirect, onSuccess, onError
 *   });
 *
 * Webhook structure must match GHL Mapping Reference (17 fields).
 */
(function (window) {
  'use strict';

  var WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/xa1Zp0IzF90BRcev1zuG/webhook-trigger/e91d78e2-b85c-4ec0-8ab2-5ebcfc66fc56';

  function buildPayload(opts) {
    return {
      firstName: opts.firstName || '',
      lastName: opts.lastName || '',
      email: opts.email || '',
      phone: opts.phone || '',
      source: opts.source || 'unknown',
      form_name: opts.formName || opts.source || 'unknown',
      page_url: window.location.href,
      message: opts.message || '',
      consent_rgpd: opts.consentRgpd !== false,
      submitted_at: new Date().toISOString(),
      tags: Array.isArray(opts.tags) ? opts.tags.join(',') : (opts.tags || ''),
      lead_score: typeof opts.leadScore === 'number' ? opts.leadScore : 10,
      city: opts.city || '',
      nb_biens: opts.nbBiens || '',
      objectif: opts.objectif || '',
      budget_range: opts.budgetRange || '',
      timeline: opts.timeline || ''
    };
  }

  function fallbackStore(payload) {
    try {
      var leads = JSON.parse(localStorage.getItem('optimi_leads_failed') || '[]');
      leads.push(payload);
      localStorage.setItem('optimi_leads_failed', JSON.stringify(leads));
    } catch (e) { /* noop */ }
  }

  function trackConversion(opts) {
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'lead_submit', {
      event_category: 'lead',
      event_label: opts.source || 'unknown',
      value: typeof opts.leadScore === 'number' ? opts.leadScore : 10
    });
  }

  function submitLead(opts) {
    var payload = buildPayload(opts);

    return fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Webhook returned ' + res.status);
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        trackConversion(opts);
        if (typeof opts.onSuccess === 'function') opts.onSuccess(data, payload);
        if (opts.redirect) {
          setTimeout(function () { window.location.href = opts.redirect; }, opts.redirectDelay || 200);
        }
        return data;
      })
      .catch(function (err) {
        fallbackStore(payload);
        if (typeof opts.onError === 'function') opts.onError(err, payload);
        if (opts.redirectOnError !== false && opts.redirect) {
          setTimeout(function () { window.location.href = opts.redirect; }, opts.redirectDelay || 200);
        }
        throw err;
      });
  }

  window.OPTIMI = window.OPTIMI || {};
  window.OPTIMI.submitLead = submitLead;
  window.OPTIMI.WEBHOOK_URL = WEBHOOK_URL;
})(window);
