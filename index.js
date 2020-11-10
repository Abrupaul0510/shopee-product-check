require ('dotenv').config()

const { Client, DiscordAPIError,Attachment } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require('discord.js');

const client = new Client();
const PREFIX = "!";

client.on('ready', ()=>{
    console.log('Successully connected to Discord! -paul');
    console.log("Servers Connected:")
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name)
    })
});


client.on('message' , (message)=>{
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

        if (CMD_NAME === 'ch'){
            const splithis = args.join(' ');
            const reffer = splithis.split('$')[1];
            const prodname = splithis.split('$')[0];           
            
            getAvailable(prodname,reffer).then((data) => {
            
            const exampleEmbed = new Discord.MessageEmbed()
            exampleEmbed.setTitle('Available Models for '+prodname+' ('+data.length+')')
            exampleEmbed.setColor('#3c00ff')   
                        if (data.length > 0){
                            for (i=0; i<data.length; i++){
                                exampleEmbed.addFields(     
                                    { name: '\u200B', value: "```📍"+data[i]+"```"},
                                )
                            }
                        }else{
                                exampleEmbed.addFields(     
                                    { name: '\u200B', value: "No data available \n please double check the product name"},
                                )
                        }
                        

            exampleEmbed.setTimestamp()
            exampleEmbed.setFooter('-Paul🤖');
            message.channel.send(exampleEmbed);

            })
        }else if(CMD_NAME === 'help'){
            const msgEmbed = new Discord.MessageEmbed()
            .setTitle('Available Command')
            .setColor('#3c00ff')
            .addFields(     
                { name: 'Search Available Brand by Design', value: "!ch <PRODUCT NAME> $ <PRODUCT URL>"},
            )
            message.channel.send(msgEmbed)

        
        }else if (CMD_NAME === 'sp'){
            const splithis = args.join(' ');
            const reffer = splithis.split('$')[1];
            const prodname = splithis.split('$')[0];           
            
            getAvailable(prodname,reffer).then((data) => {
            
            const exampleEmbed = new Discord.MessageEmbed()
            exampleEmbed.setTitle('Available Models for '+prodname+' ('+data.length+')')
            exampleEmbed.setColor('#3c00ff')   
                        if (data.length > 0){
                            for (i=0; i<data.length; i++){
                                exampleEmbed.addFields(     
                                    { name: '\u200B', value: "```📍"+data[i]+"```"},
                                )
                            }
                        }else{
                                exampleEmbed.addFields(     
                                    { name: '\u200B', value: "No data available \n please double check the product name"},
                                )
                        }
                        

            exampleEmbed.setTimestamp()
            exampleEmbed.setFooter('-Paul🤖');
            message.channel.send(exampleEmbed);

            })

        }else if(CMD_NAME === 'get'){

            const name = args.join(' ');
            message.channel.send('Please wait....🔎')
            getDesigns(name).then((res)=>{
            
            message.channel.send('Hey we have '+res.length+' designs for you')
                if(res.length > 0){
                    for (var i=0; i < res.length; i++){
                        var image = res[i]['image']
                        var price = res[i]['price'] / 100000
                        const imageURL = 'https://cf.shopee.ph/file/'+image
                        const embedIMG = imageURL.replace(/\s+/g, '')
                        const designEmbed = new Discord.MessageEmbed()
                        designEmbed.setTitle('```🏷️ '+res[i]['name']+'```')
                        designEmbed.setColor('#F4A460')  
                        designEmbed.addFields(     
                            { name: '📱 Model Type', value: res[i]['brand'],inline: true} ,
                            { name: '💸 Price', value: "P "+price,inline: true} ,
    
                        )
                        designEmbed.setImage(embedIMG)
                        designEmbed.setTimestamp()
                        designEmbed.setFooter('Redthigz.ph🤖')
                        message.channel.send(designEmbed);
                    }

                }else{
                    message.channel.send('Ennngk!....Invalid product brand')
                }
 
 
            })

        }
        }else{
            message.channel.send('Invalid Command Please use "!help" to see the availble commands')
        }
    
    
    

});

