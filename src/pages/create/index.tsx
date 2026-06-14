import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { ProjectCategory, CATEGORY_MAP, ProjectRole } from '@/types/project';

interface RoleFormItem {
  id: string;
  name: string;
  skills: string;
  slots: string;
  description: string;
}

const CreatePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('ecommerce');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [budget, setBudget] = useState('');
  const [period, setPeriod] = useState('');
  const [city, setCity] = useState('');
  const [riskWarning, setRiskWarning] = useState('');
  const [roles, setRoles] = useState<RoleFormItem[]>([
    { id: 'r1', name: '', skills: '', slots: '1', description: '' }
  ]);

  const categories: ProjectCategory[] = ['ecommerce', 'content', 'tool', 'offline'];

  const handleAddRole = () => {
    setRoles(prev => [
      ...prev,
      { id: `r${Date.now()}`, name: '', skills: '', slots: '1', description: '' }
    ]);
  };

  const handleRemoveRole = (id: string) => {
    if (roles.length <= 1) return;
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  const handleRoleChange = (id: string, field: keyof RoleFormItem, value: string) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入项目名称', icon: 'none' });
      return;
    }
    if (!description.trim()) {
      Taro.showToast({ title: '请输入项目描述', icon: 'none' });
      return;
    }
    console.log('[Create] Submit project:', {
      title, category, description, goals, budget, period, city, riskWarning, roles
    });
    Taro.showToast({ title: '发布成功！', icon: 'success' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/plaza/index' });
    }, 1500);
  };

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>基础信息
          </Text>

          <View className={styles.formItem}>
            <Text className={classnames(styles.label, styles.required)}>项目名称</Text>
            <Input
              className={styles.input}
              placeholder="给项目起个吸引人的名字"
              value={title}
              onInput={e => setTitle(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.label, styles.required)}>项目分类</Text>
            <View className={styles.categoryGrid}>
              {categories.map(cat => (
                <View
                  key={cat}
                  className={classnames(styles.categoryItem, category === cat && styles.activeCategory)}
                  onClick={() => setCategory(cat)}
                >
                  <Text>{CATEGORY_MAP[cat].label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={classnames(styles.label, styles.required)}>项目描述</Text>
            <Textarea
              className={styles.textarea}
              placeholder="简要介绍你的项目，包括做什么、为什么做、目标用户等"
              value={description}
              onInput={e => setDescription(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>项目目标</Text>
            <Textarea
              className={styles.textarea}
              placeholder="列出你期望达成的具体目标"
              value={goals}
              onInput={e => setGoals(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>⚙️</Text>项目参数
          </Text>

          <View className={styles.formItem}>
            <Text className={styles.label}>预计周期</Text>
            <Input
              className={styles.input}
              placeholder="例如：3-6个月"
              value={period}
              onInput={e => setPeriod(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>预算与收益方式</Text>
            <Input
              className={styles.input}
              placeholder="例如：总预算5万，按收益分成"
              value={budget}
              onInput={e => setBudget(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>所在城市</Text>
            <Input
              className={styles.input}
              placeholder="不限城市可填：不限城市"
              value={city}
              onInput={e => setCity(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>风险提示</Text>
            <Textarea
              className={styles.textarea}
              placeholder="诚实地告知合伙人可能面临的风险"
              value={riskWarning}
              onInput={e => setRiskWarning(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👥</Text>招募角色
          </Text>

          {roles.map((role, index) => (
            <View key={role.id} className={styles.roleCard}>
              <View className={styles.roleHeader}>
                <Text className={styles.roleName}>角色 {index + 1}</Text>
                {roles.length > 1 && (
                  <Text className={styles.removeBtn} onClick={() => handleRemoveRole(role.id)}>
                    删除
                  </Text>
                )}
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="角色名称，如：前端开发"
                  value={role.name}
                  onInput={e => handleRoleChange(role.id, 'name', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="所需技能，逗号分隔"
                  value={role.skills}
                  onInput={e => handleRoleChange(role.id, 'skills', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="招募名额"
                  type="number"
                  value={role.slots}
                  onInput={e => handleRoleChange(role.id, 'slots', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Textarea
                  className={styles.textarea}
                  placeholder="角色工作描述"
                  value={role.description}
                  onInput={e => handleRoleChange(role.id, 'description', e.detail.value)}
                />
              </View>
            </View>
          ))}

          <Button className={styles.addBtn} onClick={handleAddRole}>
            <Text className={styles.addIcon}>+</Text>
            <Text>添加招募角色</Text>
          </Button>
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.submitBtn} onClick={handleSubmit}>
          发布项目
        </Button>
      </View>
    </View>
  );
};

export default CreatePage;
