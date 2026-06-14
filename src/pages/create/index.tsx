import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useProjectStore } from '@/store/projectStore';
import { ProjectCategory, CATEGORY_MAP, ProjectRole, Milestone, ProjectTask } from '@/types/project';

interface RoleFormItem {
  id: string;
  name: string;
  skills: string;
  slots: string;
  description: string;
}

interface MilestoneFormItem {
  id: string;
  title: string;
  deadline: string;
}

interface TaskFormItem {
  id: string;
  title: string;
  description: string;
  deadline: string;
}

const CreatePage: React.FC = () => {
  const { addProject } = useProjectStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('ecommerce');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState('');
  const [budget, setBudget] = useState('');
  const [period, setPeriod] = useState('');
  const [city, setCity] = useState('');
  const [riskWarning, setRiskWarning] = useState('');
  const [tags, setTags] = useState('');
  const [roles, setRoles] = useState<RoleFormItem[]>([
    { id: 'r1', name: '', skills: '', slots: '1', description: '' }
  ]);
  const [milestones, setMilestones] = useState<MilestoneFormItem[]>([
    { id: 'm1', title: '', deadline: '' }
  ]);
  const [tasks, setTasks] = useState<TaskFormItem[]>([
    { id: 't1', title: '', description: '', deadline: '' }
  ]);

  const categories: ProjectCategory[] = ['ecommerce', 'content', 'tool', 'offline'];
  const categoryImages: Record<ProjectCategory, string> = {
    ecommerce: 'https://picsum.photos/id/119/750/500',
    content: 'https://picsum.photos/id/1027/750/500',
    tool: 'https://picsum.photos/id/201/750/500',
    offline: 'https://picsum.photos/id/1082/750/500'
  };

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

  const handleAddMilestone = () => {
    setMilestones(prev => [...prev, { id: `m${Date.now()}`, title: '', deadline: '' }]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  const handleMilestoneChange = (id: string, field: keyof MilestoneFormItem, value: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleAddTask = () => {
    setTasks(prev => [...prev, { id: `t${Date.now()}`, title: '', description: '', deadline: '' }]);
  };

  const handleRemoveTask = (id: string) => {
    if (tasks.length <= 1) return;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleTaskChange = (id: string, field: keyof TaskFormItem, value: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
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

    const validRoles = roles.filter(r => r.name.trim());
    if (validRoles.length === 0) {
      Taro.showToast({ title: '请至少填写一个招募角色', icon: 'none' });
      return;
    }

    const projectRoles: ProjectRole[] = validRoles.map(r => ({
      id: r.id,
      name: r.name.trim(),
      skills: r.skills.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      slots: Math.max(1, parseInt(r.slots) || 1),
      filled: 0,
      description: r.description.trim() || `${r.name}相关工作`
    }));

    const projectMilestones: Milestone[] = milestones
      .filter(m => m.title.trim())
      .map(m => ({
        id: m.id,
        title: m.title.trim(),
        deadline: m.deadline || '待定',
        status: 'pending' as const
      }));

    const projectTasks: ProjectTask[] = tasks
      .filter(t => t.title.trim())
      .map(t => ({
        id: t.id,
        title: t.title.trim(),
        description: t.description.trim() || '待补充',
        deadline: t.deadline || '待定',
        status: 'todo' as const
      }));

    const tagList = tags
      ? tags.split(/[,，]/).map(t => t.trim()).filter(Boolean).slice(0, 5)
      : [CATEGORY_MAP[category].label];

    const newProjectId = `p_${Date.now()}`;

    addProject({
      title: title.trim(),
      category,
      description: description.trim(),
      goals: goals.trim() || '待补充',
      budget: budget.trim() || '待商议',
      period: period.trim() || '待定',
      city: city.trim() || '不限城市',
      riskWarning: riskWarning.trim() || '请仔细评估项目风险后再加入',
      coverImage: categoryImages[category],
      roles: projectRoles,
      milestones: projectMilestones,
      tasks: projectTasks
    });

    console.log('[Create] Project submitted:', newProjectId);

    Taro.showToast({ title: '发布成功！', icon: 'success' });
    setTimeout(() => {
      Taro.redirectTo({ url: `/pages/project-detail/index?id=${newProjectId}` });
    }, 800);
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
            <Text className={styles.label}>项目目标（每行一个）</Text>
            <Textarea
              className={styles.textarea}
              placeholder="列出你期望达成的具体目标，每行一个"
              value={goals}
              onInput={e => setGoals(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>项目标签（逗号分隔，最多5个）</Text>
            <Input
              className={styles.input}
              placeholder="例如：电商, 美妆, 独立站"
              value={tags}
              onInput={e => setTags(e.detail.value)}
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

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🚩</Text>项目里程碑
          </Text>

          {milestones.map((m, index) => (
            <View key={m.id} className={styles.roleCard}>
              <View className={styles.roleHeader}>
                <Text className={styles.roleName}>里程碑 {index + 1}</Text>
                {milestones.length > 1 && (
                  <Text className={styles.removeBtn} onClick={() => handleRemoveMilestone(m.id)}>
                    删除
                  </Text>
                )}
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="里程碑名称，如：品牌定位与视觉设计"
                  value={m.title}
                  onInput={e => handleMilestoneChange(m.id, 'title', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="截止日期，如：2026-07-15"
                  value={m.deadline}
                  onInput={e => handleMilestoneChange(m.id, 'deadline', e.detail.value)}
                />
              </View>
            </View>
          ))}

          <Button className={styles.addBtn} onClick={handleAddMilestone}>
            <Text className={styles.addIcon}>+</Text>
            <Text>添加里程碑</Text>
          </Button>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>任务清单
          </Text>

          {tasks.map((task, index) => (
            <View key={task.id} className={styles.roleCard}>
              <View className={styles.roleHeader}>
                <Text className={styles.roleName}>任务 {index + 1}</Text>
                {tasks.length > 1 && (
                  <Text className={styles.removeBtn} onClick={() => handleRemoveTask(task.id)}>
                    删除
                  </Text>
                )}
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="任务标题"
                  value={task.title}
                  onInput={e => handleTaskChange(task.id, 'title', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Textarea
                  className={styles.textarea}
                  placeholder="任务描述"
                  value={task.description}
                  onInput={e => handleTaskChange(task.id, 'description', e.detail.value)}
                />
              </View>

              <View className={styles.formItem}>
                <Input
                  className={styles.input}
                  placeholder="截止日期，如：2026-06-30"
                  value={task.deadline}
                  onInput={e => handleTaskChange(task.id, 'deadline', e.detail.value)}
                />
              </View>
            </View>
          ))}

          <Button className={styles.addBtn} onClick={handleAddTask}>
            <Text className={styles.addIcon}>+</Text>
            <Text>添加任务</Text>
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
