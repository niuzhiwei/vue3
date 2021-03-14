interface ImageProps {
  url?: string;
  _id?: string;
  createdAt?: string;
}
export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}
export interface ColumnProps {
  _id: string;
  title: string;
  description: string;
  avatar?: ImageProps;
  createdAt: string;
}
export interface PostProps {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: ImageProps;
  createdAt: string;
  column: string;
}
