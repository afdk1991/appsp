<template>
  <view class="page">
    <view class="circle" :style="circleStyle">
      <view class="bubble" :style="bubbleStyle"></view>
      <view class="cross h"></view>
      <view class="cross v"></view>
    </view>
    <view class="readings">
      <text class="r">X: {{ x.toFixed(2) }}</text>
      <text class="r">Y: {{ y.toFixed(2) }}</text>
    </view>
    <view class="status" :class="{ ok: balanced }">{{ balanced ? '✓ 水平' : '调整手机…' }}</view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onUnload } from '@dcloudio/uni-app';

const x = ref(0);
const y = ref(0);

const balanced = computed(() => Math.abs(x.value) < 0.05 && Math.abs(y.value) < 0.05);

// 限制气泡偏移
const bubbleStyle = computed(() => {
  const dx = Math.max(-60, Math.min(60, x.value * 120));
  const dy = Math.max(-60, Math.min(60, -y.value * 120));
  return { transform: `translate(${dx}rpx, ${dy}rpx)` };
});
const circleStyle = computed(() => ({
  borderColor: balanced.value ? '#4CAF50' : '#FF5A1F',
}));

uni.onAccelerometerChange((res) => {
  x.value = res.x;
  y.value = res.y;
});
uni.startAccelerometer({ interval: 'normal' });

onUnload(() => {
  uni.stopAccelerometer();
});
</script>

<style scoped>
.page { padding: 60rpx 48rpx; display: flex; flex-direction: column; align-items: center; }
.circle { position: relative; width: 500rpx; height: 500rpx; border-radius: 50%; border: 8rpx solid #FF5A1F; background: #fff; overflow: hidden; }
.bubble { position: absolute; left: 50%; top: 50%; width: 120rpx; height: 120rpx; margin-left: -60rpx; margin-top: -60rpx; border-radius: 50%; background: rgba(255,90,31,.5); }
.cross { position: absolute; background: #eee; }
.cross.h { left: 0; right: 0; top: 50%; height: 2rpx; }
.cross.v { top: 0; bottom: 0; left: 50%; width: 2rpx; }
.readings { display: flex; gap: 48rpx; margin-top: 48rpx; }
.r { font-size: 28rpx; color: #666; font-family: monospace; }
.status { margin-top: 32rpx; padding: 12rpx 48rpx; border-radius: 32rpx; background: #f2f3f5; font-size: 28rpx; color: #FF5A1F; }
.status.ok { background: #E8F5E9; color: #4CAF50; }
</style>
