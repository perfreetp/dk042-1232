import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ProjectCard from '@/components/ProjectCard';
import { mockProjects } from '@/data/projects';
import { ProjectCategory, CATEGORY_MAP } from '@/types/project';

const FILTERS: { key: ProjectCategory | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'ecommerce', label: CATEGORY_MAP.ecommerce.label },
  { key: 'content', label: CATEGORY_MAP.content.label },
  { key: 'tool', label: CATEGORY_MAP.tool.label },
  { key: 'offline', label: CATEGORY_MAP.offline.label }
];

const PlazaPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [projects, setProjects] = useState(mockProjects);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchCategory = activeFilter === 'all' || p.category === activeFilter;
      const matchKeyword = !searchKeyword ||
        p.title.includes(searchKeyword) ||
        p.description.includes(searchKeyword) ||
        p.tags.some(t => t.includes(searchKeyword));
      return matchCategory && matchKeyword;
    });
  }, [projects, activeFilter, searchKeyword]);

  const handleFavorite = (id: string) => {
    setProjects(prev => prev.map(p =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    ));
    Taro.showToast({ title: '已更新收藏', icon: 'none' });
    console.log('[Plaza] Toggle favorite:', id);
  };

  const handlePullDownRefresh = () => {
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  };

  return (
    <View className={styles.page} onPullDownRefresh={handlePullDownRefresh}>
      <View className={styles.header}>
        <View className={styles.searchBar}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder="搜索项目、技能、标签"
            placeholderClass={styles.placeholder}
            value={searchKeyword}
            onInput={e => setSearchKeyword(e.detail.value)}
          />
        </View>

        <ScrollView className={styles.filterBar} scrollX showScrollbar={false}>
          {FILTERS.map(filter => (
            <View
              key={filter.key}
              className={classnames(styles.filterItem, activeFilter === filter.key && styles.active)}
              onClick={() => setActiveFilter(filter.key)}
            >
              <Text>{filter.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className={styles.list}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onFavorite={handleFavorite} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无匹配的项目</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PlazaPage;
