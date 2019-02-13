import Livechat from "@livechat/agent-app-widget-sdk";
import { capitalize } from './helpers';

function createRow({ trackingNumber, status, source }) {
  const sendStatusButton = {
    type: "button",
    data: {
      label: "Send status",
      id: `sendstatus-${trackingNumber}`,
      openApp: false
    }
  };

  return [].concat(
    [
      {
        type: "label_value",
        data: {
          label: "Tracking #: ",
          value: trackingNumber || 'Error (tracking number)'
        }
      },
      {
        type: "label_value",
        data: {
          label: "Status: ",
          value: status && capitalize(status) || 'Error (status)'
        }
      }
    ],
    source === 'chats' ? sendStatusButton : [],
    {
      type: "button",
      data: {
        label: "More",
        id: `more-${trackingNumber}`,
        openApp: true
      }
    }
  );
}

function modifyComponentSection(componentList = []) {
  Livechat.modifyCustomerDetailsSection({
    title: "UPS Delivery Status",
    components: componentList
  });
}

export default function(normalizedTrackingData, source) {
  if (normalizedTrackingData.length <= 0) {
    modifyComponentSection([
      {
        type: "title",
        data: {
          title: "No packages found"
        }
      }
    ]);
  } else {
    const components = normalizedTrackingData.map(({ trackingNumber, status, errorDescription }, index) => {
      let statusDescription = status.value;
      if (errorDescription.value) {
        statusDescription = errorDescription.value;
      }

      const row = createRow({ trackingNumber: trackingNumber.value, status: statusDescription, source });

      if (index <= 0) {
        return row;
      } else {
        return [{ type: "line" }, ...row];
      }
    });
    const flattenedComponentsList = [].concat(...components);
    modifyComponentSection(flattenedComponentsList);
  }
}