export class FlashService {

  constructor() { }

  flashMessages = [];

  setMessage(key: string, message: string) {
    this.flashMessages[key] = message;
  }

  getMessage(key: string): string {
    return this.flashMessages[key] === undefined ? false : this.flashMessages[key];
  }

  getMessages(): Array<string> {
    return this.flashMessages;
  }

}
