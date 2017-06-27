import Ember from 'ember';
import config from '../config/environment';

function getKeys() {
  var cosmicJs;
  if (config.environment === "production") {
    Ember.$.ajax('/api', {
      data: {format: 'json'},
      async: false,
      success: function(data) {
        cosmicJs = {
          bucket: data.bucket,
          writeKey: data.writeKey,
          readKey: data.readKey
        };
      }
    });
  } else {
    //config.environment === "development"
    cosmicJs = {
      bucket: 'cosmic-real-estate',
      writeKey: null,
      readKey: null
    };
  }
  return cosmicJs;
}

export default Ember.Route.extend({
  setupController(controller) {
    var cosmic = getKeys();
    var path = 'https://api.cosmicjs.com/v1/' + cosmic.bucket + '/object/home-page';
    var url = cosmic.readKey ? path + '?read_key=' + cosmic.readKey : path;
    Ember.$.ajax(url , {
      data: {format: 'json'},
      success: function(data) {
        controller.set('pageContent',data.object.content);
        controller.set('headerImage',data.object.metadata.header_image.url);
        controller.set('phone',data.object.metadata.phone);
        controller.set('address',data.object.metadata.address);
        controller.set('email',data.object.metadata.email);
      }
    });
  }
});
