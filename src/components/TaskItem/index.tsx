import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { TaskItem as TaskItemType } from '@/types/collaborate';

interface TaskItemProps {
  task: TaskItemType;
  onStatusChange?: (id: string) => void;
}

const STATUS_MAP = {
  todo: { label: '待开始', className: 'statusTodo' },
  doing: { label: '进行中', className: 'statusDoing' },
  done: { label: '已完成', className: 'statusDone' }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange }) => {
  const statusInfo = STATUS_MAP[task.status];

  return (
    <View className={styles.taskItem}>
      <View
        className={classnames(styles.checkbox, task.status === 'done' && styles.checked)}
        onClick={() => onStatusChange?.(task.id)}
      >
        {task.status === 'done' && <Text className={styles.checkIcon}>✓</Text>}
      </View>
      <View className={styles.content}>
        <Text className={classnames(styles.title, task.status === 'done' && styles.done)}>
          {task.title}
        </Text>
        <Text className={styles.description}>{task.description}</Text>
        <View className={styles.meta}>
          <View className={classnames(styles.statusTag, styles[statusInfo.className])}>
            <Text>{statusInfo.label}</Text>
          </View>
          <Text className={styles.deadline}>截止：{task.deadline}</Text>
        </View>
      </View>
    </View>
  );
};

export default TaskItem;
