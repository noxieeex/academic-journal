/* ========================================
   ACADEMIC JOURNAL — ENTRY
======================================== */


/* ========================================
   ELEMENTS
======================================== */

const entryBackLink =
  document.getElementById(
    "entry-back-link"
  );

const entryPageType =
  document.getElementById(
    "entry-page-type"
  );

const entryPageTitle =
  document.getElementById(
    "entry-page-title"
  );

const entryPageDescription =
  document.getElementById(
    "entry-page-description"
  );

const entryPageNote =
  document.getElementById(
    "entry-page-note"
  );


const blocksList =
  document.getElementById(
    "blocks-list"
  );

const emptyPage =
  document.getElementById(
    "entry-page-empty"
  );

const addBlockButton =
  document.getElementById(
    "add-block"
  );


/* ========================================
   BLOCK MODAL
======================================== */

const blockModal =
  document.getElementById(
    "block-modal"
  );

const blockModalBackdrop =
  document.querySelector(
    ".block-modal-backdrop"
  );

const blockModalClose =
  document.getElementById(
    "block-modal-close"
  );

const blockModalCancel =
  document.getElementById(
    "block-modal-cancel"
  );

const blockModalLabel =
  document.getElementById(
    "block-modal-label"
  );

const blockModalTitle =
  document.getElementById(
    "block-modal-title"
  );

const blockTypePicker =
  document.getElementById(
    "block-type-picker"
  );

const blockTypeOptions =
  document.querySelectorAll(
    ".block-type-option"
  );

const blockForm =
  document.getElementById(
    "block-form"
  );

const blockContent =
  document.getElementById(
    "block-content"
  );

const blockSubmitButton =
  blockForm.querySelector(
    ".modal-save"
  );


/* ========================================
   BLOCK DELETE CONFIRMATION
======================================== */

const blockConfirmModal =
  document.getElementById(
    "block-confirm-modal"
  );

const blockConfirmBackdrop =
  document.querySelector(
    ".block-confirm-modal-backdrop"
  );

const blockConfirmCancel =
  document.getElementById(
    "block-confirm-cancel"
  );

const blockConfirmDelete =
  document.getElementById(
    "block-confirm-delete"
  );


/* ========================================
   URL PARAMETERS
======================================== */

const params =
  new URLSearchParams(
    window.location.search
  );

const subjectId =
  params.get("subject");

const entryId =
  params.get("entry");


/* ========================================
   LOAD DATA
======================================== */

let subjects =
  loadJournalSubjects();


let subject =
  subjects.find(
    (item) =>
      item.id === subjectId
  );


let entry =
  subject?.entries?.find(
    (item) =>
      item.id === entryId
  );


/* ========================================
   EDITOR STATE
======================================== */

let blockMode =
  "add";

let selectedBlockType =
  null;

let editingBlockId =
  null;

let pendingDeleteBlockId =
  null;


/* ========================================
   CREATE BLOCK ID
======================================== */

