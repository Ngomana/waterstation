export interface iUser {
  email: string;
  token: string;
}

export interface iUserState {
  user: {
    email: string;
    token: string;
  };
}
