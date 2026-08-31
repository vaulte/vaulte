/* =========================================================
   LLYN UNIVERSITY
   FAKE WINDOWS XP OPERATING SYSTEM
   DESKTOP.JS
========================================================= */

let highestZ = 100;
const openWindows = {};
let draggedWindow = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let resizedWindow = null;
let resizeDirection = "";
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartWidth = 0;
let resizeStartHeight = 0;
let resizeStartLeft = 0;
let resizeStartTop = 0;

function openWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    windowElement.style.display = "block";
    bringToFront(windowId);
    openWindows[windowId] = true;
    updateTaskbar();
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    windowElement.style.display = "none";
    delete openWindows[windowId];
    updateTaskbar();
}

function minimizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    windowElement.style.display = "none";
    updateTaskbar();
}

function maximizeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    if (windowElement.dataset.maximized === "true") {
        windowElement.style.top = windowElement.dataset.oldTop;
        windowElement.style.left = windowElement.dataset.oldLeft;
        windowElement.style.width = windowElement.dataset.oldWidth;
        windowElement.style.height = windowElement.dataset.oldHeight;
        windowElement.dataset.maximized = "false";
        bringToFront(windowId);
        return;
    }

    windowElement.dataset.oldTop = windowElement.style.top;
    windowElement.dataset.oldLeft = windowElement.style.left;
    windowElement.dataset.oldWidth = windowElement.style.width;
    windowElement.dataset.oldHeight = windowElement.style.height;

    windowElement.style.top = "0px";
    windowElement.style.left = "0px";
    windowElement.style.width = "100%";
    windowElement.style.height = "calc(100% - 32px)";
    windowElement.dataset.maximized = "true";
    bringToFront(windowId);
}

function bringToFront(windowId) {
    const windowElement = document.getElementById(windowId);
    if (!windowElement) return;
    highestZ++;
    windowElement.style.zIndex = highestZ;
}

const fileSystem = {
    "My Documents": {
        type: "folder",
        children: {
            "Thesis": {
                type: "folder",
                children: {
                    "Field Notes": {
                        type: "folder",
                        children: {
                            "FIELD_NOTE_001.txt": {
                                type: "file",
                                fileType: "text",
                                title: "Field Note 001",
                                content:
`LLYN UNIVERSITY
MARINE SCIENCE DIVISION

FIELD NOTE 001

Date: 14/03/2004

Initial observations recorded.

The wetland samples were collected
from the eastern survey site.

Further documentation has been
placed in the research directory.

— M. Wake`
                            },
                            "FIELD_NOTE_002.txt": {
                                type: "file",
                                fileType: "text",
                                title: "Field Note 002",
                                content:
`LLYN UNIVERSITY
MARINE SCIENCE DIVISION

FIELD NOTE 002

Date: 17/03/2004

The water samples continue to
produce inconsistent results.

Iron concentration is significantly
higher than expected.

Supervisor has requested that
additional samples be collected.

Do not discard previous samples.`
                            },
                            "FIELD_NOTE_003.txt": {
                                type: "file",
                                fileType: "text",
                                title: "Field Note 003",
                                content:
`LLYN UNIVERSITY
MARINE SCIENCE DIVISION

FIELD NOTE 003

Date: 22/03/2004

There is something unusual about
the western pool.

The water appears darker after
several hours of exposure.

I have requested permission to
return tomorrow.

— M. Wake`
                            }
                        }
                    },
                    "Research": {
                        type: "folder",
                        children: {
                            "bibliography.txt": {
                                type: "file",
                                fileType: "text",
                                title: "Bibliography",
                                content:
`THESIS BIBLIOGRAPHY

Selected references:

1. Wetland Ecology and
   Environmental Systems

2. Iron Oxidation in
   Freshwater Ecosystems

3. Aquatic Microbiology

4. Temperate Wetland Studies

5. Aquatic Iron-Cycling
   Microorganisms`
                            },
                            "research_database.url": {
                                type: "file",
                                fileType: "website",
                                title: "Research Database",
                                url: "research.html"
                            }
                        }
                    },
                    "Drafts": {
                        type: "folder",
                        children: {
                            "THESIS_DRAFT_01.txt": {
                                type: "file",
                                fileType: "text",
                                title: "Thesis Draft 01",
                                content:
`INFERNAL FLORA IN
TEMPERATE WETLANDS

THESIS DRAFT

CHAPTER ONE

INTRODUCTION

[DOCUMENT INCOMPLETE]`
                            },
                            "THESIS_DRAFT_02.txt": {
                                type: "file",
                                fileType: "text",
                                title: "Thesis Draft 02",
                                content:
`INFERNAL FLORA IN
TEMPERATE WETLANDS

THESIS DRAFT

CHAPTER TWO

ENVIRONMENTAL CONDITIONS

[DOCUMENT INCOMPLETE]`
                            }
                        }
                    }
                }
            },
            "Photos": {
                type: "folder",
                children: {
                    "IMG_001.jpg": {
                        type: "file",
                        fileType: "image",
                        title: "IMG_001"
                    },
                    "IMG_002.jpg": {
                        type: "file",
                        fileType: "image",
                        title: "IMG_002"
                    }
                }
            },
            "Downloads": {
                type: "folder",
                children: {
                    "University_Repository.url": {
                        type: "file",
                        fileType: "website",
                        title: "University Repository",
                        url: "repository.html"
                    },
                    "HopCorp.url": {
                        type: "file",
                        fileType: "website",
                        title: "Hopkins Corporation",
                        url: "hopcorp.html"
                    }
                }
            },
            "Read Me.txt": {
                type: "file",
                fileType: "text",
                title: "Read Me",
                content:
`WELCOME

This computer belongs to:

MARGARETE WAKE

Llyn University
Department of Marine and
Environmental Science

Please remember to save
your work regularly.

- Information Technology`
            }
        }
    }
};

