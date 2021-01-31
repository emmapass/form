export class Mat {
  id!: string;
  topping!: string;
  input!: string;
  select!: string;
  textarea!: string;
  isDeleting: boolean = false;
}
export class BlankMat {
  id: string = undefined;
  topping: string = "";
  input: string = "";
  select: string = "";
  textarea: string = "";
  isDeleting: boolean = false;
}
