"use client";

import { useState, useEffect } from "react";
import {
  Outlet,
  User,
  Product,
  Category,
  RawMaterial,
  OutletMaterialStock,
  PosOrder,
  CashierShift,
  StockOpname,
  PurchaseOrder,
  Attendance,
  CartItem,
  UserRole,
} from "./types";
import {
  INITIAL_OUTLETS,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_OUTLET_STOCKS,
  INITIAL_SHIFTS,
  INITIAL_POS_ORDERS,
  INITIAL_STOCK_OPNAMES,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_ATTENDANCES,
  INITIAL_PROMOTIONS,
  INITIAL_ARTICLES,
} from "./mock-data";
import { generateInvoiceNumber, generateOpnameNumber, generatePoNumber } from "./formatters";
import { validateGeofence } from "./geofence";

const STORAGE_KEYS = {
  OUTLETS: "dbesto_outlets_v1",
  USERS: "dbesto_users_v1",
  PRODUCTS: "dbesto_products_v1",
  STOCKS: "dbesto_stocks_v1",
  SHIFTS: "dbesto_shifts_v1",
  POS_ORDERS: "dbesto_orders_v1",
  OPNAMES: "dbesto_opnames_v1",
  PURCHASE_ORDERS: "dbesto_pos_v1",
  ATTENDANCES: "dbesto_attendances_v1",
  CURRENT_USER_ID: "dbesto_curr_user_v1",
  CURRENT_OUTLET_ID: "dbesto_curr_outlet_v1",
  CART: "dbesto_cart_v1",
};

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