function createBlockId() {

  return (
    "block-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


/* ========================================
   SAVE JOURNAL
======================================== */

function saveJournal() {

  saveJournalSubjects(
    subjects
  );

}


/* ========================================
   INVALID ENTRY
======================================== */

if (!subject || !entry) {

  entryPageType.textContent =
    "NOT FOUND";

  entryPageTitle.textContent =
    "Entry not found";

  entryPageDescription.textContent =
    "This entry could not be found.";

  entryPageNote.textContent =
    "where did it go...?";


  addBlockButton.style.display =
    "none";

}


/* ========================================
   VALID ENTRY
======================================== */

else {

  /*
     Older entries don't have
     blocks yet.

     Give them an empty array.
  */

  if (
    !Array.isArray(
      entry.blocks
    )
  ) {

    entry.blocks = [];

    saveJournal();

  }


  document.title =
    `${entry.title} | Academic Journal`;


  entryBackLink.href =
    `subject.html?id=${encodeURIComponent(
      subject.id
    )}`;


  entryBackLink.textContent =
    `← ${subject.name}`;


  entryPageType.textContent =
    entry.type || "ENTRY";


  entryPageTitle.textContent =
    entry.title;


  entryPageDescription.textContent =
    entry.description || "";


  entryPageNote.textContent =
    entry.note || "";


  renderBlocks();

}


/* ========================================
   RENDER BLOCKS
======================================== */

function renderBlocks() {

  if (!entry) {
    return;
  }


  blocksList.innerHTML =
    "";


  /* =====================================
     EMPTY STATE
  ====================================== */

  if (
    entry.blocks.length === 0
  ) {

    emptyPage.style.display =
      "block";

    return;

  }


  emptyPage.style.display =
    "none";


  /* =====================================
     BLOCKS
  ====================================== */

  entry.blocks.forEach(
    (block) => {

      const blockElement =
        document.createElement(
          "div"
        );

      blockElement.classList.add(
        "journal-block"
      );

      blockElement.dataset.blockId =
        block.id;


      /* =================================
         CONTENT
      ================================= */

      const content =
        document.createElement(
          "div"
        );

      content.classList.add(
        "journal-block-content"
      );


      if (
        block.type ===
        "heading"
      ) {

        const heading =
          document.createElement(
            "h2"
          );

        heading.textContent =
          block.content;

        content.appendChild(
          heading
        );

      }


      else if (
        block.type ===
        "text"
      ) {

        const paragraph =
          document.createElement(
            "p"
          );

        paragraph.textContent =
          block.content;

        content.appendChild(
          paragraph
        );

      }


      /* =================================
         MENU
      ================================= */

      const menuWrapper =
        document.createElement(
          "div"
        );

      menuWrapper.classList.add(
        "block-menu-wrapper"
      );


      const menuButton =
        document.createElement(
          "button"
        );

      menuButton.type =
        "button";

      menuButton.classList.add(
        "block-menu-button"
      );

      menuButton.textContent =
        "···";

      menuButton.setAttribute(
        "aria-label",
        "Block options"
      );


      const menu =
        document.createElement(
          "div"
        );

      menu.classList.add(
        "block-menu"
      );


      /* ---------- Edit ---------- */

      const editButton =
        document.createElement(
          "button"
        );

      editButton.type =
        "button";

      editButton.textContent =
        "Edit";


      editButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          closeAllBlockMenus();

          openEditBlockModal(
            block.id
          );

        }
      );


      /* ---------- Delete ---------- */

      const deleteButton =
        document.createElement(
          "button"
        );

      deleteButton.type =
        "button";

      deleteButton.textContent =
        "Delete";

      deleteButton.classList.add(
        "block-delete-option"
      );


      deleteButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();

          closeAllBlockMenus();

          askDeleteBlock(
            block.id
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


      menuButton.addEventListener(
        "click",
        (event) => {

          event.stopPropagation();


          const isOpen =
            menu.classList.contains(
              "open"
            );


          closeAllBlockMenus();


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

      blockElement.appendChild(
        content
      );

      blockElement.appendChild(
        menuWrapper
      );

      blocksList.appendChild(
        blockElement
      );

    }
  );

}


/* ========================================
   OPEN ADD BLOCK
======================================== */

function openAddBlockModal() {

  blockMode =
    "add";

  selectedBlockType =
    null;

  editingBlockId =
    null;


  blockForm.reset();


  blockModalLabel.textContent =
    "NEW BLOCK";

  blockModalTitle.textContent =
    "Add Block";

  blockSubmitButton.textContent =
    "Add Block";


  blockTypePicker.style.display =
    "grid";

  blockForm.style.display =
    "none";


  blockTypeOptions.forEach(
    (option) => {

      option.classList.remove(
        "selected"
      );

    }
  );


  blockModal.classList.add(
    "open"
  );

}


/* ========================================
   SELECT BLOCK TYPE
======================================== */

blockTypeOptions.forEach(
  (option) => {

    option.addEventListener(
      "click",
      () => {

        selectedBlockType =
          option.dataset.blockType;


        blockTypeOptions.forEach(
          (item) => {

            item.classList.remove(
              "selected"
            );

          }
        );


        option.classList.add(
          "selected"
        );


        blockTypePicker.style.display =
          "none";

        blockForm.style.display =
          "block";


        if (
          selectedBlockType ===
          "heading"
        ) {

          blockModalTitle.textContent =
            "Add Heading";

          blockContent.placeholder =
            "Section title...";

        }

        else {

          blockModalTitle.textContent =
            "Add Text";

          blockContent.placeholder =
            "Write something...";

        }


        blockContent.focus();

      }
    );

  }
);


/* ========================================
   OPEN EDIT BLOCK
======================================== */

function openEditBlockModal(
  blockId
) {

  const block =
    entry.blocks.find(
      (item) =>
        item.id === blockId
    );


  if (!block) {
    return;
  }


  blockMode =
    "edit";

  selectedBlockType =
    block.type;

  editingBlockId =
    block.id;


  blockContent.value =
    block.content;


  blockModalLabel.textContent =
    "EDIT BLOCK";

  blockModalTitle.textContent =
    block.type === "heading"
      ? "Edit Heading"
      : "Edit Text";

  blockSubmitButton.textContent =
    "Save Changes";


  blockTypePicker.style.display =
    "none";

  blockForm.style.display =
    "block";


  blockModal.classList.add(
    "open"
  );


  setTimeout(
    () => {

      blockContent.focus();

    },
    100
  );

}


/* ========================================
   CLOSE BLOCK MODAL
======================================== */

function closeBlockModal() {

  blockModal.classList.remove(
    "open"
  );

  blockForm.reset();

  blockMode =
    "add";

  selectedBlockType =
    null;

  editingBlockId =
    null;

}


/* ========================================
   SUBMIT BLOCK
======================================== */

blockForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    if (
      !entry ||
      !selectedBlockType
    ) {

      return;

    }


    const content =
      blockContent.value.trim();


    if (!content) {
      return;
    }


    /* =================================
       ADD
    ================================= */

    if (
      blockMode === "add"
    ) {

      entry.blocks.push({

        id:
          createBlockId(),

        type:
          selectedBlockType,

        content:
          content

      });

    }


    /* =================================
       EDIT
    ================================= */

    else if (
      blockMode === "edit"
    ) {

      const block =
        entry.blocks.find(
          (item) =>
            item.id ===
            editingBlockId
        );


      if (block) {

        block.content =
          content;

      }

    }


    saveJournal();

    renderBlocks();

    closeBlockModal();

  }
);


/* ========================================
   ASK DELETE BLOCK
======================================== */

function askDeleteBlock(
  blockId
) {

  pendingDeleteBlockId =
    blockId;


  blockConfirmModal.classList.add(
    "open"
  );

}


/* ========================================
   CLOSE DELETE CONFIRMATION
======================================== */

function closeBlockConfirmModal() {

  blockConfirmModal.classList.remove(
    "open"
  );

  pendingDeleteBlockId =
    null;

}


/* ========================================
   DELETE BLOCK
======================================== */

function deleteBlock(
  blockId
) {

  if (!entry) {
    return;
  }


  entry.blocks =
    entry.blocks.filter(
      (block) =>
        block.id !== blockId
    );


  saveJournal();

  renderBlocks();

  closeAllBlockMenus();

}


/* ========================================
   CLOSE BLOCK MENUS
======================================== */

function closeAllBlockMenus() {

  document
    .querySelectorAll(
      ".block-menu"
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
   EVENTS — ADD / EDIT MODAL
======================================== */

addBlockButton.addEventListener(
  "click",
  openAddBlockModal
);


blockModalClose.addEventListener(
  "click",
  closeBlockModal
);


blockModalCancel.addEventListener(
  "click",
  closeBlockModal
);


blockModalBackdrop.addEventListener(
  "click",
  closeBlockModal
);


/* ========================================
   EVENTS — DELETE CONFIRMATION
======================================== */

blockConfirmCancel.addEventListener(
  "click",
  closeBlockConfirmModal
);


blockConfirmBackdrop.addEventListener(
  "click",
  closeBlockConfirmModal
);


blockConfirmDelete.addEventListener(
  "click",
  () => {

    if (!pendingDeleteBlockId) {
      return;
    }


    const blockId =
      pendingDeleteBlockId;


    /*
       Clear confirmation state first.
    */

    blockConfirmModal.classList.remove(
      "open"
    );

    pendingDeleteBlockId =
      null;


    deleteBlock(
      blockId
    );

  }
);


/* ========================================
   GLOBAL EVENTS
======================================== */

document.addEventListener(
  "click",
  closeAllBlockMenus
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !== "Escape"
    ) {

      return;

    }


    closeAllBlockMenus();


    /*
       Confirmation modal gets
       priority over the editor.
    */

    if (
      blockConfirmModal.classList.contains(
        "open"
      )
    ) {

      closeBlockConfirmModal();

      return;

    }


    if (
      blockModal.classList.contains(
        "open"
      )
    ) {

      closeBlockModal();

    }

  }
);