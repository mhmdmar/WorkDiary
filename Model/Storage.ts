NB.Storage = {
  getDataFromStorage: function(): any {
    if (localStorage.Board) {
      try {
        this.storedBoard = JSON.parse(localStorage.Board);
        this.checkData();
      } catch (e) {
        console.error(e);
        this.storedBoard = this.reset();
      }
    } else {
      this.storedBoard = this.reset();
    }
  },
  checkData: function(): any {
    if (!this.storedBoard.contacts) {
      this.storedBoard.contacts = [];
    }
  },

  reset: function(): any {
    return {
      contacts: [],
      currentID: 0,
      chosenContactINDEX: undefined
    };
  },

  getEditMode: function(): boolean {
    return this.storedBoard.editMode;
  },
  getStoredBoard: function(): any {
    return this.storedBoard;
  },
  getContactIndexInEditMode: function(): number {
    return this.storedBoard.chosenContactINDEX;
  },
  getContacts: function(): Array<any> {
    return this.storedBoard.contacts;
  },
  getCurrentID: function(): number {
    return this.storedBoard.currentID || 0;
  },
  saveToStorage: function(contacts, id): void {
    this.storedBoard.contacts = contacts;
    this.storedBoard.currentID = id;
    localStorage.Board = JSON.stringify(this.storedBoard);
  },
  saveChosenContact: function(index): void {
    const temp: any = JSON.parse(localStorage.Board);
    temp.chosenContactINDEX = index;
    localStorage.Board = JSON.stringify(temp);
  }
};

NB.Storage.getDataFromStorage();
