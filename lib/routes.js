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
          //console.log(groupName);
          var seriesTitle = this.params.seriesTitle;
          return [Meteor.subscribe('groups', groupName), 
                  Meteor.subscribe('admin_series'), 
                  Meteor.subscribe('admin_episodes')
                ]
          ;
     },
    action: function () {
      if (this.ready()){
        Comments.aggregate(  
                  [
                      {$match: {type: {$exists: false}}},
                      {$group: 
                          {_id: 
                            { seriesTitle: '$seriesTitle', idString: '$idString'}, 
                            posts: {$sum: 1}}
                      } 
                  ],
                  function(err, result){
           Session.set("commentsAggregates", result);
        });
         this.render();
      }else{
        this.render('loading');
      } 

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
         //console.log("I am here");
         //Session.set("sessionRunTime",0)
         $('.selectpicker_timer').selectpicker();
      }else{
        Session.set()
        this.render('loading');
      } 

   },
   onAfterAction: function (){
           $('.selectpicker_timer').selectpicker();
   }
});
});

Router.map(function () {
  this.route('clipper', {
    path: '/clipper/:seriesTitle/:idString', 
    template: "clipper",
    waitOn: function (){
      var seriesTitle = this.params.seriesTitle;
      var idString = this.params.idString;
      Session.set("idString", idString);
      Session.set("seriesTitle", seriesTitle);
      //Meteor.subscribe('admin_series'),
      return[
        Meteor.subscribe('episodes', seriesTitle, idString),
        Meteor.subscribe('bestof_episode', idString, seriesTitle),
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
  this.route('admin_index', {
    path: '/admin', 
    template: "admin_index",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});

Router.map(function () {
  this.route('admin_add_series', {
    path: '/admin/admin_add_series', 
    template: "admin_add_series",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});
Router.map(function () {
  this.route('admin_edit_series', {
    path: '/admin/admin_edit_series', 
    template: "admin_edit_series",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});
Router.map(function () {
  this.route('admin_edit_episodes', {
    path: '/admin/admin_edit_episodes', 
    template: "admin_edit_episodes",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});

Router.map(function () {
  this.route('admin_delete_episodes', {
    path: '/admin_delete_episodes', 
    template: "admin_delete_episodes",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes')
    }
  });
});

Router.map(function () {
  this.route('admin_create_bestofnotes', {
    path: '/admin/create_bestofnotes', 
    template: "admin_create_bestofnotes",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes'),
      Meteor.subscribe('bestof')

    }
  });
});
Router.map(function () {
  this.route('admin_edit_bestofnotes', {
    path: '/admin/edit_bestofnotes', 
    template: "admin_edit_bestofnotes",
    waitOn: function(){
      Meteor.subscribe('admin_series'),
      Meteor.subscribe('admin_episodes'),
      Meteor.subscribe('bestof')

    }
  });
});

