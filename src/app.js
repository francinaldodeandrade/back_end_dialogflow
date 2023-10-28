import express from 'express'
const app = express()
app.use(express.json())

import dotenv from 'dotenv'
dotenv.config()

import Model from '../src/Models/botModels.js'


const get = process.env.GET
const dialogflow = process.env.ROUTE_DIALOGFLOW

app.get(get, (req, res)=>{
    res.send("entry-poit para o dialogflow"+': ' + dialogflow)
})


app.post(dialogflow, (req, res) =>{
    const webHook = async (req, res) =>{
        const mensagem = req.body.queryResult.queryText;
        const intencao = req.body.queryResult.intent.displayName;
        const parametros = req.body.queryResult.parameters;
        let responder = ""
      
        switch(intencao) {
          case 'VerCardapio': 
            resposta = await Model.verCardapio( mensagem, parametros );
            break;
          case 'verStatus':
            resposta = Model.verStatus( mensagem, parametros );
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
})

/*import router from "../Routes/botRoutes"

app.use("/log", router)

app.use("/logs", router)*/


export default app