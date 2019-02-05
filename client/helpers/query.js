export default async function(client, query, variables){
    const res = await client.query({ 
      query,
      variables,
      prefetch: true
    })
    return res
}