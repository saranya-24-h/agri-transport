// Sample motorable road junctions for remote-farm first-mile drop-offs.
export const ROADS = [
  { id: 101, name: 'NH-65 Highway Junction', type: 'Motorable Road', area: 'Hayathnagar', city: 'Ranga Reddy', distanceKm: 4 },
  { id: 102, name: 'ORR Exit 12 Motorable Point', type: 'Main Road', area: 'Bongloor', city: 'Ranga Reddy', distanceKm: 6 },
  { id: 103, name: 'Sagar Highway Road Point', type: 'State Highway', area: 'Ibrahimpatnam', city: 'Ranga Reddy', distanceKm: 8 },
  { id: 104, name: 'NH-44 Main Road Junction', type: 'National Highway', area: 'Shadnagar', city: 'Ranga Reddy', distanceKm: 11 },
  { id: 105, name: 'Srisailam Highway Drop Point', type: 'State Highway', area: 'Maheshwaram', city: 'Ranga Reddy', distanceKm: 13 },
  { id: 106, name: 'NH-163 Warangal Road Junction', type: 'National Highway', area: 'Ghatkesar', city: 'Medchal', distanceKm: 15 },
  { id: 107, name: 'Vikarabad Main Road Point', type: 'State Highway', area: 'Moinabad', city: 'Ranga Reddy', distanceKm: 17 },
  { id: 108, name: 'Chevella Road Collection Point', type: 'Motorable Road', area: 'Shankarpally', city: 'Ranga Reddy', distanceKm: 19 }
];

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