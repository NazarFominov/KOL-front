export function randomInteger(min, max) {
    const rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
};

export function scrollBlock(block) {
    let left = true;

    function scroll() {
        setTimeout(() => {
            try {
                const leftPos = parseInt((block.offsetWidth + block.scrollLeft).toFixed());

                if (leftPos <= block.offsetWidth) left = true;
                else if (leftPos >= block.scrollWidth) left = false;

                block.scrollLeft += left ? 1 : -1
                if (block) scroll();
            } catch (e) {
                console.log(e)
            }
        }, 50)
    }

    scroll()
}

export function checkIsMobile() {
    return Boolean(window.innerWidth < 800)
}

export function getDigitalParam(index = 0) {
    const params = location.pathname.match(/\d/g);
    return params && params.length ? params[index] : null
}

export function newObject(object = {}) {
    return Object.assign({}, object)
}

export const runOnKeys = (func, ...codes) => {
    const pressed = new Set();

    document.addEventListener('keydown', function(event) {
        pressed.add(event.code);

        for (const code of codes) { // все ли клавиши из набора нажаты?
            if (!pressed.has(code)) {
                return;
            }
        }
        pressed.clear();

        func();
    });

    document.addEventListener('keyup', function(event) {
        pressed.delete(event.code);
    });
};