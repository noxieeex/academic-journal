/* ========================================
   ACADEMIC JOURNAL — SUBJECT
======================================== */


/* ========================================
   GET SUBJECT ID
======================================== */

const params =
  new URLSearchParams(window.location.search);

const subjectId =
  params.get("id");


/* ========================================
   LOAD JOURNAL
======================================== */

let subjects =
  loadJournalSubjects();

const subject =
  subjects.find(
    (item) => item.id === subjectId
  );


/* ========================================
   PAGE ELEMENTS
======================================== */

const subjectName =
  document.getElementById("subject-page-name");

const subjectDescription =
  document.getElementById("subject-page-description");

const subjectNote =
  document.getElementById("subject-page-note");

const entriesList =
  document.getElementById("entries-list");

const entriesEmpty =
  document.getElementById("entries-empty");


/* ========================================
   ENTRY MODAL ELEMENTS
======================================== */

const addEntryButton =
  document.getElementById("add-entry");

const entryModal =
  document.getElementById("entry-modal");

const entryModalBackdrop =
  document.querySelector(".entry-modal-backdrop");

const entryModalClose =
  document.getElementById("entry-modal-close");

const entryModalCancel =
  document.getElementById("entry-modal-cancel");

const entryForm =
  document.getElementById("entry-form");

const entryTitle =
  document.getElementById("entry-title");

const entryType =
  document.getElementById("entry-type");

const entryDescription =
  document.getElementById("entry-description");

const entryNote =
  document.getElementById("entry-note");


/* ========================================
   ENTRY MODAL TEXT
======================================== */

const entryModalLabel =
  entryModal.querySelector(".small-title");

const entryModalHeading =
  entryModal.querySelector("h2");

const entrySubmitButton =
  entryForm.querySelector(".modal-save");


/* ========================================
   CONFIRMATION MODAL ELEMENTS
======================================== */

const confirmModal =
  document.getElementById("confirm-modal");

const confirmBackdrop =
  document.querySelector(".confirm-modal-backdrop");

const confirmLabel =
  document.getElementById("confirm-label");

const confirmTitle =
  document.getElementById("confirm-title");

const confirmMessage =
  document.getElementById("confirm-message");

const confirmWarning =
  document.getElementById("confirm-warning");

const confirmCancel =
  document.getElementById("confirm-cancel");

const confirmAction =
  document.getElementById("confirm-action");


/* ========================================
   STATE
======================================== */

/*
   mode:
   "add"  = creating a new entry
   "edit" = editing an existing entry
*/

let entryMode = "add";

let editingEntryId = null;

let pendingAction = null;


/* ========================================
   SUBJECT NOT FOUND
======================================== */

if (!subject) {

  subjectName.textContent =
    "Subject not found";

  subjectDescription.textContent =
    "This subject does not exist.";

  subjectNote.style.display =
    "none";

  addEntryButton.style.display =
    "none";

}


/* ========================================
   RENDER SUBJECT
======================================== */

else {

  document.title =
    `${subject.name} | Academic Journal`;

  subjectName.textContent =
    subject.name;

  subjectDescription.textContent =
    subject.description;


  if (subject.note) {

    subjectNote.textContent =
      subject.note;

  }
  else {

    subjectNote.style.display =
      "none";

  }


  renderEntries();

}


/* ========================================
   RENDER ENTRIES
======================================== */

