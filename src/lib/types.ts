export type UserRole = "SUPER_ADMIN" | "RESTO_ADMIN" | "CASHIER" | "STAFF";

export type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY_ONLINE";

export type PaymentMethod = "CASH" | "QRIS" | "DEBIT_CARD" | "CREDIT_CARD" | "TRANSFER";

export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED" | "REFUNDED";

export type ShiftStatus = "OPEN" | "CLOSED";

export type PoStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED_BY_HQ"
  | "REJECTED"
  | "IN_DELIVERY"
  | "RECEIVED"
  | "CANCELLED";

export type AttendanceStatus =
  | "PRESENT"
  | "LATE"
  | "EARLY_LEAVE"
  | "PERMIT"
  | "SICK"
  | "ABSENT";

export type StockOpnameStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export interface Outlet {
  id: string;
  code: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone?: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  openingTime: string;
  closingTime: string;
  monthlyTarget: number;
  isActive: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username?: string;
  password?: string;
  name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  outletId?: string | null;
  outletName?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isActive: boolean;
  isPopular?: boolean;
  badge?: string;
  calories?: string;
  pieces?: string;
}

export interface PosOrderItem {
  id: string;
  orderId?: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface PosOrder {
  id: string;
  invoiceNumber: string;
  outletId: string;
  outletName?: string;
  shiftId?: string;
  cashierId: string;
  cashierName?: string;
  orderType: OrderType;
  customerName: string;
  customerPhone?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  items: PosOrderItem[];
}

export interface CashierShift {
  id: string;
  outletId: string;
  outletName?: string;
  userId: string;
  userName?: string;
  openedAt: string;
  closedAt?: string;
  openingCash: number;
  closingCash?: number;
  expectedCash?: number;
  cashDiscrepancy?: number;
  notes?: string;
  status: ShiftStatus;
  totalTransactions?: number;
  totalCashSales?: number;
  totalNonCashSales?: number;
}

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  unit: string;
  standardCost: number;
  minStockAlert: number;
  isActive: boolean;
}

export interface OutletMaterialStock {
  id: string;
  outletId: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string;
  currentStock: number;
  standardCost: number;
  updatedAt: string;
}

export interface StockOpnameItem {
  id: string;
  opnameId?: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string;
  systemStock: number;
  physicalStock: number;
  difference: number;
  costPerUnit: number;
  lossValue: number;
  reason?: string;
}

export interface StockOpname {
  id: string;
  opnameNumber: string;
  outletId: string;
  outletName?: string;
  createdById: string;
  createdByName?: string;
  conductedById?: string;
  conductedByName?: string;
  opnameDate: string;
  status: StockOpnameStatus;
  totalDifferenceQty?: number;
  totalLossAmount: number;
  notes?: string;
  approvedAt?: string;
  items: StockOpnameItem[];
}

export interface PurchaseOrderItem {
  id: string;
  poId?: string;
  materialId: string;
  materialName: string;
  unit: string;
  orderedQty: number;
  receivedQty?: number;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  outletId: string;
  outletName?: string;
  createdById: string;
  createdByName?: string;
  orderDate: string;
  deliveryDate?: string;
  status: PoStatus;
  totalAmount: number;
  notes?: string;
  receivedPhoto?: string;
  receivedNotes?: string;
  receivedAt?: string;
  items: PurchaseOrderItem[];
}

export interface Attendance {
  id: string;
  outletId: string;
  outletName?: string;
  userId: string;
  userName?: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  inLatitude: number;
  inLongitude: number;
  inDistanceM: number;
  inPhotoUrl?: string;
  outLatitude?: number;
  outLongitude?: number;
  outDistanceM?: number;
  outPhotoUrl?: string;
  status: AttendanceStatus;
  lateMinutes: number;
  workHours?: number;
  notes?: string;
}

export interface Promotion {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  code?: string;
  discountValue?: string;
  isActive: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  isPublished: boolean;
  publishedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}
