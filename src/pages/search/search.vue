<template>
  <view class="page">
    <view class="search-bar">
      <view class="input-wrap">
        <text class="icon">🔍</text>
        <input
          v-model="keyword"
          class="input"
          placeholder="搜索商品 / 品牌"
          confirm-type="search"
          @confirm="doSearch"
          focus
        />
        <text v-if="keyword" class="clear" @tap="clearKw">✕</text>
      </view>
      <text class="cancel" @tap="goBack">取消</text>
    </view>

    <template v-if="!searched">
      <view v-if="history.length" class="block">
        <view class="block-head">
          <text class="block-title">历史搜索</text>
          <text class="block-clear" @tap="clearHistory">清空</text>
        </view>
        <view class="tags">
          <text v-for="h in history" :key="h" class="tag" @tap="quick(h)">{{ h }}</text>
        </view>
      </view>
      <view class="block">
        <view class="block-head"><text class="block-title">热门推荐</text></view>
        <view class="tags">
          <text v-for="h in hot" :key="h" class="tag hot" @tap="quick(h)">{{ h }}</text>
        </view>
      </view>
    </template>

    <template v-else>
      <view v-if="loading" class="loading">搜索中…</view>
      <view v-else-if="results.length" class="grid">
        <view v-for="p in results" :key="p.id" class="card" @tap="goDetail(p)">
          <view class="thumb" :style="{ background: p.color }">
            <text class="thumb-text">{{ p.title.slice(0, 2) }}</text>
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
      <view v-else class="empty">
        <text class="empty-icon">🔍</text>
        <text class="empty-text">没有找到「{{ keyword }}」相关商品</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchProducts } from '../../api';
import type { Product } from '../../api/types';
import { load, save } from '../../utils/storage';

const HISTORY_KEY = 'appsp_search_history';
const keyword = ref('');
const searched = ref(false);
const loading = ref(false);
const results = ref<Product[]>([]);
const history = load<string[]>(HISTORY_KEY, []);
const hot = ['保温杯', '耳机', '键盘', '充电宝', '四件套', '手环'];

function doSearch() {
  const k = keyword.value.trim();
  if (!k) return;
  if (!history.includes(k)) {
    history.unshift(k);
    if (history.length > 10) history.pop();
    save(HISTORY_KEY, history);
  }
  searched.value = true;
  loading.value = true;
  fetchProducts().then((res) => {
    results.value = res.data.filter((p) => p.title.includes(k));
  }).finally(() => {
    loading.value = false;
  });
}

function quick(h: string) {
  keyword.value = h;
  doSearch();
}
function clearKw() {
  keyword.value = '';
  searched.value = false;
  results.value = [];
}
function clearHistory() {
  history.length = 0;
  save(HISTORY_KEY, history);
}
function goDetail(p: Product) {
  uni.navigateTo({ url: `/pages/product/detail?id=${p.id}` });
}
function goBack() {
  uni.navigateBack();
}
</script>

<style scoped>
.page { padding: 16rpx 24rpx 40rpx; }
.search-bar { display: flex; align-items: center; gap: 16rpx; }
.input-wrap { flex: 1; height: 72rpx; background: #F0F1F3; border-radius: 36rpx; display: flex; align-items: center; padding: 0 24rpx; gap: 12rpx; }
.icon { font-size: 28rpx; }
.input { flex: 1; font-size: 26rpx; }
.clear { color: #aaa; font-size: 26rpx; padding: 0 8rpx; }
.cancel { color: #666; font-size: 26rpx; }
.block { margin-top: 32rpx; }
.block-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16rpx; }
.block-title { font-size: 28rpx; color: #222; font-weight: 600; }
.block-clear { font-size: 24rpx; color: #999; }
.tags { display: flex; flex-wrap: wrap; gap: 16rpx; }
.tag { padding: 10rpx 24rpx; background: #fff; border-radius: 28rpx; font-size: 24rpx; color: #555; }
.tag.hot { background: #FFF3EC; color: #FF5A1F; }
.loading, .empty { text-align: center; color: #999; padding: 120rpx 0; }
.empty-icon { font-size: 64rpx; display: block; margin-bottom: 16rpx; }
.empty-text { font-size: 26rpx; }
.grid { display: flex; flex-wrap: wrap; justify-content: space-between; }
.card { width: 48.5%; background: #fff; border-radius: 20rpx; overflow: hidden; margin-bottom: 20rpx; }
.thumb { height: 280rpx; display: flex; align-items: center; justify-content: center; }
.thumb-text { font-size: 48rpx; color: rgba(255,255,255,.85); font-weight: 600; }
.info { padding: 16rpx 20rpx 20rpx; }
.title { font-size: 26rpx; color: #222; line-height: 1.4; display: block; min-height: 72rpx; }
.price-row { display: flex; align-items: baseline; gap: 12rpx; margin-top: 10rpx; }
.price { color: #FF5A1F; font-size: 36rpx; font-weight: 700; }
.origin { color: #bbb; font-size: 22rpx; text-decoration: line-through; }
.sales { color: #999; font-size: 22rpx; margin-top: 6rpx; display: block; }
</style>
