import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TagChip from '@/components/TagChip';
import UserAvatar from '@/components/UserAvatar';
import { useProjectStore } from '@/store/projectStore';
import { useUserStore, ApplicationRecord } from '@/store/userStore';
import { CATEGORY_MAP, ProjectRole } from '@/types/project';

const ProjectDetailPage: React.FC = () => {
  const router = useRouter();
  const projectId = router.params.id || 'p1';

  const { getProjectById, toggleFavorite, isFavorite, incrementAppliedCount } = useProjectStore();
  const { addApplication, addReceivedApplication, addVoiceAppointment, profile } = useUserStore();

  const project = useMemo(() => getProjectById(projectId), [projectId, getProjectById]);
  const [favState, setFavState] = useState(isFavorite(projectId));
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [applyMessage, setApplyMessage] = useState('');
  const [voiceDate, setVoiceDate] = useState('');
  const [voiceTime, setVoiceTime] = useState('');

  useDidShow(() => {
    setFavState(isFavorite(projectId));
  });

  if (!project) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text style={{ color: '#94A3B8', fontSize: 28 }}>项目不存在或已下架</Text>
        </View>
      </View>
    );
  }

  const category = CATEGORY_MAP[project.category];
  const filledSlots = project.roles.reduce((sum, r) => sum + r.filled, 0);

  const handleFavorite = () => {
    const newFav = toggleFavorite(projectId);
    setFavState(newFav);
    Taro.showToast({ title: newFav ? '已收藏' : '已取消收藏', icon: 'none' });
    console.log('[ProjectDetail] Toggle favorite:', projectId, newFav);
  };

  const handleChat = () => {
    Taro.navigateTo({ url: `/pages/chat/index?userId=${project.founderId}&projectId=${projectId}` });
  };

  const handleVoice = () => {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    setVoiceDate(tomorrow.toISOString().split('T')[0]);
    setVoiceTime('19:00');
    setShowVoiceModal(true);
  };

  const confirmVoiceAppointment = () => {
    if (!voiceDate || !voiceTime) {
      Taro.showToast({ title: '请选择日期和时间', icon: 'none' });
      return;
    }
    addVoiceAppointment({
      id: `va_${Date.now()}`,
      targetUserId: project.founderId,
      targetUserName: project.founderName,
      targetUserAvatar: project.founderAvatar,
      projectId: project.id,
      projectTitle: project.title,
      date: voiceDate,
      time: voiceTime,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    });
    setShowVoiceModal(false);
    Taro.showToast({ title: '预约已提交', icon: 'success' });
    console.log('[ProjectDetail] Voice appointment:', voiceDate, voiceTime);
  };

  const handleApply = () => {
    const availableRoles = project.roles.filter(r => r.filled < r.slots);
    if (availableRoles.length === 0) {
      Taro.showToast({ title: '所有角色名额已满', icon: 'none' });
      return;
    }
    setSelectedRole(availableRoles[0].id);
    setApplyMessage('');
    setShowApplyModal(true);
  };

  const confirmApply = () => {
    if (!selectedRole) {
      Taro.showToast({ title: '请选择申请角色', icon: 'none' });
      return;
    }
    const role = project.roles.find(r => r.id === selectedRole);
    if (!role) return;

    const appId = `app_${Date.now()}`;

    const appRecord: ApplicationRecord = {
      id: appId,
      projectId: project.id,
      projectTitle: project.title,
      projectCover: project.coverImage,
      roleName: role.name,
      roleId: role.id,
      status: 'pending',
      message: applyMessage,
      createdAt: new Date().toISOString().split('T')[0],
      founderId: project.founderId,
      founderName: project.founderName,
      applicantId: 'me',
      applicantName: profile.name,
      applicantAvatar: profile.avatar
    };
    addApplication(appRecord);

    addReceivedApplication({
      ...appRecord,
      id: `recv_${appId}`
    });

    incrementAppliedCount(project.id);
    setShowApplyModal(false);
    Taro.showToast({ title: '申请已发送', icon: 'success' });
    console.log('[ProjectDetail] Apply submitted:', appRecord);
  };

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
                <Text className={styles.favoriteIcon}>{favState ? '★' : '☆'}</Text>
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
            {project.goals.split('\n').filter(Boolean).map((goal, i) => (
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
                  <Text
                    className={styles.roleSlots}
                    style={{ color: role.filled >= role.slots ? '#94A3B8' : '#4F46E5' }}
                  >
                    {role.filled}/{role.slots}名额
                    {role.filled >= role.slots && '（已满）'}
                  </Text>
                </View>
                <Text className={styles.roleDesc}>{role.description}</Text>
                {role.skills.length > 0 && (
                  <View className={styles.roleSkills}>
                    {role.skills.map(skill => (
                      <TagChip key={skill} text={skill} color="#475569" bgColor="#F1F5F9" small />
                    ))}
                  </View>
                )}
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
                      m.status === 'in_progress' && '',
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

        {project.tasks.length > 0 && (
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📋</Text>任务清单 ({project.tasks.filter(t => t.status === 'done').length}/{project.tasks.length})
            </Text>
            <View className={styles.taskList}>
              {project.tasks.map(task => {
                const statusMap: Record<string, { label: string; color: string; bg: string }> = {
                  todo: { label: '待开始', color: '#94A3B8', bg: '#F1F5F9' },
                  doing: { label: '进行中', color: '#4F46E5', bg: '#EEF2FF' },
                  done: { label: '已完成', color: '#10B981', bg: '#ECFDF5' }
                };
                const s = statusMap[task.status] || statusMap.todo;
                return (
                  <View key={task.id} className={styles.taskItem}>
                    <View className={styles.taskHeader}>
                      <Text className={styles.taskTitle}>{task.title}</Text>
                      <View style={{ padding: '4rpx 12rpx', borderRadius: 8, fontSize: 22, color: s.color, backgroundColor: s.bg }}>
                        <Text>{s.label}</Text>
                      </View>
                    </View>
                    <Text className={styles.taskDesc}>{task.description}</Text>
                    <Text className={styles.taskDeadline}>截止：{task.deadline}</Text>
                  </View>
                );
              })}
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

      {showApplyModal && (
        <View
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32
          }}
          onClick={() => setShowApplyModal(false)}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 686,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 32
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 34, fontWeight: 600, color: '#0F172A', marginBottom: 24 }}>
              申请加入项目
            </Text>
            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 16 }}>
              选择申请角色：
            </Text>
            <View style={{ marginBottom: 24 }}>
              {project.roles.filter(r => r.filled < r.slots).map(role => (
                <View
                  key={role.id}
                  style={{
                    padding: 20,
                    marginBottom: 12,
                    borderRadius: 12,
                    border: `2rpx solid ${selectedRole === role.id ? '#4F46E5' : '#E2E8F0'}`,
                    backgroundColor: selectedRole === role.id ? '#EEF2FF' : '#F8FAFC'
                  }}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <Text style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: selectedRole === role.id ? '#4F46E5' : '#0F172A'
                  }}>
                    {role.name}（剩余{role.slots - role.filled}个名额）
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>
              留言给发起人（选填）：
            </Text>
            <Textarea
              value={applyMessage}
              onInput={e => setApplyMessage(e.detail.value)}
              placeholder="简单介绍一下你自己和相关经验"
              style={{
                width: '100%',
                height: 160,
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                padding: 20,
                fontSize: 28,
                marginBottom: 32,
                boxSizing: 'border-box'
              }}
            />
            <View style={{ display: 'flex', gap: 16 }}>
              <Button
                onClick={() => setShowApplyModal(false)}
                style={{
                  flex: 1,
                  height: 88,
                  borderRadius: 48,
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  fontSize: 30,
                  fontWeight: 500
                }}
              >
                取消
              </Button>
              <Button
                onClick={confirmApply}
                style={{
                  flex: 1,
                  height: 88,
                  borderRadius: 48,
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  fontSize: 30,
                  fontWeight: 600
                }}
              >
                确认申请
              </Button>
            </View>
          </View>
        </View>
      )}

      {showVoiceModal && (
        <View
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32
          }}
          onClick={() => setShowVoiceModal(false)}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 686,
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 32
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 34, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>
              预约语音沟通
            </Text>
            <Text style={{ fontSize: 26, color: '#94A3B8', marginBottom: 24 }}>
              与 {project.founderName} 沟通「{project.title}」
            </Text>

            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>沟通日期：</Text>
            <Input
              type="text"
              value={voiceDate}
              placeholder="例如：2026-06-16"
              onInput={e => setVoiceDate(e.detail.value)}
              style={{
                width: '100%',
                height: 80,
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                padding: '0 20rpx',
                fontSize: 28,
                marginBottom: 24,
                boxSizing: 'border-box'
              }}
            />

            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>沟通时间：</Text>
            <Input
              type="text"
              value={voiceTime}
              placeholder="例如：19:00"
              onInput={e => setVoiceTime(e.detail.value)}
              style={{
                width: '100%',
                height: 80,
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                padding: '0 20rpx',
                fontSize: 28,
                marginBottom: 32,
                boxSizing: 'border-box'
              }}
            />

            <View style={{ display: 'flex', gap: 16 }}>
              <Button
                onClick={() => setShowVoiceModal(false)}
                style={{
                  flex: 1,
                  height: 88,
                  borderRadius: 48,
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  fontSize: 30,
                  fontWeight: 500
                }}
              >
                取消
              </Button>
              <Button
                onClick={confirmVoiceAppointment}
                style={{
                  flex: 1,
                  height: 88,
                  borderRadius: 48,
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  fontSize: 30,
                  fontWeight: 600
                }}
              >
                确认预约
              </Button>
            </View>
          </View>
        </View>
      )}

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
          <Text className={styles.iconBtnIcon}>{favState ? '★' : '☆'}</Text>
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
