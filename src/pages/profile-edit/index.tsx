import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useUserStore } from '@/store/userStore';
import {
  IncomeType, INCOME_TYPE_MAP, Work,
  AVAILABLE_TIME_OPTIONS, SKILL_OPTIONS, CITY_OPTIONS
} from '@/types/user';

const ProfileEditPage: React.FC = () => {
  const { profile, updateProfile, updateSkills, addWork, removeWork } = useUserStore();

  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio);
  const [availableTime, setAvailableTime] = useState(profile.availableTime);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    profile.skills.map(s => s.name)
  );
  const [selectedIncomeTypes, setSelectedIncomeTypes] = useState<IncomeType[]>(
    profile.incomeTypes
  );
  const [works, setWorks] = useState<Work[]>([...profile.works]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleIncomeType = (type: IncomeType) => {
    setSelectedIncomeTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleAddWork = () => {
    const sampleImageIds = [119, 201, 225, 582, 598];
    const randomId = sampleImageIds[Math.floor(Math.random() * sampleImageIds.length)];
    const newWork: Work = {
      id: `w_${Date.now()}`,
      title: `作品 ${works.length + 1}`,
      description: '点击作品可以编辑描述',
      imageUrl: `https://picsum.photos/id/${randomId}/400/300`
    };
    setWorks(prev => [...prev, newWork]);
  };

  const handleRemoveWork = (workId: string, e: any) => {
    e.stopPropagation();
    setWorks(prev => prev.filter(w => w.id !== workId));
  };

  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    if (selectedSkills.length === 0) {
      Taro.showToast({ title: '请选择至少一项技能', icon: 'none' });
      return;
    }

    updateProfile({
      name: name.trim(),
      city,
      bio: bio.trim(),
      availableTime,
      incomeTypes: selectedIncomeTypes,
      works
    });
    updateSkills(selectedSkills);

    console.log('[ProfileEdit] Save profile success');
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 800);
  };

  const incomeTypes: IncomeType[] = ['revenue_share', 'fixed_salary', 'equity', 'project_bonus'];

  return (
    <View className={styles.page}>
      <View className={styles.form}>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👤</Text>基本信息
          </Text>

          <View className={styles.formItem}>
            <Text className={classnames(styles.label, styles.required)}>昵称</Text>
            <Input
              className={styles.input}
              placeholder="请输入你的昵称"
              value={name}
              onInput={e => setName(e.detail.value)}
            />
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>所在城市</Text>
            <View className={styles.chipWrap}>
              {CITY_OPTIONS.map(c => (
                <View
                  key={c}
                  className={classnames(styles.chip, city === c && styles.chipActive)}
                  onClick={() => setCity(c)}
                >
                  <Text>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.formItem}>
            <Text className={styles.label}>个人简介</Text>
            <Textarea
              className={styles.textarea}
              placeholder="简单介绍一下自己吧"
              value={bio}
              onInput={e => setBio(e.detail.value)}
            />
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💪</Text>技能标签
          </Text>
          <View className={styles.chipWrap}>
            {SKILL_OPTIONS.map(skill => (
              <View
                key={skill}
                className={classnames(styles.chip, selectedSkills.includes(skill) && styles.chipActive)}
                onClick={() => toggleSkill(skill)}
              >
                <Text>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>⏱</Text>可投入时间
          </Text>
          <View className={styles.chipWrap}>
            {AVAILABLE_TIME_OPTIONS.map(time => (
              <View
                key={time}
                className={classnames(styles.chip, availableTime === time && styles.chipActive)}
                onClick={() => setAvailableTime(time)}
              >
                <Text>{time}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>💰</Text>期望收益方式
          </Text>
          <View className={styles.chipWrap}>
            {incomeTypes.map(type => (
              <View
                key={type}
                className={classnames(styles.chip, selectedIncomeTypes.includes(type) && styles.chipActive)}
                onClick={() => toggleIncomeType(type)}
              >
                <Text>{INCOME_TYPE_MAP[type]}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <Text className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              <Text className={styles.sectionIcon}>🎨</Text>过往作品 ({works.length})
            </Text>
            <Text
              style={{ fontSize: 28, color: '#4F46E5', fontWeight: 500 }}
              onClick={handleAddWork}
            >
              + 添加作品
            </Text>
          </View>

          {works.length > 0 ? (
            <View style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
              {works.map(work => (
                <View
                  key={work.id}
                  style={{
                    width: 'calc(50% - 12rpx)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    backgroundColor: '#F1F5F9',
                    position: 'relative'
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      zIndex: 10,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 24
                    }}
                    onClick={(e) => handleRemoveWork(work.id, e)}
                  >
                    ✕
                  </View>
                  <Image
                    src={work.imageUrl}
                    mode="aspectFill"
                    style={{ width: '100%', height: 200 }}
                  />
                  <View style={{ padding: 16 }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: 500,
                        color: '#0F172A',
                        marginBottom: 4,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {work.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 22,
                        color: '#94A3B8',
                        display: '-webkit-box',
                        overflow: 'hidden',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1
                      }}
                    >
                      {work.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: '#94A3B8', fontSize: 28, textAlign: 'center', padding: 40 }}>
              还没有作品，点击右上角添加
            </Text>
          )}
        </View>
      </View>

      <View className={styles.footer}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          保存资料
        </Button>
      </View>
    </View>
  );
};

export default ProfileEditPage;
