


require ('dotenv').config()

const { Client, DiscordAPIError,Attachment } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require('discord.js');

const client = new Client();
const PREFIX = "!";

client.on('ready', ()=>{
    console.log('Successullsds');
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
                exampleEmbed.setTitle(prodname)
                exampleEmbed.setColor('#3c00ff')   
                            if (Object.keys(data).length > 0){
    
                                // https://cf.shopee.ph/file
    
                                    const imgURL = "https://cf.shopee.ph/file/"+data['photourl'][0]
                                    
                                    const originalprice = data['price']/100000;
                                    const redjprice = originalprice + 60;
                               
                                  
    
                                    for(var k = 0; k < data['photourl'].length; k++){
                                        exampleEmbed.addFields(     
                                            { name: '\u200B', value: "https://cf.shopee.ph/file/"+data['photourl'][k]},
                                        )
    
                                    }
                                    exampleEmbed.addFields(     
                                        { name: 'Original Price', value: originalprice },
                                    )
                                    exampleEmbed.addFields(     
                                        { name: '\u200B', value: prodname+' 💸'+redjprice},
                                    )
                                   
     
                                   
                                    exampleEmbed.setThumbnail(imgURL)
                                  
                                        for(var l = 0; l < data['availables'].length; l++){
                                            exampleEmbed.addFields(     
                                                { name: '\u200B', value: data['availables'][l]},
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

        }else if(CMD_NAME === 'latest'){
           const limit = args.join(' ');
           getLatest(limit).then((data) => {

            for (i=0; i<data.length; i++){
            const exampleEmbed = new Discord.MessageEmbed()
            exampleEmbed.setTitle(data[i]['pname'])
            exampleEmbed.setColor('#3c00ff')   
                        if (data.length > 0){

                            // https://cf.shopee.ph/file

                                const imgURL = "https://cf.shopee.ph/file/"+data[i]['photourl'][0]
                                
                                const originalprice = data[i]['price']/100000;
                                const redjprice = originalprice + 60;
                           
                              

                                for(var k = 0; k < data[i]['photourl'].length; k++){
                                    exampleEmbed.addFields(     
                                        { name: '\u200B', value: "https://cf.shopee.ph/file/"+data[i]['photourl'][k]},
                                    )

                                }
                                exampleEmbed.addFields(     
                                    { name: 'Original Price', value: originalprice },
                                )
                                exampleEmbed.addFields(     
                                    { name: '\u200B', value: data[i]['pname']+' 💸'+redjprice},
                                )
                                

 
                               
                                exampleEmbed.setThumbnail(imgURL)
                                // if(data[i]['availables'].length === 0){
                                //     exampleEmbed.addFields(     
                                //         { name: '\u200B', value: "No model availables"},
                                //     )
                                // }else{
                                    for(var l = 0; l < data[i]['availables'].length; l++){
                                        exampleEmbed.addFields(     
                                            { name: '\u200B', value: "📍"+data[i]['availables'][l]},
                                        )
                                    }
                                // }
                            
                        }else{
                                exampleEmbed.addFields(     
                                    { name: '\u200B', value: "No data available \n please double check the product name"},
                                )
                        }
                        

            exampleEmbed.setTimestamp()
            exampleEmbed.setFooter('-Paul🤖');
            message.channel.send(exampleEmbed);
            }

            })
            
        }
        }
        else{
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

async function  getLatest(limit){

    const items = await getLatestItems(limit)

    const uniqueitems = getUniqueListBy(items, 'name')

    const photos = await getPhotos(uniqueitems)

    return photos
}

//////////////////////////////////////////
async function getPhotos(uniqueitems){
    var arrdata = []
    for(var p = 0; p < uniqueitems.length; p++){
        var obj2 = {}
        const searchitems =  uniqueitems[p]['name']
        const itemdata = await getPhotoUrl(searchitems)
        const availables = await getAllAvailable(searchitems)

        const photourl = itemdata['images']
        const price = itemdata['price']

        obj2['pname'] = searchitems
        obj2['photourl'] = photourl
        obj2['availables'] = availables
        obj2['price'] = price
        arrdata.push(obj2)

    }

    return arrdata

}


//////////////////////////////////////////
async function getAllAvailable(searchitems){

    const response = await fetch("https://shopee.ph/api/v2/search_items/?by=relevancy&categoryids=5011&entry_point=ShopBySearch&keyword="+searchitems+"&limit=50&match_id=23393629&newest=0&order=desc&page_type=shop&skip_autocorrect=1&version=2", {
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

    var arrmodels = []
    for (var j = 0; j < items.length; j++){

    const itemid = items[j]['itemid']
    
    // console.log(itemid)
    const availables = await getLatestModel(itemid)  
    
    arrmodels.push(availables)

    }

return arrmodels


}

//////////////////////////////////////////

async function getLatestModel(itemid){


    const response = await fetch("https://shopee.ph/api/v2/item/get?itemid="+itemid+"&shopid=23393629", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Shopee-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-API-SOURCE": "pc",
            "If-None-Match-": "55b03-dab934e46a14456adba1514f8f126f2f",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://shopee.ph/Hello-Kitty-Candy-Case-iPhone-6-6s-7-8-Plus-XR-X-Xs-Max-11-Pro-Max-i.23393629.7072388761",
        "method": "GET",
        "mode": "cors"

    });

    const data = await response.json()

    const models = data.item.models

    const itemids = data.item.itemid

    const brandname2 = await getBrandName(itemids); 
    var names = []
    var colors = []
    
    for (var n=0; n< models.length; n++) {
        if (models[n]['normal_stock'] > 0){
        
              var splitthis = models[n]['name'];
              var splitthis2 = splitthis.split(",");
            
                    names.push(splitthis2[1]);
                    colors.push(splitthis2[0]);

        }   
    }
    var availables = Array.from(new Set(names));
    var availablecolors = Array.from(new Set(colors));
    var av = availables.join(',');
    var av2 = availablecolors.join(',');
    var final = brandname2 + " - "+av+" - "+av2;
    

    return final
}

//////////////////////////////////////////

async function getPhotoUrl(searchitems){

    const response = await fetch("https://shopee.ph/api/v2/search_items/?by=relevancy&categoryids=5011&entry_point=ShopBySearch&keyword="+searchitems+"&limit=50&match_id=23393629&newest=0&order=desc&page_type=shop&skip_autocorrect=1&version=2", {
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

    const item = data.items

    const itemid = item[0].itemid

    const itemdata = await getPhotoImages(itemid)


    

    return itemdata


}

/////////////////////////////////////////

async function getPhotoImages(itemid){

    const response = await fetch("https://shopee.ph/api/v2/item/get?itemid="+itemid+"&shopid=23393629", {
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

    const dataitem = data.item
    var fromItem = {}
    fromItem['images'] = dataitem.images
    fromItem['price'] = dataitem.price


    return fromItem

}




/////////////////////////////////////////

async function getModels2(itemid){



}

/////////////////////////////////////////


function getUniqueListBy(arr, key) {

    return [...new Map(arr.map(item => [item[key], item])).values()]
}


/////////////////////////////////////////

async function getLatestItems(limit){
    const response = await fetch("https://shopee.ph/api/v2/search_items/?by=ctime&categoryids=5011&limit="+limit+"&match_id=23393629&newest=0&order=desc&page_type=shop&version=2", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "X-Shopee-Language": "en",
            "X-Requested-With": "XMLHttpRequest",
            "X-API-SOURCE": "pc",
            "If-None-Match-": "55b03-50315239e3106933f5b6222c5a29d0c9",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
           
        },
        "referrer": "https://shopee.ph/shop/23393629/search?facet=5011&page=4&sortBy=ctime",
        "method": "GET",
        "mode": "cors"
    });

    const data = await response.json()
    const items = data.items
    
    var itemsdata = []

    for (var i = 0; i < items.length; i++){
        var obj = {}

        const name = items[i]['name'].split('-')[0]
        
        
        obj['name'] = name
        
        itemsdata.push(obj)
    }

    return itemsdata
}


///////////////////////////////////////

async function getDesigns(search){

const designs = await getDesign(search)

return designs
}



/////////////////////////////////////////




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

const itemdata = await getPhotoUrl(prodname)

const avModel = await geteachItem(items,reffer);
var itemsobj = {}

const photourl = itemdata['images']
const price = itemdata['price']

itemsobj['availables'] = avModel
itemsobj['photourl'] = photourl
itemsobj['price'] = price


return itemsobj;
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


