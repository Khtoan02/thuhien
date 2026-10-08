(function() {
    'use strict';
    if (typeof window === 'undefined') return;
    if (window.location.pathname.includes('/admin')) return;

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { capture: true });

    document.addEventListener('copy', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.clipboardData) {
            e.clipboardData.setData('text/plain', '');
        }
        return false;
    }, { capture: true });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { capture: true });

    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }, { capture: true });

    document.addEventListener('selectstart', function(e) {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return true;
        e.preventDefault();
        return false;
    }, { capture: true });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        const isMac = navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrl = isMac ? (e.metaKey || e.ctrlKey) : e.ctrlKey;
        const shift = e.shiftKey;
        const alt = e.altKey;
        const key = (e.key || '').toLowerCase();
        const code = e.keyCode || e.which;

        if ((ctrl && shift && (key === 'i' || code === 73 || key === 'j' || code === 74 || key === 'c' || code === 67)) ||
            (ctrl && alt && (key === 'i' || code === 73 || key === 'j' || code === 74 || key === 'c' || code === 67))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if ((ctrl && (key === 'u' || code === 85)) || (ctrl && alt && (key === 'u' || code === 85))) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (ctrl && (key === 's' || code === 83)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (ctrl && (key === 'p' || code === 80)) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        if (key === 'printscreen' || code === 44) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('');
            }
        }
    }, { capture: true });

    let devtoolsOpen = false;
    const threshold = 160;

    function onDevToolsTriggered() {
        if (!devtoolsOpen) {
            devtoolsOpen = true;
            try { console.clear(); } catch(e) {}
            if (document.body) {
                document.body.style.filter = 'blur(12px)';
                document.body.style.pointerEvents = 'none';
            }
        }
    }

    function onDevToolsClosed() {
        if (devtoolsOpen) {
            devtoolsOpen = false;
            if (document.body) {
                document.body.style.filter = '';
                document.body.style.pointerEvents = '';
            }
        }
    }

    function detectWindowResize() {
        const widthDiff = window.outerWidth - window.innerWidth > threshold;
        const heightDiff = window.outerHeight - window.innerHeight > threshold;
        if (widthDiff || heightDiff) {
            onDevToolsTriggered();
        } else {
            onDevToolsClosed();
        }
    }

    window.addEventListener('resize', detectWindowResize);

    setInterval(function() {
        const start = performance.now();
        (function() {}['constructor']('debugger')());
        if (performance.now() - start > 100) {
            onDevToolsTriggered();
        }
    }, 1500);

    try {
        const noop = function() {};
        window.console.log = noop;
        window.console.warn = noop;
        window.console.error = noop;
        window.console.info = noop;
        window.console.table = noop;
    } catch(e) {}
})();
