const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const categorySelect = document.getElementById("category-select");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");
const noteCount = document.getElementById("note-count");
const notesList = document.getElementById("notes-list");

const STORAGE_KEY = "quicknotes-notes";

let notes = [];

function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadNotes() {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (savedNotes) {
        try {
            notes = JSON.parse(savedNotes);

            if (!Array.isArray(notes)) {
                notes = [];
            }
        } catch (error) {
            notes = [];
        }
    }
}

function updateCount() {
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

function renderNotes(notesToRender = notes) {
    notesList.innerHTML = "";

    if (notesToRender.length === 0) {
        const message = document.createElement("li");
        message.className = "empty-message";

        if (searchInput.value.trim() !== "") {
            message.textContent = "No notes match your search.";
        } else {
            message.textContent = "No notes to display.";
        }

        notesList.appendChild(message);
        updateCount();
        return;
    }

    notesToRender.forEach((note) => {
        const listItem = document.createElement("li");
        listItem.className =
            `note-card category-${note.category.toLowerCase()}`;

        const noteText = document.createElement("p");
        noteText.className = "note-text";
        noteText.textContent = note.text;

        const meta = document.createElement("div");
        meta.className = "note-meta";

        const categoryLabel = document.createElement("span");
        categoryLabel.className = "category-label";
        categoryLabel.textContent = note.category;

        const date = document.createElement("span");
        date.className = "note-date";
        date.textContent = note.createdAt;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = note.id;

        const clearAllBtn = document.getElementById("clear-all-btn");

        meta.appendChild(categoryLabel);
        meta.appendChild(date);
        meta.appendChild(deleteButton);

        listItem.appendChild(noteText);
        listItem.appendChild(meta);

        notesList.appendChild(listItem);
    });

    updateCount();
}

function filterNotes() {
    const searchWords = searchInput.value.trim().toLowerCase();

    if (searchWords === "") {
        renderNotes(notes);
        return;
    }

    const filteredNotes = notes.filter((note) =>
        note.text.toLowerCase().includes(searchWords)
    );

    renderNotes(filteredNotes);
}

noteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = categorySelect.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }

    const note = {
        id: Date.now().toString(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(note);

    saveNotes();

    errorMessage.textContent = "";
    noteInput.value = "";

    filterNotes();
});

notesList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const noteId = event.target.dataset.id;

    notes = notes.filter((note) => note.id !== noteId);

    saveNotes();
    filterNotes();
});

searchInput.addEventListener("input", filterNotes);

loadNotes();
renderNotes();
clearAllBtn.addEventListener("click", () => {
    if (confirm("Delete all notes?")) {
        notes = [];
        saveNotes();
        filterNotes();
    }
});