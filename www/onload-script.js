
    if (window.PalmSystem) {
        window.PalmSystem.stageReady();
    }
    if (!window.enyo) {
        alert('No application build found, redirecting to debug.html.');
        location = 'debug.html';
    } else {
        new TopWatch().renderInto(document.body);
    }
