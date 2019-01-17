export default async function(client, mutation, variables){
    const res = await client.mutate({ 
      mutation,
      variables
    })
    return res
}