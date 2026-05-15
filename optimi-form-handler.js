/**
 * OPTIMI Form Handler - POST leads to GHL Inbound Webhook
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

  // Config-driven : 1 ligne par form pour injecter automatiquement des tags GHL.
  // Source de vérité unique pour le routing form → workflow GHL.
  var FORM_TAG_MAP = {
    'audit-coaching':  ['form-audit-coaching'],   // déclenche W2 Coaching Audit Lead
    'guide-2026':      ['guide-2026-downloaded'], // déclenche W1 Welcome Guide DL
    'roi-calc':        ['roi-calc-completed'],
    'audit-loom':      ['audit-loom-requested'],
    'discovery-call':  ['form-discovery-call']
  };

  function buildPayload(opts) {
    var formName = opts.formName || opts.source || 'unknown';
    var callerTags = Array.isArray(opts.tags)
      ? opts.tags
      : (opts.tags ? String(opts.tags).split(',') : []);
    var autoTags = FORM_TAG_MAP[formName] || [];
    var allTags = callerTags.concat(autoTags).filter(function (t, i, arr) {
      return t && arr.indexOf(t) === i;
    });

    return {
      firstName: opts.firstName || '',
      lastName: opts.lastName || '',
      email: opts.email || '',
      phone: opts.phone || '',
      source: opts.source || 'unknown',
      form_name: formName,
      page_url: window.location.href,
      message: opts.message || '',
      consent_rgpd: opts.consentRgpd !== false,
      submitted_at: new Date().toISOString(),
      tags: allTags.join(','),
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

  // Granular GAds + GA4 event mapping per form_name
  // Aligned with FORM_TAG_MAP. Add a row when adding a new form.
  var EVENT_NAME_MAP = {
    'audit-coaching':   'lead_coaching_apply',
    'guide-2026':       'lead_guide_download',
    'roi-calc':         'lead_roi_calc',
    'audit-loom':       'lead_audit_request',
    'discovery-call':   'lead_discovery_call',
    'Coaching Candidature': 'lead_coaching_apply',
    'Audit Loom Annonce':   'lead_audit_request'
  };

  function trackConversion(opts) {
    if (typeof window.gtag !== 'function') return;

    var formName = opts.formName || opts.source || 'unknown';
    var eventName = EVENT_NAME_MAP[formName] || 'lead_submit_generic';
    var leadValue = typeof opts.leadScore === 'number' ? opts.leadScore : 10;

    // Granular GA4 / GAds event (per form)
    window.gtag('event', eventName, {
      event_category: 'lead',
      event_label: opts.source || formName,
      value: leadValue,
      currency: 'EUR',
      lead_source: opts.source || '',
      form_name: formName,
      lead_score: leadValue,
      city: opts.city || '',
      nb_biens: opts.nbBiens || ''
    });

    // Also fire a generic `lead_submit` event so existing dashboards/audiences
    // keep working without rebuild.
    window.gtag('event', 'lead_submit', {
      event_category: 'lead',
      event_label: opts.source || 'unknown',
      value: leadValue
    });

    // Meta Pixel (if loaded post-consent - fbq is set up in cookie-consent.js)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: eventName,
        content_category: opts.source || '',
        value: leadValue,
        currency: 'EUR'
      });
    }

    // TikTok Pixel (if loaded post-consent)
    if (typeof window.ttq === 'object' && typeof window.ttq.track === 'function') {
      window.ttq.track('SubmitForm', {
        content_id: eventName,
        value: leadValue,
        currency: 'EUR'
      });
    }
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
