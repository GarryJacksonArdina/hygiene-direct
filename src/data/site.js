// ---------------------------------------------------------------------------
// Site wide settings. Update these in one place.
// ---------------------------------------------------------------------------
export const site = {
  name: 'Hygiene Direct',
  tagline: 'Washroom consumables, delivered direct to your business.',
  parentCompany: 'Ardina Commercial Services',
  parentEntity: 'Ardina Group Pty Ltd',
  // TODO: confirm contact details before go live
  phone: '07 0000 0000',
  email: 'orders@hygienedirect.com.au',
  abn: '00 000 000 000',
  address: 'Brisbane, Queensland',

  // Delivery rules
  deliveryArea: 'Brisbane and South East Queensland',
  freeDeliveryThresholdExGst: 150, // orders at or above this (ex GST) ship free
  deliveryFeeExGst: 15,
  deliveryLeadTime: '1 to 3 business days',

  // Pricing display
  gstRate: 0.1,

  // Volume discounts apply per product line based on carton quantity
  volumeTiers: [
    { minCartons: 1, discount: 0, label: '1 to 4 cartons' },
    { minCartons: 5, discount: 0.05, label: '5 to 9 cartons' },
    { minCartons: 10, discount: 0.1, label: '10+ cartons' },
  ],
}
