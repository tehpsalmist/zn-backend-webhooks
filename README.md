# Backend Webhooks

> Helper module for working with Webhooks in Zengine backend Plugins.

[![Coverage Status](https://coveralls.io/repos/github/ZengineHQ/zn-backend-webhooks/badge.svg?branch=master)](https://coveralls.io/github/ZengineHQ/zn-backend-webhooks?branch=master)   [![Build Status](https://circleci.com/gh/ZengineHQ/zn-backend-webhooks/tree/master.svg?style=shield)](https://circleci.com/gh/ZengineHQ/zn-backend-webhooks/tree/master)

## Installation

```bash
npm i @zenginehq/backend-webhooks --save
```

## Usage

```js
var $webhook = require('@zenginehq/backend-webhooks');
var $firebase = require('@zenginehq/backend-firebase');
var $api = require('@zenginehq/backend-http');

var workspace; // from eventData
var activity; // from eventData

// Load settings from firebase.
$firebase.load(workspaceId).then(function (settings) {
  if (!$webhook.validateSecret(settings, eventData.request)) {
    return eventData.response.status(403).send('Invalid Webhook Key');
  }

  // Load activity.
  return $api.getActivity(activity.id).then(function (fullActivity) {
    if ($webhook.activityToFolder(fullActivity, settings.submittedFolder)) {
      // Do something.
    }
    
    // You can also make sure the activity didn't come from a specific folder.
    if (!$webhook.activityFromFolder(fullActivity, settings.submittedFolder)) {
    	// Do something else.
    }
  });
});
```

## Methods

#### validateSecret(settings, request)

Returns whether the webhook id and secret match what's stored in settings.

Out of the box expects the id to be stored in `settings.webhookId` and the key in `settings.webhookKey`.

You can customize this by calling `$webhook.setIdField('myIdField)` and `$webhook.setKeyField('myKeyField')`. 

#### activityToFolder(activity, toFolder)

Returns whether the given activity is a move to the specified folder (ie: record moved from a folder this this one) 

#### activityFromFolder(activity, toFolder)

Returns whether the given activity is a move from the specified folder (ie: record moved from this folder this another one)

## API Docs

[Full documentation](https://zenginehq.github.io/zn-backend-webhooks)
