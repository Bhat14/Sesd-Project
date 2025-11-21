// Data Storage (In-Memory)
let currentUser = null;
let users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    password: 'john1234',
    role: 'user'
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@system.com',
    phone: '9999999999',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 3,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    phone: '9876543211',
    password: 'sarah1234',
    role: 'user'
  }
];

let complaints = [
  {
    id: 'CMP001',
    userId: 1,
    title: 'Broken Street Light',
    category: 'Infrastructure',
    description: 'Street light not working for 3 days',
    location: 'Main Street, Block A',
    fileName: 'streetlight.jpg',
    priority: 'High',
    status: 'In Progress',
    dateSubmitted: '2025-11-04',
    assignedTo: 'Infrastructure Dept',
    adminComments: 'Work order issued to repair team',
    rating: null,
    feedback: null
  },
  {
    id: 'CMP002',
    userId: 1,
    title: 'Water Supply Issue',
    category: 'Water Supply',
    description: 'No water supply since yesterday morning',
    location: 'Sector 5, Lane 2',
    fileName: null,
    priority: 'High',
    status: 'Pending',
    dateSubmitted: '2025-11-05',
    assignedTo: null,
    adminComments: null,
    rating: null,
    feedback: null
  },
  {
    id: 'CMP003',
    userId: 3,
    title: 'Pothole on Road',
    category: 'Roads',
    description: 'Large pothole causing accidents',
    location: 'Highway Road',
    fileName: null,
    priority: 'Medium',
    status: 'Resolved',
    dateSubmitted: '2025-11-01',
    assignedTo: 'Road Maintenance',
    adminComments: 'Pothole has been filled',
    rating: 4,
    feedback: 'Quick response, thank you!'
  },
  {
    id: 'CMP004',
    userId: 3,
    title: 'Garbage Collection Delayed',
    category: 'Sanitation',
    description: 'Garbage not collected for 4 days',
    location: 'Park Street',
    fileName: null,
    priority: 'Medium',
    status: 'In Progress',
    dateSubmitted: '2025-11-03',
    assignedTo: 'Sanitation Dept',
    adminComments: 'Collection scheduled for tomorrow',
    rating: null,
    feedback: null
  },
  {
    id: 'CMP005',
    userId: 1,
    title: 'Power Outage',
    category: 'Electricity',
    description: 'Frequent power cuts in the area',
    location: 'Residential Area B',
    fileName: null,
    priority: 'High',
    status: 'Pending',
    dateSubmitted: '2025-11-06',
    assignedTo: null,
    adminComments: null,
    rating: null,
    feedback: null
  }
];

let notifications = [
  {
    id: 1,
    userId: 1,
    message: 'Your complaint CMP001 status updated to In Progress',
    read: false,
    timestamp: '2025-11-05 10:30 AM'
  },
  {
    id: 2,
    userId: 3,
    message: 'Your complaint CMP003 has been resolved',
    read: false,
    timestamp: '2025-11-02 02:15 PM'
  },
  {
    id: 3,
    userId: 3,
    message: 'Your complaint CMP004 status updated to In Progress',
    read: false,
    timestamp: '2025-11-04 11:00 AM'
  }
];

let complaintIdCounter = 6;
let notificationIdCounter = 4;

