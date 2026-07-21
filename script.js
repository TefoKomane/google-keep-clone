// notes array
let allNotes = [];

// load notes from storage
function loadNotes() {
    let saved = localStorage.getItem('myNotes');
    if (saved != null) {
        allNotes = JSON.parse(saved);
        showAllNotes();
    }
}

// save notes to storage
function saveNotes() {
    localStorage.setItem('myNotes', JSON.stringify(allNotes));
}

// load on page start
loadNotes();


// get html elements
const addBtn = document.getElementById('addBtn');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const notesContainer = document.getElementById('notesContainer');

// dark mode button
const darkModeBtn = document.getElementById('darkModeBtn');

// check dark mode in storage
let darkMode = localStorage.getItem('darkMode');
if (darkMode == 'true') {
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = 'Light Mode';
}

// dark mode click
darkModeBtn.addEventListener('click', function() {
    toggleDarkMode();
});

// toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    // check if dark mode is on
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'true');
        darkModeBtn.textContent = 'Light Mode';
    } else {
        localStorage.setItem('darkMode', 'false');
        darkModeBtn.textContent = 'Dark Mode';
    }
}


// button click
addBtn.addEventListener('click', function() {
    addNewNote();
        // save to storage
    saveNotes();

});

// add note
function addNewNote() {
    let title = noteTitle.value;
    let content = noteContent.value;
    let color = document.getElementById('noteColor').value;

    // check empty
    if (title == '' || content == '') {
        alert('add title and content');
        return;
    }

    // make note object
    let newNote = {
        id: Date.now(),
        title: title,
        content: content,
        color: color,
        pinned: false
    };

    // add to array
    allNotes.push(newNote);

    // clear inputs
    noteTitle.value = '';
    noteContent.value = '';

    // show notes
    showAllNotes();

    // save to storage
    saveNotes();
}


// show notes
function showAllNotes() {
    // clear
    notesContainer.innerHTML = '';

    // loop notes
    for (let i = 0; i < allNotes.length; i++) {
        let note = allNotes[i];

        // make div
        let noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.color;

        // check if pinned
        if (note.pinned == true) {
            noteElement.classList.add('pinned-note');
        }

        // add html
        noteElement.innerHTML = '<div class="note-title">' + note.title + '</div>';
        noteElement.innerHTML += '<div class="note-content">' + note.content + '</div>';
        noteElement.innerHTML += '<div class="note-buttons">';
        noteElement.innerHTML += '<button class="note-pin" onclick="togglePin(' + note.id + ')">Pin</button>';
        noteElement.innerHTML += '<button class="note-delete" onclick="removeNote(' + note.id + ')">Delete</button>';
        noteElement.innerHTML += '</div>';

        // add to page
        notesContainer.appendChild(noteElement);
    }
}



// delete note
function removeNote(noteId) {
    // find note
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id == noteId) {
            allNotes.splice(i, 1);
            break;
        }
            // save to storage
    saveNotes();

    }

    // refresh
    showAllNotes();
}

// toggle pin
function togglePin(noteId) {
    // find note
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id == noteId) {
            if (allNotes[i].pinned == true) {
                allNotes[i].pinned = false;
            } else {
                allNotes[i].pinned = true;
            }
            break;
        }
    }

    // refresh
    showAllNotes();

    // save
    saveNotes();
}
