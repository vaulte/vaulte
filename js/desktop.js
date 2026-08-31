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

let resizedWindow = null;

let dragOffsetX = 0;

let dragOffsetY = 0;

let resizeDirection = "";

let resizeStartX = 0;

let resizeStartY = 0;

let resizeStartWidth = 0;

let resizeStartHeight = 0;

let resizeStartLeft = 0;

let resizeStartTop = 0;


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
        RESTORE
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
        SAVE CURRENT POSITION
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
        MAXIMIZE
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

document.addEventListener(
    "mousedown",
    function(event) {

        /*
            Check whether the click happened
            on a title bar.
        */

        const titlebar =
            event.target.closest(
                ".window-titlebar"
            );


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
            Don't drag when clicking
            the window controls.
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


        bringToFront(
            windowElement.id
        );


        const rect =
            windowElement.getBoundingClientRect();


        dragOffsetX =
            event.clientX -
            rect.left;


        dragOffsetY =
            event.clientY -
            rect.top;


        document.body.style.cursor =
            "move";


        event.preventDefault();

    }
);


/* =========================================
   WINDOW RESIZING
========================================= */


/*
    Determine which edge/corner the
    mouse is currently near.
*/

function getResizeDirection(
    event,
    windowElement
) {

    const rect =
        windowElement.getBoundingClientRect();


    const edgeSize = 8;


    const mouseX =
        event.clientX -
        rect.left;


    const mouseY =
        event.clientY -
        rect.top;


    const nearLeft =
        mouseX <= edgeSize;


    const nearRight =
        mouseX >=
        rect.width - edgeSize;


    const nearTop =
        mouseY <= edgeSize;


    const nearBottom =
        mouseY >=
        rect.height - edgeSize;


    /*
        Corners
    */

    if (
        nearTop &&
        nearLeft
    ) {
        return "nw";
    }


    if (
        nearTop &&
        nearRight
    ) {
        return "ne";
    }


    if (
        nearBottom &&
        nearLeft
    ) {
        return "sw";
    }


    if (
        nearBottom &&
        nearRight
    ) {
        return "se";
    }


    /*
        Edges
    */

    if (nearLeft) {
        return "w";
    }


    if (nearRight) {
        return "e";
    }


    if (nearTop) {
        return "n";
    }


    if (nearBottom) {
        return "s";
    }


    return "";

}


/* =========================================
   START RESIZING
========================================= */

document.addEventListener(
    "mousedown",
    function(event) {

        /*
            Don't resize when clicking
            title bars.
        */

        if (
            event.target.closest(
                ".window-titlebar"
            )
        ) {
            return;
        }


        const windowElement =
            event.target.closest(
                ".os-window"
            );


        if (!windowElement) {
            return;
        }


        /*
            Maximized windows can't resize.
        */

        if (
            windowElement.dataset.maximized ===
            "true"
        ) {
            return;
        }


        const direction =
            getResizeDirection(
                event,
                windowElement
            );


        if (!direction) {
            return;
        }


        resizedWindow =
            windowElement;


        resizeDirection =
            direction;


        bringToFront(
            windowElement.id
        );


        /*
            Store starting values.
        */

        const rect =
            windowElement.getBoundingClientRect();


        resizeStartX =
            event.clientX;


        resizeStartY =
            event.clientY;


        resizeStartWidth =
            rect.width;


        resizeStartHeight =
            rect.height;


        resizeStartLeft =
            windowElement.offsetLeft;


        resizeStartTop =
            windowElement.offsetTop;


        /*
            Change cursor.
        */

        document.body.style.cursor =
            getResizeCursor(
                direction
            );


        event.preventDefault();

    }
);


/* =========================================
   RESIZE CURSOR
========================================= */

function getResizeCursor(direction) {

    switch (direction) {

        case "nw":
            return "nwse-resize";

        case "ne":
            return "nesw-resize";

        case "sw":
            return "nesw-resize";

        case "se":
            return "nwse-resize";

        case "n":
            return "ns-resize";

        case "s":
            return "ns-resize";

        case "e":
            return "ew-resize";

        case "w":
            return "ew-resize";

        default:
            return "default";

    }

}


