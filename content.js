console.log('UMD Canvas Grade Extension is running!');

async function fetchGradeForCourse(courseId) {
  console.log(`Fetching grade for UMD course ${courseId}`);
  try {
    const response = await fetch(`https://umd.instructure.com/courses/${courseId}/grades`);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    const userId = getCurrentUserId();

    if (!userId) {
      console.error('Could not determine current user ID');
      return {};
    }
    else{
      console.log('Found user ID:', userId);
    }
    
    
    // Try multiple potential selectors
    let gradeElement = doc.querySelector('#submission_final-grade .grade');

    
    if (!gradeElement) {
      console.log('First selector failed, trying alternative selectors');
    }
  
    
    // Debug what we're seeing in the document
    console.log('Document title:', doc.title);
    const finalGradeSection = doc.querySelector('#submission_final-grade');
    console.log('Final grade section found:', !!finalGradeSection);
    
    if (gradeElement) {
      const grade = gradeElement.textContent.trim();
      console.log(`Found grade: ${grade} for course ${courseId}`);
      return grade;
    } else {
      console.log(`No grade element found for course ${courseId}`);
      // Log some of the document to help debug
      console.log('HTML snippet:', doc.body.innerHTML.substring(0, 500));
      return 'N/A';
    }
  } catch (error) {
    console.error(`Error fetching grade for course ${courseId}:`, error);
    return 'Error';
  }
}

function addGradesToDashboard() {
  if (!window.location.hostname.includes('umd.instructure.com')) {
    console.log('Not on UMD Canvas - extension inactive');
    return;
  }

  console.log('Starting to add grades to UMD dashboard');
  
  // Wait a moment for potential dynamic content to load
  setTimeout(() => {
    const courseCards = document.querySelectorAll('.ic-DashboardCard');
    console.log(`Found ${courseCards.length} UMD course cards`);
    
    if (courseCards.length === 0) {
      console.log('No course cards found. The selector might be incorrect or the page structure has changed.');
      // Try alternative selectors
      const altCards = document.querySelectorAll('[data-testid="DashboardCard"], .dashboard-card');
      console.log(`Found ${altCards.length} cards with alternative selector`);
      if (altCards.length > 0) {
        processCards(altCards);
      }
    } else {
      processCards(courseCards);
    }
  }, 1000); // 1 second delay
}

async function processCards(courseCards) {
  for (const card of courseCards) {
    const courseLink = card.querySelector('.ic-DashboardCard__link, a[href*="/courses/"]');
    if (!courseLink) {
      console.log('No course link found for card');
      continue;
    }
    
    const courseUrl = courseLink.href;
    const courseId = courseUrl.match(/courses\/(\d+)/)?.[1];
    if (!courseId) {
      console.log('Could not extract course ID from URL:', courseUrl);
      continue;
    }
    
    console.log(`Processing UMD course ID: ${courseId}`);
    const grade = await fetchGradeForCourse(courseId);
    
    // Display grade for debugging, even N/A
    console.log(`Grade result for ${courseId}: ${grade}`);
    
    // Create grade display regardless of N/A or Error for testing
    const gradeDisplay = document.createElement('div');
    gradeDisplay.className = 'umd-grade-display';
    gradeDisplay.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
      z-index: 100;
    `;
    gradeDisplay.textContent = grade;
    
    const cardHeader = card.querySelector('.ic-DashboardCard__header') || card;
    if (cardHeader) {
      cardHeader.style.position = 'relative';
      cardHeader.appendChild(gradeDisplay);
      console.log(`Added grade display for UMD course ${courseId}`);
    } else {
      console.log(`Could not find header for course ${courseId}`);
    }
  }
}

// Run when the page loads with a slight delay
if (document.readyState === 'loading') {
  console.log('UMD Canvas page loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', () => setTimeout(addGradesToDashboard, 500));
} else {
  console.log('UMD Canvas page loaded, running with delay');
  setTimeout(addGradesToDashboard, 500);
}

// Add styles with UMD theme
const styles = document.createElement('style');
styles.textContent = `
  .umd-grade-display {
    font-size: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease;
  }
  
  .umd-grade-display:hover {
    background: rgb(200, 0, 0) !important;
    transform: scale(1.05);
  }
`;
document.head.appendChild(styles);