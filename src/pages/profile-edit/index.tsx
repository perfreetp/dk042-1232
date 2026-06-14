import React, { useState } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { mockCurrentUser } from '@/data/users';
import {
  IncomeType, INCOME_TYPE_MAP,
  AVAILABLE_TIME_OPTIONS, SKILL_OPTIONS, CITY_OPTIONS
} from '@/types/user';

const ProfileEditPage: React.FC = () => {
  const user = mockCurrentUser;

  const [name, setName] = useState(user.name);
  const [city, setCity] = useState(user.city);
  const [bio, setBio] = useState(user.bio);
  const [availableTime, setAvailableTime] = useState(user.availableTime);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user.skills.map(s => s.name)
  );
  const [selectedIncomeTypes, setSelectedIncomeTypes] = useState<IncomeType[]>(
    user.incomeTypes
  );

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

  const handleSave = () => {
    if (!name.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    if (selectedSkills.length === 0) {
      Taro.showToast({ title: '请选择至少一项技能', icon: 'none' });
      return;
    }
    console.log('[ProfileEdit] Save profile:', {
      name, city, bio, availableTime, selectedSkills, selectedIncomeTypes
    });
    Taro.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      Taro.navigateBack();
    }, 1000);
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
