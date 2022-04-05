const connectorRedirect = {
  /*
   This is a simple string to name your connector.
   If the service your connector is feature-rich to the extent
   that you might implement multiple connectors to avoid
   crowding a single connector with capabilities that are diverse,
   try naming your connector specifically with what you are planning to do.
   For example, take Amazon, you wouldn't write an all-encompassing Amazon 
   connector. Rather, you might have a set of connectors like:
     - Amazon AWS S3 Connector
     - Amazon AWS SES Connector
     - Amazon IdP
     - Aamzon Selling Partner
     - Amazon Cognito
     - ...
   it is very common for first time implementations to be named too broadly.
   It's harder to revisit once your connector is published and used in flows.
   Think about this now. 
   */
  name: 'Redirect Connector',

  /*
    A simple description to briefly explain what the connector does.
    This is displayed in the admin portal -> connections -> New connection
    which does not offer a lot of real estate, keep it brief and to the point.
   */
  description: 'This is an example of a connector that redirects to a 3rd party service and returns back',

  /*
   The connector id must be gloablly unique.
   It's a good idea to keep this consistent with your connector name
   Note that it is crucial that the connectorId value match the name of
   the const defined at the top of this file
   */
  connectorId: 'connectorRedirect',

  /*
    This is the ID of the redis service to and from which events will be
    exchanged with the orchestration engine. It is critical that this be
    unique to your connector to avoid messaging issues.
   */
  serviceName: 'connector-redirect',

  /*
   the connector type
   */
  connectorType: 'verify',

  /*
   A connector can be registered in one or more categories.
   Think of them as advertising tags, the categories will allow
   your connector to be featured along with other connectors sharing
   the same categories.
   */
  connectorCategories: [{name: 'Verify',value: 'verify'}],

  /*
    This should be a longer description of your connector and its capabilities
    It is displayed in Connectors -> New connector as a description text field
    and has more real estate to go into more details about the specifics of
    your connector
   */
  connectorDetails:
    'Fill in later',

  /*
    This provides an image for the connector that is higher resolution than those included in the repo
    It is displayed in Connectors -> New connector browser and will have more real estate for rendering
    This property needs to include the base64-encoded PNG contents of the image as demonstrated below
   */
  detailImage: null,
  /*
    Some metada for the connector that will allow to render it nicely on the canvas as
    it gets used in flows, including colors and a logo
   */
  metadata: {
    colors: {
      canvas: '#f5f9fa',
      dark: '#eb1c24',
    },
    logos: {
      /*
        the logo file name must match what is being provided in assets
        or use the pingIndentity.svg logo
       */
      canvas: {
        imageFileName: 'pingIdentity.svg',
      },
    },
  },

  /*
    This describes sections in the connector UI.
    When users make use of the connector, the connector UI in flow studio will render these sections.
    Each section may be used to expose different properties that would then be leveraged by connector
    capabilities to perform the necessary processing to deliver the capability.

    You may leave sections as is for now.
    It will come in handy especially if you provide advanced capabilities in more sophisitcated connectors.
   */
  sections: [{ name: 'General', value: 'general', default: true }],
  flowSections: [{ name: 'General', value: 'general' }],

  /*
    The 'properties' object defines all the properties later needed by your connector to implement 
    capabilities. Any bit of data that is going to either be configured on the connector, the connection
    or in the flow is going to have to be declared here.
   */
  properties: {

    authType: {
      value: 'customAuth',
    },

    showPoweredBy: {
      preferredControlType: 'toggleSwitch',
      value: false,
    },
    skipButtonPress: {
        preferredControlType: 'toggleSwitch',
        value: true,
    },  

    button: {
      displayName: 'Redirect',
      logo: '',
      showLogo: true,
      preferredControlType: 'button',
      css: {
          backgroundColor: '#121212',
          color: '#ffffff',
      },
      onClick: {location: '{{authorizationUrl}}'},
    },    

    url: {
      displayName: 'URL',
      preferredControlType: 'textField',
      info: 'The URL of the 3rd party service',
    },
    customAuth: {
      properties: {
        skRedirectUri: {
            displayName: 'Redirect URL',
            preferredControlType: 'textField',
            disabled: true,
            initializeValue: 'SINGULARKEY_REDIRECT_URI',
            copyToClip: true
        },
        secret: {
          displayName: 'JWT Secret',
          preferredControlType: 'textField',
          info: 'Optional secret for JWT Response Validation',
          hashedVisibility: true,
        }    
      }
    },


  
    /*
     Here we define the 'body' property, which is later declared as something that is
    assigned a value in the flow
     */
  },
  /*
   the 'capabilities' object enumerates the capabilities that the orchestration
   engine can call and that the UI needs to render configuration panels for
   */
  capabilities: {
    /*
      the 'postHTTP' capability is the only capability implemented in this example connector.
      Note that the name must match the handle_capability_< capabilty_name_here > in index.js
     */
    initializeAuthorizationRequest: {
      type: 'action',
      /* 
       The name of the capability as displayed in the connector UI
       */
      title: 'Redirect To',

      // Subtext for the title of the capability
      subTitle: 'Redirect user to URL',
      disableCreateUser: true,

      /* 
        respondToUser is toggled if the capability needs to interact with the user *within* the capability
        This is different from displaying an HTML form to collect user input using the built-in HTTP connector.
        For example, if a connector had to display a set of images to the user and have them pick 2 that matched
        for the capabilty to successfully complete, you would set responseToUser to true and configure a userView
        to display the images
        */
      respondToUser: true,

      /*
       this is an array to pass global variables in to the capability
       some example values you can pass in as inputs:
        - global.error
        - global.ip
        - global.userInfo
        - global.saml

       */
      inputs: ['global.ip'],

      /*
       userViews is an array of UI frames presented to the user within the arc of the 
       life of the capability. This is an advanced topic left for a more advanced template
       */
      userViews: [
        {
            screenTemplateName: 'LoginScreen1',
            items: [
                {
                    propertyName: 'button',
                    fields: {},
                },
                { propertyName: 'showPoweredBy' },
                { propertyName: 'skipButtonPress' },
            ],
        },
      ],

      /*
       the 'flowConfigView' object hold an 'items' array of the properties (defined earlier) 
       to display in the UI panel specific to this capability
       */
      flowConfigView: {
        items: [
            {
                propertyName: 'url'
            }
        ],
      },
      /*
       the 'payloadInputSchema' object defines the input schema for this capability
       You will need to edit only the innermost level of this object to describe
       how the platform must marshall data provided as valid input
       */
      payloadInputSchema: {
        default: {
          type: 'object',
          properties: {
            properties: {
              type: 'object',
              properties: {
                /*
                 Add your input properties here, at this level
                 */
                url: {
                  /*
                   Make sure you provide the right native javascript 
                   for runtime validation
                   Valid types are:
                     - array
                     - object
                     - string
                     - boolean
                     - number
                     - bigint
                   */
                  type: 'string',
                  description: 'The redirect destination',
                }
              },
              /*
               the 'required' array lists the properties that are required in the validation
               of the input data to the capability
               */ 
              required: ['url'],
            }
          },
          /* 
           example of a valid input data
           */
          example: {
            properties: {
              url: 'https://example.com'
            }
          }
        }
      },
      /*
      the output schema for data validation
       */
      localOutputSchema: {
        output: {
          type: 'object',
          properties: {
            rawResponse: {
              type: 'object',
            }
          }
        }
      }
    }
  },
  /*
    the 'accountConfigView' object stores an 'items' array of the properties 
    (as defined earlier) to display at the connection level.
    In other words, these are the fields that are share by every flow
    using the connection in the company.
   */
  accountConfigView: {
    items: [      
      {
        propertyName: 'customAuth',
        items: [
          { propertyName: 'skRedirectUri'},
          { propertyName: 'secret'}
        ],
      },
    ],
  }
};

module.exports = connectorRedirect;
