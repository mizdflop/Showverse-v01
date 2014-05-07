SimpleSchema.debug = true;
Series = new Meteor.Collection("series", {
    schema: {
        seriesTitle: {
            type: String,
            label: "Title",
            max: 200
        },
        createdBy: {
            type: String,
            label: "Created By"
        },
        network: {
            type: String,
            label: "Airing network"
        },
        startAirDate: {
            type: Date,
            label: "Air date of first episode "
        },
        endAirDate: {
            type: Date,
            label: "Air date of last episode "
        },
        currentlyAired: {
            type: Boolean,
            label: "Sill on the Air? "
        },
        seriesDescription: {
            type: String,
            label: "Brief summary"
        },
        numberSeasons: {
          type: Number,
          label: "Total number of seasons"
        },
        numberEpisodes: {
          type: Number,
          label: "Total number of episodes."
        },
        seriesImage: {
          type: String,
          label: "image name (assuming lives in img folder"
        }
    } 

});
Episodes = new Meteor.Collection("episodes", {
    schema: {
      seriesId: {
        type: String,
        label: "Fk from Series",
      },
      seriesTitle: {
        type: String,
        label: "Name of the Series"
      },
      seasonNumber: {
        type: Number
      },
      episodeNumber: {
        type: Number
      },
      idString: {
        type: String,
        label: "For example S1-Ep1"
      },
      episodeAirDate:{
        type: Date
      },
      episodeRunTime: {
        type: Number,
        label: "Runtime in Seconds"
      },
      episodeTitle: {
        type: String
      },
      episodeDescription: {
        type: String
      },
      episodeImage: {
        type: String
      },
      imdbRating: {
        type: String
      },
      showMarkers:{
          type: [Object]
      },
      "showMarkers.$.timestamp": {
          type: Number
        },
      "showMarkers.$.showMarker": {
          type: String
      }
    }

});

Groups = new Meteor.Collection("groups", {
  schema: {
    groupName: {
      type: String
    },
    groupDesc: {
      type: String
    },
    groupURL: {
      type: String
    }
  }
});
Bestof = new Meteor.Collection("bestof", {
  schema: {
    episodeId:{
      type:String
    },
    generalNote:{
      type: Boolean,
      label: "Is this intended for the General section"
    },
    attachedToTimeline:{
      type: Boolean,
      label:"Is there a spot on the timeline for this note?"
    },
    runtime:{
      type: Number,
      label: "Comment runtime (in seconds)",
      optional: true
    },
    sourceName:{
      type: String,
      label: "name of site; e.g Vanity Fair"
    },
    sourceRootUri:{
      type: String,
      label: "Root URL e.g. vanityfair.com"
    },
    text:{
      type: String,
      label: "Text to be displayed"
    },
    directUri:{
      type: String, 
      label: "Url to the original text, should include digg.com, twitter.com, etc"
    },
    author:{
      type: String,
      label: "Name of the commentor"
    },
    authorUri:{
      type: String,
      label: "If author has some URL, include here",
      optional: true
    },
    bestOfType:{
      type: String,
      allowedValues: ["Quip", "Longread"]
    },
    associatedAtSceneLevel:{
      type: Boolean
    },
    associatedWithScene:{
      type: Number,
      optional: true
    }
  }
});

CommentsMeta = new Meteor.Collection("commentsmeta");
Comments = new Meteor.Collection("comments");