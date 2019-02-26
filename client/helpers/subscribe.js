export default async function(client, options){
    const res = await client.subscribe(options)
    return res
}