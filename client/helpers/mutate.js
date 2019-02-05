export default async function(client, mutation, variables, refetchQueries, awaitRefetchQueries){
    const res = await client.mutate({ 
      mutation,
      variables,
      refetchQueries,
      awaitRefetchQueries
    })
    return res
}