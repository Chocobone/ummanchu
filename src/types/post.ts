export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  author?: string;
}

export interface PostResponse {
  success: boolean;
  data?: Post;
  error?: string;
}

export interface PostsResponse {
  success: boolean;
  data?: Post[];
  error?: string;
}
