function toCamelCase(str) {
  str = str.replace(/[-_\s]+(.)?/g, (match, ch) => // eslint-disable-line no-param-reassign
    (ch ? ch.toUpperCase() : ''),
  );

  // Ensure first chat is always lowercase
  return str.substr(0, 1).toLowerCase() + str.substr(1);
};

export default {
  packagePath: 'TrackResponse/Shipment/Package',
  packageTrackingNumberPath: 'TrackingNumber',
  packageActivityPath: 'Activity',
  packageWeightPath: 'PackageWeight',

  servicePath: 'TrackResponse/Shipment/Service/Description',
  pickupDatePath: 'TrackResponse/Shipment/PickupDate',
  shipmentTypePath: 'TrackResponse/Shipment/ShipmentType/Code',
  shipmentStatusPath: 'TrackResponse/Shipment/CurrentStatus/Description',
  packagingUnitsPath: 'TrackResponse/Shipment/NumberOfPackagingUnit/Type/Description',
  errorDescriptionPath: 'Fault/detail/Errors/ErrorDetail/PrimaryErrorCode/Description',
  errorCodePath: 'Fault/detail/Errors/ErrorDetail/PrimaryErrorCode/Code',

  get: (path, object) => {
    const pathList = path.split('/');
    return pathList.reduce((accumulator, partOfPath) => {
      if (accumulator && accumulator[partOfPath]) {
        return accumulator[partOfPath];
      } else { 
        return null;
      }
    }, object);
  },

  getPackages(response) {
    const rawPackageData = this.get(this.packagePath, response);
    if (Array.isArray(rawPackageData)) {
      return rawPackageData;
    } else {
      return [rawPackageData];
    }
  },

  getPackageTrackingNumber(rawPackageData) {
    return this.get(this.packageTrackingNumberPath, rawPackageData);
  },

  getPackageStatus(rawPackageData) {
    const activity = this.get(this.packageActivityPath, rawPackageData);
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

  getPackageWeight(rawPackageData) {
    const weightObject = this.get(this.packageWeightPath, rawPackageData);
    if (!weightObject) {
      return '';
    }

    const unit = weightObject['UnitOfMeasurement']['Code'];
    const weight = weightObject['Weight'];
    return `${weight} ${unit}`.toLowerCase();
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

  getShipmentType(response) {
    const shipmentTypes = {
      '01': 'Package',
      '02': 'Freight',
      '03': 'Mail Innovations'
    };

    const shipmentCode = this.get(this.shipmentTypePath, response);
    return shipmentTypes[shipmentCode];
  },

  getShipmentStatus(response) {
    return this.get(this.shipmentStatusPath, response);
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

  getCommonValues(response) {
    return [
      { type: 'service', label: 'Service', value: this.getService(response) },
      { type: 'pickup-date', label: 'Pickup date', value: this.getPickupDate(response) },
      { type: 'shipment-type', label: 'Shipment type', value: this.getShipmentType(response) },
      { type: 'packaging-units', label: 'Number of packaging units', value: this.getPackagingUnits(response) },
      { type: 'error-description', label: 'Error Description', value: this.getErrorDescription(response) },
      { type: 'error-code', label: 'Error Code', value: this.getErrorCode(response) },
    ];
  },

  getPackageValues(rawPackageData) {
    return [
      { type: 'tracking-number', value: this.getPackageTrackingNumber(rawPackageData) },
      { type: 'status', label: 'Status', value: this.getPackageStatus(rawPackageData) },
      { type: 'weight', label: 'Weight', value: this.getPackageWeight(rawPackageData) },
    ];
  },

  getValueMap(values) {
    return values.reduce((acc, value) => {
      acc[toCamelCase(value.type)] = value;
      return acc;
    }, {});
  },

  getNormalizedResponse(trackingNumber, response) {
    const packages = this.getPackages(response);
    return packages.map((rawPackageData) => {
      const commonData = this.getValueMap(this.getCommonValues(response));
      const normalizedPackageData = this.getValueMap(this.getPackageValues(rawPackageData));
      
      const keyValueMap = {
        ...commonData,
        ...normalizedPackageData
      };

      // error responses don't have tracking numbers and they're important
      if (!keyValueMap.trackingNumber.value) {
        keyValueMap.trackingNumber.value = trackingNumber;
      }

      if (!keyValueMap.status.value) {
        keyValueMap.status = { type: 'status', label: 'Status', value: this.getShipmentStatus(response) };
      }

      return keyValueMap;
    });
  }
};