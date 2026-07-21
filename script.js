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

    // check empty
    if (title == '' || content == '') {
        alert('add title and content');
        return;
    }

    // make note object
    let newNote = {
        id: Date.now(),
        title: title,
        content: content
    };

    // add to array
    allNotes.push(newNote);

    // clear inputs
    noteTitle.value = '';
    noteContent.value = '';

    // show notes
    showAllNotes();
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

        // add html
        noteElement.innerHTML = '<div class="note-title">' + note.title + '</div>';
        noteElement.innerHTML += '<div class="note-content">' + note.content + '</div>';
        noteElement.innerHTML += '<button class="note-delete" onclick="removeNote(' + note.id + ')">Delete</button>';

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
