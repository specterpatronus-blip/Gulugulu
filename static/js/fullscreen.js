// =============================================================
//  GULUGULU  –  Fullscreen + SPA Router  (v5 - Performance)
// =============================================================

// ── Fullscreen helpers ────────────────────────────────────────
function requestFullscreen() {
    var el = document.documentElement;
    var isFull = document.fullscreenElement || document.webkitFullscreenElement ||
                 document.mozFullScreenElement || document.msFullscreenElement;
    if (isFull) return; // Already full

    var fn = el.requestFullscreen || el.mozRequestFullScreen ||
             el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (fn) {
        fn.call(el).catch(function() {});
    }
}

function exitFullscreen() {
    var fn = document.exitFullscreen || document.mozCancelFullScreen ||
             document.webkitExitFullscreen || document.msExitFullscreen;
    if (fn) fn.call(document);
}

function toggleFullScreen() {
    var isFull = document.fullscreenElement || document.webkitFullscreenElement ||
                 document.mozFullScreenElement || document.msFullscreenElement;
    if (!isFull) {
        requestFullscreen();
        localStorage.setItem('gulu_fullscreen_pref', 'true');
    } else {
        exitFullscreen();
        localStorage.setItem('gulu_fullscreen_pref', 'false');
    }
}

function updateFullscreenIcon() {
    var icon = document.getElementById('fullscreenIcon');
    var text = document.getElementById('fullscreenText');
    var isFull = document.fullscreenElement || document.webkitFullscreenElement ||
                 document.mozFullScreenElement || document.msFullscreenElement;
    if (isFull) {
        if (icon) icon.textContent = 'fullscreen_exit';
        if (text) text.textContent = 'Salir Pantalla Completa';
        localStorage.setItem('gulu_fullscreen_pref', 'true');
    } else {
        if (icon) icon.textContent = 'fullscreen';
        if (text) text.textContent = 'Pantalla Completa';
        localStorage.setItem('gulu_fullscreen_pref', 'false');
    }
}

