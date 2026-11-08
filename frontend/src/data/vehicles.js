export const VEHICLES = [
  { name: 'Mini Truck', maxKg: 750 },
  { name: 'Pickup Truck', maxKg: 1500 },
  { name: 'Refrigerated Truck', maxKg: 3000 },
  { name: 'Tractor Trailer', maxKg: Infinity }
];

export const suitableVehicles = (quantityKg) =>
  VEHICLES.filter((v) => Number(quantityKg) <= v.maxKg);