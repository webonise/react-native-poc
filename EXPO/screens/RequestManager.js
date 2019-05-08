import React, { Component } from 'react';


export default  class RequestManager  {

   static requestGET(url) {
        console.log("GET Full URL " + url);
        return fetch(url)
   }

  static requestPOST(url,body) {
    console.log("POST URL " + url);
    console.log("POst Body -: "+body);
    return fetch(url,{
        method: 'POST',
        body:JSON.stringify(body)
    })
  }

  static requestHEAD(url) {
    return fetch(url,{
        method: 'HEAD',
    })
  }
  
}

