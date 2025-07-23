export interface GooglePayload {
  id: string;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: {
    value: string;
  }[];
}

export interface JwtPayload {
  userId: string;
}