function renderEntries() {

  if (!subject) {
    return;
  }


  const entries =
    subject.entries || [];

  entriesList.innerHTML = "";


  /* ---------- Empty ---------- */

  if (entries.length === 0) {

    entriesEmpty.style.display =
      "block";

    return;

  }


  entriesEmpty.style.display =
    "none";


  /* ---------- Entries ---------- */

  entries.forEach(
    (entry, index) => {

      /* =================================
         CARD
      ================================= */

      const card =
        document.createElement("div");

      card.classList.add("entry-card");


      /* =================================
         MAIN LINK
      ================================= */

      const main =
  document.createElement("a");

main.classList.add(
  "entry-main"
);


if (entry.page) {

  /*
     Custom HTML page.
  */

  main.href =
    entry.page;

}
else {

  /*
     Generic journal entry.
  */

  main.href =
    `entry.html?subject=${encodeURIComponent(
      subject.id
    )}&entry=${encodeURIComponent(
      entry.id
    )}`;

}


      /* ---------- Number ---------- */

      const number =
        document.createElement("span");

      number.classList.add(
        "entry-number"
      );

      number.textContent =
        String(index + 1)
          .padStart(2, "0");


      /* ---------- Content ---------- */

      const content =
        document.createElement("div");

      content.classList.add(
        "entry-content"
      );


      const type =
        document.createElement("span");

      type.classList.add(
        "entry-type"
      );

      type.textContent =
        entry.type || "ENTRY";


      const title =
        document.createElement("h3");

      title.textContent =
        entry.title;


      const description =
        document.createElement("p");

      description.textContent =
        entry.description || "";


      content.appendChild(type);
      content.appendChild(title);
      content.appendChild(description);


      /* ---------- Note ---------- */

      if (entry.note) {

        const note =
          document.createElement("span");

        note.classList.add(
          "entry-note"
        );

        note.textContent =
          entry.note;

        content.appendChild(note);

      }


      main.appendChild(number);
      main.appendChild(content);


      /* =================================
         MENU
      ================================= */

      const menuWrapper =
        document.createElement("div");

      menuWrapper.classList.add(
        "entry-menu-wrapper"
      );


      const menuButton =
        document.createElement("button");

      menuButton.classList.add(
        "entry-menu-button"
      );

      menuButton.type =
        "button";

      menuButton.textContent =
        "···";

      menuButton.setAttribute(
        "aria-label",
        `Options for ${entry.title}`
      );


      const menu =
        document.createElement("div");

      menu.classList.add(
        "entry-menu"
      );


      /* ---------- Edit ---------- */

      const editButton =
        document.createElement("button");

      editButton.type =
        "button";

      editButton.textContent =
        "Edit";


      editButton.addEventListener(
        "click",
        () => {

          closeAllEntryMenus();

          openEditEntryModal(
            entry.id
          );

        }
      );


      /* ---------- Delete ---------- */

      const deleteButton =
        document.createElement("button");

      deleteButton.type =
        "button";

      deleteButton.textContent =
        "Delete";

      deleteButton.classList.add(
        "entry-delete-option"
      );


      deleteButton.addEventListener(
        "click",
        () => {

          closeAllEntryMenus();

          askDeleteEntry(
            entry.id
          );

        }
      );


      menu.appendChild(editButton);
      menu.appendChild(deleteButton);

      menuWrapper.appendChild(
        menuButton
      );

      menuWrapper.appendChild(
        menu
      );


      /* ---------- Open Menu ---------- */

      menuButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          const isOpen =
            menu.classList.contains(
              "open"
            );

          closeAllEntryMenus();


          if (!isOpen) {

            menu.classList.add(
              "open"
            );

          }

        }
      );


      /* =================================
         ASSEMBLE
      ================================= */

      card.appendChild(main);
      card.appendChild(menuWrapper);

      entriesList.appendChild(card);

    }
  );

}


/* ========================================
   CLOSE ENTRY MENUS
======================================== */

function closeAllEntryMenus() {

  document
    .querySelectorAll(".entry-menu")
    .forEach(
      (menu) => {

        menu.classList.remove(
          "open"
        );

      }
    );

}


/* ========================================
   CREATE ENTRY ID
======================================== */

function createEntryId(title) {

  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

}


/* ========================================
   OPEN ADD ENTRY MODAL
======================================== */

function openAddEntryModal() {

  if (!subject) {
    return;
  }


  entryMode =
    "add";

  editingEntryId =
    null;


  entryForm.reset();


  entryModalLabel.textContent =
    "NEW ENTRY";

  entryModalHeading.textContent =
    "Add Entry";

  entrySubmitButton.textContent =
    "Add Entry";


  entryModal.classList.add(
    "open"
  );


  setTimeout(
    () => {

      entryTitle.focus();

    },
    100
  );

}


/* ========================================
   OPEN EDIT ENTRY MODAL
======================================== */

function openEditEntryModal(entryId) {

  const entry =
    subject.entries.find(
      (item) =>
        item.id === entryId
    );


  if (!entry) {
    return;
  }


  entryMode =
    "edit";

  editingEntryId =
    entry.id;


  entryTitle.value =
    entry.title;

  entryType.value =
    entry.type || "Other";

  entryDescription.value =
    entry.description || "";

  entryNote.value =
    entry.note || "";


  entryModalLabel.textContent =
    "EDIT ENTRY";

  entryModalHeading.textContent =
    "Edit Entry";

  entrySubmitButton.textContent =
    "Save Changes";


  entryModal.classList.add(
    "open"
  );


  setTimeout(
    () => {

      entryTitle.focus();

    },
    100
  );

}


/* ========================================
   CLOSE ENTRY MODAL
======================================== */

function closeEntryModal() {

  entryModal.classList.remove(
    "open"
  );

  entryForm.reset();

  entryMode =
    "add";

  editingEntryId =
    null;

}


/* ========================================
   ADD / EDIT ENTRY
======================================== */

entryForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    if (!subject) {
      return;
    }


    const values = {

      title:
        entryTitle.value.trim(),

      type:
        entryType.value,

      description:
        entryDescription.value.trim(),

      note:
        entryNote.value.trim()

    };


    if (!values.title) {
      return;
    }


    /* =================================
       ADD
    ================================= */

    if (entryMode === "add") {

      const newEntry = {

        id:
          createEntryId(
            values.title
          ),

        title:
          values.title,

        type:
          values.type,

        description:
          values.description,

        note:
          values.note,

        page: ""

      };


      if (
        !Array.isArray(
          subject.entries
        )
      ) {

        subject.entries = [];

      }


      subject.entries.push(
        newEntry
      );


      saveJournalSubjects(
        subjects
      );

      renderEntries();

      closeEntryModal();

      return;

    }


    /* =================================
       EDIT
    ================================= */

    if (entryMode === "edit") {

      const entry =
        subject.entries.find(
          (item) =>
            item.id ===
            editingEntryId
        );


      if (!entry) {
        return;
      }


      /*
         Do NOT change anything yet.

         Store the proposed changes and
         ask for confirmation first.
      */

      pendingAction = {

        type:
          "edit",

        entryId:
          entry.id,

        values:
          values

      };


      entryModal.classList.remove(
        "open"
      );


      openConfirmModal({

        label:
          "SAVE CHANGES",

        title:
          "Are you sure?",

        message:
          `Are you sure you want to save these changes to "${entry.title}"?`,

        warning:
          "",

        button:
          "Yes, save"

      });

    }

  }
);


/* ========================================
   ASK DELETE ENTRY
======================================== */

function askDeleteEntry(entryId) {

  const entry =
    subject.entries.find(
      (item) =>
        item.id === entryId
    );


  if (!entry) {
    return;
  }


  pendingAction = {

    type:
      "delete",

    entryId:
      entry.id

  };


  openConfirmModal({

    label:
      "DELETE ENTRY",

    title:
      "Are you sure?",

    message:
      `Are you sure you want to delete "${entry.title}"?`,

    warning:
      "This action cannot be undone.",

    button:
      "Yes, delete"

  });

}


/* ========================================
   OPEN CONFIRM MODAL
======================================== */

function openConfirmModal(options) {

  confirmLabel.textContent =
    options.label;

  confirmTitle.textContent =
    options.title;

  confirmMessage.textContent =
    options.message;

  confirmWarning.textContent =
    options.warning;

  confirmAction.textContent =
    options.button;


  if (
    pendingAction?.type ===
    "delete"
  ) {

    confirmAction.classList.add(
      "danger"
    );

  }
  else {

    confirmAction.classList.remove(
      "danger"
    );

  }


  confirmModal.classList.add(
    "open"
  );

}


/* ========================================
   CLOSE CONFIRM MODAL
======================================== */

function closeConfirmModal() {

  confirmModal.classList.remove(
    "open"
  );

  pendingAction =
    null;

}


/* ========================================
   CONFIRM ACTION
======================================== */

confirmAction.addEventListener(
  "click",
  () => {

    if (!pendingAction) {
      return;
    }


    /* =================================
       CONFIRM EDIT
    ================================= */

    if (
      pendingAction.type ===
      "edit"
    ) {

      const entry =
        subject.entries.find(
          (item) =>
            item.id ===
            pendingAction.entryId
        );


      if (entry) {

        const oldId =
          entry.id;


        entry.title =
          pendingAction.values.title;

        entry.type =
          pendingAction.values.type;

        entry.description =
          pendingAction.values.description;

        entry.note =
          pendingAction.values.note;


        /*
           Keep the ID for existing entries.

           This avoids breaking references
           just because the title changed.
        */

        entry.id =
          oldId;


        saveJournalSubjects(
          subjects
        );

        renderEntries();

      }


      confirmModal.classList.remove(
        "open"
      );

      pendingAction =
        null;

      entryForm.reset();

      entryMode =
        "add";

      editingEntryId =
        null;

      return;

    }


    /* =================================
       CONFIRM DELETE
    ================================= */

    if (
      pendingAction.type ===
      "delete"
    ) {

      subject.entries =
        subject.entries.filter(
          (entry) =>
            entry.id !==
            pendingAction.entryId
        );


      saveJournalSubjects(
        subjects
      );

      renderEntries();


      confirmModal.classList.remove(
        "open"
      );

      pendingAction =
        null;

    }

  }
);


/* ========================================
   ENTRY MODAL EVENTS
======================================== */

addEntryButton.addEventListener(
  "click",
  openAddEntryModal
);


entryModalClose.addEventListener(
  "click",
  closeEntryModal
);


entryModalCancel.addEventListener(
  "click",
  closeEntryModal
);


entryModalBackdrop.addEventListener(
  "click",
  closeEntryModal
);


/* ========================================
   CONFIRM MODAL EVENTS
======================================== */

confirmCancel.addEventListener(
  "click",
  closeConfirmModal
);


confirmBackdrop.addEventListener(
  "click",
  closeConfirmModal
);


/* ========================================
   GLOBAL EVENTS
======================================== */

document.addEventListener(
  "click",
  () => {

    closeAllEntryMenus();

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Escape") {
      return;
    }


    closeAllEntryMenus();


    if (
      confirmModal.classList.contains(
        "open"
      )
    ) {

      closeConfirmModal();

      return;

    }


    if (
      entryModal.classList.contains(
        "open"
      )
    ) {

      closeEntryModal();

    }

  }
);