import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { mockCurrentUser } from '@/data/users';
import { INCOME_TYPE_MAP } from '@/types/user';

const ProfilePage: React.FC = () => {
  const user = mockCurrentUser;

  const handleEditProfile = () => {
    Taro.navigateTo({ url: '/pages/profile-edit/index' });
  };

  const handleMenuItem = (key: string) => {
    Taro.showToast({ title: `功能：${key}`, icon: 'none' });
  };

  const menuItems = [
    { icon: '📝', key: '我的项目', text: '我发起的项目' },
    { icon: '📋', key: '申请记录', text: '我的申请记录' },
    { icon: '⭐', key: '我的收藏', text: '收藏的项目' },
    { icon: '💬', key: '消息中心', text: '消息通知' }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <View className={styles.avatarWrap}>
            <Image className={styles.avatar} src={user.avatar} mode="aspectFill" />
          </View>
          <View className={styles.info}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{user.name}</Text>
              <Text className={styles.rating}>⭐ {user.rating}</Text>
            </View>
            <Text className={styles.city}>📍 {user.city} · {user.availableTime}</Text>
            <Text className={styles.bio}>{user.bio}</Text>
          </View>
        </View>

        <Button className={styles.editBtn} onClick={handleEditProfile}>
          编辑资料
        </Button>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.completedProjects}</Text>
            <Text className={styles.statLabel}>完成项目</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{user.works.length}</Text>
            <Text className={styles.statLabel}>作品展示</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>3</Text>
            <Text className={styles.statLabel}>收藏项目</Text>
          </View>
        </View>
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            个人技能
            <Text className={styles.more}>编辑</Text>
          </Text>
          <View className={styles.skillsWrap}>
            {user.skills.map(skill => (
              <View key={skill.id} className={styles.skillTag}>
                <Text>{skill.name}</Text>
              </View>
            ))}
          </View>
          <View className={styles.metaRow}>
            <View className={styles.metaItem}>
              <Text className={styles.metaIcon}>⏱</Text>
              <Text>{user.availableTime}</Text>
            </View>
            <View className={styles.metaItem}>
              <Text className={styles.metaIcon}>💰</Text>
              <Text>{user.incomeTypes.map(t => INCOME_TYPE_MAP[t]).join('、')}</Text>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            我的功能
          </Text>
          <View className={styles.menuList}>
            {menuItems.map(item => (
              <View key={item.key} className={styles.menuItem} onClick={() => handleMenuItem(item.key)}>
                <View className={styles.menuIcon}>
                  <Text>{item.icon}</Text>
                </View>
                <Text className={styles.menuText}>{item.text}</Text>
                <Text className={styles.menuArrow}>›</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            过往作品
            <Text className={styles.more}>查看全部</Text>
          </Text>
          <View className={styles.worksList}>
            {user.works.map(work => (
              <View key={work.id} className={styles.workItem}>
                <Image className={styles.workCover} src={work.imageUrl} mode="aspectFill" />
                <View className={styles.workInfo}>
                  <Text className={styles.workTitle}>{work.title}</Text>
                  <Text className={styles.workDesc}>{work.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;
