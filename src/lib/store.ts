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
  Promotion,
  Article,
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
  MATERIALS: "dbesto_materials_v1",
  PROMOTIONS: "dbesto_promos_v1",
  ARTICLES: "dbesto_articles_v1",
  STOCKS: "dbesto_stocks_v1",
  SHIFTS: "dbesto_shifts_v1",
  POS_ORDERS: "dbesto_orders_v1",
  OPNAMES: "dbesto_opnames_v1",
  PURCHASE_ORDERS: "dbesto_pos_v1",
  ATTENDANCES: "dbesto_attendances_v1",
  CURRENT_USER_ID: "dbesto_curr_user_v1",
  CURRENT_OUTLET_ID: "dbesto_curr_outlet_v1",
  CART: "dbesto_cart_v1",
  JWT_TOKEN: "dbesto_jwt_token",
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
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(INITIAL_RAW_MATERIALS);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [stocks, setStocks] = useState<OutletMaterialStock[]>(INITIAL_OUTLET_STOCKS);
  const [shifts, setShifts] = useState<CashierShift[]>(INITIAL_SHIFTS);
  const [posOrders, setPosOrders] = useState<PosOrder[]>(INITIAL_POS_ORDERS);
  const [stockOpnames, setStockOpnames] = useState<StockOpname[]>(INITIAL_STOCK_OPNAMES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [attendances, setAttendances] = useState<Attendance[]>(INITIAL_ATTENDANCES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // Current session context
  const [currentUserId, setCurrentUserId] = useState<string>("usr-super-01");
  const [currentOutletId, setCurrentOutletId] = useState<string>("out-mrg-01");

  useEffect(() => {
    setIsClient(true);
    setOutlets(getStorage(STORAGE_KEYS.OUTLETS, INITIAL_OUTLETS));
    setUsers(getStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
    setProducts(getStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS));
    setRawMaterials(getStorage(STORAGE_KEYS.MATERIALS, INITIAL_RAW_MATERIALS));
    setPromotions(getStorage(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS));
    setArticles(getStorage(STORAGE_KEYS.ARTICLES, INITIAL_ARTICLES));
    setStocks(getStorage(STORAGE_KEYS.STOCKS, INITIAL_OUTLET_STOCKS));
    setShifts(getStorage(STORAGE_KEYS.SHIFTS, INITIAL_SHIFTS));
    setPosOrders(getStorage(STORAGE_KEYS.POS_ORDERS, INITIAL_POS_ORDERS));
    setStockOpnames(getStorage(STORAGE_KEYS.OPNAMES, INITIAL_STOCK_OPNAMES));
    setPurchaseOrders(getStorage(STORAGE_KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS));
    setAttendances(getStorage(STORAGE_KEYS.ATTENDANCES, INITIAL_ATTENDANCES));
    setCart(getStorage(STORAGE_KEYS.CART, []));

    const token = localStorage.getItem(STORAGE_KEYS.JWT_TOKEN);
    if (token) setJwtToken(token);

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

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.JWT_TOKEN);
    setJwtToken(null);
    if (typeof document !== "undefined") {
      document.cookie = "dbesto_jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    window.location.href = "/auth/login";
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
      const updated =
        quantity <= 0
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
      const mat = rawMaterials.find((m) => m.id === it.materialId) || INITIAL_RAW_MATERIALS[0];
      const diff = it.physicalStock - it.systemStock;
      const loss = diff < 0 ? Math.abs(diff) * mat.standardCost : 0;
      totalLoss += loss;
      return {
        id: `oi-${Date.now()}-${idx}`,
        materialId: it.materialId,
        materialName: mat.name,
        materialCode: mat.code,
        unit: mat.unit,
        systemStock: it.systemStock,
        physicalStock: it.physicalStock,
        difference: diff,
        costPerUnit: mat.standardCost,
        lossValue: loss,
        reason: it.reason || (diff < 0 ? "Selisih susut fisik" : "Sesuai standar"),
      };
    });

    const newOpname: StockOpname = {
      id: `opn-${Date.now()}`,
      opnameNumber: generateOpnameNumber(currentOutlet.code),
      outletId: currentOutlet.id,
      outletName: currentOutlet.name,
      createdById: currentUser.id,
      createdByName: currentUser.name,
      conductedById: currentUser.id,
      conductedByName: currentUser.name,
      opnameDate: new Date().toISOString(),
      status: "SUBMITTED",
      totalDifferenceQty: items.reduce((acc, it) => acc + (it.physicalStock - it.systemStock), 0),
      totalLossAmount: totalLoss,
      notes,
      items: opnameItems,
    };

    const updated = [newOpname, ...stockOpnames];
    setStockOpnames(updated);
    setStorage(STORAGE_KEYS.OPNAMES, updated);
    return newOpname;
  };

  const approveStockOpname = (opnameId: string, status: "APPROVED" | "REJECTED" = "APPROVED") => {
    setStockOpnames((prev) => {
      const updated = prev.map((opn) => {
        if (opn.id === opnameId) {
          const updatedOpn = {
            ...opn,
            status,
            approvedById: currentUser.id,
            approvedByName: currentUser.name,
            approvedAt: new Date().toISOString(),
          };

          // If approved, update outlet stocks to physical count
          if (status === "APPROVED") {
            setStocks((prevStocks) => {
              const updatedStocks = prevStocks.map((stk) => {
                if (stk.outletId === opn.outletId) {
                  const matchItem = opn.items.find((i) => i.materialId === stk.materialId);
                  if (matchItem) {
                    return {
                      ...stk,
                      currentStock: matchItem.physicalStock,
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

          return updatedOpn;
        }
        return opn;
      });
      setStorage(STORAGE_KEYS.OPNAMES, updated);
      return updated;
    });
  };

  // Purchase Order (PO Bahan Baku)
  const createPurchaseOrder = (
    items: { materialId: string; orderedQty: number }[],
    deliveryDate: string,
    notes?: string
  ): PurchaseOrder => {
    let total = 0;
    const poItems = items.map((it, idx) => {
      const mat = rawMaterials.find((m) => m.id === it.materialId) || INITIAL_RAW_MATERIALS[0];
      const sub = it.orderedQty * mat.standardCost;
      total += sub;
      return {
        id: `poi-${Date.now()}-${idx}`,
        materialId: it.materialId,
        materialName: mat.name,
        materialCode: mat.code,
        unit: mat.unit,
        orderedQty: it.orderedQty,
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
      inPhotoUrl:
        photoUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
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
            outPhotoUrl:
              photoUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop",
            workHours,
          };
        }
        return att;
      });
      setStorage(STORAGE_KEYS.ATTENDANCES, updated);
      return updated;
    });
  };

  // ==========================================
  // FULL CRUD METHODS: PRODUCTS / MENU
  // ==========================================
  const addProduct = (prodData: Omit<Product, "id">): Product => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    setStorage(STORAGE_KEYS.PRODUCTS, updated);
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(updated);
    setStorage(STORAGE_KEYS.PRODUCTS, updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    setStorage(STORAGE_KEYS.PRODUCTS, updated);
  };

  const toggleProductAvailability = (id: string) => {
    const updated = products.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
    setProducts(updated);
    setStorage(STORAGE_KEYS.PRODUCTS, updated);
  };

  // ==========================================
  // FULL CRUD METHODS: OUTLETS / CABANG
  // ==========================================
  const addOutlet = (newOutlet: Omit<Outlet, "id" | "createdAt">): Outlet => {
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

  const updateOutlet = (id: string, updates: Partial<Outlet>) => {
    const updated = outlets.map((o) => (o.id === id ? { ...o, ...updates } : o));
    setOutlets(updated);
    setStorage(STORAGE_KEYS.OUTLETS, updated);
  };

  const deleteOutlet = (id: string) => {
    const updated = outlets.filter((o) => o.id !== id);
    setOutlets(updated);
    setStorage(STORAGE_KEYS.OUTLETS, updated);
  };

  // ==========================================
  // FULL CRUD METHODS: USERS / AKUN STAF
  // ==========================================
  const addUser = (newUser: Omit<User, "id">): User => {
    const created: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
    };
    const updated = [...users, created];
    setUsers(updated);
    setStorage(STORAGE_KEYS.USERS, updated);
    return created;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    setUsers(updated);
    setStorage(STORAGE_KEYS.USERS, updated);
  };

  const deleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    setStorage(STORAGE_KEYS.USERS, updated);
  };

  // ==========================================
  // FULL CRUD METHODS: RAW MATERIALS / BAHAN
  // ==========================================
  const addRawMaterial = (newMat: Omit<RawMaterial, "id">): RawMaterial => {
    const created: RawMaterial = {
      ...newMat,
      id: `mat-${Date.now()}`,
    };
    const updated = [...rawMaterials, created];
    setRawMaterials(updated);
    setStorage(STORAGE_KEYS.MATERIALS, updated);
    return created;
  };

  const updateRawMaterial = (id: string, updates: Partial<RawMaterial>) => {
    const updated = rawMaterials.map((m) => (m.id === id ? { ...m, ...updates } : m));
    setRawMaterials(updated);
    setStorage(STORAGE_KEYS.MATERIALS, updated);
  };

  const deleteRawMaterial = (id: string) => {
    const updated = rawMaterials.filter((m) => m.id !== id);
    setRawMaterials(updated);
    setStorage(STORAGE_KEYS.MATERIALS, updated);
  };

  const adjustStock = (stockId: string, newStock: number) => {
    const updated = stocks.map((s) =>
      s.id === stockId ? { ...s, currentStock: newStock, updatedAt: new Date().toISOString() } : s
    );
    setStocks(updated);
    setStorage(STORAGE_KEYS.STOCKS, updated);
  };

  // ==========================================
  // FULL CRUD METHODS: PROMOTIONS & ARTICLES
  // ==========================================
  const addPromotion = (newPromo: Omit<Promotion, "id">): Promotion => {
    const created: Promotion = {
      ...newPromo,
      id: `prm-${Date.now()}`,
    };
    const updated = [created, ...promotions];
    setPromotions(updated);
    setStorage(STORAGE_KEYS.PROMOTIONS, updated);
    return created;
  };

  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    const updated = promotions.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setPromotions(updated);
    setStorage(STORAGE_KEYS.PROMOTIONS, updated);
  };

  const deletePromotion = (id: string) => {
    const updated = promotions.filter((p) => p.id !== id);
    setPromotions(updated);
    setStorage(STORAGE_KEYS.PROMOTIONS, updated);
  };

  const addArticle = (newArt: Omit<Article, "id">): Article => {
    const created: Article = {
      ...newArt,
      id: `art-${Date.now()}`,
    };
    const updated = [created, ...articles];
    setArticles(updated);
    setStorage(STORAGE_KEYS.ARTICLES, updated);
    return created;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    const updated = articles.map((a) => (a.id === id ? { ...a, ...updates } : a));
    setArticles(updated);
    setStorage(STORAGE_KEYS.ARTICLES, updated);
  };

  const deleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    setArticles(updated);
    setStorage(STORAGE_KEYS.ARTICLES, updated);
  };

  return {
    isClient,
    jwtToken,
    outlets,
    users,
    products,
    categories: INITIAL_CATEGORIES,
    rawMaterials,
    stocks,
    shifts,
    posOrders,
    stockOpnames,
    purchaseOrders,
    attendances,
    promotions,
    articles,
    cart,
    currentUser,
    currentOutlet,
    switchUser,
    switchOutlet,
    logout,
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
    // Products CRUD
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    // Outlets CRUD
    addOutlet,
    updateOutlet,
    deleteOutlet,
    // Users CRUD
    addUser,
    updateUser,
    deleteUser,
    // Raw Materials CRUD
    addRawMaterial,
    updateRawMaterial,
    deleteRawMaterial,
    adjustStock,
    // Promos & Articles CRUD
    addPromotion,
    updatePromotion,
    deletePromotion,
    addArticle,
    updateArticle,
    deleteArticle,
  };
}
