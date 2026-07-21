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

// clear all button
const clearAllBtn = document.getElementById('clearAllBtn');

// clear all click
clearAllBtn.addEventListener('click', function() {
    clearAllNotes();
});

// clear all notes
function clearAllNotes() {
    let confirm = window.confirm('Are you sure you want to delete all notes?');

    if (confirm == true) {
        allNotes = [];
        showAllNotes();
        saveNotes();
    }
}


// search input
const searchInput = document.getElementById('searchInput');

// search event
searchInput.addEventListener('keyup', function() {
    searchNotes();
});

// search notes
function searchNotes() {
    let searchTerm = searchInput.value.toLowerCase();

    // get all note elements
    let noteElements = document.querySelectorAll('.note');

    // loop through notes
    noteElements.forEach(function(noteElement) {
        let title = noteElement.querySelector('.note-title').textContent.toLowerCase();
        let content = noteElement.querySelector('.note-content').textContent.toLowerCase();

        // check if search term matches
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            noteElement.style.display = 'block';
        } else {
            noteElement.style.display = 'none';
        }
    });
}


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
        noteElement.draggable = true;
        noteElement.id = 'note-' + note.id;
        noteElement.style.backgroundColor = note.color;

        // check if pinned
        if (note.pinned == true) {
            noteElement.classList.add('pinned-note');
        }

        // add html
        noteElement.innerHTML = '<div class="note-title">' + note.title + '</div>';
        noteElement.innerHTML += '<div class="note-content">' + note.content + '</div>';
        noteElement.innerHTML += '<div class="note-buttons">';
        noteElement.innerHTML += '<button class="note-edit" onclick="editNote(' + note.id + ')">Edit</button>';
        noteElement.innerHTML += '<button class="note-pin" onclick="togglePin(' + note.id + ')">Pin</button>';
        noteElement.innerHTML += '<button class="note-delete" onclick="removeNote(' + note.id + ')">Delete</button>';
        noteElement.innerHTML += '</div>';

        // drag events
        noteElement.addEventListener('dragstart', handleDragStart);
        noteElement.addEventListener('dragover', handleDragOver);
        noteElement.addEventListener('drop', handleDrop);
        noteElement.addEventListener('dragend', handleDragEnd);

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

// drag variables
let draggedNote = null;

// drag start
function handleDragStart(e) {
    draggedNote = this;
    this.style.opacity = '0.5';
}

// drag over
function handleDragOver(e) {
    e.preventDefault();
}

// drop
function handleDrop(e) {
    e.preventDefault();

    if (draggedNote != this) {
        // swap notes
        let draggedId = draggedNote.id.replace('note-', '');
        let droppedId = this.id.replace('note-', '');

        let draggedIndex = -1;
        let droppedIndex = -1;

        for (let i = 0; i < allNotes.length; i++) {
            if (allNotes[i].id == draggedId) {
                draggedIndex = i;
            }
            if (allNotes[i].id == droppedId) {
                droppedIndex = i;
            }
        }

        // swap
        let temp = allNotes[draggedIndex];
        allNotes[draggedIndex] = allNotes[droppedIndex];
        allNotes[droppedIndex] = temp;

        // refresh
        showAllNotes();

        // save
        saveNotes();
    }
}

// drag end
function handleDragEnd(e) {
    this.style.opacity = '1';
}

// edit note
function editNote(noteId) {
    let note = null;

    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id == noteId) {
            note = allNotes[i];
            break;
        }
    }

    if (note != null) {
        noteTitle.value = note.title;
        noteContent.value = note.content;
        document.getElementById('noteColor').value = note.color;

        removeNote(noteId);
    }
}
