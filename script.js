// Education Level Selection
let selectedEducationLevel = localStorage.getItem('educationLevel') || null;

// Initialize Education Selection Screen
function initEducationSelection() {
  const overlay = document.getElementById('educationSelectionOverlay');
  const options = document.querySelectorAll('.education-option');
  
  // If education level already selected, hide the overlay
  if (selectedEducationLevel) {
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 300);
  }
  
  // Add click handlers to education options
  options.forEach(option => {
    option.addEventListener('click', () => {
      const level = option.dataset.level;
      selectedEducationLevel = level;
      localStorage.setItem('educationLevel', level);
      
      // Hide the overlay with animation
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
      
      // Initialize the modules after selection
      initModulesAfterSelection();
    });
  });
}

// Initialize modules after education level selection
function initModulesAfterSelection() {
  // Reinitialize modules with new names
  updateModuleNames();
  if (document.getElementById('moduleList')) {
    initModules();
  }
  console.log('Education level selected:', selectedEducationLevel);
}

// Return to selection button functionality
function initReturnToSelectionButton() {
  const returnBtn = document.getElementById('returnToSelectionBtn');
  const overlay = document.getElementById('educationSelectionOverlay');
  
  if (returnBtn && overlay) {
    returnBtn.addEventListener('click', () => {
      // Clear the selected education level
      localStorage.removeItem('educationLevel');
      selectedEducationLevel = null;
      
      // Show the overlay again
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.classList.remove('hidden');
      }, 10);
    });
  }
}

// Module names based on education level
const moduleNamesByLevel = {
  'secondary': [
    "Module 1: Understanding My Body",
    "Module 2: Words Shape Culture",
    "Module 3: When Comments Hurt - What Do I Do?"
  ],
  'post-secondary': [
    "Module 1: Skin, Stress & Self-Perception",
    "Module 2: Comparison Trap",
    "Module 3: BodyTalk & Social Norms"
  ],
  'university': [
    "Module 1: Appearance & Identity",
    "Module 2: Expanding Identity",
    "Module 3: Be the Change"
  ]
};

// Module System with branching structure
let modules = [
  { id: 1, name: "Module 1: Understanding My Body", intro: "vid1", optionA: "vid2", optionB: "vid5" },
  { id: 2, name: "Module 2: Words Shape Culture", intro: "vid1", optionA: "vid2", optionB: "vid5" },
  { id: 3, name: "Module 3: When Comments Hurt - What Do I Do?", intro: "vid1", optionA: "vid2", optionB: "vid5" }
];

// Update module names based on selected education level
function updateModuleNames() {
  const level = selectedEducationLevel || 'secondary';
  const names = moduleNamesByLevel[level] || moduleNamesByLevel['secondary'];
  
  modules.forEach((module, index) => {
    if (names[index]) {
      module.name = names[index];
    }
  });
}

// Video mapping to YouTube video IDs
const videoUrls = {
  "vid1": "gVpbfk82Tzs",
  "vid2": "y-R1tQTxxwY",
  "vid3": "JKmgAYn1G38",
  "vid4": "sXdFA91WRYk",
  "vid5": "ppIBAn4gp_E"
};

// YouTube Player instance
let player = null;
let isYouTubeAPIReady = false;

// Video branching tree structure
const videoTree = {
  "vid1": { optionA: "vid2", optionB: "vid5" },
  "vid2": { optionA: "vid3", optionB: "vid4" },
  "vid3": null,
  "vid4": null,
  "vid5": null
};

// Scenario descriptions for each decision point
const scenarios = {
  "vid1": {
    title: "What would you do?",
    description: "Miya scrolls through TikTok and sees her feed full of filtered videos. She compares it to herself and gets self conscious about her pores. She decides to post a video of herself using a beauty filter. Should Miya post the video? ",
    optionAText: "Option A: Post Filtered Video",
    optionBText: "Option B: Post Natural Beauty",
    optionAOutcome: "Miya posted a filtered video and got many likes, but people started judging her appearance in real life.",
    optionBOutcome: "Miya posted her natural beauty and received genuine support from her friends and followers."
  },
  "vid2": {
    title: "The situation continues...",
    description: "After posting the edited photo, Miya received many likes and comments on TikTok. However, people who knows her starts judging her in real life. How should Miya respond?",
    optionAText: "Option A: Ignore and Continue Posting Filtered Video",
    optionBText: "Option B: Delete video and reject filters",
    optionAOutcome: "Miya continued with filters but felt increasingly disconnected from her true self and authentic relationships.",
    optionBOutcome: "Miya deleted the filtered content and embraced her natural appearance, gaining more authentic confidence."
  }
};

