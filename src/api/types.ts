/** 统一后端响应结构 */
export interface ApiResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 电商商品 */
export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  sales: number;
  tag?: string;
  /** 占位渐变色，避免依赖网络图片 */
  color: string;
}

/** 内容社区帖子 */
export interface Post {
  id: string;
  author: string;
  avatarColor: string;
  content: string;
  imageColor: string;
  likes: number;
  comments: number;
  time: string;
}

/** 工具项 */
export interface ToolItem {
  key: string;
  name: string;
  desc: string;
  iconColor: string;
}

/** 我的页入口 */
export interface MineEntry {
  key: string;
  name: string;
}
