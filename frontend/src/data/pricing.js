// Sample rates for the demo. Must match the VEHICLES list in backend/routes/shipments.js
export const RATES = {
  'Mini Truck': { base: 300, perKg: 4 },
  'Pickup Truck': { base: 500, perKg: 3.5 },
  'Refrigerated Truck': { base: 1000, perKg: 5 },
  'Tractor Trailer': { base: 1500, perKg: 2.5 },
};

export function estimatePrice(vehicleName, quantityKg) {
  const r = RATES[vehicleName];
  if (!r) return null;
  return Math.round(r.base + r.perKg * quantityKg);
}

export function formatPrice(p) {
  if (p === null || p === undefined) return '-';
  return '₹' + Number(p).toLocaleString('en-IN');
}