/* =========================================
   MOUSE MOVEMENT
========================================= */

document.addEventListener(
    "mousemove",
    function(event) {


        /* =====================================
           DRAGGING
        ===================================== */

        if (draggedWindow) {

            const desktop =
                document.getElementById(
                    "desktop"
                );


            const desktopRect =
                desktop.getBoundingClientRect();


            let newLeft =
                event.clientX -
                desktopRect.left -
                dragOffsetX;


            let newTop =
                event.clientY -
                desktopRect.top -
                dragOffsetY;


            /*
                Keep inside desktop.
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


            draggedWindow.style.left =
                newLeft + "px";


            draggedWindow.style.top =
                newTop + "px";


            return;

        }


        /* =====================================
           RESIZING
        ===================================== */

        if (resizedWindow) {

            resizeWindow(
                event
            );

            return;

        }


        /* =====================================
           RESIZE CURSOR PREVIEW
        ===================================== */

        const windowElement =
            event.target.closest(
                ".os-window"
            );


        if (!windowElement) {

            document.body.style.cursor =
                "default";

            return;

        }


        if (
            windowElement.dataset.maximized ===
            "true"
        ) {
            return;
        }


        const direction =
            getResizeDirection(
                event,
                windowElement
            );


        if (direction) {

            document.body.style.cursor =
                getResizeCursor(
                    direction
                );

        }

        else {

            document.body.style.cursor =
                "default";

        }

    }
);


/* =========================================
   RESIZE WINDOW
========================================= */

function resizeWindow(event) {

    const dx =
        event.clientX -
        resizeStartX;


    const dy =
        event.clientY -
        resizeStartY;


    const minWidth = 300;

    const minHeight = 200;


    let newWidth =
        resizeStartWidth;


    let newHeight =
        resizeStartHeight;


    let newLeft =
        resizeStartLeft;


    let newTop =
        resizeStartTop;


    /*
        RIGHT
    */

    if (
        resizeDirection.includes("e")
    ) {

        newWidth =
            resizeStartWidth +
            dx;

    }


    /*
        LEFT
    */

    if (
        resizeDirection.includes("w")
    ) {

        newWidth =
            resizeStartWidth -
            dx;

        newLeft =
            resizeStartLeft +
            dx;

    }


    /*
        BOTTOM
    */

    if (
        resizeDirection.includes("s")
    ) {

        newHeight =
            resizeStartHeight +
            dy;

    }


    /*
        TOP
    */

    if (
        resizeDirection.includes("n")
    ) {

        newHeight =
            resizeStartHeight -
            dy;

        newTop =
            resizeStartTop +
            dy;

    }


    /*
        Minimum width.
    */

    if (
        newWidth < minWidth
    ) {

        if (
            resizeDirection.includes("w")
        ) {

            newLeft =
                resizeStartLeft +
                resizeStartWidth -
                minWidth;

        }


        newWidth =
            minWidth;

    }


    /*
        Minimum height.
    */

    if (
        newHeight < minHeight
    ) {

        if (
            resizeDirection.includes("n")
        ) {

            newTop =
                resizeStartTop +
                resizeStartHeight -
                minHeight;

        }


        newHeight =
            minHeight;

    }


    /*
        Apply dimensions.
    */

    resizedWindow.style.width =
        newWidth + "px";


    resizedWindow.style.height =
        newHeight + "px";


    resizedWindow.style.left =
        newLeft + "px";


    resizedWindow.style.top =
        newTop + "px";

}


/* =========================================
   STOP DRAGGING / RESIZING
========================================= */

document.addEventListener(
    "mouseup",
    function() {

        draggedWindow =
            null;


        resizedWindow =
            null;


        resizeDirection =
            "";


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
   CLOSE START MENU
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
