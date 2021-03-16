export interface ImageProps {
  url?: string;
  fitUrl?: string;
  _id?: string;
  createdAt?: string;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
  avatar?: ImageProps;
  description?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  description: string;
  avatar?: ImageProps;
  createdAt: string;
}
export interface PostProps {
  _id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps | string;
  createdAt?: string;
  column: string;
  author?: string | UserProps;
}
export interface ResponseType<P = {}> {
  code: number;
  msg: string;
  data: P;
}

export interface ListProps<T> {
  [id: string]: T;
}
