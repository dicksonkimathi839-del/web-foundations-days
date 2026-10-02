let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];

// 1. Search notes
function searchNotes(word) {
    return notes.filter(note =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}

// Test searchNotes
console.log(searchNotes("javascript")); // Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]
console.log(searchNotes("holiday")); // Expected: []


// 2. Find the longest note
function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (let i = 1; i < notes.length; i++) {
        if (notes[i].text.length > longest.text.length) {
            longest = notes[i];
        }
    }

    return longest;
}

// Test longestNote
console.log(longestNote()); // Expected: { id: 2, text: "Finish the Day 3 assignment", category: "study" }
console.log(longestNote() === null); // Expected: false


// 3. Count notes by category
function countByCategory() {
    let counts = {};

    for (let note of notes) {
        if (counts[note.category] === undefined) {
            counts[note.category] = 0;
        }

        counts[note.category]++;
    }

    return counts;
}

// Test countByCategory
console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }
console.log(countByCategory().unknown); // Expected: undefined


// 4. Get notes summary
function getSummary() {
    let counts = countByCategory();
    let total = notes.length;

    let noteWord = total === 1 ? "note" : "notes";

    return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

// Test getSummary
console.log(getSummary()); // Expected: "5 notes: 2 personal, 1 work, 2 study."
console.log(getSummary().includes("5 notes")); // Expected: true


// 5. Check for duplicate notes
function isDuplicate(text) {
    let cleanedText = text.trim().toLowerCase();

    return notes.some(note =>
        note.text.trim().toLowerCase() === cleanedText
    );
}

// Test isDuplicate
console.log(isDuplicate("  BUY MILK AND BREAD  ")); // Expected: true
console.log(isDuplicate("Go to the gym")); // Expected: false


// 6. Add a new note
function addNote(text, category) {
    let trimmedText = text.trim();
    let validCategories = ["personal", "work", "study"];

    if (trimmedText.length < 1 || trimmedText.length > 200) {
        console.log("Note was not added: text must be 1–200 characters.");
        return false;
    }

    if (isDuplicate(trimmedText)) {
        console.log("Note was not added: duplicate note.");
        return false;
    }

    if (!validCategories.includes(category)) {
        console.log("Note was not added: invalid category.");
        return false;
    }

    let newId = notes.length > 0
        ? Math.max(...notes.map(note => note.id)) + 1
        : 1;

    notes.push({
        id: newId,
        text: trimmedText,
        category: category
    });

    console.log("Note added successfully.");
    return true;
}

// Test addNote - normal case
console.log(addNote("Prepare for the next lesson", "study")); 
// Expected: Note added successfully. then true

// Test addNote - duplicate/edge case
console.log(addNote("  BUY MILK AND BREAD  ", "personal")); 
// Expected: Note was not added: duplicate note. then false

// Test addNote - invalid category
console.log(addNote("Plan weekend activities", "travel")); 
// Expected: Note was not added: invalid category. then false

// Test addNote - empty text
console.log(addNote("   ", "personal")); 
// Expected: Note was not added: text must be 1–200 characters. then false