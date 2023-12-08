// note.js
window.notes = [];

document.addEventListener("DOMContentLoaded", () => {

    const startButton = document.getElementById('start');
    if (startButton) {
        startButton.addEventListener('click', startdiscussion);
    }


    const notesContainer = document.getElementById("notesContainer");
 
    let noteIdCounter = 1;


    function updateDataText(note, newText) {
        const textArea = note.querySelector('textarea');
        textArea.value = newText;
    }

    function createStickyNote() {
        const note = document.createElement("div");
        note.classList.add("note");
        note.style.left = "100px";
        note.style.top = "100px";

        const textArea = document.createElement("textarea");
        textArea.setAttribute("rows", "3");
        textArea.setAttribute("cols", "30");
        textArea.placeholder = "テキストを入力してください...";

        textArea.addEventListener("input", () => {
            updateDataText(note, textArea.value);
        });

        note.appendChild(textArea);

        note.setAttribute('data-note-id', noteIdCounter++);
        note.setAttribute('data-gaze-time', '0');
        note.setAttribute('data-left', '100');
        note.setAttribute('data-top', '100');

        let isDragging = false;
        let prevX, prevY, prevLeft, prevTop;

        note.addEventListener("mousedown", (e) => {
            const { offsetX, offsetY } = getOffset(e, note);

            isDragging = true;
            prevX = e.clientX;
            prevY = e.clientY;
            prevLeft = note.style.left;
            prevTop = note.style.top;

            document.onmousemove = (e) => {
                const dx = e.clientX - prevX;
                const dy = e.clientY - prevY;
                note.style.left = parseInt(prevLeft) + dx + "px";
                note.style.top = parseInt(prevTop) + dy + "px";

                note.setAttribute('data-left', note.style.left);
                note.setAttribute('data-top', note.style.top);
            };
        });

        document.onmouseup = () => {
            isDragging = false;
            document.onmousemove = null;
        };

        return note;
    }

    function getOffset(e, element) {
        const rect = element.getBoundingClientRect();
        return {
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
        };
    }

    
    function startdiscussion() {
        // 付箋のgaze-timeを0に戻す
        const allNotes = document.querySelectorAll('.note');
        allNotes.forEach((note) => {
            note.setAttribute('data-gaze-time', '0');
        });
    
        // webgazerGazeDotの透明度を変更する
        const gazeDot = document.getElementById('webgazerGazeDot');
        if (gazeDot) {
            gazeDot.style.opacity = '0';
        }
    
        // startButtonを非表示にする
        const startButton = document.getElementById('start');
        if (startButton) {
            startButton.style.display = 'none';
        }
    }

    const columns = 3;
    const rows = 2;
    const noteWidth = 200;
    const noteHeight = 200;
    const gapX = 20;
    const gapY = 20;

    const initialTexts = ["あ", "い", "う", "え", "お", "か"];

    for (let i = 0; i < 6; i++) {
        const newNote = createStickyNote();
        const col = i % columns;
        const row = Math.floor(i / columns);
        const left = -150 + col * (noteWidth + gapX);
        const top = 200 + row * (noteHeight + gapY);

        newNote.style.left = `${left}px`;
        newNote.style.top = `${top}px`;

        updateDataText(newNote, initialTexts[i]);
        newNote.setAttribute('data-text', initialTexts[i]);

        notes.push(newNote);
        notesContainer.appendChild(newNote);
    }
});
