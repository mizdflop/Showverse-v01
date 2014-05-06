Template.test_tumblr.rendered= function() {
	OAuth.popup('tumblr', function(err, result) { // or OAuth.callback
  // handle error with err
  // call the API with the jQuery's $.ajax style:
  result.get('/me').done(function(data) {
    // data is the API call's response. e.g. data.name for your facebook's fullname.
  });
});
};