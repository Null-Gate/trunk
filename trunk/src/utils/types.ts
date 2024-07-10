export type User_detail = {
  username: string;
  fullname: string;
  password: string;
  pik_role: any[];
};

export type User = {
  user_details: User_detail;
  token: string;
};
