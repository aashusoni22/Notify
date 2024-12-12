const addNoteBtn = document.querySelector(".addNoteBtn");
const notes = document.querySelector(".notes");
const alertMsg = document.querySelector(".alertMsg");
const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const body = document.querySelector("body");
const modeBtn = document.querySelector(".modeBtn");
const noteFooter = document.querySelector(".noteFooter");

// Apply Dark Mode based on localStorage
const loadMode = () => {
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
};

// Enable Dark Mode
const enableDarkMode = () => {
  body.classList.add("bg-dark", "text-light");
  addNoteBtn.classList.remove("btn-dark");
  addNoteBtn.classList.add("btn-light");
  modeBtn.textContent = "Light Mode";
  localStorage.setItem("darkMode", "true");
};

// Disable Dark Mode
const disableDarkMode = () => {
  body.classList.remove("bg-dark", "text-light");
  addNoteBtn.classList.remove("btn-light");
  addNoteBtn.classList.add("btn-dark");
  modeBtn.textContent = "Dark Mode";
  modeBtn.classList.remove("btn-dark");
  modeBtn.classList.add("btn-light");
  localStorage.setItem("darkMode", "false");
};

// Toggle Dark Mode on button click
modeBtn.addEventListener("click", () => {
  if (body.classList.contains("bg-dark")) {
    disableDarkMode();
  } else {
    enableDarkMode();
  }
});

// Load the saved mode on page load
window.addEventListener("load", () => {
  loadMode();
});

const saveToLocalStorage = () => {
  const allNotes = Array.from(notes.children).map((note) => {
    return {
      text: note.querySelector(".textAreaInNewNote").value,
      date: note.querySelector(".dateTimeDetails").textContent,
      count: note.querySelector(".counter").textContent,
    };
  });
  localStorage.setItem("notes", JSON.stringify(allNotes));
};

const loadFromLocalStorage = () => {
  const savedNotes = JSON.parse(localStorage.getItem("notes"));
  if (savedNotes) {
    savedNotes.forEach(({ text, date, count }) => {
      addNote(text, date, count);
    });
  }
};

const addNote = (
  noteText = "",
  dateTime = new Date().toLocaleString(),
  count
) => {
  const newNote = document.createElement("div");
  newNote.classList.add("newNote");

  const textAreaInNewNote = document.createElement("textarea");
  textAreaInNewNote.classList.add(
    "textAreaInNewNote",
    "form-control",
    "shadow-none"
  );
  textAreaInNewNote.placeholder = "Add note here...";
  textAreaInNewNote.rows = 8;
  textAreaInNewNote.cols = 35;
  textAreaInNewNote.minLength = 1;
  textAreaInNewNote.maxLength = 250;
  textAreaInNewNote.value = noteText;
  textAreaInNewNote.readOnly = noteText !== "";

  const noteFooter = document.createElement("div");
  noteFooter.classList.add("noteFooter");

  const dateTimeDetails = document.createElement("p");
  dateTimeDetails.classList.add("dateTimeDetails");
  dateTimeDetails.textContent = dateTime;

  const counter = document.createElement("p");
  counter.classList.add("counter");
  counter.textContent = count;

  const actionBtns = document.createElement("div");
  actionBtns.classList.add("actionBtns");

  const saveBtn = document.createElement("button");
  saveBtn.classList.add("saveBtn", "btn", "btn-success");
  saveBtn.type = "button";
  saveBtn.textContent = "Save";
  saveBtn.style.display = noteText === "" ? "block" : "none";

  const editBtn = document.createElement("button");
  editBtn.classList.add("editBtn", "btn", "btn-primary");
  editBtn.type = "button";
  editBtn.textContent = "Edit";
  editBtn.style.display = noteText !== "" ? "block" : "none";

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn", "btn", "btn-danger");
  deleteBtn.type = "button";
  deleteBtn.textContent = "Delete";
  deleteBtn.style.display = noteText !== "" ? "block" : "none";

  editBtn.addEventListener("click", () => {
    textAreaInNewNote.focus();
    textAreaInNewNote.readOnly = false;
    saveBtn.style.display = "block";
    editBtn.style.display = "none";
  });

  saveBtn.addEventListener("click", () => {
    if (textAreaInNewNote.value.trim()) {
      textAreaInNewNote.readOnly = true;
      saveBtn.style.display = "none";
      editBtn.style.display = "block";
      deleteBtn.style.display = "block";
      alertUser("Note saved successfully!", "alert-success");
      saveToLocalStorage();
    }
  });

  deleteBtn.addEventListener("click", () => {
    newNote.remove();
    alertUser("Note deleted successfully!", "alert-danger");
    saveToLocalStorage();
  });

  textAreaInNewNote.addEventListener("focusout", () => {
    if (!textAreaInNewNote.readOnly && textAreaInNewNote.value.trim()) {
      saveBtn.click();
    } else if (!textAreaInNewNote.readOnly && !textAreaInNewNote.value.trim()) {
      newNote.remove();
      saveToLocalStorage();
    }
  });

  textAreaInNewNote.addEventListener("input", (e) => {
    const currentCounter = newNote.querySelector(".counter");
    const count = e.target.value.length;
    currentCounter.textContent = `${count}/250`;
    saveToLocalStorage();
  });

  setTimeout(() => {
    newNote.classList.add("loaded");
  }, 100);

  actionBtns.appendChild(saveBtn);
  actionBtns.appendChild(editBtn);
  actionBtns.appendChild(deleteBtn);

  newNote.appendChild(textAreaInNewNote);
  noteFooter.appendChild(dateTimeDetails);
  noteFooter.appendChild(counter);
  newNote.appendChild(noteFooter);
  newNote.appendChild(actionBtns);

  notes.appendChild(newNote);
  textAreaInNewNote.focus();
};

const alertUser = (message, alertClass) => {
  alertMsg.style.display = "block";
  alertMsg.classList.add(`${alertClass}`);
  alertMsg.textContent = message;
  setTimeout(() => {
    alertMsg.style.display = "none";
  }, 2000);
};

addNoteBtn.addEventListener("click", () => {
  addNote();
  saveToLocalStorage();
});

window.addEventListener("load", () => {
  loadFromLocalStorage();
});

searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  const allNotes = Array.from(notes.children);

  allNotes.forEach((note) => {
    const noteText = note
      .querySelector(".textAreaInNewNote")
      .value.toLowerCase();
    note.style.display = noteText.includes(searchValue) ? "block" : "none";
  });
});
