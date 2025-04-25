window.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.nav-button[href="login.html"]');
    const registerBtn = document.querySelector('.nav-button[href="register.html"]');
    const welcomeMsg = document.getElementById('welcomeUser');
  
    let logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) {
      logoutBtn = document.createElement('a');
      logoutBtn.href = '#';
      logoutBtn.className = 'nav-button';
      logoutBtn.id = 'logoutBtn';
      logoutBtn.innerText = 'Logout';
      document.querySelector('.nav-buttons').appendChild(logoutBtn);
    }
  
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  
    if (loggedInUser) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (registerBtn) registerBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
  
      if (welcomeMsg) {
        welcomeMsg.innerText = `Welcome, ${loggedInUser.username || loggedInUser.email}`;
        welcomeMsg.style.fontSize = '18px';
        welcomeMsg.style.margin = '20px';
        welcomeMsg.style.textAlign = 'center';
      }
  
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('loggedInUser');
        window.location.reload();
      });
    } else {
      logoutBtn.style.display = 'none';
    }
  });
  