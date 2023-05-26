import React from 'react'

//Local file imports
import ENDPOINT from '../../util/API';
import findCookie from '../../util/findCookie';
import {crn_calendars, schedule_tag, subscribed_calendars, calendar_tags} from '../../util/constant';

const ClubSubscription = ({uuid, meetDump, setMeetDump}) => {

  const subscribeHandle = async (uuid, subType) => { //Uuid of the club being subbed too (str), subType true is subscribe & false is unsubscribe (bool)
    console.log(uuid,subType);

    const token = findCookie('access_token', document.cookie);

    const paramURL = `calendar/${subType ? 'subscribe' : 'unsubscribe'}?cal_uuid=${uuid}`

    if(!subType){
      
      //Preliminary check to see if this staleness tag even exists yet:

      const calTags = JSON.parse(window.localStorage.getItem(calendar_tags));
      const keyCheck = Object.keys(calTags);
      console.log(
        'KEYLEN' , keyCheck
      )

      if(keyCheck.includes(uuid)){
        const subCals = JSON.parse(window.localStorage.getItem(subscribed_calendars));

        if(subCals.length !== keyCheck.length){
          throw new RangeError("calendar_tags & subscribed_calendars don't match in length.")
        }

        console.log(subCals);
        let newSubCals = [];
        let newCalTags = {};
  
        //Assuming key length and sub Cals length are equal
        for(let i = 0; i <= (keyCheck.length - 1); i++){
          //Removes Staleness Tag
          if(keyCheck[i] !== uuid){
            newCalTags[keyCheck[i]] = calTags[keyCheck[i]];
          }
          //Removes storage entry
          if(subCals[i].uuid !== uuid){
            newSubCals.push(subCals[i]);
          }
  
        }
  
        window.localStorage.setItem(calendar_tags, JSON.stringify(newCalTags));
        window.localStorage.setItem(subscribed_calendars, JSON.stringify(newSubCals));

      }


    }


    const resp = await fetch(ENDPOINT + paramURL , {
      method: 'POST' , 
      headers: {'Content-Type' : 'application/json', 'Authorization' : 'Bearer '+token }, 
    })

    console.log(await resp.json());

    if(resp.status === 200){
      
      const dumpRef = {...meetDump}
      dumpRef.is_subscribed = subType

      setMeetDump(dumpRef);
    }

  }

  return (
    meetDump.is_subscribed 
    ? 
      (
      <button className="btn btn-secondary"
      onClick = { () => {subscribeHandle(uuid, false)}}
      >Unsubscribe</button>
      )
    :
    (
      <button className="btn btn-primary"
      onClick = { () => {subscribeHandle(uuid, true)}}
      >Subscribe</button> )
)
}

export default ClubSubscription