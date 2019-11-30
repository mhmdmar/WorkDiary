NB.Note = class {
  content: string;
  timestamp: number;
  constructor(content, timestamp) {
    this.content = content || "";
    this.timestamp = timestamp || Date.now();
  }
  update(content, timestamp) {
    this.content = content;
    this.timestamp = timestamp;
  }
};
