import subscriptions from "@/gql/subscriptions"

export default async ({app, store}, inject)=>{
    // Testing subscriptions
    const testSubscriptionObservable = await app.$apolloClient.subscribe({
        query: subscriptions.testSubscription
    })
    const testSubscription = await testSubscriptionObservable.subscribe(
        x => console.log(x),
        err => console.log(err),
        () => console.log('Finished')
    );
    await store.dispatch(
        "setTestUnsubscription",
         testSubscription.unsubscribe.bind(testSubscription)
    )
}


