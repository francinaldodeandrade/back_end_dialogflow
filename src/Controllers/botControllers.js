import model from "../model/botModel.js"

import dotenv from 'dotenv'
dotenv.config()

const dialogflow = process.env.ROUTE_DIALOGFLOW

const readAll = (req, res) =>{
    
    res.send("entry-poit para o dialogflow"+': ' + dialogflow)
}

const webHook = async (req, res) =>{
    const mensagem = req.body.queryResult.queryText;
    const intencao = req.body.queryResult.intent.displayName;
    const parametros = req.body.queryResult.parameters;
    let responder = ""
  
    switch(intencao) {
      case 'VerCardapio': 
        resposta = await model.verCardapio( mensagem, parametros );
        break;
      case 'verStatus':
        resposta = model.verStatus( mensagem, parametros );
        break;
      default: 
        resposta = {tipo: 'texto', mensagem: 'Sinto muito, não entendi o que você quer'}
    }
  
  
    let meuCardapio = [];
    let menuItem = {};
  
    for (let i=0; i<resposta.cardapio.length; i++) {
      menuItem = {
          "card": {
            "title": resposta.cardapio[i].titulo,
            "subtitle": resposta.cardapio[i].preco,
            "imageUri": resposta.cardapio[i].url,
          }
      }
      meuCardapio.push(menuItem)
    }
  
  
  if ( resposta.tipo == 'texto') {
    responder = {
      "fulfillmentText": "Resposta do Webhook",
      "fulfillmentMessages": [
        {
          "text": {
            "text": [
              resposta.mensagem
            ]
          }
        }
      ],
      "source": "",
    }
  } else if ( resposta.tipo == 'imagem' ) {
    responder = {
      "fulfillmentText": "Resposta do Webhook",
      "fulfillmentMessages": [
        {
          "image": {
            "imageUri": resposta.url,
          }
        }
      ],
      "source": "",
    }
  } else if ( resposta.tipo == 'card' ) {
    responder = {
      "fulfillmentText": "Resposta do Webhook",
      "fulfillmentMessages":  meuCardapio,
      "source": "",
    }
  }
  
  console.log("resposta final", responder)
  
    res.send(responder);
  
}

export default {
    webHook,
    readAll
}