// Utility Functions
function generateComplaintId() {
  return `CMP${String(complaintIdCounter++).padStart(3, '0')}`;
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addNotification(userId, message) {
  notifications.push({
    id: notificationIdCounter++,
    userId,
    message,
    read: false,
    timestamp: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  });
}

function getUnreadNotificationCount() {
  if (!currentUser) return 0;
  return notifications.filter(n => n.userId === currentUser.id && !n.read).length;
}

// Router
function navigate(page) {
  const root = document.getElementById('root');
  root.innerHTML = '';

  switch(page) {
    case 'home':
      renderHomePage(root);
      break;
    case 'login':
      renderLoginPage(root);
      break;
    case 'register':
      renderRegisterPage(root);
      break;
    case 'dashboard':
      if (!currentUser) {
        navigate('login');
        return;
      }
      if (currentUser.role === 'admin') {
        renderAdminDashboard(root);
      } else {
        renderUserDashboard(root);
      }
      break;
    case 'submit-complaint':
      if (!currentUser || currentUser.role === 'admin') {
        navigate('dashboard');
        return;
      }
      renderComplaintForm(root);
      break;
    default:
      renderHomePage(root);
  }
}

function logout() {
  currentUser = null;
  navigate('home');
}

// Header Component
function renderHeader(container) {
  const header = document.createElement('header');
  header.className = 'app-header';
  
  const headerContent = document.createElement('div');
  headerContent.className = 'header-content';
  
  const logo = document.createElement('a');
  logo.className = 'logo';
  logo.href = '#';
  logo.onclick = (e) => {
    e.preventDefault();
    navigate('home');
  };
  
  const logoIcon = document.createElement('div');
  logoIcon.className = 'logo-icon';
  logoIcon.textContent = 'C';
  
  const logoText = document.createElement('span');
  logoText.textContent = 'Complaint Redressal';
  
  logo.appendChild(logoIcon);
  logo.appendChild(logoText);
  
  const navLinks = document.createElement('div');
  navLinks.className = 'nav-links';
  
  if (currentUser) {
    // Notification bell
    const notificationBell = document.createElement('div');
    notificationBell.className = 'notification-bell';
    notificationBell.innerHTML = '🔔';
    notificationBell.onclick = toggleNotificationPanel;
    
    const unreadCount = getUnreadNotificationCount();
    if (unreadCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'notification-badge';
      badge.textContent = unreadCount;
      notificationBell.appendChild(badge);
    }
    
    navLinks.appendChild(notificationBell);
    
    const dashboardLink = document.createElement('a');
    dashboardLink.className = 'nav-link';
    dashboardLink.textContent = 'Dashboard';
    dashboardLink.href = '#';
    dashboardLink.onclick = (e) => {
      e.preventDefault();
      navigate('dashboard');
    };
    navLinks.appendChild(dashboardLink);
    
    if (currentUser.role === 'user') {
      const submitLink = document.createElement('a');
      submitLink.className = 'nav-link';
      submitLink.textContent = 'Submit Complaint';
      submitLink.href = '#';
      submitLink.onclick = (e) => {
        e.preventDefault();
        navigate('submit-complaint');
      };
      navLinks.appendChild(submitLink);
    }
    
    const userInfo = document.createElement('span');
    userInfo.className = 'nav-link';
    userInfo.textContent = currentUser.name;
    navLinks.appendChild(userInfo);
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn--sm btn--outline';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = logout;
    navLinks.appendChild(logoutBtn);
  } else {
    const loginLink = document.createElement('a');
    loginLink.className = 'nav-link';
    loginLink.textContent = 'Login';
    loginLink.href = '#';
    loginLink.onclick = (e) => {
      e.preventDefault();
      navigate('login');
    };
    navLinks.appendChild(loginLink);
    
    const registerBtn = document.createElement('button');
    registerBtn.className = 'btn btn--sm btn--primary';
    registerBtn.textContent = 'Register';
    registerBtn.onclick = () => navigate('register');
    navLinks.appendChild(registerBtn);
  }
  
  headerContent.appendChild(logo);
  headerContent.appendChild(navLinks);
  header.appendChild(headerContent);
  container.appendChild(header);
}

// Notification Panel
function toggleNotificationPanel() {
  const existingPanel = document.getElementById('notification-panel');
  if (existingPanel) {
    existingPanel.remove();
    return;
  }
  
  const panel = document.createElement('div');
  panel.id = 'notification-panel';
  panel.className = 'notification-panel';
  
  const header = document.createElement('div');
  header.className = 'notification-header';
  header.innerHTML = '<span>Notifications</span>';
  
  const markAllBtn = document.createElement('button');
  markAllBtn.className = 'btn btn--sm';
  markAllBtn.textContent = 'Mark all read';
  markAllBtn.onclick = () => {
    notifications.forEach(n => {
      if (n.userId === currentUser.id) n.read = true;
    });
    toggleNotificationPanel();
    navigate('dashboard');
  };
  header.appendChild(markAllBtn);
  panel.appendChild(header);
  
  const userNotifications = notifications.filter(n => n.userId === currentUser.id).reverse();
  
  if (userNotifications.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No notifications';
    panel.appendChild(empty);
  } else {
    userNotifications.forEach(notification => {
      const item = document.createElement('div');
      item.className = `notification-item ${!notification.read ? 'unread' : ''}`;
      
      const message = document.createElement('div');
      message.className = 'notification-message';
      message.textContent = notification.message;
      
      const time = document.createElement('div');
      time.className = 'notification-time';
      time.textContent = notification.timestamp;
      
      item.appendChild(message);
      item.appendChild(time);
      
      item.onclick = () => {
        notification.read = true;
        toggleNotificationPanel();
        navigate('dashboard');
      };
      
      panel.appendChild(item);
    });
  }
  
  document.body.appendChild(panel);
  
  // Close on click outside
  setTimeout(() => {
    document.addEventListener('click', function closePanel(e) {
      if (!panel.contains(e.target) && !e.target.closest('.notification-bell')) {
        panel.remove();
        document.removeEventListener('click', closePanel);
      }
    });
  }, 0);
}

// Show login/register dialog
function showLoginDialog() {
  // Remove any existing dialog
  const existingDialog = document.querySelector('.modal-overlay');
  if (existingDialog) {
    existingDialog.remove();
  }
  
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.zIndex = '2000';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.style.maxWidth = '400px';
  
  const header = document.createElement('div');
  header.className = 'modal-header';
  
  const title = document.createElement('h3');
  title.textContent = 'Authentication Required';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    overlay.remove();
  };
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  const body = document.createElement('div');
  body.className = 'modal-body';
  body.style.textAlign = 'center';
  
  const message = document.createElement('p');
  message.textContent = 'Please login or register to access this feature.';
  message.style.marginBottom = 'var(--space-24)';
  message.style.fontSize = 'var(--font-size-lg)';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = 'var(--space-12)';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.flexWrap = 'wrap';
  
  const loginBtn = document.createElement('button');
  loginBtn.className = 'btn btn--primary';
  loginBtn.textContent = 'Login';
  loginBtn.style.minWidth = '120px';
  loginBtn.onclick = (e) => {
    e.stopPropagation();
    overlay.remove();
    navigate('login');
  };
  
  const registerBtn = document.createElement('button');
  registerBtn.className = 'btn btn--secondary';
  registerBtn.textContent = 'Register';
  registerBtn.style.minWidth = '120px';
  registerBtn.onclick = (e) => {
    e.stopPropagation();
    overlay.remove();
    navigate('register');
  };
  
  buttonContainer.appendChild(loginBtn);
  buttonContainer.appendChild(registerBtn);
  
  body.appendChild(message);
  body.appendChild(buttonContainer);
  
  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  };
  
  // Prevent modal content clicks from closing
  modal.onclick = (e) => {
    e.stopPropagation();
  };
}

