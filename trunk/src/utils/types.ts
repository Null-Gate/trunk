
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

export type loginProps = {
  username: string;
  password: string;
};

export type signUpProps = {
  username: string;
  fullname: string;
  password: string;
};

export type Coordinate = {
  latitude: string;
  longitude: string;
};

export type ChooseLoationsProps = {
  lat: number;
  lng: number;
  description: string;
};
