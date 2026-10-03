/* ========================================
   ACADEMIC JOURNAL — HOME
======================================== */


/* ========================================
   ELEMENTS
======================================== */

const subjectsList =
  document.getElementById("subjects-list");

const addSubjectButton =
  document.getElementById("add-subject");

const subjectModal =
  document.getElementById("subject-modal");

const subjectForm =
  document.getElementById("subject-form");

const modalClose =
  document.getElementById("modal-close");

const modalCancel =
  document.getElementById("modal-cancel");

const modalBackdrop =
  document.querySelector(
    ".subject-modal-backdrop"
  );

const subjectName =
  document.getElementById("subject-name");

const subjectDescription =
  document.getElementById(
    "subject-description"
  );

const subjectNote =
  document.getElementById("subject-note");


/* ========================================
   SUBJECT MODAL TEXT
======================================== */

const subjectModalLabel =
  subjectModal.querySelector(
    ".small-title"
  );

const subjectModalHeading =
  subjectModal.querySelector("h2");

const subjectSubmitButton =
  subjectForm.querySelector(
    ".modal-save"
  );


/* ========================================
   CONFIRMATION MODAL
======================================== */

const confirmModal =
  document.getElementById(
    "subject-confirm-modal"
  );

const confirmBackdrop =
  document.querySelector(
    ".subject-confirm-modal-backdrop"
  );

const confirmLabel =
  document.getElementById(
    "subject-confirm-label"
  );

const confirmTitle =
  document.getElementById(
    "subject-confirm-title"
  );

const confirmMessage =
  document.getElementById(
    "subject-confirm-message"
  );

const confirmWarning =
  document.getElementById(
    "subject-confirm-warning"
  );

const confirmCancel =
  document.getElementById(
    "subject-confirm-cancel"
  );

const confirmAction =
  document.getElementById(
    "subject-confirm-action"
  );


/* ========================================
   STATE
======================================== */

let subjects =
  loadJournalSubjects();

let subjectMode =
  "add";

let editingSubjectId =
  null;

let pendingAction =
  null;


/*
   Save once so older data uses
   the current structure.
*/

saveJournalSubjects(subjects);


/* ========================================
   CREATE SUBJECT ID
======================================== */

function createSubjectId(name) {

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

}


/* ========================================
   RENDER SUBJECTS
======================================== */

function renderSubjects() {

  subjectsList.innerHTML = "";


  const sortedSubjects =
    [...subjects].sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          "en",
          {
            sensitivity: "base"
          }
        )
    );


  sortedSubjects.forEach(
    (subject, index) => {

      /* =================================
         CARD
      ================================= */

      const card =
        document.createElement("div");

      card.classList.add(
        "subject-card"
      );


      /* =================================
         MAIN LINK
      ================================= */

      const main =
        document.createElement("a");

      main.classList.add(
        "subject-main"
      );

      main.href =
        `subject.html?id=${encodeURIComponent(
          subject.id
        )}`;


      /* ---------- Number ---------- */

      const number =
        document.createElement("span");

      number.classList.add(
        "subject-number"
      );

      number.textContent =
        String(index + 1)
          .padStart(2, "0");


      /* ---------- Content ---------- */

      const content =
        document.createElement("div");

      content.classList.add(
        "subject-content"
      );


      const title =
        document.createElement("h3");

      title.textContent =
        subject.name;


      const description =
        document.createElement("p");

      description.textContent =
        subject.description || "";


      content.appendChild(title);
      content.appendChild(description);


      /* ---------- Note ---------- */

      if (subject.note) {

        const note =
          document.createElement("span");

        note.classList.add(
          "subject-note"
        );

        note.textContent =
          subject.note;

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
        "subject-menu-wrapper"
      );


      const menuButton =
        document.createElement("button");

      menuButton.classList.add(
        "subject-menu-button"
      );

      menuButton.type =
        "button";

      menuButton.textContent =
        "···";

      menuButton.setAttribute(
        "aria-label",
        `Options for ${subject.name}`
      );


      const menu =
        document.createElement("div");

      menu.classList.add(
        "subject-menu"
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
        (event) => {

          event.stopPropagation();

          closeAllSubjectMenus();

          openEditSubjectModal(
            subject.id
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
        "subject-delete-option"
      );


      deleteButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          closeAllSubjectMenus();

          askDeleteSubject(
            subject.id
          );

        }
      );


      menu.appendChild(
        editButton
      );

      menu.appendChild(
        deleteButton
      );

      menuWrapper.appendChild(
        menuButton
      );

      menuWrapper.appendChild(
        menu
      );


      /* ---------- Open menu ---------- */

      menuButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          const isOpen =
            menu.classList.contains(
              "open"
            );


          closeAllSubjectMenus();


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

      card.appendChild(
        menuWrapper
      );

      subjectsList.appendChild(
        card
      );

    }
  );

}


/* ========================================
   CLOSE SUBJECT MENUS
======================================== */

function closeAllSubjectMenus() {

  document
    .querySelectorAll(
      ".subject-menu"
    )
    .forEach(
      (menu) => {

        menu.classList.remove(
          "open"
        );

      }
    );

}


/* ========================================
   OPEN ADD SUBJECT
======================================== */

