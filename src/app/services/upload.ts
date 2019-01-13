export class Upload {
  id: string;
  key: string;
  name: string;
  url: string;
  status: boolean;
  uid: string;
  file: File;
  createdAt: Date = new Date();
  constructor(file: File) {
    this.file = file;
  }
}
