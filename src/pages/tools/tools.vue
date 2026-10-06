<template>
  <view class="page">
    <view class="banner">
      <text class="banner-title">本地工具箱</text>
      <text class="banner-sub">无需联网即可使用的小工具</text>
    </view>

    <view v-if="loading" class="loading">加载中…</view>
    <view v-else class="grid">
      <view v-for="t in tools" :key="t.key" class="cell" @tap="onTool(t)">
        <view class="icon" :style="{ background: t.iconColor }">{{ t.name.slice(0, 1) }}</view>
        <text class="name">{{ t.name }}</text>
        <text class="desc">{{ t.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchTools } from '../../api';
import type { ToolItem } from '../../api/types';

const tools = ref<ToolItem[]>([]);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const res = await fetchTools();
    tools.value = res.data;
  } finally {
    loading.value = false;
  }
}

function onTool(t: ToolItem) {
  switch (t.key) {
    case 'todo': uni.navigateTo({ url: '/pages/tools/todo' }); break;
    case 'calc': uni.navigateTo({ url: '/pages/tools/calc' }); break;
    case 'note': uni.navigateTo({ url: '/pages/tools/note' }); break;
    case 'currency': uni.navigateTo({ url: '/pages/tools/currency' }); break;
    case 'qrcode': uni.navigateTo({ url: '/pages/tools/qrcode' }); break;
    case 'level': uni.navigateTo({ url: '/pages/tools/level' }); break;
    case 'scan':
      uni.scanCode({
        success: (res) => {
          uni.showModal({ title: '扫码结果', content: res.result || '空', showCancel: false });
        },
        fail: () => uni.showToast({ title: '已取消扫码', icon: 'none' }),
      });
      break;
    default:
      uni.showToast({ title: `${t.name} · 即将上线`, icon: 'none' });
  }
}

onMounted(load);
</script>

<style scoped>
.page { padding: 16rpx 24rpx 40rpx; }
.banner { background: linear-gradient(135deg, #FF8A65, #FF5A1F); border-radius: 20rpx; padding: 36rpx; margin-bottom: 24rpx; }
.banner-title { color: #fff; font-size: 36rpx; font-weight: 700; display: block; }
.banner-sub { color: rgba(255,255,255,.85); font-size: 24rpx; margin-top: 8rpx; display: block; }
.loading { text-align: center; color: #999; padding: 120rpx 0; }
.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.cell { width: 31.5%; background: #fff; border-radius: 20rpx; padding: 24rpx 16rpx; text-align: center; margin-bottom: 20rpx; }
.icon { width: 88rpx; height: 88rpx; border-radius: 24rpx; color: #fff; font-size: 40rpx; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 14rpx; }
.name { font-size: 26rpx; color: #222; display: block; }
.desc { font-size: 20rpx; color: #999; display: block; margin-top: 6rpx; }
</style>
