// Service Worker for Progressive Web App
// Enables offline functionality and caching for the Kids Learning Platform

const CACHE_NAME = 'kids-learning-pwa-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/app.js',
  '/js/curriculum.js',
  '/js/progress.js',
  '/data/weeks-data.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete, skipping waiting');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response
          console.log('[Service Worker] Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetchAndCache(event.request);
      })
      .catch((error) => {
        console.error('[Service Worker] Fetch failed:', error);
        
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      })
  );
});

// Fetch from network and cache the response
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    
    // Don't cache non-successful responses
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }
    
    // Clone the response
    const responseToCache = response.clone();
    
    caches.open(CACHE_NAME)
      .then((cache) => {
        cache.put(request, responseToCache);
      });
    
    return response;
  } catch (error) {
    console.error('[Service Worker] Network request failed:', error);
    throw error;
  }
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName);
      });
    });
  }
});

// Background sync for when connection is restored (optional feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(
      // Sync progress data when online
      console.log('[Service Worker] Background sync triggered')
    );
  }
});

console.log('[Service Worker] Service Worker file loaded');
