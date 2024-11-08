
<script>
import { Capacitor } from '@capacitor/core';

function generateRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function isMobile() {
    return window.innerWidth < 768;
}

function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isIos() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function iAmDevice() {
    if(Capacitor.isNativePlatform()) {
        return true
    }
}

export default { generateRandomColor, isMobile, isAndroid, isIos, iAmDevice };
</script>