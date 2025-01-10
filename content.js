console.log('UMD Canvas Grade Extension is running!');

async function fetchGradeForCourse(courseId) {
  console.log(`Fetching grade for UMD course ${courseId}`);
  try {
    const response = await fetch(`https://umd.instructure.com/courses/${courseId}/grades`);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // Use the exact selector structure from UMD Canvas
    const gradeElement = document.querySelector('#submission_final-grade.student_assignment.hard_coded.final_grade .score_holder .tooltip .grade');
    
    if (gradeElement) {
      const grade = gradeElement.textContent.trim();
      console.log(`Found grade: ${grade} for course ${courseId}`);
      return grade;
    } else {
      console.log(`No grade element found for course ${courseId}`);
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
  const courseCards = document.querySelectorAll('.ic-DashboardCard');
  console.log(`Found ${courseCards.length} UMD course cards`);
  
  courseCards.forEach(async (card) => {
    const courseLink = card.querySelector('.ic-DashboardCard__link');
    if (!courseLink) {
      console.log('No course link found for card');
      return;
    }
    
    const courseUrl = courseLink.href;
    const courseId = courseUrl.match(/courses\/(\d+)/)?.[1];
    if (!courseId) {
      console.log('Could not extract course ID from URL:', courseUrl);
      return;
    }
    
    console.log(`Processing UMD course ID: ${courseId}`);
    const grade = await fetchGradeForCourse(courseId);
    
    // Only create grade display if we actually found a grade
    if (grade !== 'N/A' && grade !== 'Error') {
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
        z-index: 1;
      `;
      gradeDisplay.textContent = grade;
      
      const cardHeader = card.querySelector('.ic-DashboardCard__header');
      if (cardHeader) {
        cardHeader.style.position = 'relative';
        cardHeader.appendChild(gradeDisplay);
        console.log(`Added grade display for UMD course ${courseId}`);
      }
    }
  });
}

// Run when the page loads
if (document.readyState === 'loading') {
  console.log('UMD Canvas page loading, waiting for DOMContentLoaded');
  document.addEventListener('DOMContentLoaded', addGradesToDashboard);
} else {
  console.log('UMD Canvas page loaded, running immediately');
  addGradesToDashboard();
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