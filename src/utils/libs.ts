class Libs {

    isMobile() {
        return window.innerWidth < 768;
    }

    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    isIos() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    generateRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
}

export default new Libs();