const INTRO = "Videos/vid1.mp4";

const video = document.getElementById("mainVideo");
const choiceOverlay = document.getElementById("choiceOverlay");
const endOverlay = document.getElementById("endOverlay");
const endCard = document.getElementById("endCard");

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
  endCard.innerHTML = `
    <h2>THE END</h2>
    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <button id="showReviewBtn" class="btn">Show Review</button>
      <button id="showReflectionBtn" class="btn btn-reflection">Share Your Reflection</button>
      <a href="dashboard.html" class="btn btn-dashboard">View Dashboard</a>
    </div>
  `;

  document.getElementById("showReviewBtn").addEventListener("click", openReview);
  document.getElementById("showReflectionBtn").addEventListener("click", openReflection);
}

function openReview() {
  reviewText.textContent =
    "Students complete pre, mid, and post program mini surveys to track changes in body confidence and self-esteem";

  reviewModal.classList.add("show");
  reviewModal.setAttribute("aria-hidden", "false");
}

function closeReview() {
  reviewModal.classList.remove("show");
  reviewModal.setAttribute("aria-hidden", "true");
}

closeReviewBtn.addEventListener("click", closeReview);

// click outside modal card to close
reviewModal.addEventListener("click", (e) => {
  if (e.target === reviewModal) closeReview();
});

// Reflection form functions
function openReflection() {
  reflectionOverlay.classList.add("show");
  reflectionForm.style.display = "block";
  successMessage.style.display = "none";
}

function closeReflection() {
  reflectionOverlay.classList.remove("show");
  reflectionForm.reset();
  confidenceValue.textContent = "5";
}

// Update confidence slider value display
confidenceInput.addEventListener("input", (e) => {
  confidenceValue.textContent = e.target.value;
});

// Handle form submission
reflectionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  // Collect form data
  const formData = {
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
  
  // Show success message
  reflectionForm.style.display = "none";
  successMessage.style.display = "block";
});

// Close reflection form
closeReflectionBtn.addEventListener("click", closeReflection);
closeSuccessBtn.addEventListener("click", closeReflection);

// Click outside to close
reflectionOverlay.addEventListener("click", (e) => {
  if (e.target === reflectionOverlay) closeReflection();
});

video.addEventListener("ended", () => {
  if (currentSrc === INTRO) {
    choiceOverlay.classList.add("show");
  } else {
    choiceOverlay.classList.remove("show");
    renderEndScreen();
    endOverlay.classList.add("show");

    // freeze last frame behind overlay
    try {
      video.pause();
      video.currentTime = Math.max(0, video.duration - 0.05);
    } catch {}
    
    // Automatically show reflection form after 2 seconds
    setTimeout(() => {
      openReflection();
    }, 2000);
  }
});

async function smoothSwitchTo(src) {
  choiceOverlay.classList.remove("show");
  endOverlay.classList.remove("show");
  closeReview();

  video.classList.add("fade-out");
  await new Promise((r) => setTimeout(r, 500));

  currentSrc = src;
  video.src = src;
  video.load();

  await new Promise((r) => video.addEventListener("canplay", r, { once: true }));

  video.classList.remove("fade-out");
  video.play().catch(() => {});
}

document.querySelectorAll(".btn[data-video]").forEach((btn) => {
  btn.addEventListener("click", () => smoothSwitchTo(btn.dataset.video));
});