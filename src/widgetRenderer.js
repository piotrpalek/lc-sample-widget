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
        id: `id-${trackingNumber}`,
        openApp: true
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

export default function(trackingNumberList) {
  if (trackingNumberList.length <= 0) {
    modifyComponentSection([
      {
        type: "title",
        data: {
          title: "No packages found"
        }
      }
    ]);
  } else {
    const components = trackingNumberList.map((trackingObject, index) => {
      const row = createRow(trackingObject);

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