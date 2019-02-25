import subscriptions from "@/gql/subscriptions"

export default function({app}){
    // Testing subscriptions
    const testSubscriptionObservable = app.$apolloClient.subscribe({
        query: subscriptions.testSubscription
    })
    testSubscriptionObservable.subscribe(
        x => console.log(x),
        err => console.log(`Finished with error: ${ err }`),
        () => console.log('Finished')
    );
}


