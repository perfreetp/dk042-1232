import React from 'react';
import { View, Image, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface UserAvatarProps {
  src?: string;
  size?: number;
  name?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, size = 72, name = '', className }) => {
  const style = { width: `${size}rpx`, height: `${size}rpx` };
  const initial = name ? name.charAt(0) : '?';

  return (
    <View className={className} style={{ ...style }}>
      <View className={styles.avatar} style={style}>
        {src ? (
          <Image className={styles.image} src={src} mode="aspectFill" />
        ) : (
          <View className={styles.placeholder}>
            <Text>{initial}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserAvatar;
