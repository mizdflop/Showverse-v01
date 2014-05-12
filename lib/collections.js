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
    attachedToTimeline:{
      type: Boolean,
      label:"Is there a spot on the timeline for this note?"
    },
    runtime:{
      type: Number,
      label: "Comment runtime (in seconds)",
      optional: true
    },
    twitterEmbedUri:{
      type: String,
      label: "Input Twitter EmbedURL",
      optional: true
    },    
    sourceName:{
      type: String,
      label: "Name of site; e.g Vanity Fair",
      optional: true
    },
    sourceRootUri:{
      type: String,
      label: "Root URL: e.g., vanityfair.com",
      optional: true
    },
    text:{
      type: String,
      label: "Text to be displayed",
      optional: true
    },
    directUri:{
      type: String, 
      label: "URL to the full article",
      optional: true
    },
    author:{
      type: String,
      label: "Name of the commentor",
      optional: true
    },
    authorUri:{
      type: String,
      label: "If author has some URL, include here",
      optional: true
    },
    bestOfType:{
      type: String,
    },
    associatedWithScene:{
      type: Number,
      optional: true
    },
    redditUriToComment: {
      type: String,
      label: "Provide URL to this comment or thread",
      optional: true
    },
    redditUriToUserHome:{
      type: String,
      label: "Provide URL to the user's path.",
      optional: true
    },
    memeImageSource:{
      type: String,
      label: "Provide direct URL to Image",
      optional: true
    },
    memePublisherSourceName:{
      type: String,
      label: "Name of Blog or Tumblr feed that published the meme",
      optional: true

    },
    memePublisherSourceUri:{
      type: String,
      label: "Provide URL to source Tumblr, blog or other publisher",
      optional: true

    },
    characters:{
      type: [String],
      label: "Enter characters relevant to this clip."
    }

  }
});

CommentsMeta = new Meteor.Collection("commentsmeta");
Comments = new Meteor.Collection("comments");