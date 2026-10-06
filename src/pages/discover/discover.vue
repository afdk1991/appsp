<template>
  <view class="page">
    <view class="tabs">
      <text
        v-for="(t, i) in tabs"
        :key="t"
        class="tab"
        :class="{ active: i === activeTab }"
        @tap="activeTab = i"
      >{{ t }}</text>
    </view>

    <view v-if="loading" class="loading">加载中…</view>
    <view v-else>
      <view v-for="p in posts" :key="p.id" class="post">
        <view class="head">
          <view class="avatar" :style="{ background: p.avatarColor }">{{ p.author.slice(0, 1) }}</view>
          <view class="meta">
            <text class="name">{{ p.author }}</text>
            <text class="time">{{ p.time }}</text>
          </view>
        </view>
        <text class="content">{{ p.content }}</text>
        <view class="cover" :style="{ background: p.imageColor }"></view>
        <view class="actions">
          <text class="act" :class="{ liked: isLiked(p.id) }" @tap="like(p)">👍 {{ displayLikes(p) }}</text>
          <text class="act" @tap="openComment(p)">💬 {{ displayComments(p) }}</text>
          <text class="act" @tap="share">↗ 分享</text>
        </view>
        <view v-if="commentsOf(p.id).length" class="comment-list">
          <view v-for="(c, i) in commentsOf(p.id)" :key="i" class="cmt">
            <text class="cmt-user">我：</text>
            <text class="cmt-text">{{ c }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 评论输入框 -->
    <view v-if="commentTarget" class="comment-bar">
      <input v-model="commentText" class="c-input" placeholder="友善评论…" focus confirm-type="send" @confirm="sendComment" />
      <view class="c-send" @tap="sendComment">发送</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchPosts } from '../../api';
import type { Post } from '../../api/types';
import { communityStore } from '../../store/community';

const tabs = ['推荐', '关注', '附近'];
const activeTab = ref(0);
const posts = ref<Post[]>([]);
const loading = ref(true);
const commentTarget = ref<Post | null>(null);
const commentText = ref('');

async function load() {
  loading.value = true;
  try {
    const res = await fetchPosts();
    posts.value = res.data;
  } finally {
    loading.value = false;
  }
}

function isLiked(id: string) { return communityStore.isLiked(id); }
function displayLikes(p: Post) { return p.likes + (isLiked(p.id) ? 1 : 0); }
function displayComments(p: Post) { return p.comments + commentsOf(p.id).length; }
function commentsOf(id: string) { return communityStore.commentsOf(id); }

function like(p: Post) {
  communityStore.toggleLike(p.id);
}
function openComment(p: Post) {
  commentTarget.value = p;
  commentText.value = '';
}
function sendComment() {
  if (!commentTarget.value) return;
  communityStore.addComment(commentTarget.value.id, commentText.value);
  commentTarget.value = null;
  commentText.value = '';
}
function share() {
  uni.showToast({ title: '链接已复制（演示）', icon: 'none' });
}

onMounted(load);
</script>

<style scoped>
.page { padding: 16rpx 24rpx 40rpx; }
.tabs { display: flex; gap: 32rpx; padding: 12rpx 0 24rpx; }
.tab { font-size: 30rpx; color: #666; padding-bottom: 8rpx; }
.tab.active { color: #222; font-weight: 700; border-bottom: 4rpx solid #FF5A1F; }
.loading { text-align: center; color: #999; padding: 120rpx 0; }
.post { background: #fff; border-radius: 20rpx; padding: 24rpx; margin-bottom: 20rpx; }
.head { display: flex; align-items: center; gap: 16rpx; margin-bottom: 16rpx; }
.avatar { width: 72rpx; height: 72rpx; border-radius: 50%; color: #fff; font-size: 30rpx; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.meta { display: flex; flex-direction: column; }
.name { font-size: 28rpx; color: #222; font-weight: 600; }
.time { font-size: 22rpx; color: #999; margin-top: 4rpx; }
.content { font-size: 28rpx; color: #333; line-height: 1.6; display: block; }
.cover { height: 300rpx; border-radius: 16rpx; margin: 16rpx 0; }
.actions { display: flex; gap: 40rpx; }
.act { font-size: 26rpx; color: #888; }
.act.liked { color: #FF5A1F; }
.comment-list { margin-top: 16rpx; padding-top: 16rpx; border-top: 1rpx solid #f5f5f5; }
.cmt { font-size: 24rpx; line-height: 1.6; padding: 6rpx 0; }
.cmt-user { color: #FF5A1F; }
.cmt-text { color: #555; }
.comment-bar { position: fixed; left: 0; right: 0; bottom: 0; display: flex; gap: 16rpx; padding: 16rpx 24rpx; background: #fff; border-top: 1rpx solid #eee; }
.c-input { flex: 1; height: 72rpx; background: #f2f3f5; border-radius: 36rpx; padding: 0 24rpx; font-size: 26rpx; }
.c-send { background: #FF5A1F; color: #fff; padding: 0 28rpx; height: 72rpx; line-height: 72rpx; border-radius: 36rpx; font-size: 26rpx; }
</style>
