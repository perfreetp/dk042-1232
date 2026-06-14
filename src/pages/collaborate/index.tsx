import React, { useMemo } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useCollabStore } from '@/store/collabStore';

const CollaboratePage: React.FC = () => {
  const { getMyCollaborations } = useCollabStore();
  const collaborations = getMyCollaborations();

  const totalTasks = useMemo(() => collaborations.reduce((sum, c) =>
    sum + c.tasks.filter(t => t.status !== 'done').length, 0
  ), [collaborations]);

  const handleCardClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/collaborate-detail/index?id=${id}`
    });
  };

  const handleGoPlaza = () => {
    Taro.switchTab({ url: '/pages/plaza/index' });
  };

  const handlePullDownRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 600);
  };

  return (
    <View className={styles.page} onPullDownRefresh={handlePullDownRefresh}>
      <View className={styles.header}>
        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{collaborations.length}</Text>
            <Text className={styles.statLabel}>协作项目</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={styles.statValue}>{totalTasks}</Text>
            <Text className={styles.statLabel}>待办任务</Text>
          </View>
        </View>
      </View>

      <ScrollView className={styles.list} scrollY>
        {collaborations.length > 0 ? (
          collaborations.map(collab => {
            const pendingTasks = collab.tasks.filter(t => t.status !== 'done').length;
            return (
              <View
                key={collab.id}
                className={styles.collabCard}
                onClick={() => handleCardClick(collab.id)}
              >
                <View className={styles.cardHeader}>
                  <View className={styles.cover}>
                    <Image className={styles.coverImg} src={collab.coverImage} mode="aspectFill" />
                  </View>
                  <View className={styles.info}>
                    <Text className={styles.title}>{collab.projectTitle}</Text>
                    <Text className={styles.collabCount}>{collab.collaborators.length} 位合伙人</Text>
                  </View>
                </View>

                <View className={styles.progressWrap}>
                  <View className={styles.progressBar}>
                    <View className={styles.progressFill} style={{ width: `${collab.progress}%` }} />
                  </View>
                  <Text className={styles.progressText}>项目进度 {collab.progress}%</Text>
                </View>

                <View className={styles.footer}>
                  <View className={styles.members}>
                    {collab.collaborators.slice(0, 4).map(m => (
                      <View key={m.id} className={styles.memberAvatar}>
                        <Image className={styles.memberImg} src={m.avatar} mode="aspectFill" />
                      </View>
                    ))}
                  </View>
                  <Text className={styles.taskCount}>{pendingTasks} 项待办</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🤝</Text>
            <Text className={styles.emptyText}>暂无协作项目，去广场看看吧</Text>
            <Button className={styles.goBtn} onClick={handleGoPlaza}>前往项目广场</Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CollaboratePage;
