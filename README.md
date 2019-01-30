# Agent App - Sample

## Usage

1. Log into the Agent App using your license.
2. Go to [Developer Console](https://developers.livechatinc.com/console/apps) (or [Developers Labs Console](https://developers.labs.livechatinc.com/console/apps)) and create a new `Agent App Widget` app.
3. Go to the `Building blocks` section of the newly created app and create a new Agent App widget. The `Widget source URL` can be either `https://livechat.github.io/sample-widget-integration/` or `https://localhost:4000`, if you want to use the local version of the widget. Set the `Widget placement` to `Chat details`. Provide the initial state JSON, eg.:

```json
{
  "customerDetailsSections": [
    {
      "title": "Widget Integration",
      "components": []
    }
  ]
}
```

4. Go to `Private installation` and click the `Install app` button.
5. Your widget should be now visible in the right sidebar of the Agent App chat view. Beware - if you did configure set any icon for your widget, it may appear that it is not there. Just hover over the widget icon bar and check, if there's any clickable whitespace. You can set the icon in Developmers Console.

## Development

Install the dependencies...

```bash
cd sample-app
npm install
```

...then start webpack:

```bash
npm run dev
```

Navigate to [localhost:8080](http://localhost:8080). You should see your app running. Edit a component file in `src`, save it, and the page should reload with your changes.
