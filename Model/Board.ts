NB.Board = class {
  contacts: any;
  latestContactID: number;

  constructor() {
    this.contacts = NB.Storage.getContacts();
    this.latestContactID = NB.Storage.getCurrentID();
  }

  getContacts(): Array<any> {
    return this.contacts;
  }

  addContact(contact): void {
    let id: number;
    if (!contact) {
      id = this.getNextId();
    }
    this.contacts.push(contact || new NB.Contact(id));
  }

  getNextId(): number {
    const id: number = this.latestContactID;
    this.latestContactID++;

    return id;
  }

  getIndexById(id): number {
    return this.contacts.findIndex(contact => contact.id === id);
  }

  removeContactById(id): void {
    const index: number = this.getIndexById(id);
    this.contacts.splice(index, 1);
  }

  updateContactById(id, name, phoneNumber, balance, notes, timestamp): void {
    const index: number = this.getIndexById(id);
    const contact: any = this.contacts[index];
    contact.name = name;
    contact.phoneNumber = phoneNumber;
    contact.balance = balance;
    contact.notes = notes;
    contact.timestamp = timestamp;
  }

  save(): void {
    NB.Storage.saveToStorage(this.contacts, this.latestContactID);
  }
};
NB.board = new NB.Board();