let currentModule = 1;
let videoHistory = [];
let currentSrc = "vid1";

// YouTube API ready callback (must be global for YouTube to call)
window.onYouTubeIframeAPIReady = function() {
  isYouTubeAPIReady = true;
  initPlayer(currentSrc);
};

// Initialize YouTube player
function initPlayer(vidId) {
  const videoId = videoUrls[vidId];
  
  if (player && player.loadVideoById) {
    player.loadVideoById(videoId);
  } else {
    player = new YT.Player('mainVideo', {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        fs: 0
      },
      events: {
        'onStateChange': onPlayerStateChange,
        'onReady': onPlayerReady
      }
    });
  }
}

// Handle when player is ready
function onPlayerReady(event) {
  event.target.playVideo();
}

// Handle player state changes
function onPlayerStateChange(event) {
  // YT.PlayerState.ENDED = 0
  if (event.data === YT.PlayerState.ENDED) {
    handleVideoEnd();
  }
}

// Get DOM elements
const choiceOverlay = document.getElementById("choiceOverlay");
const endOverlay = document.getElementById("endOverlay");
const endCard = document.getElementById("endCard");
const reflectionOverlay = document.getElementById("reflectionOverlay");
const reflectionForm = document.getElementById("reflectionForm");
const successMessage = document.getElementById("successMessage");
const closeReflectionBtn = document.getElementById("closeReflectionBtn");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");
const confidenceInput = document.getElementById("confidence");
const confidenceValue = document.getElementById("confidenceValue");

