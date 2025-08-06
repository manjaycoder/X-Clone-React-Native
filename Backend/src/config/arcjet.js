import arcjet ,{tokenBucket,shield,detectBot} from "@arcjet/node";
import {ENV} from '../config/env.js'


export const aj=arcjet({
  key:ENV.ARCJET_KEY,
  characteristics:['ip.src'],
  rules:[
    //shield protects your app from comman attacks eg.sql injection,xss,csrf attacks
    shield({mode: "LIVE" }),
    //bot detection -block all bots except search search engines
    detectBot({
      mode:"LIVE",
      allow:[
        "CATEGORY:SEARCH_ENGINE",
        //ALLOW LEGITIMATE search engine bots
        //see full list at https://arcjet.com/bot-list
      ]
    }),
    //rate limiting with token bucket algorithm
    tokenBucket({
      mode:"LIVE",
      refillRate:10,//token added per internal
      interval:10,//internal in second (10 second)
      capacity:15,//maximam token in bucket
    })
  ]
})
