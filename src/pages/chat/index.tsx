import React, { useState } from 'react';
import { View, Text, Image, Input, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { getUserById } from '@/data/users';

interface Message {
  id: string;
  content: string;
  isMine: boolean;
  time: string;
}

const ChatPage: React.FC = () => {
  const router = useRouter();
  const userId = router.params.userId || 'u1';
  const otherUser = getUserById(userId) || getUserById('u1')!;
  const me = getUserById('me')!;

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: '你好，我看了你的项目，很感兴趣！', isMine: false, time: '10:30' },
    { id: '2', content: '你好！感谢关注，请问你想了解哪方面的信息？', isMine: true, time: '10:32' },
    { id: '3', content: '我做前端开发5年了，有小程序开发经验，想申请前端开发的角色', isMine: false, time: '10:33' },
    { id: '4', content: '太好了！可以简单介绍下你的项目经历吗？', isMine: true, time: '10:35' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleVoice = () => {
    Taro.showToast({ title: '语音预约功能开发中', icon: 'none' });
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      content: text,
      isMine: true,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    console.log('[Chat] Send message:', text);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Image className={styles.avatar} src={otherUser.avatar} mode="aspectFill" />
        <View className={styles.userInfo}>
          <Text className={styles.userName}>{otherUser.name}</Text>
          <Text className={styles.userStatus}>{otherUser.city} · 在线</Text>
        </View>
        <Button className={styles.actionBtn} onClick={handleVoice}>
          📞 预约语音
        </Button>
      </View>

      <ScrollView className={styles.messages} scrollY scrollIntoView={`msg_${messages.length - 1}`}>
        <View className={styles.timeRow}>
          <Text className={styles.timeText}>今天 10:30</Text>
        </View>
        {messages.map((msg, i) => (
          <View
            key={msg.id}
            id={`msg_${i}`}
            className={classnames(styles.messageRow, msg.isMine && styles.mine)}
          >
            {!msg.isMine && (
              <Image className={classnames(styles.msgAvatar, styles.otherAvatar)} src={otherUser.avatar} mode="aspectFill" />
            )}
            <View className={classnames(
              styles.bubble,
              msg.isMine ? styles.mineBubble : styles.otherBubble
            )}>
              <Text>{msg.content}</Text>
            </View>
            {msg.isMine && (
              <Image className={classnames(styles.msgAvatar, styles.mineAvatar)} src={me.avatar} mode="aspectFill" />
            )}
          </View>
        ))}
      </ScrollView>

      <View className={styles.inputBar}>
        <Input
          className={styles.input}
          placeholder="输入消息..."
          value={inputText}
          onInput={e => setInputText(e.detail.value)}
          confirmType="send"
          onConfirm={handleSend}
        />
        <Button className={styles.sendBtn} onClick={handleSend}>
          发送
        </Button>
      </View>
    </View>
  );
};

export default ChatPage;
