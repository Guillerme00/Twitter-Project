import { create } from "zustand";

type PostProps = {
  author: {
    bio: string;
    birthday: string;
    email: string;
    followers_count: number;
    following_count: number;
    id: number;
    name: string;
    profile_banner: string;
    profile_image: string;
    username: string;
  };
  comments: PostProps[];
  created_at: string;
  id: number;
  likes: number[];
  likes_count: number;
  medias: {
    id: number;
    file: string;
    order: number;
  }[];
  post_body: string;
  retweets: {
    author: number;
    created_at: string;
    id: number;
    post: number;
  }[];
};

type SelectedPostState = {
  selectedPost: PostProps | null;
  setSelectedPost: (post: PostProps | null) => void;
};

export const useSelectedPostStore = create<SelectedPostState>((set) => ({
  selectedPost: null,
  setSelectedPost: (post) => set({ selectedPost: post }),
}));