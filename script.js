// Auth Module
const auth = {
  isAuthenticated: false,
  protectedContent: document.getElementById('protected-content'),
  loginBtn: document.querySelector('.login-button'),
  logoutBtn: null,

  init() {
      this.checkAuth();
      this.setupLogout();
  },

  checkAuth() {
      // In real app: Verify session with server
      this.isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
      this.toggleContent();
      this.toggleAuthButtons();
  },

  toggleContent() {
      if (this.protectedContent) {
          this.protectedContent.style.display = this.isAuthenticated ? 'block' : 'none';
      }
  },

  toggleAuthButtons() {
      if (this.isAuthenticated) {
          this.loginBtn.style.display = 'none';
          this.createLogoutButton();
      } else {
          this.loginBtn.style.display = 'block';
          if (this.logoutBtn) this.logoutBtn.remove();
      }
  },

  createLogoutButton() {
      this.logoutBtn = document.createElement('button');
      this.logoutBtn.className = 'logout-button';
      this.logoutBtn.innerHTML = 'Logout';
      this.logoutBtn.onclick = () => this.logout();
      this.loginBtn.parentNode.insertBefore(this.logoutBtn, this.loginBtn.nextSibling);
  },

  login() {
      sessionStorage.setItem('authenticated', 'true');
      this.isAuthenticated = true;
      this.toggleContent();
      this.toggleAuthButtons();
  },

  logout() {
      sessionStorage.removeItem('authenticated');
      this.isAuthenticated = false;
      this.toggleContent();
      this.toggleAuthButtons();
      window.location.reload(); // Refresh to clear state
  }
};

// Modified Login Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();

  // Simple validation
  if (!username || !password) {
      showMessage('error', 'Please fill in all fields');
      return;
  }

  try {
      const isValid = await authenticateUser(username, password);
      
      if (isValid) {
          showMessage('success', 'Authentication successful!');
          auth.login();
          setTimeout(closeLoginModal, 1500);
      } else {
          showMessage('error', 'Invalid credentials');
          e.target.reset();
      }
  } catch (error) {
      showMessage('error', 'Authentication failed. Please try again.');
  }
});

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => auth.init());

// CSS for Protected Content
const protectedContentStyle = document.createElement('style');
protectedContentStyle.textContent = `
  #protected-content {
      display: none;
  }
  
  .logout-button {
      background: #dc3545 !important;
      margin-left: 1rem;
  }
`;
document.head.appendChild(protectedContentStyle);