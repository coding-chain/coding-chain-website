export interface IPublicUser {
  id: string;
  username: string;
  email: string;
  rightIds: string[];
  teamIds: string[];
}

export interface Token {
  token: string;
}
