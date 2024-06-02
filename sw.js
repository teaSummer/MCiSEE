"use strict";

// 缓存名
const cacheName = "mcic-cache";
// 在线/离线起始页
const startPage = "/";
const offlinePage = "/";
// 预缓存项
const filesToCache = [startPage, offlinePage];
// 不缓存项 (比如: 动态页面)
const neverCacheUrls = ["/php/"];

// Install
// 初始化 service worker (以下简称"sw")
self.addEventListener('install', function(e) {
	console.log('PWA service worker installation');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('PWA service worker caching dependencies');
			filesToCache.map(function(url) {
				return cache.add(url).catch(function (reason) {
					return console.log('PWA: ' + String(reason) + ' ' + url);
				});
			});
		})
	);
});

// Activate
// 激活 sw
self.addEventListener('activate', function(e) {
	console.log('PWA service worker activation');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if ( key !== cacheName ) {
					console.log('PWA old cache removed', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

// Fetch
// 缓存配置
self.addEventListener('fetch', function(e) {
	
	// Return if the current request url is in the never cache list
	// 不缓存设定的的项目(最好开启)
	if ( ! neverCacheUrls.every(checkNeverCacheList, e.request.url) ) {
		console.log( 'PWA: Current request is excluded from cache.' );
		return;
	}
	
	// Return if request url protocal isn't http or https
	// 不缓存非 http/https 协议的请求(建议禁用)
	if ( ! e.request.url.match(/^(http|https):\/\//i) )
		// return;
	
	// Return if request url is from an external domain.
	// 不缓存来自其他域名的请求(建议禁用)
	if ( new URL(e.request.url).origin !== location.origin )
		// return;
	
	// For POST requests, do not use the cache. Serve offline page if offline.
	// 不缓存 post 请求,如果离线则提供离线页(最好别动)
	if ( e.request.method !== 'GET' ) {
		e.respondWith(
			fetch(e.request).catch( function() {
				return caches.match(offlinePage);
			})
		);
		return;
	}
	
	// Revving strategy
	if ( e.request.mode === 'navigate' && navigator.onLine ) {
		e.respondWith(
			fetch(e.request).then(function(response) {
				return caches.open(cacheName).then(function(cache) {
					cache.put(e.request, response.clone());
					return response;
				});
			})
		);
		return;
	}

	e.respondWith(
		caches.match(e.request).then(function(response) {
			return response || fetch(e.request).then(function(response) {
				return caches.open(cacheName).then(function(cache) {
					cache.put(e.request, response.clone());
					return response;
				});
			});
		}).catch(function() {
			return caches.match(offlinePage);
		})
	);
});

// Check if current url is in the neverCacheUrls list
// 检测当前 url 是否在不缓存项
function checkNeverCacheList(url) {
	if ( this.match(url) ) {
		return false;
	}
	return true;
}
