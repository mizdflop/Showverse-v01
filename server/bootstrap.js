// if the database is empty on server start, create some sample data.
// Lists -- {name: String}
 
 Cloudinary.config({
    cloud_name: 'showverse-meteor-com',
    api_key: '429115372231935',
    api_secret: '2KqWJMhBvfhmTZXTZquj2pck88E'
});

Meteor.methods({
    save_url:function(response){
    	//console.log(response);
        //console.log('Add '+ response.upload_data.url + ' to the id of '+ response.public_id);
        console.log(this.userId);
        Meteor.users.update({_id: this.userId}, {$push: {profile: {picture: response.upload_data.url}}}
        	, function(err, suc){
        		console.log(err);
        	}
        );
    }
});


Meteor.startup(function () {
	ServiceConfiguration.configurations.remove({
 		service: "facebook"
 	});
	
	if(process.env.ROOT_URL=="http://localhost:3000/"){
		ServiceConfiguration.configurations.insert({
		  service: "facebook",
		  appId: "537447533036099",
		  secret: "8d7eaeb0b0deb75f38ea4f9dff47d876"
		});
	} else {
		ServiceConfiguration.configurations.insert({
		  service: "facebook",
		  appId: "711108058939465",
		  secret: "a002f7cb19866ac6b5a650f53b3ccd42"
		});		
	}
	if (Episodes.find().count() === 0){
		var data = 
		[
			["1", "0", "There are currently no comments for this thread"],
		];
	
		var timestamp = (new Date()).getTime();
		for (var i = 0; i < data.length; i++) {
			var comment_id = Comments.insert({ comment_id: data[i][0],
												userid: data[i][1],
												timestamp: timestamp,
												commentText: data[i][2]
			});
		}	
	}	
});


Accounts.onCreateUser(function(options, user) {
    if (options.profile) {
        options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=small";
        user.profile = options.profile;
    }
    else{
   // 	options.profile.picure = "/img/placeholder.png";
    //	options.profile.name = "nameholer";
    }
    return user;
});