// Render feature icons
function renderFeatureIcons(container) {
  const features = document.createElement('div');
  features.className = 'features';
  
  const featureList = [
    { icon: '📝', title: 'Submit Complaint', desc: 'File a new complaint with details', action: 'submit-complaint', role: 'user' },
    { icon: '📍', title: 'Track Status', desc: 'Monitor your complaint progress', action: 'track-status', role: 'all' },
    { icon: '🔔', title: 'Get Notified', desc: 'Receive updates on complaints', action: 'notifications', role: 'all' },
    { icon: '⭐', title: 'Feedback & Rating', desc: 'Rate service effectiveness', action: 'feedback', role: 'user' },
    { icon: '📊', title: 'View Reports', desc: 'View complaint analytics', action: 'reports', role: 'admin' },
    { icon: '🔧', title: 'Manage Complaints', desc: 'Handle and assign complaints', action: 'admin-manage', role: 'admin' }
  ];
  
  featureList.forEach(feature => {
    // Filter features based on role when logged in
    if (currentUser) {
      if (feature.role === 'admin' && currentUser.role !== 'admin') return;
      if (feature.role === 'user' && currentUser.role === 'admin') return;
    } else {
      // Show only user features when not logged in (hide admin-only features)
      if (feature.role === 'admin') return;
    }
    
    const card = document.createElement('div');
    card.className = 'feature-card';
    card.style.cursor = 'pointer';
    card.style.userSelect = 'none';
    card.style.webkitUserSelect = 'none';
    card.style.webkitTapHighlightColor = 'transparent';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', feature.title);
    
    // Click handler with proper event handling
    const clickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleFeatureClick(feature.action);
    };
    
    card.onclick = clickHandler;
    card.ontouchend = clickHandler;
    
    // Keyboard accessibility
    card.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFeatureClick(feature.action);
      }
    };
    
    // Hover effects
    card.onmouseenter = () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = 'var(--shadow-md)';
    };
    
    card.onmouseleave = () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-sm)';
    };
    
    // Touch feedback
    card.ontouchstart = () => {
      card.style.transform = 'scale(0.98)';
    };
    
    card.ontouchcancel = () => {
      card.style.transform = 'scale(1)';
    };
    
    const heading = document.createElement('h3');
    
    const icon = document.createElement('span');
    icon.className = 'feature-icon';
    icon.textContent = feature.icon;
    icon.style.pointerEvents = 'none';
    
    const titleText = document.createElement('span');
    titleText.textContent = feature.title;
    titleText.style.pointerEvents = 'none';
    
    heading.appendChild(icon);
    heading.appendChild(titleText);
    
    const desc = document.createElement('p');
    desc.textContent = feature.desc;
    desc.style.pointerEvents = 'none';
    
    card.appendChild(heading);
    card.appendChild(desc);
    features.appendChild(card);
  });
  
  container.appendChild(features);
}

