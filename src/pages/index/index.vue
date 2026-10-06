<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input" @tap="goSearch">
        <text class="search-icon">🔍</text>
        <text class="search-ph">搜索商品 / 品牌</text>
      </view>
      <view class="search-cart" @tap="onCart">
        🛒
        <text v-if="cartCount" class="badge">{{ cartCount }}</text>
      </view>
    </view>

    <!-- 金刚区 -->
    <scroll-view class="kingkong" scroll-x>
      <view v-for="c in categories" :key="c" class="kk-item">
        <view class="kk-dot" :style="{ background: catColor(c) }"></view>
        <text class="kk-text">{{ c }}</text>
      </view>
    </scroll-view>

    <!-- 商品双列 -->
    <view v-if="loading" class="loading">加载中…</view>
    <view v-else class="grid">
      <view v-for="p in products" :key="p.id" class="card" @tap="onProduct(p)">
        <view class="thumb" :style="{ background: p.color }">
          <text class="thumb-text">{{ p.title.slice(0, 2) }}</text>
          <text v-if="p.tag" class="tag">{{ p.tag }}</text>
        </view>
        <view class="info">
          <text class="title">{{ p.title }}</text>
          <view class="price-row">
            <text class="price">¥{{ p.price }}</text>
            <text v-if="p.originalPrice" class="origin">¥{{ p.originalPrice }}</text>
          </view>
          <text class="sales">已售 {{ p.sales }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchProducts } from '../../api';
import type { Product } from '../../api/types';
import { cartStore } from '../../store/cart';

const products = ref<Product[]>([]);
const loading = ref(true);
const categories = ['推荐', '数码', '家居', '服饰', '美食', '美妆', '运动', '母婴'];
const cartCount = computed(() => cartStore.totalCount.value);

function catColor(c: string) {
  const palette = ['#FF8A80', '#82B1FF', '#B9F6CA', '#FFE57F', '#B388FF', '#80CBC4', '#F48FB1', '#A5D6A7'];
  let s = 0;
  for (const ch of c) s += ch.charCodeAt(0);
  return palette[s % palette.length];
}

async function load() {
  loading.value = true;
  try {
    const res = await fetchProducts();
    products.value = res.data;
  } finally {
    loading.value = false;
  }
}

function onProduct(p: Product) {
  uni.navigateTo({ url: `/pages/product/detail?id=${p.id}` });
}
function onCart() {
  uni.navigateTo({ url: '/pages/cart/cart' });
}
function goSearch() {
  uni.navigateTo({ url: '/pages/search/search' });
}

onMounted(load);
</script>

<style scoped>
.page { padding: 16rpx 24rpx 40rpx; }
.search-bar { display: flex; align-items: center; gap: 16rpx; padding: 12rpx 0; }
.search-input { flex: 1; height: 72rpx; background: #F0F1F3; border-radius: 36rpx; display: flex; align-items: center; padding: 0 24rpx; gap: 12rpx; }
.search-icon { font-size: 28rpx; }
.search-ph { color: #9AA0A6; font-size: 26rpx; }
.search-cart { position: relative; font-size: 40rpx; }
.badge { position: absolute; top: -10rpx; right: -14rpx; background: #FF3B30; color: #fff; font-size: 18rpx; min-width: 28rpx; height: 28rpx; line-height: 28rpx; border-radius: 14rpx; text-align: center; padding: 0 6rpx; }
.kingkong { white-space: nowrap; padding: 16rpx 0 24rpx; }
.kk-item { display: inline-flex; flex-direction: column; align-items: center; margin-right: 36rpx; }
.kk-dot { width: 80rpx; height: 80rpx; border-radius: 24rpx; margin-bottom: 10rpx; }
.kk-text { font-size: 24rpx; color: #333; }
.loading { text-align: center; color: #999; padding: 120rpx 0; }
.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.card { width: 48.5%; background: #fff; border-radius: 20rpx; overflow: hidden; margin-bottom: 20rpx; }
.thumb { position: relative; height: 280rpx; display: flex; align-items: center; justify-content: center; }
.thumb-text { font-size: 48rpx; color: rgba(255,255,255,.85); font-weight: 600; }
.tag { position: absolute; left: 16rpx; top: 16rpx; background: rgba(0,0,0,.45); color: #fff; font-size: 20rpx; padding: 4rpx 12rpx; border-radius: 8rpx; }
.info { padding: 16rpx 20rpx 20rpx; }
.title { font-size: 26rpx; color: #222; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 72rpx; }
.price-row { display: flex; align-items: baseline; gap: 12rpx; margin-top: 10rpx; }
.price { color: #FF5A1F; font-size: 36rpx; font-weight: 700; }
.origin { color: #bbb; font-size: 22rpx; text-decoration: line-through; }
.sales { color: #999; font-size: 22rpx; margin-top: 6rpx; display: block; }
</style>
