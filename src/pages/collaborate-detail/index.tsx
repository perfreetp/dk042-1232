import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TaskItem from '@/components/TaskItem';
import { getCollaborationById } from '@/data/collaborate';
import { TaskItem as TaskItemType } from '@/types/collaborate';

type TabKey = 'team' | 'tasks' | 'files' | 'meetings' | 'reviews';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'team', label: '团队' },
  { key: 'tasks', label: '任务' },
  { key: 'files', label: '文件' },
  { key: 'meetings', label: '会议' },
  { key: 'reviews', label: '复盘' }
];

const CollaborateDetailPage: React.FC = () => {
  const router = useRouter();
  const collabId = router.params.id || 'c1';
  const collaboration = getCollaborationById(collabId) || getCollaborationById('c1')!;

  const [activeTab, setActiveTab] = useState<TabKey>('team');
  const [tasks, setTasks] = useState<TaskItemType[]>(collaboration.tasks);

  const handleTaskStatusChange = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const statusFlow: TaskItemType['status'][] = ['todo', 'doing', 'done'];
      const nextIndex = (statusFlow.indexOf(t.status) + 1) % statusFlow.length;
      return { ...t, status: statusFlow[nextIndex] };
    }));
    console.log('[CollabDetail] Task status changed:', id);
  };

  const handleFileClick = (name: string) => {
    Taro.showToast({ title: `打开 ${name}`, icon: 'none' });
  };

  if (!collaboration) {
    return <View className={styles.page}><Text>协作不存在</Text></View>;
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.projectInfo}>
          <View className={styles.cover}>
            <Image className={styles.coverImg} src={collaboration.coverImage} mode="aspectFill" />
          </View>
          <View className={styles.info}>
            <Text className={styles.title}>{collaboration.projectTitle}</Text>
            <View className={styles.progressWrap}>
              <View className={styles.progressBar}>
                <View className={styles.progressFill} style={{ width: `${collaboration.progress}%` }} />
              </View>
              <Text className={styles.progressText}>项目进度 {collaboration.progress}%</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.tabs}>
        {TABS.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeTab === tab.key && styles.tabActive)}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text>{tab.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.content}>
        {/* 团队 */}
        <View className={classnames(styles.tabContent, activeTab === 'team' && styles.tabContentActive)}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👥</Text>团队成员 ({collaboration.collaborators.length})
            </Text>
            <View className={styles.membersGrid}>
              {collaboration.collaborators.map(m => (
                <View key={m.id} className={styles.memberItem}>
                  <Image className={styles.memberAvatar} src={m.avatar} mode="aspectFill" />
                  <View className={styles.memberInfo}>
                    <Text className={styles.memberName}>{m.name}</Text>
                    <Text className={styles.memberRole}>{m.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 任务 */}
        <View className={classnames(styles.tabContent, activeTab === 'tasks' && styles.tabContentActive)}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📋</Text>任务清单 ({tasks.filter(t => t.status === 'done').length}/{tasks.length})
            </Text>
            <View className={styles.taskList}>
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
              ))}
            </View>
          </View>
        </View>

        {/* 文件 */}
        <View className={classnames(styles.tabContent, activeTab === 'files' && styles.tabContentActive)}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📁</Text>共享文件
            </Text>
            {collaboration.files.length > 0 ? (
              collaboration.files.map(file => (
                <View key={file.id} className={styles.fileItem} onClick={() => handleFileClick(file.name)}>
                  <View className={styles.fileIcon}>
                    <Text>📄</Text>
                  </View>
                  <View className={styles.fileInfo}>
                    <Text className={styles.fileName}>{file.name}</Text>
                    <Text className={styles.fileMeta}>{file.uploadedBy} · {file.uploadedAt}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: '28rpx' }}>暂无共享文件</Text>
            )}
          </View>
        </View>

        {/* 会议 */}
        <View className={classnames(styles.tabContent, activeTab === 'meetings' && styles.tabContentActive)}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📝</Text>会议纪要
            </Text>
            {collaboration.meetings.length > 0 ? (
              collaboration.meetings.map(m => (
                <View key={m.id} className={styles.meetingItem}>
                  <View className={styles.meetingHeader}>
                    <Text className={styles.meetingTitle}>{m.title}</Text>
                    <Text className={styles.meetingDate}>{m.date}</Text>
                  </View>
                  <Text className={styles.meetingContent}>{m.content}</Text>
                  <Text className={styles.attendees}>参与人：{m.attendees.join('、')}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: '28rpx' }}>暂无会议纪要</Text>
            )}
          </View>
        </View>

        {/* 复盘 */}
        <View className={classnames(styles.tabContent, activeTab === 'reviews' && styles.tabContentActive)}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🔄</Text>阶段复盘
            </Text>
            {collaboration.reviews.length > 0 ? (
              collaboration.reviews.map(r => (
                <View key={r.id} className={styles.reviewItem}>
                  <View className={styles.reviewPhase}>
                    <Text>{r.phase}</Text>
                    <Text className={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <View className={styles.reviewSection}>
                    <Text className={styles.reviewLabel}>✅ 成果</Text>
                    <Text className={styles.reviewText}>{r.achievements}</Text>
                  </View>
                  <View className={styles.reviewSection}>
                    <Text className={styles.reviewLabel}>💡 改进</Text>
                    <Text className={styles.reviewText}>{r.improvements}</Text>
                  </View>
                  <View className={styles.reviewSection}>
                    <Text className={styles.reviewLabel}>🚀 下一步</Text>
                    <Text className={styles.reviewText}>{r.nextSteps}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: '28rpx' }}>暂无复盘记录</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CollaborateDetailPage;
