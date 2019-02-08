function toCamelCase(str) {
  str = str.replace(/[-_\s]+(.)?/g, (match, ch) => // eslint-disable-line no-param-reassign
    (ch ? ch.toUpperCase() : ''),
  );

  // Ensure first chat is always lowercase
  return str.substr(0, 1).toLowerCase() + str.substr(1);
};

export default {
  trackingNumberPath: 'TrackResponse/Shipment/Package/TrackingNumber',
  activityPath: 'TrackResponse/Shipment/Package/Activity',
  servicePath: 'TrackResponse/Shipment/Service/Description',
  pickupDatePath: 'TrackResponse/Shipment/PickupDate',
  weightPath: 'TrackResponse/Shipment/Package/PackageWeight',
  shipmentTypePath: 'TrackResponse/Shipment/ShipmentType/Code',
  packagingUnitsPath: 'TrackResponse/Shipment/NumberOfPackagingUnit/Type/Description',
  errorDescriptionPath: 'Fault/detail/Errors/ErrorDetail/PrimaryErrorCode/Description',
  errorCodePath: 'Fault/detail/Errors/ErrorDetail/PrimaryErrorCode/Code',

  get: (p, o) => p.split('/').reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o),

  getTrackingNumber(response) {
    return this.get(this.trackingNumberPath, response);
  },

  getStatus(response) {
    const activity = this.get(this.activityPath, response);
    const activityToStatusPath = 'Status/Description';
    let activityObject;

    if (Array.isArray(activity)) {
      activityObject = activity.sort((a, b) => {
        return b['Date'] - a['Date'] || b['Time'] - a['Time'];
      })[0];
    } else {
      activityObject = activity;
    }

    const status = this.get(activityToStatusPath, activityObject);
    return status && status.toLowerCase();
  },

  getService(response) {
    return this.get(this.servicePath, response);
  },

  getPickupDate(response) {
    const dateString = this.get(this.pickupDatePath, response);
    if (!dateString) {
      return '';
    }

    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}/${month}/${day}`;
  },

  getWeight(response) {
    const weightObject = this.get(this.weightPath, response);
    if (!weightObject) {
      return '';
    }

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

  getErrorDescription(response) {
    return this.get(this.errorDescriptionPath, response);
  },

  getErrorCode(response) {
    return this.get(this.errorCodePath, response);
  },

  getValues(response) {
    return [
      { type: 'status', label: 'Status', value: this.getStatus(response) },
      { type: 'service', label: 'Service', value: this.getService(response) },
      { type: 'pickup-date', label: 'Pickup date', value: this.getPickupDate(response) },
      { type: 'weight', label: 'Weight', value: this.getWeight(response) },
      { type: 'shipment-type', label: 'Shipment type', value: this.getShipmentType(response) },
      { type: 'packaging-units', label: 'Number of packaging units', value: this.getPackagingUnits(response) },
      { type: 'error-description', label: 'Error Description', value: this.getErrorDescription(response) },
      { type: 'error-code', label: 'Error Code', value: this.getErrorCode(response) },
    ];
  },

  getValueMap(response) {
    return this.getValues(response).reduce((acc, value) => {
      acc[toCamelCase(value.type)] = value;
      return acc;
    }, {});
  }
};