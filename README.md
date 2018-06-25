# Backend Webhooks

> Helper module for working with Webhooks in Zengine backend Plugins.

## Installation

```bash
npm i @zenginehq/backend-webhooks --save
```

## Usage

```js
var $webhook = require('@zenginehq/backend-webhooks');
var $firebase = require('@zenginehq/backend-firebase');
var $api = require('@zenginehq/backend-http');

// Load settings from firebase.
$firebase.load(workspaceId).then(function (settings) {
  if (!$webhook.validateSecret(settings, eventData.request)) {
    return eventData.response.status(403).send('Invalid Webhook Key');
  }

  // Load activity.
  return $api.getActivity(activity.id).then(function (fullActivity) {
    if ($webhook.activityFolders(fullActivity, settings.submittedFolder)) {
      // Do something.
}
  });
});
```

## Methods

#### validateSecret(settings, request)

Returns whether the webhook id and secret match what's stored in settings.

Out of the box expects the id to be stored in `settings.webhookId` and the key in `settings.webhookKey`.

You can customize this by calling `$webhook.setIdField('myIdField)` and `$webhook.setKeyField('myKeyField')`. 

#### activityFolders(activity, toFolder, \[fromFolder\])

Returns whether the given activity is a move to the specified folder and optionally filter by whether it came from a certain folder too.