['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
    .forEach(function(e) { document.addEventListener(e, updateFullscreenIcon); });

// ── Vue instance registry ─────────────────────────────────────
var _guluVueApp = null;

function _destroyVueApp() {
    if (_guluVueApp) {
        try { _guluVueApp.unmount(); } catch (e) {}
        _guluVueApp = null;
    }
}

// Pages that use Vue — we handle them via SPA but ensure cleanup
var VUE_PATHS = ['/juego/']; 

function _isVuePage(url) {
    try {
        var path = new URL(url, window.location.origin).pathname;
        return VUE_PATHS.some(function(p) { return path.indexOf(p) !== -1; });
    } catch (e) { return false; }
}

function _isSameOrigin(url) {
    try {
        return new URL(url, window.location.origin).origin === window.location.origin;
    } catch (e) { return false; }
}

var isNavigating = false;

// ── SPA navigation core (v6 - Fullscreen Persistent) ─────────
async function navigateSpa(url, push) {
    if (isNavigating) return;
    if (push === undefined) push = true;

    try {
        isNavigating = true;
        document.body.style.cursor = 'wait';
        _destroyVueApp();
        
        var response = await fetch(url);
        if (!response.ok) throw new Error('Network error ' + response.status);
        var html = await response.text();

        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        if (doc.title) document.title = doc.title;

        // ── Clean old page-specific styles, add new ones ─────
        var oldDynStyles = document.head.querySelectorAll('style[data-spa]');
        oldDynStyles.forEach(function(s) { s.remove(); });

        var newStyles = doc.querySelectorAll('style');
        newStyles.forEach(function(ns) {
            var node = document.createElement('style');
            node.setAttribute('data-spa', 'true');
            node.innerHTML = ns.innerHTML;
            document.head.appendChild(node);
        });

        // ── Sync <head> scripts ──────────────────────────────
        var currentHeadScripts = Array.from(document.head.querySelectorAll('script'));
        var newHeadScripts = Array.from(doc.head.querySelectorAll('script'));
        
        for (var i = 0; i < newHeadScripts.length; i++) {
            var old = newHeadScripts[i];
            if (old.src) {
                var absoluteSrc = new URL(old.getAttribute('src'), window.location.origin).href;
                var exists = currentHeadScripts.some(function(s) {
                    return s.src === absoluteSrc && !s.getAttribute('data-reload');
                });
                if (!exists) {
                    var fresh = document.createElement('script');
                    Array.from(old.attributes).forEach(function(attr) {
                        fresh.setAttribute(attr.name, attr.value);
                    });
                    await new Promise(function(resolve) {
                        fresh.onload = resolve;
                        fresh.onerror = resolve;
                        document.head.appendChild(fresh);
                    });
                }
            }
        }

        // ── Replace body (FOUC-free) ─────────────────────────
        var bodyContent = doc.body.innerHTML;
        var bodyClass = doc.body.className;

        await new Promise(function(resolve) {
            requestAnimationFrame(function() {
                document.body.className = bodyClass;
                document.body.innerHTML = bodyContent;
                resolve();
            });
        });

        // ── Re-execute body scripts (IN ORDER) ────────────────
        var bodyScripts = Array.from(document.body.querySelectorAll('script'));
        for (var i = 0; i < bodyScripts.length; i++) {
            var old = bodyScripts[i];
            var fresh = document.createElement('script');
            
            // Copy all attributes
            Array.from(old.attributes).forEach(function(attr) {
                fresh.setAttribute(attr.name, attr.value);
            });

            if (old.src) {
                // External script: wait for it to load to maintain order
                await new Promise(function(resolve) {
                    fresh.onload = resolve;
                    fresh.onerror = function() {
                        console.error("Failed to load script:", fresh.src);
                        resolve();
                    };
                    old.parentNode.replaceChild(fresh, old);
                });
            } else {
                // Inline script: execute immediately
                fresh.textContent = old.textContent;
                old.parentNode.replaceChild(fresh, old);
            }
        }

        if (push) window.history.pushState({}, '', url);

        updateFullscreenIcon();
        
        // Persistent Fullscreen: If pref is true and we aren't in FS, request it
        if (localStorage.getItem('gulu_fullscreen_pref') === 'true') {
            requestFullscreen();
        }

        window.scrollTo(0, 0);

    } catch (err) {
        console.error('Gulugulu SPA error:', err);
        window.location.href = url;
    } finally {
        isNavigating = false;
        document.body.style.cursor = 'default';
    }
}

// ── Intercept clicks ──────────────────────────────────────────
document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    if (!_isSameOrigin(link.href)) return;
    if (link.target || link.download) return;
    var hash = link.getAttribute('href');
    if (!hash || hash.startsWith('#')) return;
    if (link.href.includes('/files/')) return;
    
    // We remove the Vue path exclusion here!

    e.preventDefault();
    navigateSpa(link.href);
});

// ── Intercept forms ───────────────────────────────────────────
document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form || !form.action) return;
    if (!_isSameOrigin(form.action)) return;
    if (form.method.toLowerCase() !== 'get') return;
    
    // We remove the Vue path exclusion here!

    e.preventDefault();
    var url = new URL(form.action, window.location.origin);
    var params = new URLSearchParams(new FormData(form));
    url.search = params.toString();
    navigateSpa(url.href);
});

window.addEventListener('popstate', function() {
    navigateSpa(window.location.href, false);
});

// Initial boot check & auto-restore
document.addEventListener('DOMContentLoaded', function() {
    updateFullscreenIcon();

    // Attempt auto-restore on first user interaction (browser requirement)
    var restoreFs = function() {
        if (localStorage.getItem('gulu_fullscreen_pref') === 'true') {
            requestFullscreen();
        }
        document.removeEventListener('mousedown', restoreFs);
        document.removeEventListener('keydown', restoreFs);
    };
    document.addEventListener('mousedown', restoreFs);
    document.addEventListener('keydown', restoreFs);
});
