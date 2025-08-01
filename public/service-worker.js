self.addEventListener('install', event => {
    console.log('Service worker installing...');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', event => {
    console.log('Service worker activating...');
  });
  
  self.addEventListener('fetch', event => {
  });
  