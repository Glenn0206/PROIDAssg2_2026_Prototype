const INTRO = "Videos/vid1.mp4";

const video = document.getElementById("mainVideo");
const choiceOverlay = document.getElementById("choiceOverlay");
const endOverlay = document.getElementById("endOverlay");
const endCard = document.getElementById("endCard");

const reviewModal = document.getElementById("reviewModal");
const reviewText = document.getElementById("reviewText");
const closeReviewBtn = document.getElementById("closeReviewBtn");

let currentSrc = INTRO;

function renderEndScreen() {
  endCard.innerHTML = `
    <h2>THE END</h2>
    <button id="showReviewBtn" class="btn">Show Review</button>
  `;

  document.getElementById("showReviewBtn").addEventListener("click", openReview);
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