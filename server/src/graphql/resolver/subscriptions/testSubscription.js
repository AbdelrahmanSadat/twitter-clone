const pubsub = require("../../../../helpers/pubsub");

exports.resolver = {
    Subscription:{
        testSubscription: {
            // This resolver can be used to manipulate
            // the payload before sending it to the
            // resolve: (payload) => {
            //     return {
            //       customData: payload,
            //     };
            // },

            // (graphql-subscriptions withFilter example)
            // For example, if somethingChanged would also accept a variable with the ID that is relevant, 
            // we can use the following code to filter according to it:
            // subscribe: withFilter(() => pubsub.asyncIterator(SOMETHING_CHANGED_TOPIC), (payload, variables) => {
            //     return payload.somethingChanged.id === variables.relevantId;
            // }),


            subscribe: (_, args) => pubsub.asyncIterator('testSubscription')
        }
    }
}