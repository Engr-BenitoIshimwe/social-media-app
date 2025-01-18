To develop a frontend mobile application for a Social Media App that runs on both iOS and Android platforms, we'll use React Native. This app will include user profiles, posts, likes, comments, messaging, secure authentication, infinite scrolling for posts, and integration with third-party APIs. Below is a structured implementation plan focusing on these features.

### Project Structure

```
social-media-app/
│
├── assets/
│   └── images/
│
├── components/
│   ├── Auth/
│   ├── Feed/
│   ├── Post/
│   ├── Profile/
│   ├── Messaging/
│   ├── Comments/
│   └── Common/
│
├── screens/
│   ├── AuthScreen.js
│   ├── FeedScreen.js
│   ├── PostDetailScreen.js
│   ├── ProfileScreen.js
│   ├── MessagingScreen.js
│   ├── CommentsScreen.js
│   └── SettingsScreen.js
│
├── navigation/
│   └── AppNavigator.js
│
├── services/
│   ├── api.js
│   ├── auth.js
│   └── posts.js
│
├── App.js
├── package.json
└── README.md
```

### Step 1: Setup React Native Project

1. **Initialize React Native Project**:
   ```bash
   npx react-native init SocialMediaApp
   cd SocialMediaApp
   ```

2. **Install Dependencies**:
   ```bash
   npm install @react-navigation/native @react-navigation/stack axios react-native-elements react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
   npm install @react-native-async-storage/async-storage
   npm install @react-native-community/push-notification-ios
   ```

### Step 2: Navigation Setup

Create `navigation/AppNavigator.js` for app navigation.

```javascript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from '../screens/AuthScreen';
import FeedScreen from '../screens/FeedScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagingScreen from '../screens/MessagingScreen';
import CommentsScreen from '../screens/CommentsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Messaging" component={MessagingScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
```

### Step 3: Screens and Components

Create necessary screens and components under `screens/` and `components/` directories. Here's an example for `FeedScreen` and `Post` component.

#### `screens/FeedScreen.js`

```javascript
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
```

#### `components/Post.js`

```javascript
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';

const Post = ({ post }) => {
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: post.user.avatar }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <Text style={{ marginLeft: 10 }}>{post.user.name}</Text>
      </View>
      <Image
        source={{ uri: post.image }}
        style={{ width: '100%', height: 200, marginTop: 10 }}
      />
      <Text style={{ marginVertical: 10 }}>{post.caption}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity>
          <Icon name='heart-outline' type='ionicon' />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name='chatbubble-outline' type='ionicon' />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default Post;
```

### Step 4: API Integration

Create `services/api.js` for making API requests using axios.

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend API URL
});

export default instance;
```

Create `services/posts.js` for handling posts related API requests.

```javascript
import api from './api';

export const getPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

### Step 5: Authentication

Implement authentication using JWT or OAuth. Example:

```javascript
// Implement authentication screen and logic
```

### Step 6: Styling and UI Components

Use `react-native-elements` or `styled-components` for styling components.

### Step 7: Testing and Deployment

Test the app on both iOS and Android emulators/simulators. For deployment, follow platform-specific guidelines.

### Summary

This structure provides a foundation for building a Social Media App frontend using React Native, demonstrating features like user profiles, posts, likes, comments, messaging, and integration with third-party APIs. Expand and customize based on specific requirements and further enhance with additional features like notifications, settings, and more.