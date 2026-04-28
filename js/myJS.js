'use strict';

/* ReqJ1: defensive scaffold — check for form existence before running any code */
const form = document.querySelector('form');

if (!form) {
    console.log('No form found; myJS.js exiting.');
    
}



    /* ReqJ2: update the live preview container with current form values */
    function updatePreview() {
        const previewContent = document.getElementById('preview-content');
        if (!previewContent) return;

        const name    = document.querySelector('#name')    ? document.querySelector('#name').value    : '';
        const email   = document.querySelector('#email')   ? document.querySelector('#email').value   : '';
        const tel     = document.querySelector('#phone')   ? document.querySelector('#phone').value   : '';
        const message = document.querySelector('#message') ? document.querySelector('#message').value : '';

        previewContent.innerHTML = `
            <h3>Contact Preview</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Tel:</strong> ${tel}</p>
            <p><strong>Message:</strong> ${message}</p>
        `;
    }

    /* ReqJ3: add/remove .valid and .invalid CSS classes based on field validity */
    function checkValidityState(field) {
        const errorBox = document.getElementById('error-box');
        if (errorBox) {
            errorBox.textContent = '';
            errorBox.classList.remove('visible');
        }

        field.classList.remove('valid', 'invalid');

        if (field.checkValidity()) {
            field.classList.add('valid');
        } else {
            field.classList.add('invalid');
        }
    }

    /* ReqJ5: custom cross-field validation rules */
    function checkCustomRules() {
        const studentSelected = document.querySelector('#student') && document.querySelector('#student').checked;
        const messageField    = document.querySelector('#message');
        const message         = messageField ? messageField.value.toLowerCase() : '';

        if (studentSelected && !message.includes('teacher')) {
            /* ReqJ6: move focus to the relevant field when a custom error is found */
            if (messageField) messageField.focus();
            return 'If you selected "Student", please mention your teacher in the message.';
        }
        return null;
    }

    /* ReqJ4: native form validation via form.reportValidity(); prevent submission on failure */
    function validateForm() {
        const errorBox = document.getElementById('error-box');
        if (errorBox) {
            errorBox.textContent = '';
            errorBox.classList.remove('visible');
        }

        /* ReqJ4: use built-in browser validation first */
        if (!form.reportValidity()) {
            return false;
        }

        /* ReqJ5: then run custom cross-field checks */
        const customError = checkCustomRules();
        if (customError) {
            if (errorBox) {
                errorBox.textContent = customError; /* ReqJ5: textContent for plain-text messages */
                errorBox.classList.add('visible');
            }
            return false;
        }

        return true;
    }

    /* reset helper — hides error box and removes highlight from submit button */
    function resetForm() {
        const errorBox  = document.getElementById('error-box');
        const submitBtn = document.getElementById('submit-btn');
        if (errorBox)  errorBox.classList.remove('visible');
        if (submitBtn) submitBtn.classList.remove('highlight');
    }

    /* ReqJ7: keyboard interaction handler — highlights submit button on Enter key */
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.classList.add('highlight');
        }
    }

    /* ReqJ8: mouse interaction handlers — change field appearance on hover */
    function handleMouseOver(element) {
        element.classList.add('highlight');
    }

    function handleMouseOut(element) {
        element.classList.remove('highlight');
    }

