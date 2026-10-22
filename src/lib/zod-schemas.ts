import { z } from "zod";

// 1. Outlet & Cabang
export const outletSchema = z.object({
  code: z.string().min(2).max(10).toUpperCase(),
  name: z.string().min(3).max(100),
  address: z.string().min(5),
  city: z.string().min(2),
  phone: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().int().min(20).max(500).default(100),
  openingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  closingTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .optional(),
  monthlyTarget: z.number().nonnegative().optional(),
  isActive: z.boolean().default(true),
});

// 2. Transaksi POS Kasir
export const posOrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  unitPrice: z.number().int().positive(),
  quantity: z.number().int().positive(),
  notes: z.string().max(200).optional(),
});

export const createPosOrderSchema = z.object({
  outletId: z.string(),
  shiftId: z.string().optional(),
  orderType: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY_ONLINE"]),
  customerName: z.string().max(100).default("Pelanggan D'Besto"),
  customerPhone: z.string().optional(),
  items: z.array(posOrderItemSchema).min(1, "Minimal 1 menu dipilih"),
  discountAmount: z.number().int().nonnegative().default(0),
  taxAmount: z.number().int().nonnegative().default(0),
  paidAmount: z.number().int().positive("Nominal bayar wajib diisi"),
  paymentMethod: z.enum(["CASH", "QRIS", "DEBIT_CARD", "CREDIT_CARD", "TRANSFER"]),
  notes: z.string().max(300).optional(),
});

// 3. Stock Opname
export const stockOpnameItemInputSchema = z.object({
  materialId: z.string(),
  systemStock: z.number().nonnegative(),
  physicalStock: z.number().nonnegative(),
  reason: z.string().max(255).optional(),
});

export const submitStockOpnameSchema = z.object({
  outletId: z.string(),
  notes: z.string().max(500).optional(),
  items: z.array(stockOpnameItemInputSchema).min(1, "Minimal 1 bahan baku dihitung"),
});

// 4. PO Bahan Baku
export const purchaseOrderItemInputSchema = z.object({
  materialId: z.string(),
  orderedQty: z.number().positive("Jumlah pesanan harus lebih dari 0"),
});

export const createPurchaseOrderSchema = z.object({
  outletId: z.string(),
  deliveryDate: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z.array(purchaseOrderItemInputSchema).min(1, "Minimal 1 item bahan baku"),
});

export const receivePurchaseOrderSchema = z.object({
  poId: z.string(),
  receivedPhoto: z.string().url("Foto surat jalan wajib valid"),
  receivedNotes: z.string().max(500).optional(),
  receivedItems: z.array(
    z.object({
      materialId: z.string(),
      receivedQty: z.number().nonnegative(),
    })
  ),
});

// 5. Absensi Geofence
export const clockInSchema = z.object({
  outletId: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  photoUrl: z.string().optional(),
});
