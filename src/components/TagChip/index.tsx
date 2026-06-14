import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TagChipProps {
  text: string;
  color?: string;
  bgColor?: string;
  small?: boolean;
  className?: string;
}

const TagChip: React.FC<TagChipProps> = ({ text, color = '#4F46E5', bgColor = '#EEF2FF', small, className }) => {
  return (
    <View
      className={classnames(styles.tagChip, small && styles.small, className)}
      style={{ color, backgroundColor: bgColor }}
    >
      <Text>{text}</Text>
    </View>
  );
};

export default TagChip;
