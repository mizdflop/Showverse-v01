Router.configure({
  layoutTemplate: 'layout' 
});



//Router.map(function () {
//  this.route('homepage', {
//    path: '/', // match the root path
//    template: "homepage",
//  });
//});
Router.map(function () {
  this.route('addphoto', {
    path: '/addphoto', // match the root path
    template: "addphoto",
    onBeforeAction: function(){
      if(Meteor.user().profile!==undefined){
        Router.go("/thanksupload");
      }
    },
  });
});
Router.map(function () {
  this.route('thanksupload', {
    path: '/thanksupload', // match the root path
    template: "thanksupload"
  });
});

Router.map(function () {
  this.route('select_episode', {
    path: '/select_episode/group/:groupName', 
    template: "select_episode",
    onRun: function() {
      if(!Meteor.userId()){
        Router.go("/");
      }
    },
    onBeforeAction: function(){
        this.render('loading');
    },
    waitOn: function () {
          var groupName = this.params.groupName;
          Session.set("groupName", groupName);
          var seriesTitle = this.params.seriesTitle;
          return [Meteor.subscribe('groups', groupName), 
                  Meteor.subscribe('admin_series'), 
                  Meteor.subscribe('admin_episodes'),
                  Meteor.subscribe('admin_comments')
                ]
          ;
     },
    action: function () {
      if (this.ready()){
         this.render();
      }else{
        this.render('loading');
      } 

    },
     onAfterAction: function(){
        Comments.aggregate(  {$group: {_id: { seriesTitle: '$seriesTitle', idString: '$idString'}, 
           posts: {$sum: 1}}}, function(err, result){
           Session.set("commentsAggregates", result);
        });
        
     }
  });
});


Router.map(function () {
  this.route('showverse', {
    path: '/group/watch/:groupName/:seriesTitle/:idString', 
    template: "showverse",
    onBeforeAction: function(){
      if(!Meteor.userId()){
        Router.go("/");
      }
    },
    waitOn: function (){
          var groupName = this.params.groupName;
          console.log(groupName);
          var seriesTitle = this.params.seriesTitle;
          var idString = this.params.idString;
          Session.set("idString", idString);
          Session.set("groupName", groupName);
          Session.set("seriesTitle", seriesTitle);
          return [
            Meteor.subscribe('groups', groupName, function(){
              //console.log("i am ready");
            }),
            Meteor.subscribe('series', seriesTitle, function(){
              //console.log("i am ready2");
            }), 
             Meteor.subscribe('episodes', seriesTitle, idString, function(){
                //console.log( Episodes.find().count());
            }),
            Meteor.subscribe('comments', idString, seriesTitle, groupName, function(){
              //console.log("i am ready4");
            }),
            Meteor.subscribe('commentsmeta', idString, groupName, function(){
              //console.log("i am ready5");
            }),
            Meteor.subscribe('commentedUsers', function(){
              //console.log("i am ready 6");
            }),
          ];
    },
    action: function () {
      if (this.ready()){
         this.render();
      }else{
        this.render('loading');
      } 

  }
});
});



Router.map(function () {
  this.route('admin', {
    path: '/admin', 
    template: "admin",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});
Router.map(function () {
  this.route('admin_edit_series', {
    path: '/admin_edit_series', 
    template: "admin_edit_series",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});
Router.map(function () {
  this.route('admin_edit_episodes', {
    path: '/admin_edit_episodes', 
    template: "admin_edit_episodes",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});
Router.map(function () {
  this.route('admin_edit_showmarkers', {
    path: '/admin_edit_showmarkers', 
    template: "admin_edit_showmarkers",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});







