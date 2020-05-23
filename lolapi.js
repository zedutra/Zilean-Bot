var axios = require('axios')
const token = require('./config.json')  /* Carregando arquivo de configuração */

var config = {
	headers: {
		"X-Riot-Token": token.tokenlol
	}
}

/*
axios
  .get('https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Z%C3%A9%20Dutra', config)
  .then(response => {
	  var name = response.data.name
	  var level = response.data.summonerLevel
	  var id = response.data.id
	  var icon = response.data.profileIconId
	  console.log(`Olá ${name}, seu level é ${level}, seu id é ${id} e seu icone é o ${icon}`)
  })
  .catch(function(error){
	  console.log(error)
  })
*/

async function getId(nome) { /* name ~> nome do jogador */
	let url = 'https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + encodeURIComponent(nome)
	let dados = []
	let erro = false
	let response = await axios
		.get(url, config)
		.catch(function (error) {
			if (error) {
				/*console.log(error)*/
				erro = true
			}
		})

	if (erro) {
		console.log(`Erro ao buscar o id do jogador ${nome}`)
		return dados
	} else {
		dados.push(
			response.data.accountId,
			response.data.profileIconId,
			response.data.revisionDate,
			response.data.name,
			response.data.id,
			response.data.puuid,
			response.data.summonerLevel
		)
		return dados
	}
}


async function getTier(id) { /* id ~> id do jogador */
	let url = 'https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/' + id
	let dados = []
	let erro = false
	let response = await axios
		.get(url, config)
		.catch(function (error) {
			if (error) {
				/*console.log(error)*/
				erro = true
			}
		})
	
	if (erro) {
		console.log(`Erro ao buscar o elo do jogador com id ${id}`)
		return dados
	} else {
		for (var x in response.data) {
			dados.push(
				response.data[x].queueType,
				response.data[x].summonerName,
				response.data[x].tier,
				response.data[x].rank,
				response.data[x].leaguePoints,
				response.data[x].wins,
				response.data[x].losses
			)
		}
		return dados
	}
}

module.exports = { getId, getTier }