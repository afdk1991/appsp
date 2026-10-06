<template>
  <view class="page">
    <view class="screen">
      <text class="expr">{{ expr || '0' }}</text>
      <text class="result">{{ result }}</text>
    </view>
    <view class="keys">
      <view v-for="(k, i) in keys" :key="i" class="key" :class="keyClass(k)" @tap="press(k)">{{ k }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const expr = ref('');
const result = ref('0');

const keys = ['C', '⌫', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '=', ];

function keyClass(k: string) {
  if ('÷×-+.='.includes(k) || k === '=') return 'op';
  if (k === 'C' || k === '⌫' || k === '%') return 'fn';
  return '';
}

function press(k: string) {
  if (k === 'C') {
    expr.value = '';
    result.value = '0';
  } else if (k === '⌫') {
    expr.value = expr.value.slice(0, -1);
  } else if (k === '=') {
    try {
      const r = evaluate(expr.value);
      result.value = String(r);
      expr.value = String(r);
    } catch {
      result.value = '错误';
    }
  } else if (k === '%') {
    try {
      const r = evaluate(expr.value) / 100;
      result.value = String(r);
      expr.value = String(r);
    } catch {
      result.value = '错误';
    }
  } else {
    expr.value += k;
  }
}

function evaluate(s: string): number {
  const normalized = s.replace(/×/g, '*').replace(/÷/g, '/');
  // 仅允许数字与 + - * / .
  if (!/^[0-9+\-*/.() ]+$/.test(normalized)) throw new Error('bad');
  // eslint-disable-next-line no-new-func
  const v = Function(`"use strict"; return (${normalized})`)();
  if (typeof v !== 'number' || !isFinite(v)) throw new Error('bad');
  return Math.round(v * 1e6) / 1e6;
}
</script>

<style scoped>
.page { padding: 24rpx; min-height: 100vh; }
.screen { background: #1c1c1e; border-radius: 20rpx; padding: 60rpx 32rpx; text-align: right; margin-bottom: 24rpx; }
.expr { color: rgba(255,255,255,.6); font-size: 36rpx; display: block; min-height: 48rpx; word-break: break-all; }
.result { color: #fff; font-size: 72rpx; font-weight: 300; display: block; margin-top: 16rpx; }
.keys { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16rpx; }
.key { height: 120rpx; border-radius: 60rpx; background: #f2f3f5; font-size: 40rpx; color: #222; display: flex; align-items: center; justify-content: center; }
.key.op { background: #FF9F0A; color: #fff; }
.key.fn { background: #d4d4d2; color: #222; }
</style>
