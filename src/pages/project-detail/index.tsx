import React, { useState } from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TagChip from '@/components/TagChip';
import UserAvatar from '@/components/UserAvatar';
import { getProjectById } from '@/data/projects';
import { CATEGORY_MAP } from '@/types/project';

const ProjectDetailPage: React.FC = () => {
  const router = useRouter();
  const projectId = router.params.id || 'p1';
  const project = getProjectById(projectId) || getProjectById('p1')!;
  const category = CATEGORY_MAP[project.category];

  const [isFavorite, setIsFavorite] = useState(project.isFavorite);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Taro.showToast({ title: isFavorite ? '已取消收藏' : '已收藏', icon: 'none' });
    console.log('[ProjectDetail] Toggle favorite:', projectId);
  };

  const handleChat = () => {
    Taro.navigateTo({ url: `/pages/chat/index?userId=${project.founderId}` });
  };

  const handleVoice = () => {
    Taro.showToast({ title: '语音预约功能开发中', icon: 'none' });
  };

  const handleApply = () => {
    Taro.showModal({
      title: '申请加入',
      content: '确定要申请加入这个项目吗？发起人会审核你的资料。',
      confirmText: '确认申请',
      success: res => {
        if (res.confirm) {
          Taro.showToast({ title: '申请已发送', icon: 'success' });
          console.log('[ProjectDetail] Apply to project:', projectId);
        }
      }
    });
  };

  if (!project) {
    return (
      <View className={styles.page}>
        <Text>项目不存在</Text>
      </View>
    );
  }

  const filledSlots = project.roles.reduce((sum, r) => sum + r.filled, 0);

  return (
    <View className={styles.page}>
      <View className={styles.cover}>
        <Image className={styles.coverImg} src={project.coverImage} mode="aspectFill" />
      </View>

      <View className={styles.content}>
        <View className={styles.card}>
          <View className={styles.header}>
            <View className={styles.titleRow}>
              <Text className={styles.title}>{project.title}</Text>
              <View className={styles.favorite} onClick={handleFavorite}>
                <Text className={styles.favoriteIcon}>{isFavorite ? '★' : '☆'}</Text>
              </View>
            </View>
            <View className={styles.tags}>
              <TagChip text={category.label} color={category.color} bgColor={category.bgColor} />
              {project.tags.map(tag => (
                <TagChip key={tag} text={tag} small />
              ))}
            </View>
            <View className={styles.metaGrid}>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>📍</Text>
                <Text>{project.city}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>⏱</Text>
                <Text>{project.period}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>💰</Text>
                <Text>{project.budget}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>👥</Text>
                <Text>{filledSlots}/{project.totalSlots} 名额</Text>
              </View>
            </View>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📖</Text>项目介绍
          </Text>
          <Text className={styles.description}>{project.description}</Text>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🎯</Text>项目目标
          </Text>
          <View className={styles.goalsList}>
            {project.goals.split('\n').map((goal, i) => (
              <Text key={i} className={styles.goalItem}>{goal}</Text>
            ))}
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>发起人
          </Text>
          <View className={styles.founderRow}>
            <UserAvatar src={project.founderAvatar} size={88} name={project.founderName} />
            <View className={styles.founderInfo}>
              <Text className={styles.founderName}>{project.founderName}</Text>
              <Text className={styles.founderLabel}>项目发起人 · {project.city}</Text>
            </View>
            <Button className={styles.viewBtn} onClick={handleChat}>
              私聊
            </Button>
          </View>
        </View>

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👥</Text>招募角色 ({filledSlots}/{project.totalSlots})
          </Text>
          <View className={styles.rolesList}>
            {project.roles.map(role => (
              <View key={role.id} className={styles.roleItem}>
                <View className={styles.roleHeader}>
                  <Text className={styles.roleName}>{role.name}</Text>
                  <Text className={styles.roleSlots}>{role.filled}/{role.slots}名额</Text>
                </View>
                <Text className={styles.roleDesc}>{role.description}</Text>
                <View className={styles.roleSkills}>
                  {role.skills.map(skill => (
                    <TagChip key={skill} text={skill} color="#475569" bgColor="#F1F5F9" small />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {project.milestones.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🚩</Text>项目里程碑
            </Text>
            <View className={styles.timeline}>
              {project.milestones.map((m, i) => (
                <View key={m.id} className={styles.timelineItem}>
                  <View className={styles.timelineLine} />
                  <View
                    className={classnames(
                      styles.timelineDot,
                      m.status === 'completed' && styles.dotDone,
                      m.status === 'pending' && styles.dotPending
                    )}
                  />
                  <Text className={styles.milestoneTitle}>{m.title}</Text>
                  <Text className={styles.milestoneDate}>截止：{m.deadline}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View className={styles.card}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>⚠️</Text>风险提示
          </Text>
          <View className={styles.riskBox}>
            <Text className={styles.riskText}>{project.riskWarning}</Text>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.iconBtn} onClick={handleChat}>
          <Text className={styles.iconBtnIcon}>💬</Text>
          <Text className={styles.iconBtnText}>私聊</Text>
        </Button>
        <Button className={styles.iconBtn} onClick={handleVoice}>
          <Text className={styles.iconBtnIcon}>📞</Text>
          <Text className={styles.iconBtnText}>语音</Text>
        </Button>
        <Button className={styles.iconBtn} onClick={handleFavorite}>
          <Text className={styles.iconBtnIcon}>{isFavorite ? '★' : '☆'}</Text>
          <Text className={styles.iconBtnText}>收藏</Text>
        </Button>
        <Button className={styles.applyBtn} onClick={handleApply}>
          申请加入
        </Button>
      </View>
    </View>
  );
};

export default ProjectDetailPage;
