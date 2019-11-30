NB.ContactVM = class {
  id: number;
  name: KnockoutObservable<string>;
  phoneNumber: KnockoutObservable<string>;
  balance: KnockoutObservable<string>;
  timestamp: any;
  lastModifiedTime: any;
  canDiscard: any;
  level: any;
  visible: any;
  latestId: number;
  notes: KnockoutObservableArray<any>;
  constructor(contact, canDiscard, subscribeData) {
    const self = this;
    self.id = contact.id;
    self.name = ko.observable(contact.name || "");
    self.balance = ko.observable(contact.balance || "");
    self.phoneNumber = ko.observable(contact.phoneNumber || "");
    self.timestamp = ko.observable(contact.timestamp);
    self.lastModifiedTime = ko.computed(function() {
      const timestampToDate = NB.Utils.timeStampToDate(self.timestamp());
      return timestampToDate.time + " - " + timestampToDate.date;
    });
    self.canDiscard = ko.observable(canDiscard || false);
    self.visible = ko.observable(true);
    self.notes = ko.observableArray(contact.notes || []);
    this.latestId = this.notes.length
      ? this.notes[this.notes.length - 1].id || 0
      : 0;
    this.subscribe(subscribeData);
  }
  addNote(text, index) {
    const timestampToDate = NB.Utils.timeStampToDate(Date.now());
    const date = timestampToDate.time + " - " + timestampToDate.date;
    let id = this.latestId++;
    const newNote = { text, date, id };
    this.notes.push(newNote);
  }
  updateNote(index, text) {
    const timestampToDate = NB.Utils.timeStampToDate(Date.now());
    const date = timestampToDate.time + " - " + timestampToDate.date;
    if (index === undefined) {
      return;
    }
    let id = this.notes()[index].id;
    const newNote = { text, date, id };
    this.notes.replace(this.notes()[index], newNote);
  }

  subscribe(subscribeData) {
    ko.computed(() => {
      this.name();
      this.phoneNumber();
      this.balance();
      this.notes();
      subscribeData(this);
    });
  }
};
