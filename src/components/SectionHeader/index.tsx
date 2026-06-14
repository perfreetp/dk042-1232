import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, onAction }) => {
  return (
    <View className={styles.sectionHeader}>
      <Text className={styles.title}>{title}</Text>
      {action && (
        <Text className={styles.action} onClick={onAction}>{action}</Text>
      )}
    </View>
  );
};

export default SectionHeader;
