const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.color = '#FF4444';  
    });

    const password = document.querySelector('[name="password"]').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    let hasError = false;

    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        hasError = true;
    }

    if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters';
        hasError = true;
    }

    const username = document.querySelector('[name="username"]').value;
    if (!/^[a-zA-Z0-9]{4,20}$/.test(username)) {
        document.getElementById('usernameError').textContent = 'Username must be 4-20 characters and contain only letters and numbers';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const formData = new URLSearchParams();
    formData.append('username', document.querySelector('[name="username"]').value);
    formData.append('email', document.querySelector('[name="email"]').value);
    formData.append('password', password);
    formData.append('is_admin', document.querySelector('[name="is_admin"]').checked);
    
    try {
        const response = await fetch(window.location.href, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        const data = await response.json();

        if (response.ok) {
            const notificationWrapper = document.createElement('div');
            notificationWrapper.className = 'notification-wrapper';
            notificationWrapper.style.position = 'fixed';
            notificationWrapper.style.top = '10px';
            notificationWrapper.style.left = '50%';
            notificationWrapper.style.transform = 'translateX(-50%)';
            notificationWrapper.style.zIndex = '9999';
            
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.textContent = 'Registration successful! Redirecting...';
            successMsg.style.backgroundColor = '#00CF76';  
            successMsg.style.color = 'white';
            successMsg.style.padding = '1rem 2rem';
            successMsg.style.borderRadius = '8px';
            successMsg.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            
            notificationWrapper.appendChild(successMsg);
            document.body.appendChild(notificationWrapper);

            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            for (const [field, errors] of Object.entries(data.errors)) {
                const errorElement = document.getElementById(`${field}Error`);
                if (errorElement) {
                    errorElement.textContent = errors[0];
                    errorElement.style.color = '#FF4444';
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
        const errorMsg = document.getElementById('successMessage');
        errorMsg.textContent = 'An error occurred. Please try again.';
        errorMsg.style.color = '#FF4444';  
    }
});


