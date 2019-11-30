const keysDown: any = {};

document.addEventListener(
  "keydown",
  function(e) {
    keysDown[e.keyCode] = true;
    checkCombinations(e);
  },
  false
);

document.addEventListener(
  "keyup",
  function(e) {
    delete keysDown[e.keyCode];
  },
  false
);

function checkCombinations(e): void {
  let actionTaken;
  // Save
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["s"]]) {
    actionTaken = true;
    NB.boardVM.clickSave();
  }
  // Add Contact
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["g"]]) {
    actionTaken = true;
    const boardMode = !NB.boardVM.contactInEditMode;
    if (boardMode) {
      NB.boardVM.addContact();
    }
  }
  // Reset Contact
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["r"]]) {
    actionTaken = true;
    ContactAction.discard();
  }
  // Edit Contact
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["actionTaken=true"]]) {
    actionTaken = true;
    ContactAction.edit();
  }
  // Delete Contact
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["delete"]]) {
    actionTaken = true;
    ContactAction.delete();
  }
  // Confirm Delete Contact
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["y"]]) {
    actionTaken = true;
    ContactAction.confirmDelete();
  }
  // Focus Search
  if (keysDown[NB.Keys["ctrl"]] && keysDown[NB.Keys["f"]]) {
    actionTaken = true;
    const searchElement: HTMLElement = document.getElementsByClassName(
      "search"
    )[0] as HTMLElement;
    searchElement.focus();
  }
  if (keysDown[NB.Keys["enter"]]) {
    actionTaken = true;
    ContactAction.addNote();
  }
  if (actionTaken) {
    e.preventDefault();
  }
}

const ContactAction = {
  getContact: function(): void {
    const focusedElement: HTMLElement = document.activeElement as HTMLElement;
    if (focusedElement.tagName === "TEXTAREA") {
      const noteElement = focusedElement && focusedElement.offsetParent;
      const id = Number(noteElement.id);
      const index = NB.board.getIndexById(id);
      if (index <= -1) {
      } else {
        return NB.boardVM.ContactVM()[index];
      }
    }
    return undefined;
  },
  discard: function(): void {
    const focusedElement = document.activeElement;
    if (focusedElement.tagName === "TEXTAREA") {
      const contact = this.getContact();
      contact && NB.boardVM.discardContact(contact);
    }
  },
  delete: function(): void {
    const contact = this.getContact();
    contact && NB.boardVM.clickRemoveContact(contact);
  },
  confirmDelete: function(): void {
    const focusedElement: HTMLElement = document.activeElement as HTMLElement;
    if (focusedElement.tagName === "TEXTAREA") {
      const noteElement: HTMLElement =
        focusedElement && (focusedElement.offsetParent as HTMLElement);
      const confirmDelete: HTMLElement = noteElement.querySelector(
        "[aria-label=Accept"
      );
      const isVisible: boolean = $(confirmDelete).is(":visible");
      if (isVisible) {
        NB.boardVM.removeContact(this.getContact());
      }
    }
  },
  edit: function(): void {
    const editMode: boolean = NB.boardVM.contactInEditMode();
    if (editMode) {
      NB.boardVM.backToBoard();
    } else {
      const contact: any = this.getContact();
      contact && NB.boardVM.clickEditNote(contact);
    }
  },
  addNote: function() {
    const editMode: boolean = NB.boardVM.contactInEditMode();
    if (editMode) {
      const el = document.querySelector("#addNoteInput");
      document.activeElement === el && NB.boardVM.addNote();
    }
  }
};
