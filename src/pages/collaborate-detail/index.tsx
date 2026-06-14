import React, { useState, useMemo } from 'react';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import TaskItem from '@/components/TaskItem';
import { useCollabStore } from '@/store/collabStore';
import { useUserStore } from '@/store/userStore';
import { TaskItem as TaskItemType } from '@/types/collaborate';

type TabKey = 'team' | 'tasks' | 'files' | 'meetings' | 'reviews';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'team', label: '团队' },
  { key: 'tasks', label: '任务' },
  { key: 'files', label: '文件' },
  { key: 'meetings', label: '会议' },
  { key: 'reviews', label: '复盘' }
];

const STATUS_FLOW: TaskItemType['status'][] = ['todo', 'doing', 'done'];

const CollaborateDetailPage: React.FC = () => {
  const router = useRouter();
  const collabId = router.params.id || 'c1';

  const { getCollabById, updateTaskStatus, addFile, addMeeting } = useCollabStore();
  const { profile } = useUserStore();

  const collaboration = useMemo(() => getCollabById(collabId), [collabId, getCollabById]);

  const [activeTab, setActiveTab] = useState<TabKey>('team');
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingContent, setNewMeetingContent] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingAttendees, setNewMeetingAttendees] = useState('');

  const handleTaskStatusChange = (taskId: string) => {
    if (!collaboration) return;
    const task = collaboration.tasks.find(t => t.id === taskId);
    if (!task) return;
    const nextIndex = (STATUS_FLOW.indexOf(task.status) + 1) % STATUS_FLOW.length;
    updateTaskStatus(collabId, taskId, STATUS_FLOW[nextIndex]);
    Taro.showToast({ title: '状态已更新', icon: 'none' });
  };

  const handleFileClick = (name: string, url: string) => {
    if (url) {
      Taro.setClipboardData({
        data: url,
        success: () => Taro.showToast({ title: `链接已复制：${name}`, icon: 'none' })
      });
    } else {
      Taro.showToast({ title: `打开 ${name}`, icon: 'none' });
    }
  };

  const handleAddFile = () => {
    setNewFileName('');
    setNewFileUrl('');
    setShowAddFileModal(true);
  };

  const confirmAddFile = () => {
    if (!newFileName.trim()) {
      Taro.showToast({ title: '请输入文件名', icon: 'none' });
      return;
    }
    if (!newFileUrl.trim()) {
      Taro.showToast({ title: '请输入文件链接', icon: 'none' });
      return;
    }
    addFile(collabId, {
      name: newFileName.trim(),
      url: newFileUrl.trim(),
      uploadedBy: profile.nickname
    });
    setShowAddFileModal(false);
    Taro.showToast({ title: '文件已添加', icon: 'success' });
  };

  const handleAddMeeting = () => {
    const today = new Date().toISOString().split('T')[0];
    setNewMeetingTitle('');
    setNewMeetingContent('');
    setNewMeetingDate(today);
    setNewMeetingAttendees('');
    setShowAddMeetingModal(true);
  };

  const confirmAddMeeting = () => {
    if (!newMeetingTitle.trim()) {
      Taro.showToast({ title: '请输入会议主题', icon: 'none' });
      return;
    }
    if (!newMeetingContent.trim()) {
      Taro.showToast({ title: '请输入会议内容', icon: 'none' });
      return;
    }
    if (!newMeetingDate.trim()) {
      Taro.showToast({ title: '请输入会议日期', icon: 'none' });
      return;
    }
    const attendeeList = newMeetingAttendees
      .split(/[,，、\s]+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (attendeeList.length === 0) {
      attendeeList.push(profile.nickname);
    }
    addMeeting(collabId, {
      title: newMeetingTitle.trim(),
      content: newMeetingContent.trim(),
      date: newMeetingDate.trim(),
      attendees: attendeeList
    });
    setShowAddMeetingModal(false);
    Taro.showToast({ title: '会议纪要已添加', icon: 'success' });
  };

  if (!collaboration) {
    return (
      <View className={styles.page}>
        <View style={{ padding: 100, textAlign: 'center' }}>
          <Text style={{ color: '#94A3B8', fontSize: 28 }}>协作不存在或已结束</Text>
        </View>
      </View>
    );
  }

  const doneTasks = collaboration.tasks.filter(t => t.status === 'done').length;

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
            <View className={styles.sectionHeaderRow}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📋</Text>任务清单 ({doneTasks}/{collaboration.tasks.length})
              </Text>
            </View>
            {collaboration.tasks.length > 0 ? (
              <View className={styles.taskList}>
                {collaboration.tasks.map(task => (
                  <TaskItem key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
                ))}
              </View>
            ) : (
              <Text style={{ color: '#94A3B8', fontSize: '28rpx' }}>暂无任务</Text>
            )}
          </View>
        </View>

        {/* 文件 */}
        <View className={classnames(styles.tabContent, activeTab === 'files' && styles.tabContentActive)}>
          <View className={styles.card}>
            <View className={styles.sectionHeaderRow}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📁</Text>共享文件
              </Text>
              <View className={styles.addBtn} onClick={handleAddFile}>
                <Text className={styles.addBtnText}>+ 添加</Text>
              </View>
            </View>
            {collaboration.files.length > 0 ? (
              collaboration.files.map(file => (
                <View key={file.id} className={styles.fileItem} onClick={() => handleFileClick(file.name, file.url)}>
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
              <Text style={{ color: '#94A3B8', fontSize: '28rpx' }}>暂无共享文件，点击右上角添加</Text>
            )}
          </View>
        </View>

        {/* 会议 */}
        <View className={classnames(styles.tabContent, activeTab === 'meetings' && styles.tabContentActive)}>
          <View className={styles.card}>
            <View className={styles.sectionHeaderRow}>
              <Text className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>📝</Text>会议纪要
              </Text>
              <View className={styles.addBtn} onClick={handleAddMeeting}>
                <Text className={styles.addBtnText}>+ 添加</Text>
              </View>
            </View>
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
              <Text style={{ color: '#94A3B8', fontSize: '28rpx' }}>暂无会议纪要，点击右上角添加</Text>
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

      {/* 添加文件弹窗 */}
      {showAddFileModal && (
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
          onClick={() => setShowAddFileModal(false)}
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
              添加文件链接
            </Text>
            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>文件名：</Text>
            <Input
              type="text"
              value={newFileName}
              placeholder="例如：产品需求文档V1.0"
              onInput={e => setNewFileName(e.detail.value)}
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
            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>文件链接：</Text>
            <Input
              type="text"
              value={newFileUrl}
              placeholder="例如：https://docs.qq.com/doc/xxx"
              onInput={e => setNewFileUrl(e.detail.value)}
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
                onClick={() => setShowAddFileModal(false)}
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
                onClick={confirmAddFile}
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
                确认添加
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 添加会议纪要弹窗 */}
      {showAddMeetingModal && (
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
          onClick={() => setShowAddMeetingModal(false)}
        >
          <View
            style={{
              width: '100%',
              maxWidth: 686,
              maxHeight: '85vh',
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 32,
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Text style={{ fontSize: 34, fontWeight: 600, color: '#0F172A', marginBottom: 24 }}>
              添加会议纪要
            </Text>

            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>会议主题：</Text>
            <Input
              type="text"
              value={newMeetingTitle}
              placeholder="例如：项目启动会"
              onInput={e => setNewMeetingTitle(e.detail.value)}
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

            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>会议日期：</Text>
            <Input
              type="text"
              value={newMeetingDate}
              placeholder="例如：2026-06-16"
              onInput={e => setNewMeetingDate(e.detail.value)}
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

            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>参与人（用逗号分隔）：</Text>
            <Input
              type="text"
              value={newMeetingAttendees}
              placeholder="例如：张三、李四、王五"
              onInput={e => setNewMeetingAttendees(e.detail.value)}
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

            <Text style={{ fontSize: 28, color: '#475569', marginBottom: 12 }}>会议内容：</Text>
            <Textarea
              value={newMeetingContent}
              placeholder="记录讨论内容、决策事项、待办等"
              onInput={e => setNewMeetingContent(e.detail.value)}
              style={{
                width: '100%',
                height: 200,
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
                onClick={() => setShowAddMeetingModal(false)}
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
                onClick={confirmAddMeeting}
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
                确认添加
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CollaborateDetailPage;
