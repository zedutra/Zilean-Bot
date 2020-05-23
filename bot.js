const Discord = require('discord.js')    /* Carregando biblioteca do discord   */
const client = new Discord.Client()      /* Conexao com o client               */
const config = require('./config.json')  /* Carregando arquivo de configuração */
const lol = require('./lolapi')

client.on('ready', () => {  /* Quando o bot for iniciado */
    console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais e ${client.guilds.cache.size} servidores.`)
    /*client.user.setActivity(`Eu estou em ${client.guilds.cache.size} servidores.`)*/ /* Define o status do bot */
})

client.on('guildCreate', guild => { /* Quando o bot entrar em um servidor */
    console.log(`O bot entrou no servidor: ${guild.name} (id: ${guild.id}). Populacao: ${guild.memberCount} membros.`)
})

client.on('guildDelete', guild => { /* Quando o bot sair de um servidor */
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`)
})

client.on('message', async message => { /* Quando alguém enviar uma mensagem */

    if (message.author.bot) return;
    /*if (message.channel.type === 'dm') return;  Faz com que o bot não responda mensagens na DM*/
    if (!message.content.startsWith(config.prefix)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    const argumento = args.join(' ')

    switch (comando) {
        case 'id':
            var dados = await lol.getId(`${argumento}`)
            if (typeof dados[0] != 'undefined') {
                message.channel.send("```" + `id: ${dados[4]} \npuuid: ${dados[5]} \naccountId: ${dados[0]}` + "```")
            } else {
                message.channel.send(`Esse jogador não existe :tired_face:`)
            }
            break

        case 'ping':
            const m = await message.channel.send('Ping?')
            m.edit(`Pong! A Latência é ${m.createdTimestamp - message.createdTimestamp}ms. A Latencia da API é ${Math.round(client.ws.ping)}ms`)
            break

        case 'perfil':
            var id = await lol.getId(`${argumento}`)
            if (typeof id[0] != 'undefined') {
                var dados = await lol.getTier(id[4])

                if (id[1] < 4542) {
                    var icone = `https://ddragon.leagueoflegends.com/cdn/10.8.1/img/profileicon/${id[1]}.png`
                } else {
                    var icone = `https://opgg-static.akamaized.net/images/profile_icons/profileIcon${id[1]}.jpg?`
                }
                if (dados.length == '7') { /* Verifica o número de filas ranqueadas (7 é igual a 1 fila)*/
                    var queue1 = dados[0]
                    queue1 == 'RANKED_SOLO_5x5' ? queue1 = 'Solo/Duo' : queue1 = 'Flex'
                    const perfilEmbed = new Discord.MessageEmbed()
                        .setColor('#0F4C81')
                        .setTitle(`${id[3]}`)
                        .setURL('https://discord.js.org/')
                        .setDescription("`" + `Level ${id[6]}` + "`")
                        .setThumbnail(icone)
                        .addFields({ name: `__${queue1}__`, value: `${dados[2]} ${dados[3]}\n ${dados[4]} pdl`, inline: false })
                        .setTimestamp()
                        .setFooter('created by Dutra', 'https://cdn.discordapp.com/avatars/380826729050013696/5cf8aa5924fac9f4d02a6aba3a03e085.png?size=128');
                    message.channel.send(perfilEmbed);
                    break
                } else if (dados.length == '14') { /* Verifica o número de filas ranqueadas (14 é igual a 2 filas)*/
                    var queue1 = dados[0]
                    var queue2 = dados[7]
                    queue1 == 'RANKED_SOLO_5x5' ? queue1 = 'Solo/Duo' : queue1 = 'Flex'
                    queue2 == 'RANKED_SOLO_5x5' ? queue2 = 'Solo/Duo' : queue2 = 'Flex'
                    console.log(`queue1 = ${queue1} || queue2 = ${queue2}`)
                    const perfilEmbed = new Discord.MessageEmbed()
                        .setColor('#0F4C81')
                        .setTitle(`${id[3]}`)
                        .setURL('https://discord.js.org/')
                        .setDescription("`" + `Level ${id[6]}` + "`")
                        .setThumbnail(icone)
                        .addFields(
                            { name: `__${queue1}__`, value: `${dados[2]} ${dados[3]}\n ${dados[4]} pdl`, inline: false },
                            { name: `__${queue2}__`, value: `${dados[9]} ${dados[10]}\n ${dados[11]} pdl`, inline: false },
                        )
                        .setTimestamp()
                        .setFooter('created by Dutra', 'https://cdn.discordapp.com/avatars/380826729050013696/5cf8aa5924fac9f4d02a6aba3a03e085.png?size=128');
                    message.channel.send(perfilEmbed);
                    break
                } else {
                    const perfilEmbed = new Discord.MessageEmbed()
                        .setColor('#0F4C81')
                        .setTitle(`${id[3]}`)
                        .setURL('https://discord.js.org/')
                        .setDescription("`" + `Level ${id[6]}` + "`")
                        .setThumbnail(icone)
                        .setTimestamp()
                        .setFooter('created by Dutra', 'https://cdn.discordapp.com/avatars/380826729050013696/5cf8aa5924fac9f4d02a6aba3a03e085.png?size=128');
                    message.channel.send(perfilEmbed);
                    break
                }
            } else {
                message.channel.send(`Esse jogador não existe :tired_face:`)
            }
            break

        case 'sobre':
            message.channel.send(`Esse comando ainda não está disponível :tired_face:`)
            break
        
        case 'historico':
            message.channel.send(`Esse comando ainda não está disponível :tired_face: mas você ainda pode ver essas informações em https://br.op.gg/summoner/userName=${encodeURI(argumento)}`)
            break

        case 'maestria':
            message.channel.send(`Esse comando ainda não está disponível :tired_face:, mas você pode olhar essas informações em https://br.op.gg/summoner/userName=${encodeURI(argumento)}`)
            break

        case 'comandos':
            message.channel.send(`
            Lista de Comandos:
            ${config.prefix}sobre         | exibe informações sobre o bot
            ${config.prefix}comandos | exibe os comandos disponíveis
            ${config.prefix}historico nomedojogador   | exibe o historico das ultimas partidas
            ${config.prefix}maestria nomedojogador  | exibe as maiores maestrias
            ${config.prefix}elo nomedojogador            | exibe o elo nas 3 filas
            ${config.prefix}resumo nomedojogador    | exibe um resumo do perfil do jogador
            `)
            break

        default:
            message.channel.send(`Comando inválido, digite ${config.prefix}comandos e veja os comandos disponíveis`)
            break
    }

})

client.login(config.tokends)