const sdk = require('@skinternal/skconnectorsdk');
const { serr, compileErr, logger } = require('@skinternal/skconnectorsdk');
const { get } = require('lodash');
const connectorManifest = require('./manifests/manifest');

const redisList = 'connectorRedirect';

/**
 * Performs the necessary processing to initialize the connector
 *
 */
const initialize = async () => {
  try {
    // Update Manifest
    if (get(process, 'argv[2]', null) === 'mode=update-manifest') {
      await sdk.manifestDeploy(connectorManifest);
      return;
    }
    // The real thing of note here: registers the connector with the SDK and subscribes to REDIS changes
    const response = await sdk.initalize(redisList);
    logger.info('Started connector-redirect:', response);
  } catch (err) {
    logger.error('Error starting connector-redirect');
    logger.error(err);
  }
};

const handle_capability_initializeAuthorizationRequest_initialize = async ({ properties }) => {
  logger.info('overriding handle_capability_initializeAuthorizationRequest');
  try {
    let { url } = properties;

    // Add https:// if missing from url property
    if (!/^httpss?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    
    return {
      location: url
    };
  } catch (err) {
    if(err.response) {
      throw new serr('initializeAuthorizationRequestResponseError', { 
        message: 'initializeAuthorizationRequest response error',
        httpResponseCode: err.response.status,          
        output: {
            rawResponse: err.response.data,
            statusCode: err.response.status,
            headers: err.response.headers
        },
        details: {
            rawResponse: err.response.data,
            statusCode: err.response.status,
            headers: err.response.headers
        },
      });
    }
    // If we get here something went wrong not related to the API request
    logger.error(`initializeAuthorizationRequest error: ${err}`);
    throw new serr('initializeAuthorizationRequestError', {
      message: `initializeAuthorizationRequest error`,
      output: {
        errorMessage: `${err}`,
      },
      details: {
        errorMessage: `${err}`,
      },
    });
  }
};

const handle_capability_initializeAuthorizationRequest_callbackFromProvider = async ({ parameters, properties }) => {
  logger.debug('overriding handle_capability_initializeAuthorizationRequest_callbackFromProvider');
  try {
    console.log('initializeAuthorizationRequest success');
    console.log(parameters);
    console.log(properties)

    return {
      output: {
        rawResponse: 'success'
      },
      eventName: 'continue',
    };

  } catch (err) {
    if (err && err.name && err.name === "JsonWebTokenError") {
      throw new serr("initializeAuthorizationRequest_callbackFromProviderError", { message: "Invalid redirect URL" })
    } else {
      throw compileErr('initializeAuthorizationRequest_callbackFromProviderError', err);
    }
  }
};

sdk.methods.handle_capability_initializeAuthorizationRequest_initialize = handle_capability_initializeAuthorizationRequest_initialize;
sdk.methods.handle_capability_initializeAuthorizationRequest_callbackFromProvider = handle_capability_initializeAuthorizationRequest_callbackFromProvider;

initialize();

module.exports = {
  handle_capability_initializeAuthorizationRequest_initialize,
  handle_capability_initializeAuthorizationRequest_callbackFromProvider
};
