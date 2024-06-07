'use strict';

// 缓存名称
const cacheName = 'mcisee-cache';
// 在线/离线起始页
const startPage = '/';
const offlinePage = '/';
// 预缓存项
const filesToCache = [startPage, offlinePage];
// 不缓存项 (比如: 动态页面)
const neverCacheUrls = ['/php/'];

// Install
// 初始化 Service Worker (以下简称 'sw')
self.addEventListener('install', function(e) {
    console.log('PWA Service Worker is installing.');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('PWA Service Worker is caching dependencies.');
            filesToCache.map(function(url) {
                return cache.add(url).catch(function (reason) {
                    return console.log(`PWA threw ${reason}. (url: ${url})`);
                });
            });
        })
    );
});

// Activate
// 激活 sw
self.addEventListener('activate', function(e) {
    console.log('PWA Service Worker is activating.');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {caches.delete(key);
                if ( key !== cacheName ) {
                    console.log(`PWA old caches are removed. (key: ${key})`);
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

    // Return if the request url is in neverCacheUrls.
    // 不缓存指定项目(最好开启)
    if ( ! neverCacheUrls.every(checkNeverCacheList, e.request.url) ) {
        console.log('PWA: The request url is excluded from caches.');
        return;
    };

    // Return if the request url protocal isn't HTTP or HTTPS.
    // 不缓存非 HTTP/HTTPS 协议的请求(建议禁用)
    if ( ! e.request.url.match(/^(http|https):\/\//i) )
    // return;

    // Return if the request url is from external domains.
    // 不缓存来自其它域名的请求(建议禁用)
    if ( new URL(e.request.url).origin !== location.origin )
    // return;

    // POST requests are not cached. Serve the offline page if offline.
    // 不缓存 POST 请求,如果离线则提供离线页(最好别动)
    if ( e.request.method !== 'GET' ) {
        e.respondWith(
            fetch(e.request).catch( function() {
                return caches.match(offlinePage);
            })
        );
        return;
    };

    // Strategies for speed
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
    };

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

// Check if the request url is in neverCacheUrls.
// 检测当前 url 是否存在于不缓存项
function checkNeverCacheList(url) {
    if ( this.match(url) ) {
        return false;
    };
    return true;
};
