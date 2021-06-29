var ImageKit = require("imagekit");
var fs = require('fs');
const asyncRedis = require("async-redis");
const Mercury = require('@postlight/mercury-parser');
let redis_host = "redis-11422.c62.us-east-1-4.ec2.cloud.redislabs.com"
let redis_port = 11422
let redis_password = "AFahzbIs3wTxs0VMPnvTqkuqyoZOWXwV"
const asyncRedisClient = asyncRedis.createClient({ host: redis_host, port: redis_port, password: redis_password })

var imagekit = new ImageKit({
    publicKey: "public_2r71yZ96zf7i1c5Qoxj5/aTP4ps=",
    privateKey: "private_tItw8T64cG0tPY+wmhNVwMiokp0=",
    urlEndpoint: "https://ik.imagekit.io/ap63okuxezn/"
});

async function fun() {
    let delResponse = await imagekit.deleteFolder('images').catch(err => { console.log(err) });
    console.log(delResponse);
    console.log("getting");
    let resp = await asyncRedisClient.get('all_news');
    let data = JSON.parse(resp);
    for (let news of data['news']) {
        for (let article of news['articles']) {
            if (article['urlToImage'].includes('./img')) {
                let result = await Mercury.parse(article['url']).catch(err => { console.log("mercuryError", err) });
                let imageRes = await imagekit.upload({
                    file: result.lead_image_url,
                    fileName: `${article['url']}`,
                    folder: 'images',
                    useUniqueFileName: false
                }).catch(err => { console.log("imgError", err) })
                console.log(imageRes);
            }
        }
    }
}
fun();



