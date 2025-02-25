export interface IDocument {
  _id: string;
  email: string;
  document: string;
  emails: string[];
  xfdf: string[];
  signedBy: string[];
  signed: boolean;
  createdAt: string;
}
