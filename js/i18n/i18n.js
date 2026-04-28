'use strict';

/* ReqI2: translation storage — holds all locale dictionaries after fetch */
let translations = {};

/* ReqI3: update all translatable elements with texts from the chosen locale */
function applyTranslations(locale) {
    const dictionary = translations[locale];
    if (!dictionary) {
        console.warn(`Translations for "${locale}" not found.`);
        return;
    }

    /* update textContent of elements marked with data-i18n */
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key  = element.dataset.i18n;
        const text = dictionary[key];
        if (text !== undefined) {
            element.innerHTML = text;
        }
    });

    /* update alt attributes */
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.dataset.i18nAlt;
        if (dictionary[key]) element.alt = dictionary[key];
    });

    /* update title attributes */
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.dataset.i18nTitle;
        if (dictionary[key]) element.title = dictionary[key];
    });

    /* update document lang for accessibility and :lang() CSS rules */
    document.documentElement.lang = locale;
}

/* ReqI4: switch language, apply all formats, and persist user preference */
function switchLanguage(locale) {
    applyTranslations(locale);     /* ReqI3 */
    applyDateFormat(locale);       /* ReqI8 */
    applyPriceFormat(locale);      /* ReqI9 */
    applyNumberFormat(locale);     /* ReqI10 */
    applyPercentageFormat(locale); /* ReqI10 */
    localStorage.setItem('preferredLanguage', locale); /* ReqI4: persist */
}

/* ── ReqI8: date formatting ────────────────────────────────────────────── */

function createDateFormatter(locale) {
    const dateLocale = locale === 'ro' ? 'ro-RO' : 'en-GB';
    return new Intl.DateTimeFormat(dateLocale, {
        weekday: 'long',
        year:    'numeric',
        month:   'long',
        day:     'numeric'
    });
}

function formatDate(date, formatter) {
    return formatter.format(date);
}

function applyDateFormat(locale) {
    const formatter    = createDateFormatter(locale);
    const dateElements = document.querySelectorAll('[data-date]');
    dateElements.forEach(el => {
        const dateStr = (el.dataset.date || '').trim();
        if (!dateStr) return;
        const date = new Date(dateStr);
        if (isNaN(date)) {
            console.error('Invalid date in data-date:', dateStr);
            el.textContent = 'Invalid date';
            return;
        }
        el.textContent = formatDate(date, formatter);
    });
}

/* ── ReqI9: price / currency formatting ────────────────────────────────── */

function createCurrencyFormatter(locale) {
    const numberLocale = locale === 'ro' ? 'ro-RO' : (locale === 'es' ? 'es-ES' : 'en-GB');
    return new Intl.NumberFormat(numberLocale, {
        style:                 'currency',
        currency:              locale === 'ro' ? 'RON' : (locale === 'es' ? 'EUR' : 'GBP'),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatPrice(price, formatter) {
    return formatter.format(price);
}

function applyPriceFormat(locale) {
    const formatter      = createCurrencyFormatter(locale);
    const priceElements  = document.querySelectorAll('[data-price]');
    priceElements.forEach(el => {
        const priceStr = (el.dataset.price || '').trim();
        if (!priceStr) return;
        const price = Number(priceStr);
        if (isNaN(price)) {
            console.error('Invalid price in data-price:', priceStr);
            el.textContent = 'Invalid price';
            return;
        }
        el.textContent = formatPrice(price, formatter);
    });
}

/* ── ReqI10: decimal number formatting ─────────────────────────────────── */

function createNumberFormatter(locale) {
    const numberLocale = locale === 'ro' ? 'ro-RO' : (locale === 'es' ? 'es-ES' : 'en-GB');
    return new Intl.NumberFormat(numberLocale, {
        style:                 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function applyNumberFormat(locale) {
    const formatter        = createNumberFormatter(locale);
    const numberElements   = document.querySelectorAll('[data-number]');
    numberElements.forEach(el => {
        const numStr = (el.dataset.number || '').trim();
        if (!numStr) return;
        const num = Number(numStr);
        if (isNaN(num)) {
            console.error('Invalid number in data-number:', numStr);
            el.textContent = 'Invalid number';
            return;
        }
        el.textContent = formatter.format(num);
    });
}

/* ── ReqI10: percentage formatting ─────────────────────────────────────── */

function createPercentageFormatter(locale) {
    const numberLocale = locale === 'ro' ? 'ro-RO' : (locale === 'es' ? 'es-ES' : 'en-GB');
    return new Intl.NumberFormat(numberLocale, {
        style:                 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

function applyPercentageFormat(locale) {
    const formatter            = createPercentageFormatter(locale);
    const percentageElements   = document.querySelectorAll('[data-percentage]');
    percentageElements.forEach(el => {
        const pctStr = (el.dataset.percentage || '').trim();
        if (!pctStr) return;
        const pct = Number(pctStr);
        if (isNaN(pct)) {
            console.error('Invalid percentage in data-percentage:', pctStr);
            el.textContent = 'Invalid percentage';
            return;
        }
        el.textContent = formatter.format(pct);
    });
}

/* ── ReqI5: self-invoking init with defensive scaffold ─────────────────── */
(function initI18n() {

    /* ReqI5: exit quietly when the page has no i18n markers */
    const markers = document.querySelectorAll('[data-i18n]');
    if (!markers || markers.length === 0) {
        console.log('initI18n: no data-i18n elements found, exiting.');
        return;
    }

    /* ReqI6: load translation file, restore saved locale, apply everything */
    fetch('/js/i18n/translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data; /* ReqI2 */
            const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
            switchLanguage(savedLanguage); /* ReqI4 ReqI6 */
        })
        .catch(error => {
            console.error('Failed to load translations:', error);
        });

}());
