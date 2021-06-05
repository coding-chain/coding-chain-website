export interface LoginUserQuery {
  password: string;
  email: string;
}

export interface RegisterUserCommand {
  password: string;
  email: string;
  username: string;
}

export interface EditUserCommand {
  password: string;
  email: string;
  username: string;
}
