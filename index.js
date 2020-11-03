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
        }else{
            message.channel.send('Invalid Command Please use "!help" to see the availble commands')
        }
    
    
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


