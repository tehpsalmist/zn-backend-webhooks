'use strict';

const $webhook = require('../index');

describe('module', function () {

	const request = {
		headers: {
			'x-zengine-webhook-key': 456
		},
		body: {
			webhook: {
				id: 123
			}
		}
	};

	const settings = {
		webhookId: 123,
		webhookKey: 456,
	};

	const multiConfigSettings = {
		crazyKeyString: {
			webhookId: 123,
			webhookKey: 456,
		},
		otherCrazyKeyString: {
			webhookId: 789,
			webhookKey: 101,
		}
	}

	const activity = {
		changes: {
			to: {
				folder: {
					id: 123
				}
			},
			from: {
				folder: {
					id: 456
				}
			}
		}
	};

	it('validates webhook secrets', function () {
		expect($webhook.validateSecret(settings, request)).to.be.true;
		expect($webhook.validateSecret(false, request)).to.be.false;
		expect($webhook.validateSecret({}, request)).to.be.false;
		expect($webhook.validateSecret({ webhookId: 125 }, request)).to.be.false;
		expect($webhook.validateSecret(multiConfigSettings.crazyKeyString, request)).to.be.true;
	});

	it('returns only valid configId from multi configs', function () {
		expect($webhook.getValidatedMultiConfigId(multiConfigSettings, request)).to.equal('crazyKeyString');

		const reqWithBadHeader = {
			headers: {
				'x-zengine-webhook-key': undefined
			},
			body: {
				webhook: {
					id: 123
				}
			}
		};

		expect($webhook.getValidatedMultiConfigId(multiConfigSettings, reqWithBadHeader)).to.equal(undefined);

		const reqWithBadId = {
			headers: {
				'x-zengine-webhook-key': 456
			},
			body: {
				webhook: {
					id: 987
				}
			}
		};

		expect($webhook.getValidatedMultiConfigId(multiConfigSettings, reqWithBadId)).to.equal(undefined);
	});

	it('checks whether a record moved into a folder', function () {
		expect($webhook.activityToFolder(activity, 123)).to.be.true;
		expect($webhook.activityToFolder(activity, 125)).to.be.false;
		expect($webhook.activityToFolder({}, 123)).to.be.false;
		expect($webhook.activityToFolder(false, 123)).to.be.false;
		expect($webhook.activityToFolder(activity)).to.be.false;
	});

	it('checks whether a record moved out of a folder', function () {
		expect($webhook.activityFromFolder(activity, 456)).to.be.true;
		expect($webhook.activityFromFolder(activity, 123)).to.be.false;
		expect($webhook.activityFromFolder({}, 456)).to.be.false;
		expect($webhook.activityFromFolder(false, 456)).to.be.false;
		expect($webhook.activityFromFolder(activity)).to.be.false;
	});

	it('allows customizing the id field', function () {
		const altSettings = {
			id: 123,
			key: 456
		};

		expect($webhook.validateSecret(altSettings, request)).to.be.false;

		$webhook.setIdField('id');
		expect($webhook.validateSecret(altSettings, request)).to.be.false;

		$webhook.setKeyField('key');
		expect($webhook.validateSecret(altSettings, request)).to.be.true;

		// Reset values.
		$webhook.setIdField('webhookId');
		$webhook.setKeyField('webhookKey');
	});

	it('supports scheduled webhooks', function () {
		const altRequest = {
			headers: {
				'x-zengine-webhook-key': 456
			},
			body: {
				scheduled: {
					id: 123
				}
			}
		};

		expect($webhook.validateSecret(settings, altRequest)).to.be.true;
		expect($webhook.validateSecret(false, altRequest)).to.be.false;
		expect($webhook.validateSecret({}, altRequest)).to.be.false;
		expect($webhook.validateSecret({ webhookId: 125 }, altRequest)).to.be.false;
	});

});