// Initialize module system
function initModules() {
  const completedModules = getCompletedModules();
  const moduleList = document.getElementById('moduleList');
  const progressIndicator = document.getElementById('progressIndicator');
  
  if (!moduleList || !progressIndicator) return;
  
  progressIndicator.textContent = `Completed ${completedModules.length}/3`;
  
  // Update certificate button state
  const certificateLink = document.getElementById('certificateLink');
  const certTooltip = document.getElementById('certTooltip');
  if (certificateLink) {
    if (completedModules.length === 3) {
      certificateLink.classList.remove('disabled');
      certificateLink.title = 'Get Your Certificate';
    } else {
      certificateLink.classList.add('disabled');
      certificateLink.title = '';
      if (certTooltip) {
        certTooltip.textContent = `Complete all 3 modules to unlock (${completedModules.length}/3)`;
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

if (sidebarToggle && sidebar) {
  if (window.innerWidth <= 768) {
    sidebar.classList.add('collapsed');
    sidebarToggle.style.left = '0';
  }
  
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const icon = sidebarToggle.querySelector('.toggle-icon');
    icon.textContent = sidebar.classList.contains('collapsed') ? '☰' : '×';
    
    const isMobile = window.innerWidth <= 768;
    const sidebarWidth = isMobile ? '280px' : '320px';
    
    if (sidebar.classList.contains('collapsed')) {
      sidebarToggle.style.left = '0';
    } else {
      sidebarToggle.style.left = sidebarWidth;
    }
  });
  
  window.addEventListener('resize', () => {
    if (!sidebar.classList.contains('collapsed')) {
      const isMobile = window.innerWidth <= 768;
      sidebarToggle.style.left = isMobile ? '280px' : '320px';
    }
  });
}

function getCompletedModules() {
  const completed = localStorage.getItem('completedModules');
  return completed ? JSON.parse(completed) : [];
}

function completeModule(moduleId) {
  const completed = getCompletedModules();
  if (!completed.includes(moduleId)) {
    completed.push(moduleId);
    localStorage.setItem('completedModules', JSON.stringify(completed));
    
    if (moduleId < modules.length) {
      setTimeout(() => {
        showModuleUnlockedNotification(moduleId + 1);
      }, 1500);
    }
  }
  initModules();
}

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
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function switchToModule(moduleId) {
  currentModule = moduleId;
  const module = modules.find(m => m.id === moduleId);
  
  document.getElementById('moduleTitle').textContent = module.name;
  
  currentSrc = module.intro;
  
  loadVideo(currentSrc);
  
  videoHistory = [];
  
  if (choiceOverlay) choiceOverlay.classList.remove('show');
  if (endOverlay) endOverlay.classList.remove('show');
  closeReflection();
  
  const buttons = document.querySelectorAll('.btn[data-video]');
  if (buttons.length >= 2) {
    buttons[0].dataset.video = module.optionA;
    buttons[1].dataset.video = module.optionB;
  }
  
  updateGoBackButton();
  initModules();
}

// Load video using YouTube Player API
function loadVideo(vidId) {
  currentSrc = vidId;
  
  if (player && player.loadVideoById) {
    player.loadVideoById(videoUrls[vidId]);
  } else {
    initPlayer(vidId);
  }
}

// Handle when video "ends" (timer completes)
function handleVideoEnd() {
  const choices = videoTree[currentSrc];
  
  if (choices) {
    // Show choices overlay directly
    updateChoiceButtons(choices.optionA, choices.optionB);
    updateScenarioText(currentSrc);
    updateGoBackButton();
    if (choiceOverlay) choiceOverlay.classList.add("show");
  } else {
    renderEndScreen();
    if (endOverlay) endOverlay.classList.add('show');
  }
}

function generatePathSummary() {
  const fullPath = [...videoHistory, currentSrc];
  let summaryHTML = '<div style="margin: 20px 0; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">';
  summaryHTML += '<h3 style="color: #5a67d8; margin-bottom: 15px;">Your Journey Summary</h3>';
  
  fullPath.forEach((videoId, index) => {
    const scenario = scenarios[videoId];
    if (scenario && index < fullPath.length - 1) {
      const nextVideo = fullPath[index + 1];
      const choices = videoTree[videoId];
      let outcome = '';
      
      if (choices) {
        if (choices.optionA === nextVideo) {
          outcome = scenario.optionAOutcome || scenario.optionAText || 'Option A';
        } else if (choices.optionB === nextVideo) {
          outcome = scenario.optionBOutcome || scenario.optionBText || 'Option B';
        }
      }
      
      summaryHTML += `
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #5a67d8;">
          <div style="font-weight: 600; margin-bottom: 5px; color: #1f2937;">${scenario.title}</div>
          <div style="font-size: 0.9em; margin-bottom: 8px; color: #6b7280;">${scenario.description}</div>
          <div style="color: #dc2626; font-weight: 500;">📌 Outcome: ${outcome}</div>
        </div>
      `;
    }
  });
  
  summaryHTML += '</div>';
  return summaryHTML;
}

function renderEndScreen() {
  if (!endCard) return;
  const summary = generatePathSummary();
  
  endCard.innerHTML = `
    <h2>THE END</h2>
    ${summary}
    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 20px;">
      <button id="rewatchModuleBtn" class="btn btn-primary">Rewatch Module</button>
      <button id="showReflectionBtn" class="btn btn-reflection">Share Your Reflection</button>
    </div>
  `;

  const rewatchModuleBtn = document.getElementById("rewatchModuleBtn");
  if (rewatchModuleBtn) {
    rewatchModuleBtn.addEventListener("click", () => {
      if (endOverlay) endOverlay.classList.remove('show');
      switchToModule(currentModule);
    });
  }

  const showReflectionBtn = document.getElementById("showReflectionBtn");
  if (showReflectionBtn) {
    showReflectionBtn.addEventListener("click", openReflection);
  }
}

function openReflection() {
  if (!reflectionOverlay || !reflectionForm || !successMessage) return;
  reflectionOverlay.classList.add("show");
  reflectionForm.style.display = "block";
  successMessage.style.display = "none";
  
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

if (confidenceInput && confidenceValue) {
  confidenceInput.addEventListener("input", (e) => {
    confidenceValue.textContent = e.target.value;
  });
}

if (reflectionForm) {
  reflectionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
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
    
    const existingData = localStorage.getItem('reflectionSubmissions');
    const submissions = existingData ? JSON.parse(existingData) : [];
    submissions.push(formData);
    localStorage.setItem('reflectionSubmissions', JSON.stringify(submissions));
    
    completeModule(currentModule);
    
    if (reflectionForm && successMessage) {
      reflectionForm.style.display = "none";
      successMessage.style.display = "block";
    }
  });
}

if (closeReflectionBtn) closeReflectionBtn.addEventListener("click", closeReflection);
if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeReflection);

