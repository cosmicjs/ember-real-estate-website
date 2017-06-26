import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    Ember.$.ajax('https://api.cosmicjs.com/v1/cosmic-real-estate/object/home-page', {
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
