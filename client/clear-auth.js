// Clear Browser Storage Script
// Copy and paste this into browser console (F12) to clear all auth data

console.log('🧹 Clearing all authentication data...');

// Clear localStorage
localStorage.removeItem('token');
console.log('✅ Token removed from localStorage');

// Clear sessionStorage
sessionStorage.clear();
console.log('✅ Session storage cleared');

// Clear all cookies
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});
console.log('✅ Cookies cleared');

console.log('🎉 All cleared! Reload the page (Ctrl+R)');
console.log('You should now see Login/Signup buttons in the navbar.');
