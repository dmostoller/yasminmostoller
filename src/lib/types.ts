export interface Comment {
  id: number;
  comment?: string;
  date_added?: string;
  painting_id?: number;
  user_id?: number;
  paintings?: Painting;
  users?: User;
}

export interface Event {
  id: number;
  name?: string;
  venue?: string;
  location?: string;
  details?: string;
  image_url?: string;
  event_date?: string;
  event_link?: string;
}

export interface Folder {
  id: number;
  name: string;
  paintings?: Painting[];
}

export interface MailingListEntry {
  id: number;
  name: string;
  email: string;
  votes?: Vote[];
}

export interface Painting {
  id: number;
  title: string;
  materials?: string | null;
  width?: number | null;
  height?: number | null;
  price?: string | null;
  sale_price?: number | null;
  image?: string | null;
  sold?: boolean | null;
  folder_id?: number | null;
  comments?: Comment[];
  folders?: Folder;
  poll_paintings?: PollPainting[];
  votes?: Vote[];
}

export interface PollPainting {
  poll_id: number;
  painting_id: number;
  paintings: Painting;
  polls: Poll;
}

export interface Poll {
  id: number;
  start_date: Date;
  end_date: Date;
  poll_paintings?: PollPainting[];
  votes?: Vote[];
}

export interface PostComment {
  id: number;
  comment?: string;
  date_added?: string;
  post_id?: number;
  user_id?: number;
  posts?: Post;
  users?: User;
}

export interface Post {
  id: number;
  title?: string;
  content?: string;
  image_url?: string;
  video_url?: string;
  date_added?: string;
  post_comments?: PostComment[];
  isAdmin?: boolean;
  onDeletePost: (deleted_post_id: number) => void;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  is_admin?: boolean;
  comments?: Comment[];
  post_comments?: PostComment[];
}

export interface Vote {
  id: number;
  painting_id: number;
  poll_id: number;
  user_id: number;
  paintings: Painting;
  polls: Poll;
  mailing_list_entries: MailingListEntry;
}
