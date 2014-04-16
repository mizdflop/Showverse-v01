Meteor.publish('comments', function (idString, seriesTitle, groupName) {
  var episodeOfInterest =Episodes.findOne({idString: idString, seriesTitle: seriesTitle});  
  var theMarkers = episodeOfInterest.showMarkers;
    for(var p in theMarkers){
        Comments.upsert(
        {

            idString: idString,
            seriesTitle: seriesTitle,
            commentRunTime: theMarkers[p].timestamp,
            marker: theMarkers[p].showMarker,
            type: "sceneMarker"
        },
        {
            $set: 
            {
                idString: idString,
                seriesTitle: seriesTitle,
                type: "sceneMarker",
                commentRunTime: theMarkers[p].timestamp,
                marker: theMarkers[p].showMarker
            }
        });
    }    
  return Comments.find(
        { $or:
           [
            {
                idString: idString, 
                seriesTitle: seriesTitle, 
                groupName: groupName
            },
            {
                type: "sceneMarker"
            }
          ]  
        }
    );
});
Meteor.publish('groups', function (groupName) {
  return Groups.find({groupName: groupName});
});
Meteor.publish('series', function(seriesTitle) {
    return Series.find({seriesTitle: seriesTitle});
}); 
Meteor.publish('episodes_for_list', function(seriesTitle) {
    console.log(seriesTitle);
    return Episodes.find({seriesTitle: seriesTitle});
}); 
Meteor.publish('episodes', function(seriesTitle, idString) {   
    return Episodes.find({idString: idString, seriesTitle: seriesTitle});
}); 
Meteor.publish('admin_episodes', function() {
    return Episodes.find();
}); 
Meteor.publish('admin_series', function() {
    return Series.find();
});  
Meteor.publish('admin_comments', function() {
    return Comments.find();
});    
Meteor.publish('commentsmeta', function(idString, groupName) {
    return CommentsMeta.find({idString: idString, groupName: groupName});
}); 
Meteor.publish('commentedUsers', function(){
    console.log("this is me here.");
    return Meteor.users.find({});
});
serverCommentsPerEpisode = new Meteor.Collection("servercommentsperepisode");

//working agg function
//db.comments.aggregate(  {$group: {_id: { seriesTitle: '$seriesTitle', seasonNumber: '$seasonNumber', episodeNumber: '$episodeNumber' }, posts: {$sum: 1}}}   )
Meteor.publish("commentsperepisode", function () {
    var sub = this;
    // This works for Meteor 0.6.5
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    // Your arguments to Mongo's aggregation. Make these however you want.
    var pipeline = [
        //{ $match: doSomethingWith(args) },
        { $group: {
            _id: { seriesTitle: '$seriesTitle', seasonNumber: '$seasonNumber', episodeNumber: '$episodeNumber' },
            count: { $sum: 1 }
        }}
    ];
    console.log(pipeline);

    db.collection("ServerCommentsPerEpisode").aggregate(        
        pipeline,
        // Need to wrap the callback so it gets called in a Fiber.
        Meteor.bindEnvironment(
            function(err, result) {
                console.log(result);
                // Add each of the results to the subscription.
                _.each(result, function(e) {
                    // Generate a random disposable id for aggregated documents
                    sub.added("CommentsPerEpisode", Random.id(), {
                        key: e._id.somethingOfInterest,                        
                        count: e.count
                    });
                });

                sub.ready();
            },
            function(error) {
                Meteor._debug( "Error doing aggregation: " + error);
            }
        )
    );
});