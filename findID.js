function getCurrentUserId() {
  
    const scripts = document.querySelectorAll('script');
    let userId = null;
    
    for (const script of scripts) {
      const content = script.textContent || '';
      const match = content.match(/ENV\s*=\s*.*"current_user_id"\s*:\s*"?(\d+)"?/);
      if (match && match[1]) {
        userId = match[1];
        break;
      }
    }
    
    if (userId) {  
      return userId;
    }
    
    return null;
  }

  window.getCurrentUserId = getCurrentUserId;