export function useAppStore() {
  const [isClient, setIsClient] = useState(false);

  const [outlets, setOutlets] = useState<Outlet[]>(INITIAL_OUTLETS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [stocks, setStocks] = useState<OutletMaterialStock[]>(INITIAL_OUTLET_STOCKS);
  const [shifts, setShifts] = useState<CashierShift[]>(INITIAL_SHIFTS);
  const [posOrders, setPosOrders] = useState<PosOrder[]>(INITIAL_POS_ORDERS);
  const [stockOpnames, setStockOpnames] = useState<StockOpname[]>(INITIAL_STOCK_OPNAMES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [attendances, setAttendances] = useState<Attendance[]>(INITIAL_ATTENDANCES);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Current session context
  const [currentUserId, setCurrentUserId] = useState<string>("usr-kasir-mrg");
  const [currentOutletId, setCurrentOutletId] = useState<string>("out-mrg-01");

  useEffect(() => {
    setIsClient(true);
    setOutlets(getStorage(STORAGE_KEYS.OUTLETS, INITIAL_OUTLETS));
    setUsers(getStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
    setProducts(getStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
    setStocks(getStorage(STORAGE_KEYS.STOCKS, INITIAL_OUTLET_STOCKS));
    setShifts(getStorage(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS));
    setPosOrders(getStorage(STORAGE_KEYS.POS_ORDERS, INITIAL_POS_ORDERS));
    setStockOpnames(getStorage(STORAGE_KEYS.OPNAMES, INITIAL_STOCK_OPNAMES));
    setPurchaseOrders(getStorage(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS));
    setAttendances(getStorage(STORAGE_KEYS.ATTENDANCES, INITIAL_ATTENDANCES));
    setCart(getStorage(STORAGE_KEYS.CART, []));

    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (savedUser) setCurrentUserId(savedUser);
    const savedOutlet = localStorage.getItem(STORAGE_KEYS.CURRENT_OUTLET_ID);
    if (savedOutlet) setCurrentOutletId(savedOutlet);
  }, []);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentOutlet = outlets.find((o) => o.id === currentOutletId) || outlets[0];

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      setStorage(STORAGE_KEYS.CURRENT_USER_ID, userId);
      if (user.outletId) {
        setCurrentOutletId(user.outletId);
        setStorage(STORAGE_KEYS.CURRENT_OUTLET_ID, user.outletId);
      }
    }
  };

  const switchOutlet = (outletId: string) => {
    setCurrentOutletId(outletId);
    setStorage(STORAGE_KEYS.CURRENT_OUTLET_ID, outletId);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
      } else {
        updated = [...prev, { product, quantity, notes }];
      }
      setStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
  };

  const updateCartQty = (productId: string, quantity: number) => {
    setCart((prev) => {
      const updated = quantity <= 0
        ? prev.filter((item) => item.product.id !== productId)
        : prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
      setStorage(STORAGE_KEYS.CART, updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setStorage(STORAGE_KEYS.CART, []);
  };

  // POS Checkout Order
  const createOrder = (orderData: Omit<PosOrder, "id" | "invoiceNumber" | "createdAt">): PosOrder => {
    const invoiceNumber = generateInvoiceNumber(currentOutlet.code);
    const newOrder: PosOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      invoiceNumber,
      createdAt: new Date().toISOString(),
      outletName: currentOutlet.name,
      cashierName: currentUser.name,
    };

    const updatedOrders = [newOrder, ...posOrders];
    setPosOrders(updatedOrders);
    setStorage(STORAGE_KEYS.POS_ORDERS, updatedOrders);

    // Update active shift if cash
    if (orderData.shiftId) {
      setShifts((prev) => {
        const updated = prev.map((s) => {
          if (s.id === orderData.shiftId) {
            const isCash = orderData.paymentMethod === "CASH";
            const cashAdd = isCash ? orderData.totalAmount : 0;
            const nonCashAdd = !isCash ? orderData.totalAmount : 0;
            return {
              ...s,
              totalTransactions: (s.totalTransactions || 0) + 1,
              totalCashSales: (s.totalCashSales || 0) + cashAdd,
              totalNonCashSales: (s.totalNonCashSales || 0) + nonCashAdd,
              expectedCash: (s.expectedCash || s.openingCash) + cashAdd,
            };
          }
          return s;
        });
        setStorage(STORAGE_KEYS.SHIFTS, updated);
        return updated;
      });
    }

    return newOrder;
  };

  // Cashier Shifts
  const openShift = (openingCash: number, notes?: string): CashierShift => {
    const newShift: CashierShift = {
      id: `shf-${Date.now()}`,
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      userId: currentUser.id,
      userName: currentUser.name,
      openedAt: new Date().toISOString(),
      openingCash,
      expectedCash: openingCash,
      status: "OPEN",
      totalTransactions: 0,
      totalCashSales: 0,
      totalNonCashSales: 0,
      notes,
    };
    const updated = [newShift, ...shifts];
    setShifts(updated);
    setStorage(STORAGE_KEYS.SHIFTS, updated);
    return newShift;
  };

  const closeShift = (shiftId: string, closingCash: number, notes?: string) => {
    setShifts((prev) => {
      const updated = prev.map((s) => {
        if (s.id === shiftId) {
          const expected = s.expectedCash || s.openingCash;
          const discrepancy = closingCash - expected;
          return {
            ...s,
            closedAt: new Date().toISOString(),
            closingCash,
            cashDiscrepancy: discrepancy,
            status: "CLOSED" as const,
            notes: notes || s.notes,
          };
        }
        return s;
      });
      setStorage(STORAGE_KEYS.SHIFTS, updated);
      return updated;
    });
  };

  // Stock Opname
  const submitStockOpname = (
    items: { materialId: string; systemStock: number; physicalStock: number; reason?: string }[],
    notes?: string
  ): StockOpname => {
    let totalLoss = 0;
    const opnameItems = items.map((it, idx) => {
      const mat = INITIAL_RAW_MATERIALS.find((m) => m.id === it.materialId)!;
      const diff = it.physicalStock - it.systemStock;
      const loss = diff < 0 ? Math.abs(diff) * mat.standardCost : 0;
      totalLoss += loss;
      return {
        id: `soi-${Date.now()}-${idx}`,
        materialId: it.materialId,
        materialName: mat.name,
        materialCode: mat.code,
        unit: mat.unit,
        systemStock: it.systemStock,
        physicalStock: it.physicalStock,
        difference: diff,
        costPerUnit: mat.standardCost,
        lossValue: loss,
        reason: it.reason || "Cek fisik rutin",
      };
    });

    const newOpname: StockOpname = {
      id: `so-${Date.now()}`,
      opnameNumber: generateOpnameNumber(currentOutlet.code),
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      opnameDate: new Date().toISOString(),
      status: "SUBMITTED",
      totalLossAmount: totalLoss,
      notes,
      items: opnameItems,
    };

    const updated = [newOpname, ...stockOpnames];
    setStockOpnames(updated);
    setStorage(STORAGE_KEYS.OPNAMES, updated);
    return newOpname;
  };

  const approveStockOpname = (opnameId: string) => {
    const opname = stockOpnames.find((o) => o.id === opnameId);
    if (!opname) return;

    // Update stock in outlet
    setStocks((prev) => {
      const updated = prev.map((stk) => {
        if (stk.outletId === opname.outletId) {
          const item = opname.items.find((i) => i.materialId === stk.materialId);
          if (item) {
            return { ...stk, currentStock: item.physicalStock, updatedAt: new Date().toISOString() };
          }
        }
        return stk;
      });
      setStorage(STORAGE_KEYS.STOCKS, updated);
      return updated;
    });

    // Update opname status
    setStockOpnames((prev) => {
      const updated = prev.map((o) =>
        o.id === opnameId ? { ...o, status: "APPROVED" as const, approvedAt: new Date().toISOString() } : o
      );
      setStorage(STORAGE_KEYS.OPNAMES, updated);
      return updated;
    });
  };

  // Purchase Order
  const createPurchaseOrder = (
    items: { materialId: string; orderedQty: number }[],
    deliveryDate?: string,
    notes?: string
  ): PurchaseOrder => {
    let total = 0;
    const poItems = items.map((it, idx) => {
      const mat = INITIAL_RAW_MATERIALS.find((m) => m.id === it.materialId)!;
      const sub = it.orderedQty * mat.standardCost;
      total += sub;
      return {
        id: `poi-${Date.now()}-${idx}`,
        materialId: it.materialId,
        materialName: mat.name,
        unit: mat.unit,
        orderedQty: it.orderedQty,
        receivedQty: 0,
        unitCost: mat.standardCost,
        subtotal: sub,
      };
    });

    const newPo: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: generatePoNumber(currentOutlet.code),
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      orderDate: new Date().toISOString(),
      deliveryDate,
      status: "SUBMITTED",
      totalAmount: total,
      notes,
      items: poItems,
    };

    const updated = [newPo, ...purchaseOrders];
    setPurchaseOrders(updated);
    setStorage(STORAGE_KEYS.PURCHASE_ORDERS, updated);
    return newPo;
  };

  const updatePoStatus = (
    poId: string,
    status: PurchaseOrder["status"],
    receivedPhoto?: string,
    receivedNotes?: string
  ) => {
    setPurchaseOrders((prev) => {
      const updated = prev.map((po) => {
        if (po.id === poId) {
          const isRec = status === "RECEIVED";
          const updatedPo = {
            ...po,
            status,
            receivedPhoto: receivedPhoto || po.receivedPhoto,
            receivedNotes: receivedNotes || po.receivedNotes,
            receivedAt: isRec ? new Date().toISOString() : po.receivedAt,
          };

          // If received, increase outlet stocks
          if (isRec) {
            setStocks((prevStocks) => {
              const updatedStocks = prevStocks.map((stk) => {
                if (stk.outletId === po.outletId) {
                  const item = po.items.find((i) => i.materialId === stk.materialId);
                  if (item) {
                    return {
                      ...stk,
                      currentStock: stk.currentStock + item.orderedQty,
                      updatedAt: new Date().toISOString(),
                    };
                  }
                }
                return stk;
              });
              setStorage(STORAGE_KEYS.STOCKS, updatedStocks);
              return updatedStocks;
            });
          }

          return updatedPo;
        }
        return po;
      });
      setStorage(STORAGE_KEYS.PURCHASE_ORDERS, updated);
      return updated;
    });
  };

  // Attendance Clock-in & Clock-out with Geofence
  const clockIn = (userLat: number, userLon: number, photoUrl?: string) => {
    const geo = validateGeofence(
      userLat,
      userLon,
      currentOutlet.latitude,
      currentOutlet.longitude,
      currentOutlet.radiusMeters
    );

    if (!geo.isValid) {
      throw new Error(geo.message);
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const isLate = hour > 9 || (hour === 9 && minute > 10);
    const lateMins = isLate ? (hour - 9) * 60 + minute : 0;

    const newAtt: Attendance = {
      id: `att-${Date.now()}`,
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      userId: currentUser.id,
      userName: currentUser.name,
      date: todayStr,
      clockInTime: new Date().toISOString(),
      inLatitude: userLat,
      inLongitude: userLon,
      inDistanceM: geo.distanceMeters,
      inPhotoUrl: photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
      status: isLate ? "LATE" : "PRESENT",
      lateMinutes: lateMins,
      notes: isLate ? `Terlambat ${lateMins} menit` : "Hadir tepat waktu",
    };

    const updated = [newAtt, ...attendances];
    setAttendances(updated);
    setStorage(STORAGE_KEYS.ATTENDANCES, updated);
    return newAtt;
  };

  const clockOut = (attId: string, userLat: number, userLon: number, photoUrl?: string) => {
    const geo = validateGeofence(
      userLat,
      userLon,
      currentOutlet.latitude,
      currentOutlet.longitude,
      currentOutlet.radiusMeters
    );

    if (!geo.isValid) {
      throw new Error(geo.message);
    }

    setAttendances((prev) => {
      const updated = prev.map((att) => {
        if (att.id === attId) {
          const inTime = new Date(att.clockInTime).getTime();
          const outTime = new Date().getTime();
          const workHours = Math.round(((outTime - inTime) / (1000 * 60 * 60)) * 10) / 10;
          return {
            ...att,
            clockOutTime: new Date().toISOString(),
            outLatitude: userLat,
            outLongitude: userLon,
            outDistanceM: geo.distanceMeters,
            outPhotoUrl: photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
            workHours,
          };
        }
        return att;
      });
      setStorage(STORAGE_KEYS.ATTENDANCES, updated);
      return updated;
    });
  };

  // Add new Outlet (Super Admin)
  const addOutlet = (newOutlet: Omit<Outlet, "id" | "createdAt">) => {
    const created: Outlet = {
      ...newOutlet,
      id: `out-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...outlets, created];
    setOutlets(updated);
    setStorage(STORAGE_KEYS.OUTLETS, updated);
    return created;
  };

  // Add new User (Super Admin)
  const addUser = (newUser: Omit<User, "id">) => {
    const created: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
    };
    const updated = [...users, created];
    setUsers(updated);
    setStorage(STORAGE_KEYS.USERS, updated);
    return created;
  };

  return {
    isClient,
    outlets,
    users,
    products,
    categories: INITIAL_CATEGORIES,
    rawMaterials: INITIAL_RAW_MATERIALS,
    stocks,
    shifts,
    posOrders,
    stockOpnames,
    purchaseOrders,
    attendances,
    promotions: INITIAL_PROMOTIONS,
    articles: INITIAL_ARTICLES,
    cart,
    currentUser,
    currentOutlet,
    switchUser,
    switchOutlet,
    addToCart,
    updateCartQty,
    clearCart,
    createOrder,
    openShift,
    closeShift,
    submitStockOpname,
    approveStockOpname,
    createPurchaseOrder,
    updatePoStatus,
    clockIn,
    clockOut,
    addOutlet,
    addUser,
  };
}
