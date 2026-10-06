import { request } from './request';
import type { Post, Product, ToolItem } from './types';
import { mockTools } from '../mock/data';

/** 商品：CloudBase PG REST */
export async function fetchProducts() {
  const res = await request<Array<Record<string, unknown>>>({
    url: '/products?select=id,title,price,original_price,sales,tag,color',
  });
  const list: Product[] = (res.data || []).map((r) => ({
    id: r.id as string,
    title: r.title as string,
    price: Number(r.price),
    originalPrice: r.original_price != null ? Number(r.original_price) : undefined,
    sales: Number(r.sales),
    tag: (r.tag as string) || undefined,
    color: r.color as string,
  }));
  return { code: 0, message: 'ok', data: list };
}

/** 帖子：CloudBase PG REST，snake_case -> camelCase */
export async function fetchPosts() {
  const res = await request<Array<Record<string, unknown>>>({
    url: '/posts?select=id,author,avatar_color,content,image_color,likes,comments,time',
  });
  const list: Post[] = (res.data || []).map((r) => ({
    id: r.id as string,
    author: r.author as string,
    avatarColor: r.avatar_color as string,
    content: r.content as string,
    imageColor: r.image_color as string,
    likes: Number(r.likes),
    comments: Number(r.comments),
    time: r.time as string,
  }));
  return { code: 0, message: 'ok', data: list };
}

/** 工具：纯前端配置，不请求后端 */
export function fetchTools() {
  return Promise.resolve({ code: 0, message: 'ok', data: mockTools });
}
