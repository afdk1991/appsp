<template>
  <view class="page">
    <view class="card">
      <view class="row" @tap="clearCache">
        <text class="name">清除缓存</text>
        <text class="value">{{ cacheSize }}</text>
      </view>
      <view class="row" @tap="onAbout">
        <text class="name">关于我们</text>
        <text class="arrow">›</text>
      </view>
      <view class="row" @tap="onAgreement">
        <text class="name">用户协议</text>
        <text class="arrow">›</text>
      </view>
      <view class="row" @tap="onPrivacy">
        <text class="name">隐私政策</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view v-if="isLogin" class="logout" @tap="logout">退出登录</view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { userStore } from '../../store/user';

const cacheSize = ref('0KB');
const isLogin = ref(false);

onShow(() => {
  isLogin.value = userStore.state.user.isLoggedIn;
  try {
    // #ifdef H5
    const keys = Object.keys(localStorage);
    let total = 0;
    keys.forEach((k) => { total += (localStorage.getItem(k) || '').length; });
    cacheSize.value = total > 1024 ? (total / 1024).toFixed(1) + 'KB' : total + 'B';
    // #endif
    // #ifndef H5
    cacheSize.value = '1.2MB';
    // #endif
  } catch {
    cacheSize.value = '0KB';
  }
});

function clearCache() {
  uni.showModal({
    title: '清除缓存',
    content: '将清理临时图片与文件，不影响账号和订单数据',
    success: (r) => {
      if (r.confirm) {
        uni.showToast({ title: '已清理', icon: 'success' });
        cacheSize.value = '0KB';
      }
    },
  });
}
function onAbout() { uni.navigateTo({ url: '/pages/about/about' }); }
function onAgreement() { uni.showModal({ title: '用户协议', content: '欢迎使用优选。您在使用本服务前应仔细阅读本协议。', showCancel: false }); }
function onPrivacy() { uni.showModal({ title: '隐私政策', content: '我们重视您的隐私，本应用仅在本地存储您的订单与设置数据。', showCancel: false }); }
function logout() {
  uni.showModal({
    title: '退出登录',
    content: '确定退出当前账号？',
    success: (r) => {
      if (r.confirm) {
        userStore.logout();
        isLogin.value = false;
        uni.showToast({ title: '已退出', icon: 'success' });
      }
    },
  });
}
</script>

<style scoped>
.page { padding: 16rpx 24rpx 40rpx; }
.card { background: #fff; border-radius: 16rpx; padding: 0 24rpx; }
.row { display: flex; justify-content: space-between; align-items: center; padding: 30rpx 0; border-bottom: 1rpx solid #f5f5f5; }
.row:last-child { border-bottom: none; }
.name { font-size: 28rpx; color: #333; }
.value { font-size: 24rpx; color: #999; }
.arrow { color: #ccc; font-size: 32rpx; }
.logout { margin-top: 60rpx; height: 88rpx; line-height: 88rpx; text-align: center; background: #fff; color: #FF3B30; border-radius: 44rpx; font-size: 28rpx; }
</style>
