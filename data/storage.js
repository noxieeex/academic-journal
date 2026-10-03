/* ========================================
   ACADEMIC JOURNAL STORAGE
======================================== */

const JOURNAL_STORAGE_KEY = "academicJournalSubjects";

/* ========================================
   LOAD SUBJECTS
======================================== */

function loadJournalSubjects() {
  const saved = localStorage.getItem(JOURNAL_STORAGE_KEY);

  /* No saved data yet */

  if (!saved) {
    return structuredClone(journalData.subjects);
  }

  const storedSubjects = JSON.parse(saved);

  /* ========================================
   DATA MIGRATIONS
======================================== */

  /*
   Subjects was moved inside Website.

   Older saved entries may still contain
   paths beginning with "../Subjects/".
*/

  storedSubjects.forEach((subject) => {
    if (!Array.isArray(subject.entries)) {
      return;
    }

    subject.entries.forEach((entry) => {
      if (
        typeof entry.page === "string" &&
        entry.page.startsWith("../Subjects/")
      ) {
        entry.page = entry.page.replace("../Subjects/", "Subjects/");
      }
    });
  });

  /*
     Merge localStorage data with
     the default journal data.
  */

  const mergedSubjects = storedSubjects.map((storedSubject) => {
    const defaultSubject = journalData.subjects.find(
      (subject) => subject.id === storedSubject.id,
    );

    /*
           Subject created manually
           through the website.
        */

    if (!defaultSubject) {
      return {
        ...storedSubject,

        entries: Array.isArray(storedSubject.entries)
          ? storedSubject.entries
          : [],
      };
    }

    /*
           Subject that also exists
           in journal.js.
        */

    return {
      ...defaultSubject,
      ...storedSubject,

      entries: Array.isArray(storedSubject.entries)
        ? storedSubject.entries
        : structuredClone(defaultSubject.entries || []),
    };
  });

  /*
     Add default subjects that aren't
     stored in localStorage yet.
  */

  journalData.subjects.forEach((defaultSubject) => {
    const alreadyExists = mergedSubjects.some(
      (subject) => subject.id === defaultSubject.id,
    );

    if (!alreadyExists) {
      mergedSubjects.push(structuredClone(defaultSubject));
    }
  });

  /*
     Every subject MUST have entries.
  */

  mergedSubjects.forEach((subject) => {
    if (!Array.isArray(subject.entries)) {
      subject.entries = [];
    }
  });

  return mergedSubjects;
}

/* ========================================
   SAVE SUBJECTS
======================================== */

function saveJournalSubjects(subjects) {
  localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(subjects));
}
