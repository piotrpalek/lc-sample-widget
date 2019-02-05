export default {
  trackingNumberPath: ['TrackResponse', 'Shipment', 'Package', 'TrackingNumber'],
  statusPath: ['TrackResponse', 'Shipment', 'Package', 'Activity', 'Status', 'Description'],

  get: (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o),

  getTrackingNumber(response) {
    return this.get(this.trackingNumberPath, response);
  },

  getStatus(response) {
    return this.get(this.statusPath, response);
  }
};