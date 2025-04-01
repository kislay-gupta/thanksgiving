"use client";
import React, { useEffect, useState } from "react";
import Post from "./PostCard";
import { baseUrl } from "@/constant";
import axios from "axios";
import { useAuth } from "@/hooks/use-auth";
import { PostProps } from "@/interface";
import { useFeedStore } from "@/store/feed-store";
import useLoader from "@/hooks/user-loader";
import PostSkeleton from "../skeletons/PostSkeleton";

const FeedPosts = () => {
  const [postsData, setPostsData] = useState<PostProps[] | null>();
  const { accessToken } = useAuth();
  const { shouldRefetch, setShouldRefetch } = useFeedStore();
  const { isLoading, startLoading, stopLoading } = useLoader();
  const getPost = async () => {
    const token = accessToken;
    startLoading();
    try {
      const res = await axios.get(`${baseUrl}/api/messages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPostsData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    getPost();
  }, []); // Initial fetch

  useEffect(() => {
    if (shouldRefetch) {
      getPost();
      setShouldRefetch(false); // Reset the flag after fetching
    }
  }, [shouldRefetch]); // Watch for refetch triggers

  return (
    <div className="space-y-1 min-w-full">
      {isLoading ? (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      ) : (
        postsData && postsData.map((post) => <Post key={post.id} {...post} />)
      )}
    </div>
  );
};

export default FeedPosts;