let currentFolder = fileSystem["My Documents"];
let folderHistory = [];
let currentPath = ["My Documents"];

function openFileExplorer() {
    let explorer = document.getElementById("file-explorer");

    if (explorer) {
        explorer.style.display = "block";
        bringToFront("file-explorer");
        openWindows["file-explorer"] = true;
        updateTaskbar();
        return;
    }

    createFileExplorer();
}

function createFileExplorer() {
    const explorer = document.createElement("div");

    explorer.id = "file-explorer";
    explorer.className = "os-window file-explorer";
    explorer.style.width = "650px";
    explorer.style.height = "430px";
    explorer.style.left = "300px";
    explorer.style.top = "130px";
    explorer.style.display = "block";
    explorer.style.zIndex = ++highestZ;

    explorer.innerHTML = `
        <div class="window-titlebar">
            <span>📁 My Documents</span>
            <div class="window-buttons">
                <button type="button" onclick="minimizeWindow('file-explorer')">_</button>
                <button type="button" onclick="maximizeWindow('file-explorer')">□</button>
                <button type="button" onclick="closeWindow('file-explorer')">×</button>
            </div>
        </div>

        <div class="window-toolbar">
            File &nbsp;&nbsp; Edit &nbsp;&nbsp; View &nbsp;&nbsp; Favorites &nbsp;&nbsp; Tools &nbsp;&nbsp; Help
        </div>

        <div class="explorer-toolbar">
            <button type="button" onclick="goBackFolder()">← Back</button>
            <button type="button" onclick="goUpFolder()">↑ Up</button>
            <span id="folder-path">My Documents</span>
        </div>

        <div id="explorer-content" class="explorer-content"></div>
    `;

    document.getElementById("desktop").appendChild(explorer);

    openWindows["file-explorer"] = true;
    currentFolder = fileSystem["My Documents"];
    folderHistory = [];
    currentPath = ["My Documents"];

    renderFolder(currentFolder);
    updateTaskbar();
}

