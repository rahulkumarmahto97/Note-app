document.getElementById('note-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const noteInput = document.getElementById('note-input');
    const note = noteInput.value.trim();
    if (note) {
        addNoteToDOM(note);
        saveNoteToLocalStorage(note);
        noteInput.value = '';
        updateNoteCounts();
    }
});

document.getElementById('clear-notes').addEventListener('click', clearAllNotes);

function addNoteToDOM(note, id = Date.now()) {
    const notesList = document.getElementById('notes-list');
    const noteItem = document.createElement('li');
    noteItem.className = 'note-item';
    noteItem.dataset.id = id;

    const noteCount = document.createElement('span');
    noteCount.className = 'note-count';

    const noteText = document.createElement('span');
    noteText.className = 'note-content';
    noteText.textContent = note;

    const editButton = document.createElement('span');
    editButton.id = 'edit-btn';
    editButton.className = 'material-symbols-outlined edit';
    editButton.textContent = 'edit';
    editButton.addEventListener('click', () => editNote(noteItem, noteText));

    const deleteButton = document.createElement('span');
    deleteButton.id = 'remove-btn'; 
    deleteButton.className = 'material-symbols-outlined';
    deleteButton.textContent = 'remove';
    deleteButton.addEventListener('click', () => {
        notesList.removeChild(noteItem);
        removeNoteFromLocalStorage(id);
        updateNoteCounts();
    });

    noteItem.appendChild(noteCount);
    noteItem.appendChild(noteText);
    noteItem.appendChild(editButton);
    noteItem.appendChild(deleteButton);
    notesList.appendChild(noteItem);
    updateNoteCounts();
}

function editNote(noteItem, noteText) {
    const newNote = prompt('Edit your note:', noteText.textContent);
    if (newNote !== null) {
        noteText.textContent = newNote.trim();
        updateNoteInLocalStorage(noteItem.dataset.id, newNote);
    }
}

function saveNoteToLocalStorage(note) {
    const notes = getNotesFromLocalStorage();
    const noteObj = { id: Date.now(), content: note };
    notes.push(noteObj);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function getNotesFromLocalStorage() {
    const notes = localStorage.getItem('notes');
    return notes ? JSON.parse(notes) : [];
}

function removeNoteFromLocalStorage(id) {
    let notes = getNotesFromLocalStorage();
    notes = notes.filter(note => note.id != id);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function updateNoteInLocalStorage(id, newContent) {
    const notes = getNotesFromLocalStorage();
    const noteIndex = notes.findIndex(note => note.id == id);
    if (noteIndex > -1) {
        notes[noteIndex].content = newContent;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

function clearAllNotes() {
    document.getElementById('notes-list').innerHTML = '';
    localStorage.removeItem('notes');
    updateNoteCounts();
}

function updateNoteCounts() {
    const notesList = document.getElementById('notes-list');
    const noteItems = notesList.querySelectorAll('.note-item');
    noteItems.forEach((noteItem, index) => {
        const noteCount = noteItem.querySelector('.note-count');
        noteCount.textContent = `${index + 1}.`;
    });
}

function loadNotes() {
    const notes = getNotesFromLocalStorage();
    notes.forEach(note => addNoteToDOM(note.content, note.id));
    updateNoteCounts();
}

// Load notes from local storage on page load
window.addEventListener('load', loadNotes);
