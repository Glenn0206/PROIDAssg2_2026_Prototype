// Dashboard JavaScript
const submissionsContainer = document.getElementById('submissionsContainer');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const emotionFilter = document.getElementById('emotionFilter');
const clearAllBtn = document.getElementById('clearAllBtn');
const exportBtn = document.getElementById('exportBtn');

// Stats elements
const totalSubmissionsEl = document.getElementById('totalSubmissions');
const avgConfidenceEl = document.getElementById('avgConfidence');
const mostCommonEmotionEl = document.getElementById('mostCommonEmotion');

let allSubmissions = [];

// Load submissions from localStorage
function loadSubmissions() {
  const stored = localStorage.getItem('reflectionSubmissions');
  allSubmissions = stored ? JSON.parse(stored) : [];
  updateStats();
  displaySubmissions(allSubmissions);
}

// Update statistics
function updateStats() {
  const total = allSubmissions.length;
  totalSubmissionsEl.textContent = total;

  if (total === 0) {
    avgConfidenceEl.textContent = '0';
    mostCommonEmotionEl.textContent = '-';
    return;
  }

  // Calculate average confidence
  const totalConfidence = allSubmissions.reduce((sum, sub) => sum + parseInt(sub.confidence), 0);
  const avgConfidence = (totalConfidence / total).toFixed(1);
  avgConfidenceEl.textContent = avgConfidence;

  // Find most common emotion
  const emotionCounts = {};
  allSubmissions.forEach(sub => {
    emotionCounts[sub.emotionalResponse] = (emotionCounts[sub.emotionalResponse] || 0) + 1;
  });
  
  const mostCommon = Object.keys(emotionCounts).reduce((a, b) => 
    emotionCounts[a] > emotionCounts[b] ? a : b
  );
  
  mostCommonEmotionEl.textContent = mostCommon.charAt(0).toUpperCase() + mostCommon.slice(1);
}

// Display submissions
function displaySubmissions(submissions) {
  if (submissions.length === 0) {
    submissionsContainer.innerHTML = '';
    emptyState.classList.add('show');
    return;
  }

  emptyState.classList.remove('show');
  
  submissionsContainer.innerHTML = submissions.map((submission, index) => {
    const date = new Date(submission.timestamp);
    const formattedDate = date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div class="submission-card" data-index="${index}">
        <div class="submission-header">
          <div>
            <div class="submission-name">${escapeHtml(submission.studentName)}</div>
            <div class="submission-date">${formattedDate}</div>
          </div>
          <button class="delete-btn" onclick="deleteSubmission(${index})" title="Delete">×</button>
        </div>

        <div class="submission-details">
          <div class="detail-row">
            <div class="detail-label">Main Takeaway</div>
            <div class="detail-value">${escapeHtml(submission.mainTakeaway)}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Emotional Response</div>
            <div class="detail-value">
              <span class="emotion-badge emotion-${submission.emotionalResponse}">
                ${submission.emotionalResponse}
              </span>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Confidence Level: ${submission.confidence}/10</div>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${submission.confidence * 10}%"></div>
            </div>
          </div>

          ${submission.additionalComments ? `
            <div class="detail-row">
              <div class="detail-label">Additional Comments</div>
              <div class="detail-value">${escapeHtml(submission.additionalComments)}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

// Filter and search submissions
function filterSubmissions() {
  const searchTerm = searchInput.value.toLowerCase();
  const emotionFilterValue = emotionFilter.value;

  let filtered = allSubmissions;

  // Filter by emotion
  if (emotionFilterValue) {
    filtered = filtered.filter(sub => sub.emotionalResponse === emotionFilterValue);
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(sub => 
      sub.studentName.toLowerCase().includes(searchTerm) ||
      sub.mainTakeaway.toLowerCase().includes(searchTerm) ||
      (sub.additionalComments && sub.additionalComments.toLowerCase().includes(searchTerm))
    );
  }

  displaySubmissions(filtered);
}

// Delete a submission
function deleteSubmission(index) {
  if (confirm('Are you sure you want to delete this reflection?')) {
    allSubmissions.splice(index, 1);
    localStorage.setItem('reflectionSubmissions', JSON.stringify(allSubmissions));
    loadSubmissions();
  }
}

// Clear all data
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete ALL reflections? This action cannot be undone.')) {
    if (confirm('This will permanently delete all data. Are you absolutely sure?')) {
      localStorage.removeItem('reflectionSubmissions');
      allSubmissions = [];
      loadSubmissions();
    }
  }
});

// Export data as CSV
exportBtn.addEventListener('click', () => {
  if (allSubmissions.length === 0) {
    alert('No data to export!');
    return;
  }

  const headers = ['Name', 'Date', 'Main Takeaway', 'Emotion', 'Confidence', 'Additional Comments'];
  const csvContent = [
    headers.join(','),
    ...allSubmissions.map(sub => {
      const date = new Date(sub.timestamp).toLocaleString();
      return [
        `"${sub.studentName}"`,
        `"${date}"`,
        `"${sub.mainTakeaway.replace(/"/g, '""')}"`,
        sub.emotionalResponse,
        sub.confidence,
        `"${(sub.additionalComments || '').replace(/"/g, '""')}"`
      ].join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `reflections_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event listeners
searchInput.addEventListener('input', filterSubmissions);
emotionFilter.addEventListener('change', filterSubmissions);

// Initial load
loadSubmissions();

// Auto-refresh every 5 seconds to show new submissions
setInterval(() => {
  const currentSearch = searchInput.value;
  const currentFilter = emotionFilter.value;
  
  loadSubmissions();
  
  // Reapply filters if they were active
  if (currentSearch || currentFilter) {
    filterSubmissions();
  }
}, 5000);
