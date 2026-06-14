import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import TagChip from '@/components/TagChip';
import UserAvatar from '@/components/UserAvatar';
import { Project, CATEGORY_MAP } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onFavorite?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onFavorite }) => {
  const category = CATEGORY_MAP[project.category];
  const filledSlots = project.roles.reduce((sum, r) => sum + r.filled, 0);

  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/project-detail/index?id=${project.id}`
    });
  };

  const handleFavorite = (e: any) => {
    e.stopPropagation();
    onFavorite?.(project.id);
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrap}>
        <Image className={styles.cover} src={project.coverImage} mode="aspectFill" />
        <View
          className={styles.categoryBadge}
          style={{ color: category.color, backgroundColor: category.bgColor }}
        >
          {category.label}
        </View>
      </View>

      <View className={styles.header}>
        <Text className={styles.title}>{project.title}</Text>
        <View className={styles.favorite} onClick={handleFavorite}>
          <Text className={styles.favoriteIcon}>{project.isFavorite ? '★' : '☆'}</Text>
        </View>
      </View>

      <Text className={styles.description}>{project.description}</Text>

      <View className={styles.meta}>
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
      </View>

      <View className={styles.tags}>
        {project.tags.slice(0, 3).map(tag => (
          <TagChip key={tag} text={tag} small />
        ))}
      </View>

      <View className={styles.footer}>
        <View className={styles.founder}>
          <UserAvatar src={project.founderAvatar} size={64} name={project.founderName} />
          <View className={styles.founderInfo}>
            <Text className={styles.founderName}>{project.founderName}</Text>
            <Text className={styles.founderLabel}>发起人</Text>
          </View>
        </View>
        <View className={styles.slots}>
          <Text className={styles.slotCount}>{filledSlots}/{project.totalSlots}名额</Text>
          <Text className={styles.applyCount}>{project.appliedCount}人申请</Text>
        </View>
      </View>
    </View>
  );
};

export default ProjectCard;
