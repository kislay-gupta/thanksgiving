import React from "react";
import Post from "./PostCard";

const posts = [
  {
    id: 1,
    user: {
      name: "Ken Hardy",
      username: "username-ken",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet consectetur. Habitasse enim auctor et imperdiet massa metus magna duis tristique. Faucibus bibendum mattis libero semper in mauris. Tellus eros tellus quis. In orci sed elit sagittis commodo quis. Scelerisque imperdiet eros vulputate quis. Amet iaculis varius vitae venenatis sollicitudin viverra fringilla.",
    stats: {
      likes: 130,
      comments: 12,
      reposts: 2,
    },
  },
  {
    id: 2,
    user: {
      name: "Kevin Max",
      username: "username-kevin",
      avatar: "https://randomuser.me/api/portraits/men/73.jpg",
    },
    content: "Lorem ipsum dolor sit amet consectetur. Habitasse enim auctor et",
    image:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
    video: true,
    stats: {
      likes: 510,
      comments: 30,
      reposts: 10,
    },
  },
  {
    id: 3,
    user: {
      name: "Liam Hiddleston",
      username: "username-liam",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet consectetur. Habitasse enim auctor et imperdiet massa metus magna duis tristique. Faucibus bibendum mattis",
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2488&q=80",
    stats: {
      likes: 130,
      comments: 12,
      reposts: 2,
    },
  },
  {
    id: 4,
    user: {
      name: "John Doe",
      username: "username-doe",
      avatar: "https://randomuser.me/api/portraits/men/53.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet consectetur. Habitasse enim auctor et imperdiet massa metus magna duis tristique. Faucibus bibendum mattis libero semper in mauris. Tellus eros tellus quis. In orci sed elit sagittis commodo quis. Scelerisque imperdiet eros vulputate quis. Amet iaculis varius vitae venenatis sollicitudin viverra fringilla.",
    stats: {
      likes: 57,
      comments: 4,
      reposts: 1,
    },
  },
  {
    id: 5,
    user: {
      name: "Liam Hiddleston",
      username: "username-liam",
      avatar: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    content:
      "Lorem ipsum dolor sit amet consectetur. Habitasse enim auctor et imperdiet massa metus magna duis tristique. Faucibus bibendum mattis",
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2488&q=80",
    stats: {
      likes: 130,
      comments: 12,
      reposts: 2,
    },
  },
];

const FeedPosts = () => {
  return (
    <div className="space-y-1">
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};

export default FeedPosts;
