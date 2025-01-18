import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import Post from '../components/Post';
import { getPosts } from '../services/posts';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const renderPost = ({ item }) => <Post post={item} />;

  return (
    <View>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        // Implement infinite scrolling or pagination here
      />
    </View>
  );
};

export default FeedScreen;
