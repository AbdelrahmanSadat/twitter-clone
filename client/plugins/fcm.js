import firebase from "firebase"
import {mutate, query} from "@/helpers"
import {mutations, queries} from "@/gql"

export default ({app}, inject)=>{
    // Initialize Firebase
    if(! firebase.apps.length){
        var config = {
            apiKey: "AIzaSyA6-lMokeuad62QrAfrlzh_LAiGcVp9m8w",
            authDomain: "twitterapiclone.firebaseapp.com",
            databaseURL: "https://twitterapiclone.firebaseio.com",
            projectId: "twitterapiclone",
            storageBucket: "twitterapiclone.appspot.com",
            messagingSenderId: "911177940730"
        };
        firebase.initializeApp(config);
    }

    const messaging = firebase.messaging();

    messaging.usePublicVapidKey("BGf-_iUlVQgAiM6w83R9Mt97C8XbAyC9o0pw6WvJh83waiDOYVvf67U6IXOj7vKjGyQpPwoMFuPOTtVluR4XdEk")

        messaging.requestPermission().then(function() {
            console.log('Notification permission granted.');

            messaging.getToken().then(async function(currentToken) {
                if (currentToken) {
                    const currentUserQuery = await query(app.$apolloClient, queries.currentUser)
                    const currentUserId = currentUserQuery.data.currentUser.id
                    const variables = {
                        userId: currentUserId,
                        token: currentToken
                    }
                    const registerationToken = await mutate(app.$apolloClient, mutations.registerationToken, variables)
                //   sendTokenToServer(currentToken);
                //   updateUIForPushEnabled(currentToken);
                } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                // Show permission UI.
                //   updateUIForPushPermissionRequired();
                //   setTokenSentToServer(false);
                }
            }).catch(function(err) {
                console.log('An error occurred while retrieving token. ', err);
                // showToken('Error retrieving Instance ID token. ', err);
                // setTokenSentToServer(false);
            });

        }).catch(function(err) {
            console.log('Unable to get permission to notify.', err);
    });

    // TODO: ???
    messaging.onTokenRefresh(function() {
        messaging.getToken().then(async function(refreshedToken) {
            console.log('Token refreshed.');
            // Indicate that the new Instance ID token has not yet been sent to the
            // app server.
            //setTokenSentToServer(false);
            //Send Instance ID token to app server.
            //sendTokenToServer(refreshedToken);
            const currentUserQuery = await query(app.$apolloClient, queries.currentUser)
            const currentUserId = currentUserQuery.data.currentUser.id
            const variables = {
                userId: currentUserId,
                token: currentToken
            }
            const registerationToken = await mutate(app.$apolloClient, mutations.registerationToken, variables)
            
        }).catch(function(err) {
          console.log('Unable to retrieve refreshed token ', err);
          showToken('Unable to retrieve refreshed token ', err);
        });
    });




    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.setBackgroundMessageHandler` handler.
    messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);
        // ...
    });
}






    




