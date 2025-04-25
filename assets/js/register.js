
    const form = document.getElementById('registerForm');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const isAdmin = document.getElementById('is_admin').checked;
      let hasError = false;
      
  
    
      if (username.length < 4 || username.length > 20) {
        document.getElementById('usernameError').textContent = 'Username must be between 4 and 20 characters.';
        hasError = true;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        hasError = true;
      }
  
      if (password.length < 8) {
        document.getElementById('passwordError').textContent = 'Password must be at least 8 characters long.';
        hasError = true;
      }
  
      if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        hasError = true;
      }

  
      const user = { username, email, password, isAdmin };
  
     
      let users = JSON.parse(localStorage.getItem('users')) || [];
  
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        document.getElementById('emailError').textContent = 'Email already registered.';
        hasError = true;
      }
      if (hasError) return;
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
  
      successMessage.textContent = 'Registration successful! Redirecting to login...';
      successMessage.style.display = 'block';
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    });

  
