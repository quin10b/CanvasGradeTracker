# CanvasGradeTracker

Approach 1 (Web Scrapping):
  -const response = await fetch(`https://umd.instructure.com/courses/${courseId}/grades`);
  - let gradeElement = doc.querySelector('#submission_final-grade .grade');
  - After scrapping the grades page through querySelector, display the gradeElement content on the dashboard


Approach 2 (API):

    const response = await fetch(`/api/v1/users/${userId}/enrollments?per_page=50`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
