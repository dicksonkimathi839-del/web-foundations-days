const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const categorySelect = document.getElementById("category-select");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");
const noteCount = document.getElementById("note-count");
const notesList = document.getElementById("notes-list");

let notes = [];

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

    if (notesToRender.length === 0 && searchInput.value.trim() !== "") {
        const message = document.createElement("li");
        message.className = "empty-message";
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
        updateCount();
        return;
    }

    notesToRender.forEach((note) => {
        const listItem = document.createElement("li");
        listItem.className = `note-card category-${note.category.toLowerCase()}`;

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

        meta.appendChild(categoryLabel);
        meta.appendChild(date);
        meta.appendChild(deleteButton);

        listItem.appendChild(noteText);
        listItem.appendChild(meta);

        notesList.appendChild(listItem);
    });

    updateCount();
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

    errorMessage.textContent = "";
    noteInput.value = "";

    renderNotes();
});

notesList.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const noteId = event.target.dataset.id;

    notes = notes.filter((note) => note.id !== noteId);

    renderNotes();
});