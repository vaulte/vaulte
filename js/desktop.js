/* =========================================
   STANASTASIA FAKE OS
   DESKTOP JAVASCRIPT
========================================= */


/* =========================================
   VARIABLES
========================================= */

let highestZ = 100;

let openWindows = {};


/* =========================================
   OPEN WINDOW
========================================= */

function openWindow(windowId) {

    const windowElement =
        document.getElementById(windowId);

    if (!windowElement) {
        return;
    }


    windowElement.style.display = "block";


    highestZ++;

    windowElement.style.zIndex =
        highestZ;


    openWindows[windowId] = true;


    updateTaskbar();

}


/* =========================================
   CLOSE WINDOW
========================================= */

function closeWindow(windowId) {

    const windowElement =
        document.getElementById(windowId);

    if (!windowElement) {
        return;
    }


    windowElement.style.display =
        "none";


    delete openWindows[windowId];


    updateTaskbar();

}


/* =========================================
   MINIMIZE WINDOW
========================================= */

function minimizeWindow(windowId) {

    const windowElement =
        document.getElementById(windowId);

    if (!windowElement) {
        return;
    }


    windowElement.style.display =
        "none";


    updateTaskbar();

}


/* =========================================
   MAXIMIZE WINDOW
========================================= */

function maximizeWindow(windowId) {

    const windowElement =
        document.getElementById(windowId);

    if (!windowElement) {
        return;
    }


    if (
        windowElement.dataset.maximized ===
        "true"
    ) {

        windowElement.style.top =
            windowElement.dataset.oldTop;

        windowElement.style.left =
            windowElement.dataset.oldLeft;

        windowElement.style.width =
            windowElement.dataset.oldWidth;

        windowElement.style.height =
            windowElement.dataset.oldHeight;

        windowElement.dataset.maximized =
            "false";

        return;

    }


    windowElement.dataset.oldTop =
        windowElement.style.top;

    windowElement.dataset.oldLeft =
        windowElement.style.left;

    windowElement.dataset.oldWidth =
        windowElement.style.width;

    windowElement.dataset.oldHeight =
        windowElement.style.height;


    windowElement.style.top =
        "0px";

    windowElement.style.left =
        "0px";

    windowElement.style.width =
        "100%";

    windowElement.style.height =
        "calc(100% - 32px)";


    windowElement.dataset.maximized =
        "true";


    bringToFront(windowId);

}


/* =========================================
   BRING WINDOW TO FRONT
========================================= */

function bringToFront(windowId) {

    const windowElement =
        document.getElementById(windowId);

    if (!windowElement) {
        return;
    }


    highestZ++;

    windowElement.style.zIndex =
        highestZ;

}


/* =========================================
   TASKBAR
========================================= */

function updateTaskbar() {

    const taskbar =
        document.getElementById(
            "taskbar-programs"
        );


    taskbar.innerHTML = "";


    Object.keys(openWindows).forEach(
        function(windowId) {

            const windowElement =
                document.getElementById(
                    windowId
                );


            if (!windowElement) {
                return;
            }


            const title =
                windowElement
                    .querySelector(
                        ".window-titlebar span"
                    );


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "taskbar-button";


            button.textContent =
                title
                    ? title.textContent.trim()
                    : "Application";


            button.onclick =
                function() {

                    if (
                        windowElement.style
                            .display === "none"
                    ) {

                        windowElement.style
                            .display = "block";

                        bringToFront(windowId);

                    } else {

                        windowElement.style
                            .display = "none";

                    }

                };


            taskbar.appendChild(button);

        }
    );

}


/* =========================================
   START MENU
========================================= */

function toggleStartMenu() {

    const menu =
        document.getElementById(
            "start-menu"
        );


    menu.classList.toggle(
        "hidden"
    );

}


/* =========================================
   CLOSE START MENU WHEN CLICKING DESKTOP
========================================= */

document.addEventListener(
    "click",
    function(event) {

        const menu =
            document.getElementById(
                "start-menu"
            );

        const startButton =
            document.getElementById(
                "start-button"
            );


        if (
            !menu.contains(event.target) &&
            !startButton.contains(event.target)
        ) {

            menu.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================
   CLICK WINDOWS TO BRING THEM FORWARD
========================================= */

document.addEventListener(
    "mousedown",
    function(event) {

        const windowElement =
            event.target.closest(
                ".os-window"
            );


        if (!windowElement) {
            return;
        }


        highestZ++;

        windowElement.style.zIndex =
            highestZ;

    }
);


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const clock =
        document.getElementById(
            "clock"
        );


    const now =
        new Date();


    let hours =
        now.getHours();


    let minutes =
        now.getMinutes();


    let suffix =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12;


    hours =
        hours || 12;


    minutes =
        minutes
            .toString()
            .padStart(2, "0");


    clock.textContent =
        hours +
        ":" +
        minutes +
        " " +
        suffix;

}


updateClock();


setInterval(
    updateClock,
    1000
);
