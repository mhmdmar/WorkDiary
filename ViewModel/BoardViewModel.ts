NB.BoardViewModel = function(): void {
  const self: any = this;
  self.attributeToIgnore = ["visible"];
  self.ContactsVM = ko.observableArray();
  let unsavedContactsVM: any = [];
  self.getObservableValue = function(observable, attr): any {
    // if attribute isn't an observable return actual value
    return typeof observable[attr] === "function"
      ? observable[attr]()
      : observable[attr];
  };

  self.forEachContactsVM = function(callback): void {
    let contactsVM = self.ContactsVM();
    for (let i = 0, len = contactsVM.length; i < len; i++) {
      callback(contactsVM[i]);
    }
  };
  self.sortOptions = ko.observableArray([
    NB.Words.Ascending,
    NB.Words.Descending
  ]);
  self.selectedSortOption = ko.observable();

  // remove Contact
  self.clickRemoveContact = function(contact): void {
    const confirmElement: HTMLElement = self.confirmDelElement(contact.id);
    const toHide: boolean = confirmElement.style.visibility === "visible";
    confirmElement.style.visibility = toHide ? "hidden" : "visible";
  };
  self.cancelRemoveContact = function(contact): void {
    const confirmElement: HTMLElement = self.confirmDelElement(contact.id);
    confirmElement.style.visibility = "hidden";
  };
  self.removeContact = function(contact): void {
    self.ContactsVM.remove(contact);
    NB.board.removeContactById(contact.id);
  };
  self.confirmDelElement = function(id): HTMLElement {
    const selector: string = "[id='" + id + "'] .confirm";
    return document.querySelector(selector);
  };

  // search options
  self.searchQuery = ko.observable("");
  self.searchByText = ko.observable(true);
  self.searchByDate = ko.observable(false);
  self.filterBoard = function(): void {
    const searchQuery = self.searchQuery().toLowerCase();
    self.forEachContactsVM(function(contact) {
      const name: string = contact.name().toLowerCase();

      const date: string = contact.lastModifiedTime();

      let sameContent: boolean = false;
      let sameDate: boolean = false;
      if (self.searchByText()) {
        // match content
        sameContent = name.includes(searchQuery);
      }
      if (self.searchByDate()) {
        // match date
        sameDate = date.includes(searchQuery);
      }
      contact.visible(sameDate || sameContent);
    });
  };

  self.resetSearch = function(): void {
    if (!self.contactInEditMode()) {
      self.searchQuery("");
      self.filterBoard();
    }
  };

  self.filterBoard();

  // Save , discard and update contacts functions
  self.clickSave = function(): void {
    self.forEachContactsVM(function(contact) {
      if (contact.canDiscard()) {
        NB.board.updateContactById(
          contact.id,
          contact.name(),
          contact.phoneNumber(),
          contact.balance(),
          contact.notes(),
          Date.now()
        );
        contact.canDiscard(false);
        contact.timestamp(Date.now());
      }
    });

    NB.board.save();

    unsavedContactsVM = JSON.parse(ko.toJSON(self.ContactsVM()));

    // Trigger computed event
    self.ContactsVM.valueHasMutated();
  };

  self.contentChange = function(contact): void {
    const index: number = self.ContactsVM.indexOf(contact);
    const oldContact: any = unsavedContactsVM[index];
    if (oldContact) {
      contact.canDiscard(
        contact.name() !== oldContact.name ||
          contact.balance() !== oldContact.balance ||
          contact.phoneNumber() !== oldContact.phoneNumber ||
          !checkArrays(oldContact.notes, contact.notes())
      );
    }
  };
  self.populateContacts = function(contacts) {
    const contactsVM = [];
    contacts.forEach(function(contact) {
      contactsVM.push(new NB.ContactVM(contact, false, self.contentChange));
    });
    return contactsVM;
  };
  self.ContactsVM(self.populateContacts(NB.board.getContacts()));
  unsavedContactsVM = JSON.parse(ko.toJSON(self.ContactsVM()));
  self.resetContacts = function(): void {
    self.ContactsVM(
      self.populateContacts(JSON.parse(ko.toJSON(unsavedContactsVM)))
    );
    if (self.contactInEditMode) {
      self.contactInEditMode(self.ContactsVM()[contactIndexInEditMode]);
    }
  };
  self.discardContact = function(contact): void {
    const index: number = NB.board.getIndexById(contact.id);
    const oldContact: any = unsavedContactsVM[index];

    // if the discarded Contact is not saved then discarding it will delete it
    oldContact
      ? self.ContactsVM.replace(
          contact,
          new NB.ContactVM(oldContact, false, self.contentChange)
        )
      : self.removeContact(contact);
  };

  self.addContact = function(): void {
    const id: number = NB.board.getNextId();
    const newContact: any = new NB.Contact(id);
    NB.board.addContact(newContact);
    const newContactVM = new NB.ContactVM(newContact, true, self.contentChange);
    self.ContactsVM.push(newContactVM);
    document.getElementById("addBtn").blur();
  };
  // section for restoring the user in the Contact edit if user exited the application while in Edit mode
  let contactIndexInEditMode: any = NB.Storage.getContactIndexInEditMode();
  // if the Contact wasn't saved before refresh it will return undefined
  self.contactInEditMode = ko.observable(
    self.ContactsVM()[contactIndexInEditMode]
  );

  self.clickEditContact = function(editContact): void {
    contactIndexInEditMode = self
      .ContactsVM()
      .findIndex(contact => contact.id === editContact.id);
    self.contactInEditMode(editContact);
  };

  self.backToBoard = function(): void {
    contactIndexInEditMode = -1;
    self.contactInEditMode(undefined);
  };

  window.onbeforeunload = function(): void {
    const index: number = self.ContactsVM.indexOf(self.contactInEditMode());
    NB.Storage.saveChosenContact(index);
  };

  self.selectedSortOption(self.sortOptions()[0]);

  self.canSaveContacts = ko.computed(function() {
    const contactsVM = self.ContactsVM();
    return (
      contactsVM.length !== unsavedContactsVM.length ||
      contactsVM.some(contact => contact.canDiscard())
    );
  });

  self.canSave = ko.computed(function(): any {
    return self.canSaveContacts();
  });

  self.sort = {
    Ascending: function(contact1, contact2) {
      const timestamp = "timestamp";
      const contact1Time = self.getObservableValue(contact1, timestamp);
      const contact2Time = self.getObservableValue(contact2, timestamp);

      return contact1Time - contact2Time;
    },
    Descending: function(contact1, contact2) {
      const timestamp = "timestamp";
      const contact1Time = self.getObservableValue(contact1, timestamp);
      const contact2Time = self.getObservableValue(contact2, timestamp);
      return contact2Time - contact1Time;
    }
  };
  self.selectedSortOption.subscribe(function(sortOrder) {
    const sortFunction =
      sortOrder === NB.Words.Ascending ? "Ascending" : "Descending";
    unsavedContactsVM = unsavedContactsVM.sort(self.sort[sortFunction]);
    self.ContactsVM(self.ContactsVM().sort(self.sort[sortFunction]));
  });

  self.blueTargetElement = function(event) {
    event && event.target.blur();
  };

  self.noteText = ko.observable();
  self.addNote = function() {
    const text = self.noteText();
    if (text) {
      self.contactInEditMode().addNote(text);
      self.noteText("");
    }
    document.getElementById("addNote").blur();
  };
  self.editNote = function(note) {
    const curContact = self.contactInEditMode();
    const index = curContact
      .notes()
      .findIndex(curNote => curNote.id === note.id);
    let notes = curContact.notes();
    let originalText = notes[index].text;
    const noteText = prompt("Enter new note ", originalText);
    if (noteText) {
      curContact.updateNote(index, noteText);
    }
    document.getElementById("editNote").blur();
  };
  self.removeNote = function(note) {
    const curContact = self.contactInEditMode();
    const index = curContact
      .notes()
      .findIndex(curNote => curNote.id === note.id);
    curContact.notes.splice(index, 1);
  };
};

function checkArrays(arrA, arrB) {
  //check if lengths are different
  if (arrA.length !== arrB.length) return false;
  return JSON.stringify(arrA) === JSON.stringify(arrB);
}
