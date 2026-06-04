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

// Pages that use Vue — use hard navigation to avoid conflicts
var VUE_PATHS = ['/juegos/', '/juego/'];

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

// ── SPA navigation core (v5 - FOUC-free) ─────────────────────
async function navigateSpa(url, push) {
    if (push === undefined) push = true;

    // Hard-navigate if target is Vue page, or if current page is Vue page
    if (_isVuePage(url) || _isVuePage(window.location.href)) {
        window.location.href = url;
        return;
    }

    try {
        var response = await fetch(url);
        if (!response.ok) throw new Error('Network error ' + response.status);
        var html = await response.text();

        _destroyVueApp();

        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');

        if (doc.title) document.title = doc.title;

        // ── Clean old page-specific styles, add new ones ─────
        // Remove all dynamically-added styles (from previous SPA navigations)
        var oldDynStyles = document.head.querySelectorAll('style[data-spa]');
        oldDynStyles.forEach(function(s) { s.remove(); });

        // Add new page styles (mark them as SPA-injected)
        var newStyles = doc.querySelectorAll('style');
        newStyles.forEach(function(ns) {
            var node = document.createElement('style');
            node.setAttribute('data-spa', 'true');
            node.innerHTML = ns.innerHTML;
            document.head.appendChild(node);
        });

        // ── Sync <head> scripts ──────────────────────────────
        var headScripts = Array.from(doc.head.querySelectorAll('script'));
        for (var i = 0; i < headScripts.length; i++) {
            var old = headScripts[i];
            if (old.src) {
                var exists = Array.from(document.head.querySelectorAll('script')).some(function(s) {
                    return s.src === old.src;
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
        // Build new body off-screen, then swap in one paint frame
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = doc.body.innerHTML;

        // Use requestAnimationFrame to batch the DOM swap into a single paint
        await new Promise(function(resolve) {
            requestAnimationFrame(function() {
                document.body.className = doc.body.className;
                document.body.innerHTML = '';
                while (tempDiv.firstChild) {
                    document.body.appendChild(tempDiv.firstChild);
                }
                resolve();
            });
        });

        // ── Re-execute body scripts ──────────────────────────
        var bodyScripts = Array.from(document.body.querySelectorAll('script'));
        for (var i = 0; i < bodyScripts.length; i++) {
            var old = bodyScripts[i];
            var fresh = document.createElement('script');
            Array.from(old.attributes).forEach(function(attr) {
                fresh.setAttribute(attr.name, attr.value);
            });

            if (old.src) {
                await new Promise(function(resolve) {
                    fresh.onload  = resolve;
                    fresh.onerror = resolve;
                    old.parentNode.replaceChild(fresh, old);
                });
            } else if (old.innerHTML.trim()) {
                fresh.innerHTML = '(function(){\n' + old.innerHTML + '\n})();';
                old.parentNode.replaceChild(fresh, old);
            }
        }

        if (push) window.history.pushState({}, '', url);

        updateFullscreenIcon();
        window.scrollTo(0, 0);

    } catch (err) {
        console.error('Gulugulu SPA error:', err);
        window.location.href = url;
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

    // Hard-navigate if target is Vue page or if current page is Vue page
    if (_isVuePage(link.href) || _isVuePage(window.location.href)) {
        return;
    }

    e.preventDefault();
    navigateSpa(link.href);
});

// ── Intercept forms ───────────────────────────────────────────
document.addEventListener('submit', function(e) {
    var form = e.target;
    if (!form || !form.action) return;
    if (!_isSameOrigin(form.action)) return;
    if (form.method.toLowerCase() !== 'get') return;

    // Hard-navigate if target is Vue page or if current page is Vue page
    if (_isVuePage(form.action) || _isVuePage(window.location.href)) {
        return;
    }

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
