export default async function(client, options){
    const res = await client.query({...options, prefetch: true})
    return res
}