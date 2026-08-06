/**
 * 订单管理 + 物流追踪组件
 *
 * 功能：
 * - 订单列表（按状态筛选）
 * - 订单详情（关联报价/询盘/产品）
 * - 填写物流追踪号
 * - 更新订单状态（production → shipped → delivered）
 * - 物流状态追踪（简易显示）
 */

"use client";

import { useCallback, useEffect, useState } from "react";

type Order = {
  id: string;
  quotation_id: string;
  quantity: number;
  total_amount: number;
  status: string;
  shipping_tracking: string | null;
  production_progress: string | null;
  created_at: string;
  updated_at: string;
  quotations?: {
    id: string;
    unit_price: number;
    status: string;
    inquiries?: {
      id: string;
      buyer_name: string;
      buyer_email: string;
      buyer_country: string | null;
      company_name: string | null;
      message: string | null;
      products?: {
        name_en: string;
        sku: string;
      };
    };
  };
};

const STATUS_OPTIONS: Record<string, string> = {
  confirmed: "📋 已确认",
  sampling: "🔬 打样中",
  production: "🏭 生产中",
  qc_passed: "✅ 质检通过",
  shipped: "🚢 已发货",
  delivered: "📦 已签收",
  cancelled: "❌ 已取消",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-slate-100 text-slate-700",
  sampling: "bg-purple-100 text-purple-700",
  production: "bg-blue-100 text-blue-700",
  qc_passed: "bg-cyan-100 text-cyan-700",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUS_FLOW = ["confirmed", "sampling", "production", "qc_passed", "shipped", "delivered"];

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editTracking, setEditTracking] = useState<Record<string, string>>({});
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ action: "list-orders" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin?${params}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // 更新订单状态
  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-order-status",
          id: orderId,
          status: newStatus,
        }),
      });
      if (res.ok) {
        loadOrders();
      } else {
        const data = await res.json();
        alert("更新失败: " + (data.error || "未知错误"));
      }
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  // 保存物流追踪号
  const saveTracking = async (orderId: string) => {
    const tracking = editTracking[orderId];
    if (!tracking?.trim()) {
      alert("请输入物流单号");
      return;
    }
    setUpdating((prev) => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-order-status",
          id: orderId,
          status: "shipped",
          shipping_tracking: tracking.trim(),
        }),
      });
      if (res.ok) {
        setEditTracking((prev) => ({ ...prev, [orderId]: tracking.trim() }));
        loadOrders();
      } else {
        const data = await res.json();
        alert("保存失败: " + (data.error || "未知错误"));
      }
    } finally {
      setUpdating((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const getNextStatus = (current: string): string | null => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx >= 0 && idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1];
    return null;
  };

  const getPrevStatus = (current: string): string | null => {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx > 0) return STATUS_FLOW[idx - 1];
    return null;
  };

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mb-4 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">📋 全部订单</option>
          {Object.entries(STATUS_OPTIONS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <button
          onClick={loadOrders}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {loading ? "加载中..." : "🔄 刷新"}
        </button>
        <span className="text-xs text-slate-400">
          {orders.length > 0 && `${orders.length} 条订单`}
        </span>
      </div>

      {/* 订单列表 */}
      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => {
            const inquiry = order.quotations?.inquiries;
            const product = inquiry?.products;
            const nextStatus = getNextStatus(order.status);
            const prevStatus = getPrevStatus(order.status);
            const isExpanded = expandedId === order.id;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white"
              >
                {/* 订单卡片头部 */}
                <div
                  className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-sm text-slate-600">
                      {order.quotations?.inquiries?.buyer_name || "未知买家"}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {STATUS_OPTIONS[order.status] || order.status}
                    </span>
                    <span className="text-sm font-medium text-blue-700">
                      ${Number(order.total_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.shipping_tracking && (
                      <span className="text-xs text-blue-500">📮 {order.shipping_tracking}</span>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(order.created_at).toLocaleDateString("zh-CN")}
                    </span>
                    <span className="text-slate-300">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* 展开详情 */}
                {isExpanded && (
                  <div className="border-t border-slate-100 px-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* 左侧：订单信息 + 产品信息 */}
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          订单信息
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex gap-2">
                            <span className="min-w-[80px] text-slate-400">订单 ID</span>
                            <span className="font-mono text-slate-700">{order.id}</span>
                          </div>
                          {product && (
                            <>
                              <div className="flex gap-2">
                                <span className="min-w-[80px] text-slate-400">产品</span>
                                <span className="text-slate-900">{product.name_en}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="min-w-[80px] text-slate-400">SKU</span>
                                <span className="font-mono text-slate-700">{product.sku}</span>
                              </div>
                            </>
                          )}
                          <div className="flex gap-2">
                            <span className="min-w-[80px] text-slate-400">数量</span>
                            <span className="text-slate-700">{order.quantity}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="min-w-[80px] text-slate-400">单价</span>
                            <span className="text-slate-700">
                              ${Number(order.quotations?.unit_price || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="min-w-[80px] text-slate-400">总金额</span>
                            <span className="font-semibold text-blue-700">
                              ${Number(order.total_amount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className="min-w-[80px] text-slate-400">创建时间</span>
                            <span className="text-slate-500">
                              {new Date(order.created_at).toLocaleString("zh-CN")}
                            </span>
                          </div>
                          {order.production_progress && (
                            <div className="flex gap-2">
                              <span className="min-w-[80px] text-slate-400">生产进度</span>
                              <span className="text-slate-700">{order.production_progress}</span>
                            </div>
                          )}
                        </div>

                        {/* 买家信息 */}
                        {inquiry && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                              买家信息
                            </h4>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex gap-2">
                                <span className="min-w-[80px] text-slate-400">姓名</span>
                                <span className="text-slate-900">{inquiry.buyer_name}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="min-w-[80px] text-slate-400">邮箱</span>
                                <span className="text-blue-600">{inquiry.buyer_email}</span>
                              </div>
                              {inquiry.buyer_country && (
                                <div className="flex gap-2">
                                  <span className="min-w-[80px] text-slate-400">国家</span>
                                  <span className="text-slate-700">{inquiry.buyer_country}</span>
                                </div>
                              )}
                              {inquiry.company_name && (
                                <div className="flex gap-2">
                                  <span className="min-w-[80px] text-slate-400">公司</span>
                                  <span className="text-slate-700">{inquiry.company_name}</span>
                                </div>
                              )}
                              {inquiry.message && (
                                <div className="flex gap-2">
                                  <span className="min-w-[80px] text-slate-400">留言</span>
                                  <span className="text-slate-500">{inquiry.message}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 右侧：物流追踪 */}
                      <div>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          物流追踪
                        </h4>
                        <div className="space-y-3">
                          {/* 状态流转 */}
                          <div className="flex items-center gap-1">
                            {STATUS_FLOW.map((s, i) => {
                              const currentIdx = STATUS_FLOW.indexOf(order.status);
                              const done = i <= currentIdx;
                              return (
                                <div key={s} className="flex items-center gap-1">
                                  <div
                                    className={`h-2.5 w-2.5 rounded-full ${
                                      done
                                        ? i === currentIdx
                                          ? "bg-blue-500 ring-2 ring-blue-200"
                                          : "bg-green-400"
                                        : "bg-slate-300"
                                    }`}
                                  />
                                  {i < STATUS_FLOW.length - 1 && (
                                    <div
                                      className={`h-0.5 w-4 sm:w-8 ${
                                        i < currentIdx ? "bg-green-400" : "bg-slate-200"
                                      }`}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-xs text-slate-400">
                            当前: {STATUS_OPTIONS[order.status] || order.status}
                          </p>

                          {/* 操作按钮 */}
                          <div className="flex flex-wrap gap-2">
                            {prevStatus && (
                              <button
                                onClick={() => updateStatus(order.id, prevStatus)}
                                disabled={updating[order.id]}
                                className="rounded border border-slate-200 px-3 py-1 text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                              >
                                ← 回退
                              </button>
                            )}
                            {nextStatus && (
                              <button
                                onClick={() => {
                                  if (nextStatus === "shipped" && !editTracking[order.id]) {
                                    // 如果需要标记 shipped 且没有追踪号，聚焦追踪输入
                                    setEditTracking((prev) => ({ ...prev, [order.id]: order.shipping_tracking || "" }));
                                    return;
                                  }
                                  updateStatus(order.id, nextStatus);
                                }}
                                disabled={updating[order.id]}
                                className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                              >
                                {updating[order.id] ? "处理中..." : `下一步 → ${STATUS_OPTIONS[nextStatus]}`}
                              </button>
                            )}
                            {order.status === "delivered" && (
                              <span className="rounded bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                ✅ 交易完成
                              </span>
                            )}
                          </div>

                          {/* 物流追踪号输入 */}
                          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <label className="mb-1 block text-xs font-medium text-slate-500">
                              物流追踪号
                            </label>
                            <div className="flex gap-2">
                              <input
                                value={editTracking[order.id] ?? order.shipping_tracking ?? ""}
                                onChange={(e) =>
                                  setEditTracking((prev) => ({
                                    ...prev,
                                    [order.id]: e.target.value,
                                  }))
                                }
                                placeholder="输入 DHL/UPS/FedEx 单号"
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                              />
                              <button
                                onClick={() => saveTracking(order.id)}
                                disabled={updating[order.id]}
                                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                {updating[order.id] ? "..." : "保存"}
                              </button>
                            </div>
                            {order.shipping_tracking && (
                              <div className="mt-2 flex items-center gap-2 rounded bg-blue-50 px-2 py-1">
                                <span className="text-xs text-blue-700">📮 {order.shipping_tracking}</span>
                                <a
                                  href={`https://www.17track.net/en/track?nums=${order.shipping_tracking}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 underline hover:text-blue-700"
                                >
                                  17Track 查物流
                                </a>
                              </div>
                            )}
                            <p className="mt-1 text-[10px] text-slate-400">
                              填写后订单自动标记为"已发货"，买家可在订单详情页查看物流
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 空状态 */}
      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <div className="mb-3 text-4xl">📋</div>
          <p className="text-sm">暂无订单记录</p>
          <p className="mt-1 text-xs text-slate-300">确认报价后将自动生成订单</p>
        </div>
      )}
    </div>
  );
}