function openAddSubjectModal() {

  subjectMode =
    "add";

  editingSubjectId =
    null;


  subjectForm.reset();


  subjectModalLabel.textContent =
    "NEW SUBJECT";

  subjectModalHeading.textContent =
    "Add Subject";

  subjectSubmitButton.textContent =
    "Add Subject";


  subjectModal.classList.add(
    "open"
  );


  setTimeout(
    () => {

      subjectName.focus();

    },
    100
  );

}


/* ========================================
   OPEN EDIT SUBJECT
======================================== */

function openEditSubjectModal(
  subjectId
) {

  const subject =
    subjects.find(
      (item) =>
        item.id === subjectId
    );


  if (!subject) {
    return;
  }


  subjectMode =
    "edit";

  editingSubjectId =
    subject.id;


  subjectName.value =
    subject.name;

  subjectDescription.value =
    subject.description || "";

  subjectNote.value =
    subject.note || "";


  subjectModalLabel.textContent =
    "EDIT SUBJECT";

  subjectModalHeading.textContent =
    "Edit Subject";

  subjectSubmitButton.textContent =
    "Save Changes";


  subjectModal.classList.add(
    "open"
  );


  setTimeout(
    () => {

      subjectName.focus();

    },
    100
  );

}


/* ========================================
   CLOSE SUBJECT MODAL
======================================== */

function closeSubjectModal() {

  subjectModal.classList.remove(
    "open"
  );

  subjectForm.reset();

  subjectMode =
    "add";

  editingSubjectId =
    null;

}


/* ========================================
   ADD / EDIT SUBJECT
======================================== */

subjectForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const values = {

      name:
        subjectName.value.trim(),

      description:
        subjectDescription.value.trim(),

      note:
        subjectNote.value.trim()

    };


    if (
      !values.name ||
      !values.description
    ) {

      return;

    }


    /* =================================
       ADD
    ================================= */

    if (
      subjectMode === "add"
    ) {

      const newSubject = {

        id:
          createSubjectId(
            values.name
          ),

        name:
          values.name,

        description:
          values.description,

        note:
          values.note,

        entries: []

      };


      subjects.push(
        newSubject
      );


      saveJournalSubjects(
        subjects
      );

      renderSubjects();

      closeSubjectModal();

      return;

    }


    /* =================================
       EDIT
    ================================= */

    if (
      subjectMode === "edit"
    ) {

      const subject =
        subjects.find(
          (item) =>
            item.id ===
            editingSubjectId
        );


      if (!subject) {
        return;
      }


      /*
         Do not change the subject yet.
         Ask for confirmation first.
      */

      pendingAction = {

        type:
          "edit",

        subjectId:
          subject.id,

        values:
          values

      };


      subjectModal.classList.remove(
        "open"
      );


      openConfirmModal({

        label:
          "SAVE CHANGES",

        title:
          "Are you sure?",

        message:
          `Are you sure you want to save these changes to "${subject.name}"?`,

        warning:
          "",

        button:
          "Yes, save"

      });

    }

  }
);


/* ========================================
   ASK DELETE SUBJECT
======================================== */

function askDeleteSubject(
  subjectId
) {

  const subject =
    subjects.find(
      (item) =>
        item.id === subjectId
    );


  if (!subject) {
    return;
  }


  pendingAction = {

    type:
      "delete",

    subjectId:
      subject.id

  };


  openConfirmModal({

    label:
      "DELETE SUBJECT",

    title:
      "Are you sure?",

    message:
      `Are you sure you want to delete "${subject.name}"?`,

    warning:
      "This removes the subject and its entries from the journal. Physical files will not be deleted.",

    button:
      "Yes, delete"

  });

}


/* ========================================
   OPEN CONFIRMATION
======================================== */

function openConfirmModal(
  options
) {

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
   CLOSE CONFIRMATION
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

      const subject =
        subjects.find(
          (item) =>
            item.id ===
            pendingAction.subjectId
        );


      if (subject) {

        /*
           Keep the original ID.

           That way renaming a subject
           does not break its URL or
           existing entries.
        */

        subject.name =
          pendingAction.values.name;

        subject.description =
          pendingAction.values.description;

        subject.note =
          pendingAction.values.note;


        saveJournalSubjects(
          subjects
        );

        renderSubjects();

      }


      confirmModal.classList.remove(
        "open"
      );

      pendingAction =
        null;

      subjectForm.reset();

      subjectMode =
        "add";

      editingSubjectId =
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

      subjects =
        subjects.filter(
          (subject) =>
            subject.id !==
            pendingAction.subjectId
        );


      saveJournalSubjects(
        subjects
      );

      renderSubjects();


      confirmModal.classList.remove(
        "open"
      );

      pendingAction =
        null;

    }

  }
);


/* ========================================
   SUBJECT MODAL EVENTS
======================================== */

addSubjectButton.addEventListener(
  "click",
  openAddSubjectModal
);


modalClose.addEventListener(
  "click",
  closeSubjectModal
);


modalCancel.addEventListener(
  "click",
  closeSubjectModal
);


modalBackdrop.addEventListener(
  "click",
  closeSubjectModal
);


/* ========================================
   CONFIRMATION EVENTS
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

    closeAllSubjectMenus();

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !== "Escape"
    ) {

      return;

    }


    closeAllSubjectMenus();


    if (
      confirmModal.classList.contains(
        "open"
      )
    ) {

      closeConfirmModal();

      return;

    }


    if (
      subjectModal.classList.contains(
        "open"
      )
    ) {

      closeSubjectModal();

    }

  }
);


/* ========================================
   INITIAL RENDER
======================================== */

renderSubjects();