client.login(process.env.token);




//FUNCTIONS ++++++++++++++++++++++++++++++++++++++++++++++++



function getName(product_name){

                  
    const thisvalue = product_name;

    if ((thisvalue.search(/Iphone/i)) > 1 ){
        const name = 'Iphone';
        return name;
    }else if ((thisvalue.search(/oppo/i)) > 1 ){
        const name = 'Oppo';
        return name;
    }else if ((thisvalue.search(/vivo/i)) > 1 ){
    const name = 'Vivo';
    return name;
    }else if ((thisvalue.search(/realme/i)) > 1 ){
        const name = 'Realme';
        return name;
    }else if ((thisvalue.search(/huawei/i)) > 1 ){
        const name = 'Huawei';
        return name;
    }else if ((thisvalue.search(/redmi/i)) > 1 ){
        const name = 'Redmi';
        return name;
    }else if ((thisvalue.search(/samsung/i)) > 1 ){
        const name = 'Samsung';
        return name;
    }else {
        const name = 'UNKNOWN';
        return name;
    }

}


/// FUNCTION FOR 'get' Command

async function getDesigns(search){

const designs = await getDesign(search)

return designs
}




async function getDesign(search){

    const response = await fetch("https://shopee.ph/api/v2/search_items/?by=relevancy&categoryids=5011&entry_point=ShopBySearch&keyword="+search+"&limit=50&match_id=23393629&newest=0&order=desc&page_type=shop&skip_autocorrect=1&version=2", {
     "credentials": "include",
     "headers": {
         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
         "Accept": "*/*",
         "Accept-Language": "en-US,en;q=0.5",
         "X-Shopee-Language": "en",
         "X-Requested-With": "XMLHttpRequest",
         "X-API-SOURCE": "pc",
         "If-None-Match-": "55b03-d6d1ee727f47983d2c8888983bedb051",
         "Pragma": "no-cache",
         "Cache-Control": "no-cache"
     },
     "referrer": "https://shopee.ph/search?facet=5011&keyword=a20&noCorrection=true&page=0&shop=23393629",
     "method": "GET",
     "mode": "cors"
 });
 
 const data = await response.json()
 const items = data.items
 var result = [];
 for (var i=0; i<items.length; i++){
     const itemid = items[i]['itemid'];
     const availabledesign = await getAvailables(itemid,search)
         if(availabledesign != undefined){
             var obj = {}

             const pbrand = availabledesign.split("|")[0]
 
             const pname = availabledesign.split("|")[1]
 
             const pimage = availabledesign.split("|")[2]
 
             const pstock = availabledesign.split("|")[3]

             const pprice = availabledesign.split("|")[4]
             obj['name'] = pname
             obj['brand'] = pbrand
             obj['image'] = pimage
             obj['stock'] = pstock
             obj['price'] = pprice

             result.push(obj)
         }

 }
 return result
 
 }


 async function getAvailables(itemid,search){
     
    const searchUpper = search.toUpperCase()
    const res = await fetch("https://shopee.ph/api/v2/item/get?itemid="+itemid+"&shopid=23393629", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Shopee-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-API-SOURCE": "pc",
            "If-None-Match-": "55b03-35fa2f678090f2f4e395a8b321dccdf5",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://shopee.ph/Focus-Case-for-Samsung-A10-A20-A30-A30s-A50s-A50-A51-A70-A10s-A20s-A01-A71-A7-2018-i.23393629.2319964452",
        "method": "GET",
        "mode": "cors"
    });

    const data = await res.json()
    const item = data.item
    const models = item.models

    for (var m=0; m < models.length; m++){

           if(models[m]['normal_stock'] > 0){
            const name = models[m]['name']
            const lowercasename = name.toUpperCase()
            const arrname = lowercasename.split(',')
            const stocks = models[m]['normal_stock']
            const checkname = arrname.indexOf(searchUpper)

                if (checkname > -1){
                    
                    const proname = item.name
                    const image = item.image
                    const price = item.price
                    var finalname = name+" | "+proname+" | "+image+" | "+stocks+" | "+price

                    return finalname
                }
           }

    }


    

}




