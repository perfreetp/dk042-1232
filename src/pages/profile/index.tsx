import React, { useState } from 'react';
import { View, Text, Image, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useUserStore, ApplicationRecord, VoiceAppointment, ReceivedApplication } from '@/store/userStore';
import { useProjectStore } from '@/store/projectStore';
import { useCollabStore } from '@/store/collabStore';
import { INCOME_TYPE_MAP } from '@/types/user';

type TabKey = 'overview' | 'myProjects' | 'applications' | 'received' | 'favorites' | 'voice';

const ProfilePage: React.FC = () => {
  const { profile, applications, receivedApplications, voiceAppointments, updateApplicationStatus, approveReceivedApplication, rejectReceivedApplication } = useUserStore();
  const { projects, favoriteIds, toggleFavorite, getProjectById, approveApplication, getMyProjects, updateProjectStatus, getRecruitingProjects } = useProjectStore();
  const { createCollaboration, addCollaborator, getCollabById, getMyCollaborations, getCollabByProjectId, updateTask } = useCollabStore();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const favoriteProjects = projects.filter(p => favoriteIds.includes(p.id));

  const handleEditProfile = () => {
    Taro.navigateTo({ url: '/pages/profile-edit/index' });
  };

  const handleGoProject = (projectId: string) => {
    Taro.navigateTo({ url: `/pages/project-detail/index?id=${projectId}` });
  };

  const handleToggleFavorite = (projectId: string) => {
    toggleFavorite(projectId);
  };

  const getStatusStyle = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'pending': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'approved': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'rejected': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
    }
  };

  const getStatusText = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
    }
  };

  const getVoiceStatusStyle = (status: VoiceAppointment['status']) => {
    switch (status) {
      case 'pending': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'confirmed': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'cancelled': return { color: '#94A3B8', bg: '#F1F5F9' };
    }
  };

  const getVoiceStatusText = (status: VoiceAppointment['status']) => {
    switch (status) {
      case 'pending': return '待确认';
      case 'confirmed': return '已确认';
      case 'cancelled': return '已取消';
    }
  };

  const handleApproveApplication = (app: ReceivedApplication) => {
    const project = getProjectById(app.projectId);
    if (!project) return;

    approveReceivedApplication(app.id);
    approveApplication(app.projectId, app.roleId);

    const existingCollab = getCollabByProjectId(app.projectId);
    let collabId = '';

    if (existingCollab) {
      collabId = existingCollab.id;
      addCollaborator(existingCollab.id, {
        userId: app.applicantId,
        name: app.applicantName,
        avatar: app.applicantAvatar,
        role: app.roleName
      });
      const unassignedTask = existingCollab.tasks.find(t => !t.assigneeId);
      if (unassignedTask) {
        updateTask(existingCollab.id, unassignedTask.id, { assigneeId: app.applicantId });
      }
    } else {
      const collabTasks = project.tasks.map((t, i) => ({
        title: t.title,
        description: t.description,
        assigneeId: i === 0 ? app.applicantId : '',
        status: t.status as 'todo' | 'doing' | 'done',
        deadline: t.deadline
      }));
      const collabMilestones = project.milestones.map(m => ({
        title: m.title,
        deadline: m.deadline,
        status: m.status as 'pending' | 'in_progress' | 'completed'
      }));
      const newCollab = createCollaboration({
        projectId: project.id,
        projectTitle: project.title,
        coverImage: project.coverImage,
        founder: { id: 'me', name: profile.name, avatar: profile.avatar },
        members: [
          { id: app.applicantId, name: app.applicantName, avatar: app.applicantAvatar, role: app.roleName }
        ],
        milestones: collabMilestones,
        tasks: collabTasks
      });
      collabId = newCollab.id;
      if (project.status === 'recruiting') {
        updateProjectStatus(project.id, 'in_progress');
      }
    }

    updateApplicationStatus(app.id, 'approved');
    Taro.showToast({ title: '已通过，协作已创建', icon: 'success' });
  };

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: '概览' },
    { key: 'myProjects', label: '我发起的', count: getMyProjects().length },
    { key: 'applications', label: '我的申请', count: applications.length },
    { key: 'received', label: '收到申请', count: receivedApplications.length },
    { key: 'favorites', label: '我的收藏', count: favoriteProjects.length },
    { key: 'voice', label: '语音预约', count: voiceAppointments.length }
  ];

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.profileCard}>
          <View className={styles.avatarWrap}>
            <Image className={styles.avatar} src={profile.avatar} mode="aspectFill" />
          </View>
          <View className={styles.info}>
            <View className={styles.nameRow}>
              <Text className={styles.name}>{profile.name}</Text>
              <Text className={styles.rating}>⭐ {profile.rating}</Text>
            </View>
            <Text className={styles.city}>📍 {profile.city} · {profile.availableTime}</Text>
            <Text className={styles.bio}>{profile.bio || '暂无简介'}</Text>
          </View>
        </View>

        <Button className={styles.editBtn} onClick={handleEditProfile}>
          编辑资料
        </Button>

        <View className={styles.statsRow}>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{profile.completedProjects}</Text>
            <Text className={styles.statLabel}>完成项目</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{profile.works.length}</Text>
            <Text className={styles.statLabel}>作品展示</Text>
          </View>
          <View className={styles.statItem}>
            <Text className={styles.statValue}>{favoriteProjects.length}</Text>
            <Text className={styles.statLabel}>收藏项目</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          display: 'flex',
          backgroundColor: '#FFFFFF',
          marginHorizontal: 32,
          borderRadius: 16,
          padding: 6,
          marginTop: -28,
          marginBottom: 24,
          boxShadow: '0 2rpx 12rpx rgba(0,0,0,0.08)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {tabs.map(tab => (
          <View
            key={tab.key}
            style={{
              flex: 1,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: activeTab === tab.key ? '#4F46E5' : 'transparent',
              color: activeTab === tab.key ? '#FFFFFF' : '#475569',
              fontSize: 26,
              fontWeight: activeTab === tab.key ? 600 : 400,
              transition: 'all 0.2s ease'
            }}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text style={{ color: activeTab === tab.key ? '#FFFFFF' : '#475569' }}>
              {tab.label}{tab.count !== undefined && tab.count > 0 ? `(${tab.count})` : ''}
            </Text>
          </View>
        ))}
      </View>

      {activeTab === 'overview' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              个人技能
              <Text className={styles.more} onClick={handleEditProfile}>编辑</Text>
            </Text>
            <View className={styles.skillsWrap}>
              {profile.skills.length > 0 ? profile.skills.map(skill => (
                <View key={skill.id} className={styles.skillTag}>
                  <Text>{skill.name}</Text>
                </View>
              )) : (
                <Text style={{ color: '#94A3B8', fontSize: 28 }}>暂无技能标签，去编辑添加</Text>
              )}
            </View>
            <View className={styles.metaRow}>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>⏱</Text>
                <Text>{profile.availableTime}</Text>
              </View>
              <View className={styles.metaItem}>
                <Text className={styles.metaIcon}>💰</Text>
                <Text>{profile.incomeTypes.length > 0 ? profile.incomeTypes.map(t => INCOME_TYPE_MAP[t]).join('、') : '未设置'}</Text>
              </View>
            </View>
          </View>

          <View className={styles.card}>
            <Text className={styles.sectionTitle}>
              过往作品
              <Text className={styles.more} onClick={handleEditProfile}>添加</Text>
            </Text>
            {profile.works.length > 0 ? (
              <View className={styles.worksList}>
                {profile.works.map(work => (
                  <View key={work.id} className={styles.workItem}>
                    <Image className={styles.workCover} src={work.imageUrl} mode="aspectFill" />
                    <View className={styles.workInfo}>
                      <Text className={styles.workTitle}>{work.title}</Text>
                      <Text className={styles.workDesc}>{work.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 40 }}>
                暂无作品，去编辑添加
              </Text>
            )}
          </View>
        </View>
      )}

      {activeTab === 'myProjects' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>我发起的项目</Text>
            {getMyProjects().length > 0 ? (
              getMyProjects().map(project => {
                const remainingSlots = project.roles.reduce((sum, r) => sum + (r.slots - r.filled), 0);
                const statusMap: Record<string, { label: string; color: string; bg: string }> = {
                  recruiting: { label: '招募中', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
                  in_progress: { label: '执行中', color: '#4F46E5', bg: 'rgba(79, 70, 229, 0.1)' },
                  completed: { label: '已完成', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' }
                };
                const s = statusMap[project.status] || statusMap.recruiting;
                return (
                  <View
                    key={project.id}
                    style={{
                      padding: '24rpx 0',
                      borderBottom: '1rpx solid #F1F5F9'
                    }}
                    onClick={() => handleGoProject(project.id)}
                  >
                    <View style={{ display: 'flex', marginBottom: 12 }}>
                      <Image
                        src={project.coverImage}
                        mode="aspectFill"
                        style={{ width: 140, height: 100, borderRadius: 12, marginRight: 20 }}
                      />
                      <View style={{ flex: 1, minWidth: 0, justifyContent: 'space-between' }}>
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: 600,
                            color: '#0F172A',
                            marginBottom: 8,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {project.title}
                        </Text>
                        <View style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          <View style={{ padding: '4rpx 12rpx', borderRadius: 6, fontSize: 22, color: s.color, backgroundColor: s.bg }}>
                            <Text>{s.label}</Text>
                          </View>
                          {project.status === 'recruiting' && (
                            <Text style={{ fontSize: 24, color: '#F59E0B' }}>还差 {remainingSlots} 人</Text>
                          )}
                          {project.status === 'in_progress' && (
                            <Text style={{ fontSize: 24, color: '#4F46E5' }}>{project.roles.length} 位成员</Text>
                          )}
                        </View>
                      </View>
                    </View>
                    <View style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                      {project.roles.map(role => (
                        <View key={role.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Text style={{ fontSize: 24, color: '#475569' }}>{role.name}</Text>
                          <Text style={{ fontSize: 22, color: role.filled < role.slots ? '#F59E0B' : '#10B981' }}>
                            {role.filled}/{role.slots}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontSize: 24, color: '#94A3B8' }}>
                        {project.status === 'recruiting' && project.recruitEndDate
                          ? `招募截止：${project.recruitEndDate}`
                          : `创建于 ${project.createdAt}`}
                      </Text>
                      {project.status === 'recruiting' && (
                        <Button
                          size="mini"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProjectStatus(project.id, 'in_progress');
                            Taro.showToast({ title: '已开始执行', icon: 'success' });
                          }}
                          style={{
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: '#4F46E5',
                            color: '#FFFFFF',
                            fontSize: 24,
                            padding: '0 24rpx',
                            lineHeight: '52rpx'
                          }}
                        >
                          开始执行
                        </Button>
                      )}
                      {project.status === 'in_progress' && (
                        <Button
                          size="mini"
                          onClick={(e) => {
                            e.stopPropagation();
                            const collab = getCollabByProjectId(project.id);
                            if (collab) {
                              Taro.navigateTo({ url: `/pages/collaborate-detail/index?id=${collab.id}` });
                            } else {
                              Taro.showToast({ title: '暂无协作数据', icon: 'none' });
                            }
                          }}
                          style={{
                            height: 52,
                            borderRadius: 26,
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5',
                            fontSize: 24,
                            padding: '0 24rpx',
                            lineHeight: '52rpx'
                          }}
                        >
                          查看协作
                        </Button>
                      )}
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 60 }}>
                还没发起过项目，去发布你的第一个项目吧
              </Text>
            )}
          </View>
        </View>
      )}

      {activeTab === 'applications' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>我的申请记录</Text>
            {applications.length > 0 ? (
              applications.map(app => {
                const collab = getCollabByProjectId(app.projectId);
                return (
                  <View
                    key={app.id}
                    style={{
                      padding: '24rpx 0',
                      borderBottom: '1rpx solid #F1F5F9'
                    }}
                  >
                    <View
                      style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}
                      onClick={() => handleGoProject(app.projectId)}
                    >
                      <Image
                        src={app.projectCover}
                        mode="aspectFill"
                        style={{ width: 100, height: 100, borderRadius: 12, marginRight: 24 }}
                      />
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: 500,
                            color: '#0F172A',
                            marginBottom: 8,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {app.projectTitle}
                        </Text>
                        <Text style={{ fontSize: 24, color: '#94A3B8', marginBottom: 8 }}>
                          申请角色：{app.roleName} · {app.createdAt}
                        </Text>
                        <View
                          style={{
                            display: 'inline-flex',
                            padding: '6rpx 16rpx',
                            borderRadius: 8,
                            fontSize: 22,
                            color: getStatusStyle(app.status).color,
                            backgroundColor: getStatusStyle(app.status).bg
                          }}
                        >
                          <Text>{getStatusText(app.status)}</Text>
                        </View>
                      </View>
                    </View>
                    {app.status === 'approved' && collab && (
                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '16rpx 20rpx',
                          backgroundColor: '#ECFDF5',
                          borderRadius: 12,
                          marginTop: 8
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          Taro.navigateTo({ url: `/pages/collaborate-detail/index?id=${collab.id}` });
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 24, color: '#10B981', fontWeight: 500, display: 'block', marginBottom: 4 }}>
                            ✓ 已加入协作
                          </Text>
                          <Text style={{ fontSize: 22, color: '#6EE7B7' }}>
                            负责角色：{app.roleName}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 24, color: '#10B981' }}>进入协作 →</Text>
                      </View>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 60 }}>
                暂无申请记录，去广场申请感兴趣的项目吧
              </Text>
            )}
          </View>
        </View>
      )}

      {activeTab === 'received' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>收到的申请</Text>
            {receivedApplications.length > 0 ? (
              receivedApplications.map(app => (
                <View
                  key={app.id}
                  style={{
                    padding: '24rpx 0',
                    borderBottom: '1rpx solid #F1F5F9'
                  }}
                >
                  <View style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <Image
                      src={app.applicantAvatar}
                      mode="aspectFill"
                      style={{ width: 80, height: 80, borderRadius: 40, marginRight: 20 }}
                    />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 30, fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>
                        {app.applicantName}
                      </Text>
                      <Text style={{ fontSize: 24, color: '#94A3B8', marginBottom: 4 }}>
                        申请角色：{app.roleName}
                      </Text>
                      <Text style={{ fontSize: 22, color: '#CBD5E1' }}>{app.createdAt}</Text>
                    </View>
                    <View
                      style={{
                        padding: '6rpx 16rpx',
                        borderRadius: 8,
                        fontSize: 22,
                        color: getStatusStyle(app.status).color,
                        backgroundColor: getStatusStyle(app.status).bg
                      }}
                    >
                      <Text>{getStatusText(app.status)}</Text>
                    </View>
                  </View>
                  {app.message && (
                    <View style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 12 }}>
                      <Text style={{ fontSize: 26, color: '#475569' }}>{app.message}</Text>
                    </View>
                  )}
                  {app.status === 'pending' && (
                    <View style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                      <Button
                        onClick={() => {
                          rejectReceivedApplication(app.id);
                          Taro.showToast({ title: '已拒绝', icon: 'none' });
                        }}
                        style={{
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: '#FEF2F2',
                          color: '#EF4444',
                          fontSize: 26,
                          fontWeight: 500,
                          padding: '0 32rpx'
                        }}
                      >
                        拒绝
                      </Button>
                      <Button
                        onClick={() => handleApproveApplication(app)}
                        style={{
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: '#4F46E5',
                          color: '#FFFFFF',
                          fontSize: 26,
                          fontWeight: 500,
                          padding: '0 32rpx'
                        }}
                      >
                        通过
                      </Button>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 60 }}>
                暂无收到申请
              </Text>
            )}
          </View>
        </View>
      )}

      {activeTab === 'favorites' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>收藏的项目</Text>
            {favoriteProjects.length > 0 ? (
              favoriteProjects.map(p => (
                <View
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '24rpx 0',
                    borderBottom: '1rpx solid #F1F5F9'
                  }}
                  onClick={() => handleGoProject(p.id)}
                >
                  <Image
                    src={p.coverImage}
                    mode="aspectFill"
                    style={{ width: 100, height: 100, borderRadius: 12, marginRight: 24 }}
                  />
                  <View style={{ flex: 1, minWidth: 0, marginRight: 16 }}>
                    <Text
                      style={{
                        fontSize: 30,
                        fontWeight: 500,
                        color: '#0F172A',
                        marginBottom: 8,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {p.title}
                    </Text>
                    <Text style={{ fontSize: 24, color: '#94A3B8' }}>
                      {p.city} · {p.period}
                    </Text>
                  </View>
                  <Text
                    style={{ fontSize: 36, color: '#F59E0B' }}
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(p.id); }}
                  >
                    ★
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 60 }}>
                暂无收藏的项目
              </Text>
            )}
          </View>
        </View>
      )}

      {activeTab === 'voice' && (
        <View style={{ padding: '0 32rpx 32rpx' }}>
          <View className={styles.card}>
            <Text className={styles.sectionTitle}>语音预约</Text>
            {voiceAppointments.length > 0 ? (
              voiceAppointments.map(appt => (
                <View
                  key={appt.id}
                  style={{
                    padding: '24rpx 0',
                    borderBottom: '1rpx solid #F1F5F9'
                  }}
                >
                  <View style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    <Image
                      src={appt.targetUserAvatar}
                      mode="aspectFill"
                      style={{ width: 72, height: 72, borderRadius: 36, marginRight: 16 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 30, fontWeight: 500, color: '#0F172A', marginBottom: 4 }}>
                        {appt.targetUserName}
                      </Text>
                      <Text style={{ fontSize: 24, color: '#94A3B8' }}>{appt.projectTitle}</Text>
                    </View>
                    <View
                      style={{
                        padding: '6rpx 16rpx',
                        borderRadius: 8,
                        fontSize: 22,
                        color: getVoiceStatusStyle(appt.status).color,
                        backgroundColor: getVoiceStatusStyle(appt.status).bg
                      }}
                    >
                      <Text>{getVoiceStatusText(appt.status)}</Text>
                    </View>
                  </View>
                  <View style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#475569' }}>
                    <Text>📅 {appt.date}</Text>
                    <Text style={{ marginLeft: 24 }}>⏰ {appt.time}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 60 }}>
                暂无语音预约，可在项目详情页预约发起人沟通
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfilePage;