function renderFolder(folder) {
    const content = document.getElementById("explorer-content");
    if (!content) return;

    content.innerHTML = "";

    Object.keys(folder.children).forEach(function(name) {
        const item = folder.children[name];
        const element = document.createElement("div");

        element.className = "file-item";
        element.dataset.name = name;
        element.dataset.selected = "false";

        let icon = "📄";
        if (item.type === "folder") icon = "📁";
        else if (item.fileType === "image") icon = "🖼️";
        else if (item.fileType === "website") icon = "🌐";

        element.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-name">${escapeHTML(name)}</div>
        `;

        element.addEventListener("click", function(event) {
            event.stopPropagation();

            document.querySelectorAll(".file-item").forEach(function(other) {
                other.dataset.selected = "false";
                other.classList.remove("selected");
            });

            element.dataset.selected = "true";
            element.classList.add("selected");

            // Single click opens the item.
            if (item.type === "folder") {
                openFolder(item, name);
            } else {
                openFile(item);
            }
        });

        content.appendChild(element);
    });
}

function openFolder(folder, folderName) {
    folderHistory.push(currentFolder);
    currentFolder = folder;
    currentPath.push(folderName);
    updateFolderPath();
    renderFolder(currentFolder);
}

function updateFolderPath() {
    const path = document.getElementById("folder-path");
    if (!path) return;
    path.textContent = currentPath.join(" \\ ");
}

function goBackFolder() {
    if (folderHistory.length === 0) return;

    currentFolder = folderHistory.pop();
    currentPath.pop();

    updateFolderPath();
    renderFolder(currentFolder);
}

function goUpFolder() {
    goBackFolder();
}

function openFile(file) {
    if (file.fileType === "text") {
        openTextDocument(file);
        return;
    }

    if (file.fileType === "website") {
        window.open(file.url, "_blank");
        return;
    }

    if (file.fileType === "image") {
        alert("Image viewer coming soon.");
    }
}

function openTextDocument(file) {
    const id = "document-" + Math.random().toString(36).substring(2, 9);
    const documentWindow = document.createElement("div");

    documentWindow.id = id;
    documentWindow.className = "os-window";
    documentWindow.style.width = "560px";
    documentWindow.style.height = "420px";
    documentWindow.style.left = "220px";
    documentWindow.style.top = "110px";
    documentWindow.style.display = "block";
    documentWindow.style.zIndex = ++highestZ;

    documentWindow.innerHTML = `
        <div class="window-titlebar">
            <span>📄 ${escapeHTML(file.title)}</span>
            <div class="window-buttons">
                <button type="button" onclick="minimizeWindow('${id}')">_</button>
                <button type="button" onclick="maximizeWindow('${id}')">□</button>
                <button type="button" onclick="closeWindow('${id}')">×</button>
            </div>
        </div>

        <div class="document-viewer">
            <pre></pre>
        </div>
    `;

    document.getElementById("desktop").appendChild(documentWindow);

    documentWindow.querySelector(".document-viewer pre").textContent = file.content;

    openWindows[id] = true;
    bringToFront(id);
    updateTaskbar();
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener("mousedown", function(event) {
    const titlebar = event.target.closest(".window-titlebar");
    if (!titlebar) return;

    const windowElement = titlebar.closest(".os-window");
    if (!windowElement) return;

    if (event.target.closest(".window-buttons")) return;
    if (windowElement.dataset.maximized === "true") return;

    draggedWindow = windowElement;
    bringToFront(windowElement.id);

    const rect = windowElement.getBoundingClientRect();
    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;

    document.body.style.cursor = "move";
    event.preventDefault();
});

function getResizeDirection(event, windowElement) {
    const rect = windowElement.getBoundingClientRect();
    const edge = 8;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const left = x <= edge;
    const right = x >= rect.width - edge;
    const top = y <= edge;
    const bottom = y >= rect.height - edge;

    if (top && left) return "nw";
    if (top && right) return "ne";
    if (bottom && left) return "sw";
    if (bottom && right) return "se";
    if (left) return "w";
    if (right) return "e";
    if (top) return "n";
    if (bottom) return "s";

    return "";
}

function getResizeCursor(direction) {
    if (direction === "nw" || direction === "se") return "nwse-resize";
    if (direction === "ne" || direction === "sw") return "nesw-resize";
    if (direction === "n" || direction === "s") return "ns-resize";
    if (direction === "e" || direction === "w") return "ew-resize";
    return "default";
}

document.addEventListener("mousedown", function(event) {
    if (event.target.closest(".window-titlebar")) return;

    const windowElement = event.target.closest(".os-window");
    if (!windowElement) return;
    if (windowElement.dataset.maximized === "true") return;

    const direction = getResizeDirection(event, windowElement);
    if (!direction) return;

    resizedWindow = windowElement;
    resizeDirection = direction;
    bringToFront(windowElement.id);

    const rect = windowElement.getBoundingClientRect();

    resizeStartX = event.clientX;
    resizeStartY = event.clientY;
    resizeStartWidth = rect.width;
    resizeStartHeight = rect.height;
    resizeStartLeft = windowElement.offsetLeft;
    resizeStartTop = windowElement.offsetTop;

    document.body.style.cursor = getResizeCursor(direction);
    event.preventDefault();
});

document.addEventListener("mousemove", function(event) {
    if (draggedWindow) {
        const desktop = document.getElementById("desktop");
        const desktopRect = desktop.getBoundingClientRect();

        let left = event.clientX - desktopRect.left - dragOffsetX;
        let top = event.clientY - desktopRect.top - dragOffsetY;

        const maxLeft = desktopRect.width - draggedWindow.offsetWidth;
        const maxTop = desktopRect.height - 32 - draggedWindow.offsetHeight;

        left = Math.max(0, Math.min(left, maxLeft));
        top = Math.max(0, Math.min(top, maxTop));

        draggedWindow.style.left = left + "px";
        draggedWindow.style.top = top + "px";
        return;
    }

    if (resizedWindow) {
        resizeWindow(event);
        return;
    }

    const windowElement = event.target.closest(".os-window");
    if (!windowElement) {
        document.body.style.cursor = "default";
        return;
    }

    if (windowElement.dataset.maximized === "true") return;

    const direction = getResizeDirection(event, windowElement);
    document.body.style.cursor = direction ? getResizeCursor(direction) : "default";
});

function resizeWindow(event) {
    const dx = event.clientX - resizeStartX;
    const dy = event.clientY - resizeStartY;

    const minWidth = 300;
    const minHeight = 200;

    let width = resizeStartWidth;
    let height = resizeStartHeight;
    let left = resizeStartLeft;
    let top = resizeStartTop;

    if (resizeDirection.includes("e")) width = resizeStartWidth + dx;
    if (resizeDirection.includes("w")) {
        width = resizeStartWidth - dx;
        left = resizeStartLeft + dx;
    }
    if (resizeDirection.includes("s")) height = resizeStartHeight + dy;
    if (resizeDirection.includes("n")) {
        height = resizeStartHeight - dy;
        top = resizeStartTop + dy;
    }

    if (width < minWidth) {
        if (resizeDirection.includes("w")) {
            left = resizeStartLeft + resizeStartWidth - minWidth;
        }
        width = minWidth;
    }

    if (height < minHeight) {
        if (resizeDirection.includes("n")) {
            top = resizeStartTop + resizeStartHeight - minHeight;
        }
        height = minHeight;
    }

    resizedWindow.style.width = width + "px";
    resizedWindow.style.height = height + "px";
    resizedWindow.style.left = left + "px";
    resizedWindow.style.top = top + "px";
}

document.addEventListener("mouseup", function() {
    draggedWindow = null;
    resizedWindow = null;
    resizeDirection = "";
    document.body.style.cursor = "default";
});

document.addEventListener("mousedown", function(event) {
    const windowElement = event.target.closest(".os-window");
    if (!windowElement) return;
    bringToFront(windowElement.id);
});

function updateTaskbar() {
    const taskbar = document.getElementById("taskbar-programs");
    if (!taskbar) return;

    taskbar.innerHTML = "";

    Object.keys(openWindows).forEach(function(windowId) {
        const windowElement = document.getElementById(windowId);
        if (!windowElement) return;

        const title = windowElement.querySelector(".window-titlebar span");
        const button = document.createElement("button");

        button.className = "taskbar-button";
        button.textContent = title ? title.textContent.trim() : "Application";

        button.addEventListener("click", function() {
            if (windowElement.style.display === "none") {
                windowElement.style.display = "block";
                bringToFront(windowId);
                return;
            }

            if (parseInt(windowElement.style.zIndex) === highestZ) {
                minimizeWindow(windowId);
            } else {
                bringToFront(windowId);
            }
        });

        taskbar.appendChild(button);
    });
}

function toggleStartMenu() {
    const menu = document.getElementById("start-menu");
    if (!menu) return;
    menu.classList.toggle("hidden");
}

document.addEventListener("click", function(event) {
    const menu = document.getElementById("start-menu");
    const startButton = document.getElementById("start-button");

    if (!menu || !startButton) return;

    if (!menu.contains(event.target) && !startButton.contains(event.target)) {
        menu.classList.add("hidden");
    }
});

function updateClock() {
    const clock = document.getElementById("clock");
    if (!clock) return;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours || 12;

    clock.textContent = hours + ":" + minutes + " " + suffix;
}

updateClock();
setInterval(updateClock, 1000);

document.addEventListener("DOMContentLoaded", function() {
    const oldDocumentsWindow = document.getElementById("documentsWindow");

    if (oldDocumentsWindow) {
        oldDocumentsWindow.style.display = "none";
    }
});
