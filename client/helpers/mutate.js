export default async function(client, options){
    const res = await client.mutate(options)
    return res
}