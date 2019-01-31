import Livechat from "@livechat/agent-app-widget-sdk";

function createRow({ trackingNumber, status }) {
  return [
    {
      type: "label_value",
      data: {
        label: "Tracking #: ",
        value: trackingNumber
      }
    },
    {
      type: "label_value",
      data: {
        label: "Status: ",
        value: status
      }
    },
    {
      type: "button",
      data: {
        label: "Show more details",
        id: `id-${trackingNumber}`
      }
    }
  ];
}

function modifyComponentSection(componentList = []) {
  Livechat.modifyCustomerDetailsSection({
    title: "UPS Packages Status",
    components: componentList
  });
}

export default function(trackingNumberKeys, trackingNumbers) {
  if (trackingNumberKeys.length === 0) {
    modifyComponentSection([
      {
        type: "title",
        data: {
          title: "No packages found"
        }
      }
    ]);
  } else if (trackingNumberKeys.length > 0) {
    const components = trackingNumberKeys.map((key, index) => {
      const row = createRow(trackingNumbers[key]);

      if (index <= 0) {
        return row;
      } else {
        return [{ type: "line" }, ...row];
      }
    });
    const flatComponents = [].concat(...components);
    modifyComponentSection(flatComponents);
  }
}