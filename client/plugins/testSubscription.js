import subscriptions from "@/gql/subscriptions"

export default ({app}, inject)=>{
    // Testing subscriptions
    const testSubscriptionObservable = app.$apolloClient.subscribe({
        query: subscriptions.testSubscription
    })
    const testSubscription = testSubscriptionObservable.subscribe(
        x => console.log(x),
        err => console.log(err),
        () => console.log('Finished')
    );
}


