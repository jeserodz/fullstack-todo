var PassportConfigurator =
  require('loopback-component-passport').PassportConfigurator;

module.exports = function(app) {
  var passportConfigurator = new PassportConfigurator(app);

  passportConfigurator.init();
  passportConfigurator.setupModels({
    userModel: app.models.user,
    userIdentityModel: app.models.userIdentity,
    userCredentialModel: app.models.UserCredential
  });
  passportConfigurator.configureProvider('facebook-login',
    require('../providers.json')['facebook-login']);
};