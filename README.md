# CanvasGradeTracker

# Installation
```
git clone https://github.com/quin10b/CanvasGradeTracker.git
```
- Open up your chrome extention manager or go to this link: *chrome://extensions/*
- Select: *Load Unpacked*
- Locate the file and upload it
- After uploading, go to https://umd.instructure.com/ and enable the extention through extention shortcut in the chrome header. Your current course grades should show up on your course tabs.
- Verify the extention works through the console tab when opening up inspect element on the dashboard page. "Starting to add grades to UMD dashboard" should be in the console

# Approaches

Approach 1 (Web Scrapping):
  - const response = await fetch(`https://umd.instructure.com/courses/${courseId}/grades`);
  - let gradeElement = doc.querySelector('#submission_final-grade .grade');
  - After scrapping the grades page through querySelector, display the gradeElement content on the dashboard


Approach 2 (API):

    const response = await fetch(`/api/v1/users/${userId}/enrollments?per_page=50`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }


How To Test:
