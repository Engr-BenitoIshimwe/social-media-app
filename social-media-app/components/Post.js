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
