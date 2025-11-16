document.addEventListener('DOMContentLoaded', () => {
    const infoOutput = document.querySelector('output[name="info-output"]');
    const errorOutput = document.querySelector('output[name="error-output"]');

    const formErrors = [];

    const commentsField = document.querySelector('#comments');
    if (commentsField && infoOutput) {
        const maxLength = commentsField.getAttribute('maxlength');

        commentsField.addEventListener('input', () => {
            const currentLength = commentsField.value.length;
            const remaining = maxLength - currentLength;

            infoOutput.textContent = `${remaining} characters remaining for comments section.`;

            // a warning styling when near the limit
            if (remaining < 20) {
                infoOutput.style.color = '#ffc107';
            } else {
                infoOutput.style.color = ''; // revert back
            }
        });
    }

    const nameField = document.querySelector('#name');
    if (nameField && errorOutput) {
        nameField.addEventListener('input', () => {
            const pattern = new RegExp(nameField.pattern);
            if (!pattern.test(nameField.value) && nameField.value !== '') {
                // flash the field
                nameField.style.outline = '2px solid red';
                setTimeout(() => {
                    nameField.style.outline = '';
                }, 500);

                // show a temporary error message
                errorOutput.textContent =
                    'Invalid character entered in the Name section.';
                setTimeout(() => {
                    errorOutput.textContent = 'error-message-if-any:';
                }, 2000);

                // Log this error
                formErrors.push({
                    field: 'name',
                    message: 'Invalid character entered',
                    timestamp: new Date().toISOString(),
                });

                nameField.value = nameField.value.slice(0, -1);
            }
        });
    }

    // Add phone number validation
    const phoneField = document.querySelector('#tel');
    if (phoneField && errorOutput) {
        phoneField.addEventListener('input', () => {
            // Allow only digits, spaces, hyphens, parentheses, and plus sign
            const pattern = /^[\d\s\-\(\)\+]*$/;
            if (!pattern.test(phoneField.value) && phoneField.value !== '') {
                // flash the field
                phoneField.style.outline = '2px solid red';
                setTimeout(() => {
                    phoneField.style.outline = '';
                }, 500);

                // show a temporary error message
                errorOutput.textContent =
                    'Invalid character entered in the Phone Number section.';
                setTimeout(() => {
                    errorOutput.textContent = 'error-message-if-any:';
                }, 2000);

                // Log this error
                formErrors.push({
                    field: 'tel',
                    message: 'Invalid character entered',
                    timestamp: new Date().toISOString(),
                });

                phoneField.value = phoneField.value.slice(0, -1);
            }
        });
    }

    // track validation errors
    const form = document.querySelector('form');
    if (form) {
        const fields = form.querySelectorAll(
            'input[required], textarea[required], input[type="email"]'
        );

        fields.forEach((field) => {
            field.addEventListener('blur', () => {
                if (!field.checkValidity() && field.value !== '') {
                    // Log the error when user leaves an invalid field
                    formErrors.push({
                        field: field.name,
                        message: field.validationMessage,
                        value: field.value,
                        timestamp: new Date().toISOString(),
                    });
                }
            });
        });

        form.addEventListener('submit', function (event) {
            // always prevent the default submission to take control
            event.preventDefault();

            // check for any remaining validation errors at submit time
            const currentErrors = [];
            fields.forEach((field) => {
                if (!field.checkValidity()) {
                    currentErrors.push({
                        field: field.name,
                        message: field.validationMessage,
                    });

                    // Also add to formErrors if not already there
                    formErrors.push({
                        field: field.name,
                        message: field.validationMessage,
                        value: field.value,
                        timestamp: new Date().toISOString(),
                    });
                }
            });

            // add or update the form-errors hidden field with ALL accumulated errors
            let errorField = form.querySelector('input[name="form-errors"]');
            if (!errorField) {
                errorField = document.createElement('input');
                errorField.type = 'hidden';
                errorField.name = 'form-errors';
                form.appendChild(errorField);
            }
            // stringify the FULL errors array (all errors made during session)
            errorField.value = JSON.stringify(formErrors);

            // display current errors in the output area
            if (currentErrors.length > 0) {
                errorOutput.textContent =
                    'error-message-if-any:\n' +
                    currentErrors
                        .map((err) => `- ${err.field}: ${err.message}`)
                        .join('\n');
            } else {
                errorOutput.textContent = 'error-message-if-any:';
            }

            this.submit();
        });
    }
});
