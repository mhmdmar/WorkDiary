NB.Contact = class {
  id: number;
  name: string;
  phoneNumber: string;
  balance: string;
  timestamp: number;
  notes:any[];
  constructor(id) {
    this.id = id;
    this.name = "";
    this.phoneNumber = "";
    this.balance = "";
    this.timestamp = Date.now();
    this.notes = [];
  }
  addNote(content, timestamp) {
    const note = new NB.Note(content, timestamp);
    this.notes.push(note);
  }
  removeNote(index) {
    this.notes.splice(index, 1);
  }
  updateNote(index,content,timestamp){
    const note = this.notes[index];
    note.update(content,timestamp);
  }
};
