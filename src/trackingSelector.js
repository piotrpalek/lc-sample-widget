export default {
  trackingNumber: ['TrackResponse', 'Shipment', 'Package', 'TrackingNumber'],
  status: ['TrackResponse', 'Shipment', 'Package', 'Activity', 'Status', 'Description'],

  get: (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o),

  getTrackingNumber(response) {
    return this.get(this.trackingNumber, response);
  },

  getStatus(response) {
    return this.get(this.status, response);
  }
};