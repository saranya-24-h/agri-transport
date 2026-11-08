// SAMPLE DATA for demo purposes. Chain names are real; branch areas and
// distances are illustrative, not live store data.
export const STORES = [
  { id: 1, name: 'DMart', type: 'Supermarket', area: 'Kukatpally', city: 'Hyderabad', distanceKm: 4 },
  { id: 2, name: 'Reliance Smart', type: 'Supermarket', area: 'Madhapur', city: 'Hyderabad', distanceKm: 7 },
  { id: 3, name: 'More Supermarket', type: 'Supermarket', area: 'Ameerpet', city: 'Hyderabad', distanceKm: 9 },
  { id: 4, name: "Spencer's", type: 'Retail', area: 'Banjara Hills', city: 'Hyderabad', distanceKm: 12 },
  { id: 5, name: 'Star Bazaar', type: 'Hypermarket', area: 'Gachibowli', city: 'Hyderabad', distanceKm: 14 },
  { id: 6, name: 'Vishal Mega Mart', type: 'Hypermarket', area: 'Dilsukhnagar', city: 'Hyderabad', distanceKm: 16 },
  { id: 7, name: 'Ratnadeep Supermarket', type: 'Supermarket', area: 'Secunderabad', city: 'Hyderabad', distanceKm: 18 },
  { id: 8, name: 'Heritage Fresh', type: 'Supermarket', area: 'Kondapur', city: 'Hyderabad', distanceKm: 20 }
];

export const storeLabel = (s) => `${s.name}, ${s.area}, ${s.city}`;