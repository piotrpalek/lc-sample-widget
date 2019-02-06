export default {
  trackingNumberPath: 'TrackResponse/Shipment/Package/TrackingNumber',
  statusPath: 'TrackResponse/Shipment/Package/Activity/Status/Description',
  servicePath: 'TrackResponse/Shipment/Service/Description',
  pickupDatePath: 'TrackResponse/Shipment/PickupDate',
  weightPath: 'TrackResponse/Shipment/Package/PackageWeight',
  shipmentTypePath: 'TrackResponse/Shipment/ShipmentType/Code',
  packagingUnitsPath: 'TrackResponse/Shipment/NumberOfPackagingUnit/Type/Description',

  get: (p, o) => p.split('/').reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o),

  getTrackingNumber(response) {
    return this.get(this.trackingNumberPath, response);
  },

  getStatus(response) {
    const status = this.get(this.statusPath, response);
    return status && status.toLowerCase();
  },

  getService(response) {
    return this.get(this.servicePath, response);
  },

  getPickupDate(response) {
    const dateString = this.get(this.pickupDatePath, response);
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}/${month}/${day}`;
  },

  getWeight(response) {
    const weightObject = this.get(this.weightPath, response);
    const unit = weightObject['UnitOfMeasurement']['Code'];
    const weight = weightObject['Weight'];
    return `${weight} ${unit}`.toLowerCase();
  },

  getShipmentType(response) {
    const shipmentTypes = {
      '01': 'Package',
      '02': 'Freight',
      '03': 'Mail Innovations'
    };

    const shipmentCode = this.get(this.shipmentTypePath, response);
    return shipmentTypes[shipmentCode];
  },

  getPackagingUnits(response) {
    return this.get(this.packagingUnitsPath, response);
  },

  getValues(response) {
    return [
      { label: 'Status', value: this.getStatus(response) },
      { label: 'Service', value: this.getService(response) },
      { label: 'Pickup date', value: this.getPickupDate(response) },
      { label: 'Weight', value: this.getWeight(response) },
      { label: 'Shipment type', value: this.getShipmentType(response) },
      { label: 'Number of packaging units', value: this.getPackagingUnits(response) },
    ];
  }
};