function updateChoiceButtons(optionA, optionB) {
  const choiceButtons = document.querySelectorAll(".btn[data-video]");
  if (choiceButtons.length >= 2) {
    choiceButtons[0].setAttribute('data-video', optionA);
    choiceButtons[1].setAttribute('data-video', optionB);
    
    const scenario = scenarios[currentSrc];
    if (scenario) {
      choiceButtons[0].textContent = scenario.optionAText || "Option A";
      choiceButtons[1].textContent = scenario.optionBText || "Option B";
    }
  }
}

function updateScenarioText(videoSrc) {
  const scenario = scenarios[videoSrc];
  const titleElement = document.getElementById('choiceTitle');
  const descriptionElement = document.getElementById('choiceDescription');
  
  if (scenario && titleElement && descriptionElement) {
    titleElement.textContent = scenario.title;
    descriptionElement.textContent = scenario.description;
  }
}

function updateGoBackButton() {
  const goBackBtn = document.getElementById('goBackBtn');
  if (goBackBtn) {
    goBackBtn.style.display = videoHistory.length > 0 ? 'inline-block' : 'none';
  }
}

function switchTo(src, addToHistory = true) {
  if (!choiceOverlay) return;
  
  if (addToHistory && currentSrc) {
    videoHistory.push(currentSrc);
  }
  
  if (choiceOverlay) choiceOverlay.classList.remove("show");
  if (endOverlay) endOverlay.classList.remove("show");
  
  loadVideo(src);
  updateGoBackButton();
}

if (choiceOverlay) {
  choiceOverlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn") && e.target.dataset.video) {
      switchTo(e.target.dataset.video);
    }
  });
}

// Replay button functionality  
const replayBtn = document.getElementById("replayBtn");
if (replayBtn) {
  replayBtn.addEventListener("click", () => {
    if (choiceOverlay) choiceOverlay.classList.remove("show");
    loadVideo(currentSrc);
  });
}

// Go back button functionality
const goBackBtn = document.getElementById("goBackBtn");
if (goBackBtn) {
  goBackBtn.addEventListener("click", () => {
    if (videoHistory.length > 0) {
      const previousVideo = videoHistory.pop();
      switchTo(previousVideo, false);
    }
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Initialize education level selection first
  initEducationSelection();
  
  // Initialize return to selection button
  initReturnToSelectionButton();
  
  // Update module names based on selected education level
  updateModuleNames();
  
  const module = modules.find(m => m.id === currentModule);
  if (module) {
    updateChoiceButtons(module.optionA, module.optionB);
    updateScenarioText(module.intro);
    updateGoBackButton();
  }
  
  if (document.getElementById('moduleList')) {
    initModules();
  }
  
  // Check if YouTube API is already loaded
  if (typeof YT !== 'undefined' && YT.Player) {
    isYouTubeAPIReady = true;
    initPlayer(currentSrc);
  }
  // Otherwise, onYouTubeIframeAPIReady will be called when ready
});

// Certificate Page Functionality
function initCertificatePage() {
  const certificateDateElement = document.getElementById('certificateDate');
  const certificateForm = document.getElementById('certificateForm');
  
  if (!certificateForm || !certificateDateElement) return;

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  certificateDateElement.textContent = `Date: ${dateString}`;

  certificateForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value.trim();
    
    if (userName) {
      const recipientNameElement = document.getElementById('recipientName');
      if (recipientNameElement) {
        recipientNameElement.textContent = userName;
      }
      
      localStorage.setItem('certificateName', userName);
      localStorage.setItem('certificateDate', dateString);
      
      const nameInputSection = document.getElementById('nameInputSection');
      const certDisplay = document.getElementById('certificateDisplay');
      
      if (nameInputSection) nameInputSection.style.display = 'none';
      if (certDisplay) {
        certDisplay.style.display = 'flex';
        certDisplay.classList.add('show');
      }
    }
  });
}

if (document.getElementById('certificateForm')) {
  initCertificatePage();
}
