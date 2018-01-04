export class UserModel {
  constructor(public email: string,
              public password: string,
              public admin?: boolean) {}
}
