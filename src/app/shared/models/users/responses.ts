export interface PublicUser {
  id: string;
  username: string;
  email: string;
  rightIds: string[];
  teamIds: string[]
}

export interface UserToken {
  token: string;
}
