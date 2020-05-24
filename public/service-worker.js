'use strict'

let cacheVersion = 3
let currentCache = {
  	offline: 'offline-cache' + cacheVersion
}
const offlineUrl = 'offline.html'

this.addEventListener('install', event => {
	event.waitUntil(
		caches.open(currentCache.offline).then((cache) => {
			return cache.addAll([
				'/styles/global.css',
				'/styles/error.css',
				'/scripts/prevent.js',
				'https://fonts.googleapis.com/css2?family=Righteous&display=swap',
				'/manifest.json',
				'https://assets.adcharity.tech/favicon.ico',
				offlineUrl
			])
		})
	)
})

this.addEventListener('fetch', event => {
	if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
		event.respondWith(
			fetch(event.request.url).catch(error => {
				return caches.match(offlineUrl)
			})
		)
	}
  	else{
        event.respondWith(caches.match(event.request)
        .then((response) => {
            return response || fetch(event.request)
        }))
    }
})