async function getProducts(searchvalue){
console.log(searchvalue)
const response = await fetch("https://shopee.ph/api/v2/search_items/?by=relevancy&keyword="+searchvalue+"&limit=50&match_id=23393629&newest=0&order=desc&page_type=shop&version=2", {
"credentials": "include",
"headers": {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.5",
    "X-Shopee-Language": "en",
    "X-Requested-With": "XMLHttpRequest",
    "X-API-SOURCE": "pc",
    "If-None-Match-": "55b03-7966a58e2955d84068197f50841d2a40",
    "If-None-Match": "2a1d10c55f9782f02aa2101da49e1653"
},
"referrer": "https://shopee.ph/shop/23393629/search?facet=5011&page=0&sortBy=ctime",
"method": "GET",
"mode": "cors"
});


const data = await response.json();

const productitems = data.items;

return productitems;
}






async function getAvailable(prodname,reffer){

const items = await getProducts(prodname);
const avModel = await geteachItem(items,reffer);
return avModel;
}




async function geteachItem(items,reffer){
var arrprod = [];
for (var p=0; p< items.length; p++) {
var itemids = items[p]['itemid'];
const rawmodels = await getmodels(itemids,reffer);
const brandname = await getBrandName(itemids,reffer); 

            var names = [];  
            var colors = [];  
            for (var n=0; n< rawmodels.length; n++) {
                if (rawmodels[n]['normal_stock'] > 0){
                
                      var splitthis = rawmodels[n]['name'];
                      var splitthis2 = splitthis.split(",");
                    
                            names.push(splitthis2[1]);
                            colors.push(splitthis2[0]);

                }   
            }
                    var availables = Array.from(new Set(names));
                    var availablecolors = Array.from(new Set(colors));
                    var av = availables.join(',');
                    var av2 = availablecolors.join(',');
                    var final = "["+brandname+"] - "+av+" - "+av2;
                    arrprod.push(final);
}
return arrprod

}

async function download (urlex) {
    const dname = name.replace(/\//g, "-");
    const response = await fetch("https://cf.shopee.ph/file/"+urlex, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:82.0) Gecko/20100101 Firefox/82.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Upgrade-Insecure-Requests": "1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Host": "cf.shopee.ph"
        },
        "method": "GET",
        "mode": "cors"
    });
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
    await streamPipeline(response.body, fs.createWriteStream('./photos/picture.png'))

    return response
  }




async function getBrandName(itemids,reffer){

        const url = "https://shopee.ph/api/v2/item/get?itemid="+itemids+"&shopid=23393629";
        const response2 =   await fetch(url, {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Shopee-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-API-SOURCE": "pc",
            "If-None-Match-": "55b03-fced1f78c7809c31969473c14affb4f1",
            "If-None-Match": "60620706b96cd6d641737fa7ef3a104f"
        },
        'referer': reffer,
        "method": "GET",
        "mode": "cors"
        });

        const rawdata = await response2.json();
        const product_name  = await rawdata.item.name;

        const brandname = await getName(product_name);

        return await brandname

}




async function getmodels(itemids,reffer){

            const url = "https://shopee.ph/api/v2/item/get?itemid="+itemids+"&shopid=23393629";
            const response2 =   await fetch(url, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "X-Shopee-Language": "en",
                "X-Requested-With": "XMLHttpRequest",
                "X-API-SOURCE": "pc",
                "If-None-Match-": "55b03-fced1f78c7809c31969473c14affb4f1",
                "If-None-Match": "60620706b96cd6d641737fa7ef3a104f"
            },
            'referer': reffer,
            "method": "GET",
            "mode": "cors"
            });

            const rawdata = await response2.json();
            const rawmodels  = await rawdata.item.models;

            return await rawmodels



}