// Handle feature icon clicks
function handleFeatureClick(action) {
  console.log('Feature clicked:', action, 'User:', currentUser ? currentUser.email : 'not logged in');
  
  if (!currentUser) {
    showLoginDialog();
    return;
  }
  
  switch(action) {
    case 'submit-complaint':
      if (currentUser.role === 'user') {
        navigate('submit-complaint');
      } else {
        navigate('dashboard');
      }
      break;
    case 'track-status':
      navigate('dashboard');
      break;
    case 'notifications':
      toggleNotificationPanel();
      break;
    case 'feedback':
      navigate('dashboard');
      // Scroll to resolved complaints section after render
      setTimeout(() => {
        const resolvedSection = document.getElementById('complaints-table');
        if (resolvedSection) {
          resolvedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      break;
    case 'reports':
      if (currentUser.role === 'admin') {
        navigate('dashboard');
        // Scroll to analytics section
        setTimeout(() => {
          const analyticsSection = document.querySelector('.chart-container');
          if (analyticsSection) {
            analyticsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      break;
    case 'admin-manage':
      if (currentUser.role === 'admin') {
        navigate('dashboard');
        // Scroll to complaints table
        setTimeout(() => {
          const tableSection = document.getElementById('complaints-table');
          if (tableSection) {
            tableSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      break;
    default:
      navigate('dashboard');
  }
}

// Home Page
function renderHomePage(container) {
  renderHeader(container);
  
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  
  const hero = document.createElement('div');
  hero.className = 'hero';
  
  const title = document.createElement('h1');
  title.textContent = 'Online Complaint Redressal System';
  
  const subtitle = document.createElement('p');
  subtitle.textContent = 'Submit, track, and resolve your complaints efficiently. Your voice matters, and we are here to help.';
  
  const actions = document.createElement('div');
  actions.className = 'hero-actions';
  
  if (!currentUser) {
    const registerBtn = document.createElement('button');
    registerBtn.className = 'btn btn--primary';
    registerBtn.textContent = 'Register Now';
    registerBtn.onclick = () => navigate('register');
    
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn btn--secondary';
    loginBtn.textContent = 'Login';
    loginBtn.onclick = () => navigate('login');
    
    actions.appendChild(registerBtn);
    actions.appendChild(loginBtn);
  }
  
  hero.appendChild(title);
  hero.appendChild(subtitle);
  if (!currentUser) {
    hero.appendChild(actions);
  }
  
  mainContainer.appendChild(hero);
  renderFeatureIcons(mainContainer);
  container.appendChild(mainContainer);
}

// Login Page
function renderLoginPage(container) {
  renderHeader(container);
  
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  
  const formCard = document.createElement('div');
  formCard.className = 'form-card';
  
  const title = document.createElement('h2');
  title.textContent = 'Login to Your Account';
  
  const form = document.createElement('form');
  form.onsubmit = handleLogin;
  
  // Email
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  const emailLabel = document.createElement('label');
  emailLabel.className = 'form-label';
  emailLabel.textContent = 'Email Address';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.className = 'form-control';
  emailInput.name = 'email';
  emailInput.required = true;
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  
  // Password
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  const passwordLabel = document.createElement('label');
  passwordLabel.className = 'form-label';
  passwordLabel.textContent = 'Password';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.className = 'form-control';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);
  
  const errorDiv = document.createElement('div');
  errorDiv.id = 'login-error';
  errorDiv.className = 'error-message';
  errorDiv.style.display = 'none';
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary';
  submitBtn.style.width = '100%';
  submitBtn.textContent = 'Login';
  
  const footer = document.createElement('div');
  footer.className = 'form-footer';
  footer.innerHTML = 'Don\'t have an account? <a href="#" id="register-link">Register here</a>';
  
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(errorDiv);
  form.appendChild(submitBtn);
  
  formCard.appendChild(title);
  formCard.appendChild(form);
  formCard.appendChild(footer);
  
  formContainer.appendChild(formCard);
  mainContainer.appendChild(formContainer);
  container.appendChild(mainContainer);
  
  document.getElementById('register-link').onclick = (e) => {
    e.preventDefault();
    navigate('register');
  };
}

function handleLogin(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get('email');
  const password = formData.get('password');
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    currentUser = user;
    navigate('dashboard');
  } else {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = 'Invalid email or password';
    errorDiv.style.display = 'block';
  }
}

// Register Page
function renderRegisterPage(container) {
  renderHeader(container);
  
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  
  const formCard = document.createElement('div');
  formCard.className = 'form-card';
  
  const title = document.createElement('h2');
  title.textContent = 'Create New Account';
  
  const form = document.createElement('form');
  form.onsubmit = handleRegister;
  
  // Full Name
  const nameGroup = document.createElement('div');
  nameGroup.className = 'form-group';
  const nameLabel = document.createElement('label');
  nameLabel.className = 'form-label';
  nameLabel.textContent = 'Full Name';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.className = 'form-control';
  nameInput.name = 'name';
  nameInput.required = true;
  nameGroup.appendChild(nameLabel);
  nameGroup.appendChild(nameInput);
  
  // Email
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  const emailLabel = document.createElement('label');
  emailLabel.className = 'form-label';
  emailLabel.textContent = 'Email Address';
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.className = 'form-control';
  emailInput.name = 'email';
  emailInput.required = true;
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  
  // Phone
  const phoneGroup = document.createElement('div');
  phoneGroup.className = 'form-group';
  const phoneLabel = document.createElement('label');
  phoneLabel.className = 'form-label';
  phoneLabel.textContent = 'Phone Number';
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.className = 'form-control';
  phoneInput.name = 'phone';
  phoneInput.pattern = '[0-9]{10}';
  phoneInput.required = true;
  phoneGroup.appendChild(phoneLabel);
  phoneGroup.appendChild(phoneInput);
  
  // Password
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  const passwordLabel = document.createElement('label');
  passwordLabel.className = 'form-label';
  passwordLabel.textContent = 'Password';
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.className = 'form-control';
  passwordInput.name = 'password';
  passwordInput.minLength = 8;
  passwordInput.required = true;
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);
  
  // Confirm Password
  const confirmGroup = document.createElement('div');
  confirmGroup.className = 'form-group';
  const confirmLabel = document.createElement('label');
  confirmLabel.className = 'form-label';
  confirmLabel.textContent = 'Confirm Password';
  const confirmInput = document.createElement('input');
  confirmInput.type = 'password';
  confirmInput.className = 'form-control';
  confirmInput.name = 'confirmPassword';
  confirmInput.required = true;
  confirmGroup.appendChild(confirmLabel);
  confirmGroup.appendChild(confirmInput);
  
  const errorDiv = document.createElement('div');
  errorDiv.id = 'register-error';
  errorDiv.className = 'error-message';
  errorDiv.style.display = 'none';
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary';
  submitBtn.style.width = '100%';
  submitBtn.textContent = 'Register';
  
  const footer = document.createElement('div');
  footer.className = 'form-footer';
  footer.innerHTML = 'Already have an account? <a href="#" id="login-link">Login here</a>';
  
  form.appendChild(nameGroup);
  form.appendChild(emailGroup);
  form.appendChild(phoneGroup);
  form.appendChild(passwordGroup);
  form.appendChild(confirmGroup);
  form.appendChild(errorDiv);
  form.appendChild(submitBtn);
  
  formCard.appendChild(title);
  formCard.appendChild(form);
  formCard.appendChild(footer);
  
  formContainer.appendChild(formCard);
  mainContainer.appendChild(formContainer);
  container.appendChild(mainContainer);
  
  document.getElementById('login-link').onclick = (e) => {
    e.preventDefault();
    navigate('login');
  };
}

function handleRegister(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  
  const errorDiv = document.getElementById('register-error');
  
  // Validation
  if (password !== confirmPassword) {
    errorDiv.textContent = 'Passwords do not match';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (password.length < 8 || !/\d/.test(password)) {
    errorDiv.textContent = 'Password must be at least 8 characters and contain a number';
    errorDiv.style.display = 'block';
    return;
  }
  
  if (users.find(u => u.email === email)) {
    errorDiv.textContent = 'Email already registered';
    errorDiv.style.display = 'block';
    return;
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    password,
    role: 'user'
  };
  
  users.push(newUser);
  navigate('login');
}

// User Dashboard
function renderUserDashboard(container) {
  renderHeader(container);
  
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  
  const dashboardHeader = document.createElement('div');
  dashboardHeader.className = 'dashboard-header';
  
  const title = document.createElement('h2');
  title.textContent = 'My Dashboard';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = '+ Submit New Complaint';
  submitBtn.onclick = () => navigate('submit-complaint');
  
  dashboardHeader.appendChild(title);
  dashboardHeader.appendChild(submitBtn);
  
  // Stats
  const userComplaints = complaints.filter(c => c.userId === currentUser.id);
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';
  
  const stats = [
    { label: 'Total Complaints', value: userComplaints.length },
    { label: 'Pending', value: userComplaints.filter(c => c.status === 'Pending').length },
    { label: 'In Progress', value: userComplaints.filter(c => c.status === 'In Progress').length },
    { label: 'Resolved', value: userComplaints.filter(c => c.status === 'Resolved').length }
  ];
  
  stats.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const label = document.createElement('div');
    label.className = 'stat-label';
    label.textContent = stat.label;
    
    const value = document.createElement('div');
    value.className = 'stat-value';
    value.textContent = stat.value;
    
    card.appendChild(label);
    card.appendChild(value);
    statsGrid.appendChild(card);
  });
  
  // Filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control search-input';
  searchInput.placeholder = 'Search by ID or title...';
  searchInput.id = 'search-input';
  searchInput.oninput = filterComplaints;
  
  const statusFilter = document.createElement('select');
  statusFilter.className = 'form-control';
  statusFilter.id = 'status-filter';
  statusFilter.onchange = filterComplaints;
  
  const statusOptions = ['All Status', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
  statusOptions.forEach(status => {
    const option = document.createElement('option');
    option.value = status === 'All Status' ? '' : status;
    option.textContent = status;
    statusFilter.appendChild(option);
  });
  
  const categoryFilter = document.createElement('select');
  categoryFilter.className = 'form-control';
  categoryFilter.id = 'category-filter';
  categoryFilter.onchange = filterComplaints;
  
  const categoryOptions = ['All Categories', 'Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Others'];
  categoryOptions.forEach(category => {
    const option = document.createElement('option');
    option.value = category === 'All Categories' ? '' : category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  filterBar.appendChild(searchInput);
  filterBar.appendChild(statusFilter);
  filterBar.appendChild(categoryFilter);
  
  // Complaints table
  const tableContainer = document.createElement('div');
  tableContainer.className = 'complaint-table';
  tableContainer.id = 'complaints-table';
  
  mainContainer.appendChild(dashboardHeader);
  mainContainer.appendChild(statsGrid);
  
  // Add feature icons section
  const featuresTitle = document.createElement('h3');
  featuresTitle.textContent = 'Quick Access';
  featuresTitle.style.marginTop = 'var(--space-32)';
  featuresTitle.style.marginBottom = 'var(--space-16)';
  mainContainer.appendChild(featuresTitle);
  renderFeatureIcons(mainContainer);
  
  const complaintsTitle = document.createElement('h3');
  complaintsTitle.textContent = 'My Complaints';
  complaintsTitle.style.marginTop = 'var(--space-32)';
  complaintsTitle.style.marginBottom = 'var(--space-16)';
  mainContainer.appendChild(complaintsTitle);
  
  mainContainer.appendChild(filterBar);
  mainContainer.appendChild(tableContainer);
  container.appendChild(mainContainer);
  
  renderComplaintsTable(userComplaints);
}

function filterComplaints() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const statusFilter = document.getElementById('status-filter').value;
  const categoryFilter = document.getElementById('category-filter').value;
  
  let filtered = currentUser.role === 'admin' ? complaints : complaints.filter(c => c.userId === currentUser.id);
  
  if (searchTerm) {
    filtered = filtered.filter(c => 
      c.id.toLowerCase().includes(searchTerm) || 
      c.title.toLowerCase().includes(searchTerm)
    );
  }
  
  if (statusFilter) {
    filtered = filtered.filter(c => c.status === statusFilter);
  }
  
  if (categoryFilter) {
    filtered = filtered.filter(c => c.category === categoryFilter);
  }
  
  renderComplaintsTable(filtered);
}

function renderComplaintsTable(complaintsList) {
  const container = document.getElementById('complaints-table');
  container.innerHTML = '';
  
  if (complaintsList.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No complaints found';
    container.appendChild(empty);
    return;
  }
  
  const table = document.createElement('table');
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Date', 'Actions'];
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  
  complaintsList.forEach(complaint => {
    const row = document.createElement('tr');
    
    const idCell = document.createElement('td');
    idCell.textContent = complaint.id;
    
    const titleCell = document.createElement('td');
    titleCell.textContent = complaint.title;
    
    const categoryCell = document.createElement('td');
    categoryCell.textContent = complaint.category;
    
    const priorityCell = document.createElement('td');
    priorityCell.innerHTML = `<span class="priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span>`;
    
    const statusCell = document.createElement('td');
    const statusClass = complaint.status.toLowerCase().replace(' ', '-');
    statusCell.innerHTML = `<span class="status-badge status-${statusClass}">${complaint.status}</span>`;
    
    const dateCell = document.createElement('td');
    dateCell.textContent = complaint.dateSubmitted;
    
    const actionsCell = document.createElement('td');
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn--sm';
    viewBtn.textContent = 'View';
    viewBtn.onclick = () => showComplaintDetails(complaint);
    actionsCell.appendChild(viewBtn);
    
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(categoryCell);
    row.appendChild(priorityCell);
    row.appendChild(statusCell);
    row.appendChild(dateCell);
    row.appendChild(actionsCell);
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  container.appendChild(table);
}

function showComplaintDetails(complaint) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const header = document.createElement('div');
  header.className = 'modal-header';
  
  const title = document.createElement('h3');
  title.textContent = 'Complaint Details';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => overlay.remove();
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  const body = document.createElement('div');
  body.className = 'modal-body';
  
  const details = [
    { label: 'Complaint ID', value: complaint.id },
    { label: 'Title', value: complaint.title },
    { label: 'Category', value: complaint.category },
    { label: 'Priority', value: complaint.priority },
    { label: 'Status', value: complaint.status },
    { label: 'Description', value: complaint.description },
    { label: 'Location', value: complaint.location },
    { label: 'Date Submitted', value: complaint.dateSubmitted },
    { label: 'Attached File', value: complaint.fileName || 'No file attached' },
    { label: 'Assigned To', value: complaint.assignedTo || 'Not assigned yet' },
    { label: 'Admin Comments', value: complaint.adminComments || 'No comments yet' }
  ];
  
  details.forEach(detail => {
    const row = document.createElement('div');
    row.className = 'detail-row';
    
    const label = document.createElement('div');
    label.className = 'detail-label';
    label.textContent = detail.label + ':';
    
    const value = document.createElement('div');
    value.className = 'detail-value';
    value.textContent = detail.value;
    
    row.appendChild(label);
    row.appendChild(value);
    body.appendChild(row);
  });
  
  // Rating section for resolved complaints
  if (complaint.status === 'Resolved' && complaint.userId === currentUser.id) {
    const ratingSection = document.createElement('div');
    ratingSection.style.marginTop = 'var(--space-24)';
    ratingSection.style.paddingTop = 'var(--space-24)';
    ratingSection.style.borderTop = '1px solid var(--color-card-border-inner)';
    
    const ratingTitle = document.createElement('h4');
    ratingTitle.textContent = 'Rate This Service';
    ratingTitle.style.marginBottom = 'var(--space-16)';
    
    if (complaint.rating) {
      const existingRating = document.createElement('p');
      existingRating.innerHTML = `<strong>Your Rating:</strong> ${complaint.rating} ⭐`;
      if (complaint.feedback) {
        existingRating.innerHTML += `<br><strong>Your Feedback:</strong> ${complaint.feedback}`;
      }
      ratingSection.appendChild(existingRating);
    } else {
      const ratingContainer = document.createElement('div');
      ratingContainer.className = 'rating-container';
      ratingContainer.id = 'rating-stars';
      
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';
        star.dataset.rating = i;
        star.onclick = () => selectRating(i);
        ratingContainer.appendChild(star);
      }
      
      const feedbackGroup = document.createElement('div');
      feedbackGroup.className = 'form-group';
      feedbackGroup.style.marginTop = 'var(--space-16)';
      
      const feedbackLabel = document.createElement('label');
      feedbackLabel.className = 'form-label';
      feedbackLabel.textContent = 'Feedback (Optional)';
      
      const feedbackInput = document.createElement('textarea');
      feedbackInput.className = 'form-control';
      feedbackInput.id = 'feedback-input';
      feedbackInput.rows = 3;
      
      feedbackGroup.appendChild(feedbackLabel);
      feedbackGroup.appendChild(feedbackInput);
      
      const submitRatingBtn = document.createElement('button');
      submitRatingBtn.className = 'btn btn--primary';
      submitRatingBtn.textContent = 'Submit Rating';
      submitRatingBtn.onclick = () => submitRating(complaint.id);
      submitRatingBtn.style.marginTop = 'var(--space-16)';
      
      ratingSection.appendChild(ratingTitle);
      ratingSection.appendChild(ratingContainer);
      ratingSection.appendChild(feedbackGroup);
      ratingSection.appendChild(submitRatingBtn);
    }
    
    body.appendChild(ratingSection);
  }
  
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  
  if (currentUser.role === 'admin') {
    const updateBtn = document.createElement('button');
    updateBtn.className = 'btn btn--primary';
    updateBtn.textContent = 'Update Status';
    updateBtn.onclick = () => {
      overlay.remove();
      showUpdateStatusModal(complaint);
    };
    footer.appendChild(updateBtn);
  }
  
  const closeFooterBtn = document.createElement('button');
  closeFooterBtn.className = 'btn btn--secondary';
  closeFooterBtn.textContent = 'Close';
  closeFooterBtn.onclick = () => overlay.remove();
  footer.appendChild(closeFooterBtn);
  
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

let selectedRating = 0;

function selectRating(rating) {
  selectedRating = rating;
  const stars = document.querySelectorAll('#rating-stars .star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('filled');
    } else {
      star.classList.remove('filled');
    }
  });
}

function submitRating(complaintId) {
  if (selectedRating === 0) {
    alert('Please select a rating');
    return;
  }
  
  const feedback = document.getElementById('feedback-input').value;
  const complaint = complaints.find(c => c.id === complaintId);
  
  if (complaint) {
    complaint.rating = selectedRating;
    complaint.feedback = feedback;
    document.querySelector('.modal-overlay').remove();
    navigate('dashboard');
  }
}

// Admin Dashboard
function renderAdminDashboard(container) {
  renderHeader(container);
  
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  
  const dashboardHeader = document.createElement('div');
  dashboardHeader.className = 'dashboard-header';
  
  const title = document.createElement('h2');
  title.textContent = 'Admin Dashboard';
  
  dashboardHeader.appendChild(title);
  
  // Stats
  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';
  
  const stats = [
    { label: 'Total Complaints', value: complaints.length },
    { label: 'Pending', value: complaints.filter(c => c.status === 'Pending').length },
    { label: 'In Progress', value: complaints.filter(c => c.status === 'In Progress').length },
    { label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length }
  ];
  
  stats.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const label = document.createElement('div');
    label.className = 'stat-label';
    label.textContent = stat.label;
    
    const value = document.createElement('div');
    value.className = 'stat-value';
    value.textContent = stat.value;
    
    card.appendChild(label);
    card.appendChild(value);
    statsGrid.appendChild(card);
  });
  
  // Analytics
  const analyticsSection = document.createElement('div');
  
  const chartContainer = document.createElement('div');
  chartContainer.className = 'chart-container';
  
  const chartTitle = document.createElement('h3');
  chartTitle.textContent = 'Complaints by Category';
  
  const chartBars = document.createElement('div');
  chartBars.className = 'chart-bars';
  
  const categories = ['Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Others'];
  const maxCount = Math.max(...categories.map(cat => complaints.filter(c => c.category === cat).length), 1);
  
  categories.forEach(category => {
    const count = complaints.filter(c => c.category === category).length;
    const percentage = (count / maxCount) * 100;
    
    const barRow = document.createElement('div');
    barRow.className = 'chart-bar';
    
    const label = document.createElement('div');
    label.className = 'chart-label';
    label.textContent = category;
    
    const barBg = document.createElement('div');
    barBg.className = 'chart-bar-bg';
    
    const barFill = document.createElement('div');
    barFill.className = 'chart-bar-fill';
    barFill.style.width = percentage + '%';
    barFill.textContent = count;
    
    barBg.appendChild(barFill);
    barRow.appendChild(label);
    barRow.appendChild(barBg);
    chartBars.appendChild(barRow);
  });
  
  chartContainer.appendChild(chartTitle);
  chartContainer.appendChild(chartBars);
  analyticsSection.appendChild(chartContainer);
  
  // Ratings
  const ratingsContainer = document.createElement('div');
  ratingsContainer.className = 'chart-container';
  
  const ratingsTitle = document.createElement('h3');
  ratingsTitle.textContent = 'Service Ratings';
  
  const ratedComplaints = complaints.filter(c => c.rating !== null);
  const avgRating = ratedComplaints.length > 0 
    ? (ratedComplaints.reduce((sum, c) => sum + c.rating, 0) / ratedComplaints.length).toFixed(1)
    : 'N/A';
  
  const ratingsInfo = document.createElement('p');
  ratingsInfo.innerHTML = `<strong>Average Rating:</strong> ${avgRating} ⭐ (${ratedComplaints.length} ratings)`;
  
  ratingsContainer.appendChild(ratingsTitle);
  ratingsContainer.appendChild(ratingsInfo);
  analyticsSection.appendChild(ratingsContainer);
  
  // Filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'filter-bar';
  
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control search-input';
  searchInput.placeholder = 'Search by ID or title...';
  searchInput.id = 'search-input';
  searchInput.oninput = filterComplaints;
  
  const statusFilter = document.createElement('select');
  statusFilter.className = 'form-control';
  statusFilter.id = 'status-filter';
  statusFilter.onchange = filterComplaints;
  
  const statusOptions = ['All Status', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
  statusOptions.forEach(status => {
    const option = document.createElement('option');
    option.value = status === 'All Status' ? '' : status;
    option.textContent = status;
    statusFilter.appendChild(option);
  });
  
  const categoryFilter = document.createElement('select');
  categoryFilter.className = 'form-control';
  categoryFilter.id = 'category-filter';
  categoryFilter.onchange = filterComplaints;
  
  const categoryOptions = ['All Categories', 'Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Others'];
  categoryOptions.forEach(category => {
    const option = document.createElement('option');
    option.value = category === 'All Categories' ? '' : category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  
  filterBar.appendChild(searchInput);
  filterBar.appendChild(statusFilter);
  filterBar.appendChild(categoryFilter);
  
  // Complaints table
  const tableContainer = document.createElement('div');
  tableContainer.className = 'complaint-table';
  tableContainer.id = 'complaints-table';
  
  mainContainer.appendChild(dashboardHeader);
  mainContainer.appendChild(statsGrid);
  
  // Add feature icons section
  const featuresTitle = document.createElement('h3');
  featuresTitle.textContent = 'Quick Access';
  featuresTitle.style.marginTop = 'var(--space-32)';
  featuresTitle.style.marginBottom = 'var(--space-16)';
  mainContainer.appendChild(featuresTitle);
  renderFeatureIcons(mainContainer);
  
  const analyticsTitle = document.createElement('h3');
  analyticsTitle.textContent = 'Analytics';
  analyticsTitle.style.marginTop = 'var(--space-32)';
  analyticsTitle.style.marginBottom = 'var(--space-16)';
  mainContainer.appendChild(analyticsTitle);
  mainContainer.appendChild(analyticsSection);
  
  const allComplaintsTitle = document.createElement('h3');
  allComplaintsTitle.textContent = 'All Complaints';
  allComplaintsTitle.style.marginTop = 'var(--space-32)';
  allComplaintsTitle.style.marginBottom = 'var(--space-16)';
  mainContainer.appendChild(allComplaintsTitle);
  
  mainContainer.appendChild(filterBar);
  mainContainer.appendChild(tableContainer);
  container.appendChild(mainContainer);
  
  renderComplaintsTable(complaints);
}

function showUpdateStatusModal(complaint) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  const header = document.createElement('div');
  header.className = 'modal-header';
  
  const title = document.createElement('h3');
  title.textContent = 'Update Complaint Status';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.innerHTML = '×';
  closeBtn.onclick = () => overlay.remove();
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  const body = document.createElement('div');
  body.className = 'modal-body';
  
  const form = document.createElement('form');
  form.onsubmit = (e) => {
    e.preventDefault();
    updateComplaintStatus(complaint.id, overlay);
  };
  
  // Status
  const statusGroup = document.createElement('div');
  statusGroup.className = 'form-group';
  const statusLabel = document.createElement('label');
  statusLabel.className = 'form-label';
  statusLabel.textContent = 'Status';
  const statusSelect = document.createElement('select');
  statusSelect.className = 'form-control';
  statusSelect.id = 'update-status';
  const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  statuses.forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status;
    if (status === complaint.status) option.selected = true;
    statusSelect.appendChild(option);
  });
  statusGroup.appendChild(statusLabel);
  statusGroup.appendChild(statusSelect);
  
  // Assign To
  const assignGroup = document.createElement('div');
  assignGroup.className = 'form-group';
  const assignLabel = document.createElement('label');
  assignLabel.className = 'form-label';
  assignLabel.textContent = 'Assign To';
  const assignInput = document.createElement('input');
  assignInput.type = 'text';
  assignInput.className = 'form-control';
  assignInput.id = 'assign-to';
  assignInput.value = complaint.assignedTo || '';
  assignInput.placeholder = 'e.g., Infrastructure Dept';
  assignGroup.appendChild(assignLabel);
  assignGroup.appendChild(assignInput);
  
  // Comments
  const commentsGroup = document.createElement('div');
  commentsGroup.className = 'form-group';
  const commentsLabel = document.createElement('label');
  commentsLabel.className = 'form-label';
  commentsLabel.textContent = 'Admin Comments';
  const commentsInput = document.createElement('textarea');
  commentsInput.className = 'form-control';
  commentsInput.id = 'admin-comments';
  commentsInput.rows = 4;
  commentsInput.value = complaint.adminComments || '';
  commentsGroup.appendChild(commentsLabel);
  commentsGroup.appendChild(commentsInput);
  
  form.appendChild(statusGroup);
  form.appendChild(assignGroup);
  form.appendChild(commentsGroup);
  body.appendChild(form);
  
  const footer = document.createElement('div');
  footer.className = 'modal-footer';
  
  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = 'Update Complaint';
  submitBtn.onclick = () => updateComplaintStatus(complaint.id, overlay);
  
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn--secondary';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = () => overlay.remove();
  
  footer.appendChild(submitBtn);
  footer.appendChild(cancelBtn);
  
  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

function updateComplaintStatus(complaintId, overlay) {
  const status = document.getElementById('update-status').value;
  const assignedTo = document.getElementById('assign-to').value;
  const adminComments = document.getElementById('admin-comments').value;
  
  const complaint = complaints.find(c => c.id === complaintId);
  
  if (complaint) {
    const oldStatus = complaint.status;
    complaint.status = status;
    complaint.assignedTo = assignedTo;
    complaint.adminComments = adminComments;
    
    // Add notification if status changed
    if (oldStatus !== status) {
      addNotification(
        complaint.userId,
        `Your complaint ${complaintId} status updated to ${status}`
      );
    }
    
    overlay.remove();
    navigate('dashboard');
  }
}

// Complaint Form
function renderComplaintForm(container) {
  renderHeader(container);
  
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container';
  
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';
  formContainer.style.maxWidth = '600px';
  
  const formCard = document.createElement('div');
  formCard.className = 'form-card';
  
  const title = document.createElement('h2');
  title.textContent = 'Submit New Complaint';
  
  const form = document.createElement('form');
  form.onsubmit = handleComplaintSubmit;
  
  // Title
  const titleGroup = document.createElement('div');
  titleGroup.className = 'form-group';
  const titleLabel = document.createElement('label');
  titleLabel.className = 'form-label';
  titleLabel.textContent = 'Complaint Title';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'form-control';
  titleInput.name = 'title';
  titleInput.required = true;
  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);
  
  // Category
  const categoryGroup = document.createElement('div');
  categoryGroup.className = 'form-group';
  const categoryLabel = document.createElement('label');
  categoryLabel.className = 'form-label';
  categoryLabel.textContent = 'Category';
  const categorySelect = document.createElement('select');
  categorySelect.className = 'form-control';
  categorySelect.name = 'category';
  categorySelect.required = true;
  const categories = ['Infrastructure', 'Water Supply', 'Electricity', 'Sanitation', 'Roads', 'Public Safety', 'Others'];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
  categoryGroup.appendChild(categoryLabel);
  categoryGroup.appendChild(categorySelect);
  
  // Description
  const descGroup = document.createElement('div');
  descGroup.className = 'form-group';
  const descLabel = document.createElement('label');
  descLabel.className = 'form-label';
  descLabel.textContent = 'Description';
  const descInput = document.createElement('textarea');
  descInput.className = 'form-control';
  descInput.name = 'description';
  descInput.rows = 4;
  descInput.required = true;
  descGroup.appendChild(descLabel);
  descGroup.appendChild(descInput);
  
  // Location
  const locationGroup = document.createElement('div');
  locationGroup.className = 'form-group';
  const locationLabel = document.createElement('label');
  locationLabel.className = 'form-label';
  locationLabel.textContent = 'Location/Address';
  const locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.className = 'form-control';
  locationInput.name = 'location';
  locationInput.required = true;
  locationGroup.appendChild(locationLabel);
  locationGroup.appendChild(locationInput);
  
  // Priority
  const priorityGroup = document.createElement('div');
  priorityGroup.className = 'form-group';
  const priorityLabel = document.createElement('label');
  priorityLabel.className = 'form-label';
  priorityLabel.textContent = 'Priority';
  const prioritySelect = document.createElement('select');
  prioritySelect.className = 'form-control';
  prioritySelect.name = 'priority';
  prioritySelect.required = true;
  const priorities = ['Low', 'Medium', 'High'];
  priorities.forEach(priority => {
    const option = document.createElement('option');
    option.value = priority;
    option.textContent = priority;
    if (priority === 'Medium') option.selected = true;
    prioritySelect.appendChild(option);
  });
  priorityGroup.appendChild(priorityLabel);
  priorityGroup.appendChild(prioritySelect);
  
  // File Upload
  const fileGroup = document.createElement('div');
  fileGroup.className = 'form-group';
  const fileLabel = document.createElement('label');
  fileLabel.className = 'form-label';
  fileLabel.textContent = 'Attach File (Optional)';
  const fileUpload = document.createElement('div');
  fileUpload.className = 'file-upload';
  const fileUploadLabel = document.createElement('label');
  fileUploadLabel.className = 'file-upload-label';
  fileUploadLabel.textContent = 'Choose File';
  fileUploadLabel.htmlFor = 'file-input';
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'file-input';
  fileInput.name = 'file';
  fileInput.accept = 'image/*,.pdf,.doc,.docx';
  fileInput.onchange = (e) => {
    const fileName = e.target.files[0]?.name || 'No file chosen';
    document.getElementById('file-name').textContent = fileName;
  };
  const fileNameDisplay = document.createElement('div');
  fileNameDisplay.id = 'file-name';
  fileNameDisplay.className = 'file-name';
  fileNameDisplay.textContent = 'No file chosen';
  fileUpload.appendChild(fileInput);
  fileUpload.appendChild(fileUploadLabel);
  fileGroup.appendChild(fileLabel);
  fileGroup.appendChild(fileUpload);
  fileGroup.appendChild(fileNameDisplay);
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary';
  submitBtn.style.width = '100%';
  submitBtn.textContent = 'Submit Complaint';
  
  form.appendChild(titleGroup);
  form.appendChild(categoryGroup);
  form.appendChild(descGroup);
  form.appendChild(locationGroup);
  form.appendChild(priorityGroup);
  form.appendChild(fileGroup);
  form.appendChild(submitBtn);
  
  formCard.appendChild(title);
  formCard.appendChild(form);
  formContainer.appendChild(formCard);
  mainContainer.appendChild(formContainer);
  container.appendChild(mainContainer);
}

function handleComplaintSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const newComplaint = {
    id: generateComplaintId(),
    userId: currentUser.id,
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
    location: formData.get('location'),
    fileName: formData.get('file') ? document.getElementById('file-name').textContent : null,
    priority: formData.get('priority'),
    status: 'Pending',
    dateSubmitted: getCurrentDate(),
    assignedTo: null,
    adminComments: null,
    rating: null,
    feedback: null
  };
  
  complaints.push(newComplaint);
  
  addNotification(
    currentUser.id,
    `Your complaint ${newComplaint.id} has been submitted successfully`
  );
  
  navigate('dashboard');
}

// Initialize App
navigate('home');
