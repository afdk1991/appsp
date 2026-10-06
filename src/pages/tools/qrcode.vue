<template>
  <view class="page">
    <view class="card">
      <input v-model="text" class="input" placeholder="输入要生成二维码的文本 / 链接" />
      <view class="gen" @tap="gen">生成二维码</view>
    </view>

    <view v-if="qrUrl" class="qr-wrap">
      <image :src="qrUrl" class="qr" mode="aspectFit" show-menu-by-longpress />
      <text class="tip">长按图片可保存 / 分享</text>
    </view>
    <view v-else class="empty">
      <text class="empty-icon">🔳</text>
      <text class="empty-text">输入内容后点击生成</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const text = ref('https://example.com');
const qrUrl = ref('');

function gen() {
  if (!text.value.trim()) {
    uni.showToast({ title: '请输入内容', icon: 'none' });
    return;
  }
  qrUrl.value = 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(text.value);
}
</script>

<style scoped>
.page { padding: 24rpx; }
.card { background: #fff; border-radius: 16rpx; padding: 24rpx; margin-bottom: 32rpx; }
.input { height: 80rpx; background: #f5f5f5; border-radius: 40rpx; padding: 0 28rpx; font-size: 26rpx; }
.gen { margin-top: 20rpx; height: 80rpx; line-height: 80rpx; text-align: center; background: #FF5A1F; color: #fff; border-radius: 40rpx; font-size: 28rpx; }
.qr-wrap { text-align: center; }
.qr { width: 400rpx; height: 400rpx; }
.tip { display: block; color: #999; font-size: 22rpx; margin-top: 16rpx; }
.empty { text-align: center; padding: 120rpx 0; color: #999; }
.empty-icon { font-size: 80rpx; display: block; }
.empty-text { font-size: 26rpx; display: block; margin-top: 16rpx; }
</style>
