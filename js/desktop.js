/* =========================================
   STANASTASIA UNIVERSITY
   FAKE OS — DESKTOP JAVASCRIPT
========================================= */


/* =========================================
   GLOBAL VARIABLES
========================================= */

let highestZ = 100;

let openWindows = {};

let draggedWindow = null;

let dragOffsetX = 0;

let dragOffsetY = 0;


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


    bringToFront(windowId);


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


    /*
        If already maximized,
        restore the previous position.
    */

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


        bringToFront(windowId);


        return;

    }


    /*
        Save the current dimensions.
    */

    windowElement.dataset.oldTop =
        windowElement.style.top;

    windowElement.dataset.oldLeft =
        windowElement.style.left;

    windowElement.dataset.oldWidth =
        windowElement.style.width;

    windowElement.dataset.oldHeight =
        windowElement.style.height;


    /*
        Maximize.
    */

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
   WINDOW DRAGGING
========================================= */


/*
    Start dragging when the user presses
    the mouse button on a title bar.
*/

document.addEventListener(
    "mousedown",
    function(event) {

        const titlebar =
            event.target.closest(
                ".window-titlebar"
            );


        /*
            Ignore clicks that aren't
            on a title bar.
        */

        if (!titlebar) {
            return;
        }


        const windowElement =
            titlebar.closest(
                ".os-window"
            );


        if (!windowElement) {
            return;
        }


        /*
            Don't start dragging when the
            user clicks one of the window
            control buttons.
        */

        if (
            event.target.closest(
                ".window-buttons"
            )
        ) {
            return;
        }


        /*
            Don't drag maximized windows.
        */

        if (
            windowElement.dataset.maximized ===
            "true"
        ) {
            return;
        }


        draggedWindow =
            windowElement;


        /*
            Bring the window forward.
        */

        highestZ++;


        windowElement.style.zIndex =
            highestZ;


        /*
            Find the current position
            of the window.
        */

        const rect =
            windowElement.getBoundingClientRect();


        /*
            Remember where inside the
            title bar the mouse was clicked.
        */

        dragOffsetX =
            event.clientX -
            rect.left;


        dragOffsetY =
            event.clientY -
            rect.top;


        /*
            Change cursor.
        */

        document.body.style.cursor =
            "move";


        /*
            Prevent text selection.
        */

        event.preventDefault();

    }
);


/*
    Move the window while the mouse
    is being held down.
*/

document.addEventListener(
    "mousemove",
    function(event) {

        if (!draggedWindow) {
            return;
        }


        const desktop =
            document.getElementById(
                "desktop"
            );


        const desktopRect =
            desktop.getBoundingClientRect();


        /*
            Calculate the new position.
        */

        let newLeft =
            event.clientX -
            desktopRect.left -
            dragOffsetX;


        let newTop =
            event.clientY -
            desktopRect.top -
            dragOffsetY;


        /*
            Keep the window inside
            the desktop.
        */

        const maxLeft =
            desktopRect.width -
            draggedWindow.offsetWidth;


        const maxTop =
            desktopRect.height -
            32 -
            draggedWindow.offsetHeight;


        newLeft =
            Math.max(
                0,
                Math.min(
                    newLeft,
                    maxLeft
                )
            );


        newTop =
            Math.max(
                0,
                Math.min(
                    newTop,
                    maxTop
                )
            );


        /*
            Apply the position.
        */

        draggedWindow.style.left =
            newLeft + "px";


        draggedWindow.style.top =
            newTop + "px";

    }
);


/*
    Stop dragging.
*/

document.addEventListener(
    "mouseup",
    function() {

        if (!draggedWindow) {
            return;
        }


        draggedWindow = null;


        document.body.style.cursor =
            "default";

    }
);


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
                windowElement.querySelector(
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


            /*
                Restore / minimize
                when taskbar button
                is clicked.
            */

            button.onclick =
                function() {

                    if (
                        windowElement.style
                            .display === "none"
                    ) {

                        windowElement.style
                            .display = "block";


                        bringToFront(
                            windowId
                        );

                    }

                    else {

                        /*
                            If the window is already
                            in front, minimize it.
                        */

                        if (
                            parseInt(
                                windowElement.style.zIndex
                            ) === highestZ
                        ) {

                            windowElement.style
                                .display = "none";

                        }

                        else {

                            bringToFront(
                                windowId
                            );

                        }

                    }

                };


            taskbar.appendChild(
                button
            );

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
   CLOSE START MENU WHEN CLICKING
   SOMEWHERE ELSE
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
   BRING WINDOWS FORWARD
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


        bringToFront(
            windowElement.id
        );

    }
);


/* =========================================
   DESKTOP DOUBLE CLICK
========================================= */

document.addEventListener(
    "dblclick",
    function(event) {

        /*
            This is intentionally left
            available for future use.

            Later we can use this for things
            like opening files, folders,
            shortcuts, etc.
        */

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


    if (!clock) {
        return;
    }


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
            .padStart(
                2,
                "0"
            );


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
