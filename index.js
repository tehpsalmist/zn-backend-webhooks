'use strict';

var idField = 'webhookId';
var keyField = 'webhookKey';

/**
 * Sets the name of the field in settings where the webhook id will be stored.
 *
 * @param {string} fieldName
 */
module.exports.setIdField = function (fieldName) {
	idField = fieldName;
};

/**
 * Sets the name of the field in settings where the webhook secret key will be stored.
 *
 * @param {string} fieldName
 */
module.exports.setKeyField = function (fieldName) {
	keyField = fieldName;
};

/**
 * Validates whether a webhook secret matches the saved one.
 *
 * @param {Object} settings Saved settings
 * @param {Object} request The HTTP Request
 *
 * @return {boolean}
 */
module.exports.validateSecret = function (settings, request) {
	var webhookKey = request.headers['x-zengine-webhook-key'];
	var webhookId = 'scheduled' in request.body ? request.body.scheduled.id : request.body.webhook.id;

	if (idField in settings && keyField in settings) {
		return settings[idField] === webhookId && settings[keyField] === webhookKey;
	}

	return false;
};

/**
 * Returns whether a record went into a folder, optionally specifying from where it came from.
 *
 * @param {Object} activity
 * @param {number} toFolderId Destination folder id.
 * @param {number} [fromFolderId] Optional. Source folder id.
 *
 * @return {boolean}
 */
module.exports.activityFolders = function (activity, toFolderId, fromFolderId) {
	var activityChanges = activity.changes || {};

	if (activityChanges.to && activityChanges.to.folder && activityChanges.to.folder.id &&
		activityChanges.to.folder.id === toFolderId) {

		if (!fromFolderId) {
			return true;
		}

		if (activityChanges.from && activityChanges.from.folder && activityChanges.from.folder.id &&
			activityChanges.from.folder.id === fromFolderId) {
			return true;
		}
	}

	return false;
};
