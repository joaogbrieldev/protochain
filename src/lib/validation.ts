export default class Validation {
  sucess: boolean;
  message: string;
  constructor(sucess: boolean = true, message: string = "") {
    this.sucess = sucess;
    this.message = message;
  }
}
