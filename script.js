// Module System
const modules = [
  { id: 1, name: "Module 1: Introduction", intro: "Videos/vid1.mp4", optionA: "Videos/vid2.mp4", optionB: "Videos/vid3.mp4" },
  { id: 2, name: "Module 2: Body Image", intro: "Videos/vid1.mp4", optionA: "Videos/vid2.mp4", optionB: "Videos/vid3.mp4" },
  { id: 3, name: "Module 3: Self-Esteem", intro: "Videos/vid1.mp4", optionA: "Videos/vid2.mp4", optionB: "Videos/vid3.mp4" },
  { id: 4, name: "Module 4: Confidence Building", intro: "Videos/vid1.mp4", optionA: "Videos/vid2.mp4", optionB: "Videos/vid3.mp4" },
  { id: 5, name: "Module 5: Peer Pressure", intro: "Videos/vid1.mp4", optionA: "Videos/vid2.mp4", optionB: "Videos/vid3.mp4" },
  { id: 6, name: "Module 6: Final Review", intro: "Videos/vid1.mp4", optionA: "Videos/vid2.mp4", optionB: "Videos/vid3.mp4" }
];

let currentModule = 1;

// Initialize module system
function initModules() {
  const completedModules = getCompletedModules();
  const moduleList = document.getElementById('moduleList');
  const progressIndicator = document.getElementById('progressIndicator');
  
  // Update progress
  progressIndicator.textContent = `Completed ${completedModules.length}/6`;
  
  // Update certificate button state
  const certificateLink = document.getElementById('certificateLink');
  const certTooltip = document.getElementById('certTooltip');
  if (certificateLink) {
    if (completedModules.length === 6) {
      certificateLink.classList.remove('disabled');
      certificateLink.title = 'Get Your Certificate';
    } else {
      certificateLink.classList.add('disabled');
      certificateLink.title = '';
      if (certTooltip) {
        certTooltip.textContent = `Complete all 6 modules to unlock (${completedModules.length}/6)`;
      }
    }
  }
  
  moduleList.innerHTML = modules.map(module => {
    const isCompleted = completedModules.includes(module.id);
    const isActive = module.id === currentModule;
    const isLocked = module.id > 1 && !completedModules.includes(module.id - 1);
    
    let statusIcon = '';
    let statusText = '';
    
    if (isCompleted) {
      statusIcon = '<span class="module-status-icon completed">✔</span>';
      statusText = 'Completed';
    } else if (isLocked) {
      statusIcon = '<span class="module-status-icon locked">🔒</span>';
      statusText = 'Locked';
    } else if (isActive) {
      statusText = 'In Progress';
    } else {
      statusText = 'Available';
    }
    
    const classes = ['module-item'];
    if (isActive) classes.push('active');
    if (isLocked) classes.push('locked');
    
    return `
      <div class="module-item-wrapper">
        <div class="${classes.join(' ')}" data-module="${module.id}">
          <div class="module-item-left">
            <div class="module-icon">📚</div>
            <div class="module-info">
              <div class="module-name">${module.name}</div>
              <div class="module-status-text">${statusText}</div>
            </div>
          </div>
          ${statusIcon}
        </div>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  document.querySelectorAll('.module-item').forEach(item => {
    item.addEventListener('click', () => {
      const moduleId = parseInt(item.dataset.module);
      if (!item.classList.contains('locked')) {
        switchToModule(moduleId);
      }
    });
  });
}

// Sidebar toggle
const sidebar = document.getElementById('moduleSidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

if (sidebarToggle) {
  // Start collapsed on mobile
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
    sidebarToggle.style.left = '0';
  }
  
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const icon = sidebarToggle.querySelector('.toggle-icon');
    icon.textContent = sidebar.classList.contains('collapsed') ? '☰' : '×';
    
    // Update toggle button position
    const isMobile = window.innerWidth <= 768;
    const sidebarWidth = isMobile ? '280px' : '320px';
    
    if (sidebar.classList.contains('collapsed')) {
      sidebarToggle.style.left = '0';
    } else {
      sidebarToggle.style.left = sidebarWidth;
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (!sidebar.classList.contains('collapsed')) {
      const isMobile = window.innerWidth <= 768;
      sidebarToggle.style.left = isMobile ? '280px' : '320px';
    }
  });
}

// Get completed modules from localStorage
function getCompletedModules() {
  const completed = localStorage.getItem('completedModules');
  return completed ? JSON.parse(completed) : [];
}

// Mark module as completed
function completeModule(moduleId) {
  const completed = getCompletedModules();
  if (!completed.includes(moduleId)) {
    completed.push(moduleId);
    localStorage.setItem('completedModules', JSON.stringify(completed));
    
    // Show notification if next module is unlocked
    if (moduleId < modules.length) {
      setTimeout(() => {
        showModuleUnlockedNotification(moduleId + 1);
      }, 1500);
    }
  }
  initModules(); // Refresh sidebar
}

// Show module unlocked notification
function showModuleUnlockedNotification(moduleId) {
  const notification = document.createElement('div');
  notification.className = 'module-unlocked-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">🎉</div>
      <div>
        <div class="notification-title">Module ${moduleId} Unlocked!</div>
        <div class="notification-text">You can now access the next module</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Switch to a different module
function switchToModule(moduleId) {
  currentModule = moduleId;
  const module = modules.find(m => m.id === moduleId);
  
  // Update title
  document.getElementById('moduleTitle').textContent = module.name;
  
  // Reset video to intro
  currentSrc = module.intro;
  video.src = module.intro;
  video.load();
  video.play().catch(() => {});
  
  // Hide overlays
  choiceOverlay.classList.remove('show');
  endOverlay.classList.remove('show');
  closeReflection();
  
  // Update button data attributes
  const buttons = document.querySelectorAll('.btn[data-video]');
  buttons[0].dataset.video = module.optionA;
  buttons[1].dataset.video = module.optionB;
  
  // Refresh sidebar to update active state
  initModules();
}

const INTRO = "Videos/vid1.mp4";

const video = document.getElementById("mainVideo");
const playButton = document.getElementById("playButton");
const choiceOverlay = document.getElementById("choiceOverlay");
const endOverlay = document.getElementById("endOverlay");
const endCard = document.getElementById("endCard");

// Play button functionality
if (playButton && video) {
  playButton.addEventListener("click", () => {
    video.play();
    playButton.classList.add("hidden");
  });
  
  // Show play button only when video is at the beginning and paused
  video.addEventListener("pause", () => {
    if (video.currentTime === 0) {
      playButton.classList.remove("hidden");
    }
  });
  
  // Hide play button when video starts playing
  video.addEventListener("play", () => {
    playButton.classList.add("hidden");
  });
}

const reviewModal = document.getElementById("reviewModal");
const reviewText = document.getElementById("reviewText");
const closeReviewBtn = document.getElementById("closeReviewBtn");

const reflectionOverlay = document.getElementById("reflectionOverlay");
const reflectionForm = document.getElementById("reflectionForm");
const successMessage = document.getElementById("successMessage");
const closeReflectionBtn = document.getElementById("closeReflectionBtn");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const confidenceInput = document.getElementById("confidence");
const confidenceValue = document.getElementById("confidenceValue");

let currentSrc = INTRO;

function renderEndScreen() {
  if (!endCard) return;
  endCard.innerHTML = `
    <h2>THE END</h2>
    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <button id="showReflectionBtn" class="btn btn-reflection">Share Your Reflection</button>
      <a href="dashboard.html" class="btn btn-dashboard">View Dashboard</a>
    </div>
  `;

  const showReflectionBtn = document.getElementById("showReflectionBtn");
  if (showReflectionBtn) {
    showReflectionBtn.addEventListener("click", openReflection);
  }
}

function closeReview() {
  if (!reviewModal) return;
  reviewModal.classList.remove("show");
  reviewModal.setAttribute("aria-hidden", "true");
}

if (closeReviewBtn) {
  closeReviewBtn.addEventListener("click", closeReview);
}

// click outside modal card to close
if (reviewModal) {
  reviewModal.addEventListener("click", (e) => {
    if (e.target === reviewModal) closeReview();
  });
}

// Reflection form functions
function openReflection() {
  if (!reflectionOverlay || !reflectionForm || !successMessage) return;
  reflectionOverlay.classList.add("show");
  reflectionForm.style.display = "block";
  successMessage.style.display = "none";
  
  // Update form title to show current module
  const formTitle = document.querySelector('.reflection-form-container h2');
  const module = modules.find(m => m.id === currentModule);
  if (formTitle && module) {
    formTitle.textContent = `${module.name} Reflection`;
  }
}

function closeReflection() {
  if (!reflectionOverlay || !reflectionForm || !confidenceValue) return;
  reflectionOverlay.classList.remove("show");
  reflectionForm.reset();
  confidenceValue.textContent = "5";
}

// Update confidence slider value display
if (confidenceInput && confidenceValue) {
  confidenceInput.addEventListener("input", (e) => {
    confidenceValue.textContent = e.target.value;
  });
}

// Handle form submission
if (reflectionForm) {
  reflectionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Collect form data
    const formData = {
      moduleId: currentModule,
      moduleName: modules.find(m => m.id === currentModule).name,
      studentName: document.getElementById("studentName").value,
      mainTakeaway: document.getElementById("mainTakeaway").value,
      emotionalResponse: document.getElementById("emotionalResponse").value,
      confidence: document.getElementById("confidence").value,
      additionalComments: document.getElementById("additionalComments").value,
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const existingData = localStorage.getItem('reflectionSubmissions');
    const submissions = existingData ? JSON.parse(existingData) : [];
    submissions.push(formData);
    localStorage.setItem('reflectionSubmissions', JSON.stringify(submissions));
    
    console.log("Reflection submitted:", formData);
    
    // Mark current module as completed and unlock next module
    completeModule(currentModule);
    
    // Show success message
    if (reflectionForm && successMessage) {
      reflectionForm.style.display = "none";
      successMessage.style.display = "block";
    }
  });
}

// Close reflection form
if (closeReflectionBtn) {
  closeReflectionBtn.addEventListener("click", closeReflection);
}
if (closeSuccessBtn) {
  closeSuccessBtn.addEventListener("click", closeReflection);
}

// Click outside to close
if (reflectionOverlay) {
  reflectionOverlay.addEventListener("click", (e) => {
    if (e.target === reflectionOverlay) closeReflection();
  });
}

if (video) {
  video.addEventListener("ended", () => {
    const module = modules.find(m => m.id === currentModule);
    if (currentSrc === module.intro) {
      // Smoothly show the choice overlay
      if (choiceOverlay) choiceOverlay.classList.add("show");
    } else {
      if (choiceOverlay) choiceOverlay.classList.remove("show");
      renderEndScreen();
      if (endOverlay) endOverlay.classList.add("show");

      // freeze last frame behind overlay
      try {
        video.pause();
        video.currentTime = Math.max(0, video.duration - 0.05);
      } catch {}
      // Reflection form no longer opens automatically
    }
  });
}

async function smoothSwitchTo(src) {
  if (!video || !choiceOverlay || !endOverlay) return;
  
  choiceOverlay.classList.remove("show");
  endOverlay.classList.remove("show");
  closeReview();

  // Fade out video
  video.classList.add("fade-out");
  await new Promise((r) => setTimeout(r, 400));

  // Keep last frame visible by pausing before source change
  video.pause();
  // Change source
  currentSrc = src;
  video.src = src;
  video.load();

  // Wait for new video to be ready
  await new Promise((r) => video.addEventListener("canplay", r, { once: true }));

  // Fade in video
  video.classList.remove("fade-out");
  video.classList.add("fade-in");
  video.play().catch(() => {});
  setTimeout(() => video.classList.remove("fade-in"), 400);
}

const choiceButtons = document.querySelectorAll(".btn[data-video]");
if (choiceButtons.length > 0) {
  choiceButtons.forEach((btn) => {
    btn.addEventListener("click", () => smoothSwitchTo(btn.dataset.video));
  });
}

// Replay button functionality
const replayBtn = document.getElementById("replayBtn");
if (replayBtn && video) {
  replayBtn.addEventListener("click", () => {
    const module = modules.find(m => m.id === currentModule);
    if (module) {
      smoothSwitchTo(module.intro);
      if (choiceOverlay) choiceOverlay.classList.remove("show");
    }
  });
}

// Initialize modules on page load
if (document.getElementById('moduleList')) {
  initModules();
}

// Certificate Page Functionality
function initCertificatePage() {
  const certificateDateElement = document.getElementById('certificateDate');
  const certificateForm = document.getElementById('certificateForm');
  
  // Only run if we're on the certificate page
  if (!certificateForm || !certificateDateElement) {
    return;
  }

  console.log('Certificate page initialized');

  // Set current date
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  certificateDateElement.textContent = `Date: ${dateString}`;

  // Handle form submission
  certificateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Form submitted');
    
    const userName = document.getElementById('userName').value.trim();
    console.log('User name:', userName);
    
    if (userName) {
      // Update certificate with user's name
      const recipientNameElement = document.getElementById('recipientName');
      if (recipientNameElement) {
        recipientNameElement.textContent = userName;
      }
      
      // Save to localStorage
      localStorage.setItem('certificateName', userName);
      localStorage.setItem('certificateDate', dateString);
      
      // Hide form and show certificate
      const nameInputSection = document.getElementById('nameInputSection');
      const certDisplay = document.getElementById('certificateDisplay');
      
      console.log('Showing certificate');
      if (nameInputSection) nameInputSection.style.display = 'none';
      if (certDisplay) {
        certDisplay.style.display = 'flex';
        certDisplay.classList.add('show');
      }
    }
  });

  // Check if user already generated a certificate
  const savedName = localStorage.getItem('certificateName');
  const savedDate = localStorage.getItem('certificateDate');
  
  const recipientName = document.getElementById('recipientName');
  if (savedName && recipientName) {
    recipientName.textContent = savedName;
    if (savedDate) {
      certificateDateElement.textContent = `Date: ${savedDate}`;
    }
  }
}

// Reset form function (for certificate page)
function resetForm() {
  const certificateDisplay = document.getElementById('certificateDisplay');
  const nameInputSection = document.getElementById('nameInputSection');
  const userName = document.getElementById('userName');
  
  if (certificateDisplay && nameInputSection) {
    certificateDisplay.style.display = 'none';
    certificateDisplay.classList.remove('show');
    nameInputSection.style.display = 'block';
    if (userName) {
      userName.value = '';
      userName.focus();
    }
  }
}

// Initialize certificate page when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertificatePage);
} else {
  initCertificatePage();
}