const tmi = require('tmi.js')

const streamer = 'Meg'
const channel = 'megturney'
var wins = 0
var total = 0
var percentage = null
var reply = null
var previouscommand = null

const options= {
  options: {
    debug: true,
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: 'Deadbydaylightpercentage',
    password: 'oauth:apru5o9jpz4ui1l0lx2f0zqfkvdpxv'
  },
  channels: [`${channel}`]
};

const client = new tmi.client(options);

client.connect();


client.on('chat', (channel, user, message, self) => {
  username = user["display-name"].toLowerCase();
  let badges = null
  let level = false
  if (user[`badges`] !== null){
    badges = Object.keys(user[`badges`])
    level = badges.includes('moderator') || badges.includes('broadcaster')
  }
  if (message === '!perc'){
    if (total !== 0){
      percentagecalc();
      reply = `${streamer} has survived ${percentage}% of their survivor game this stream.`
      additionalreply();
      client.action(`${channel}`, `@${user["display-name"]}` + ` ` + `${reply}`)
    }
    else{
      reply = `The first game isn't over. Wish ${streamer} good luck!`
      client.action(`${channel}`, `@${user["display-name"]}` + ` ` + `${reply}`)
    }
  }
  else if (username === 'dai101' || level === true){
    if(message === '!win'){
      ++wins
      ++total
      percentagecalc();
      previouscommand = 'win'
      reply = `${streamer} has survived ${percentage}% of their survivor game this stream.`
      additionalreply();
      client.action(`${channel}`, `${reply}`)
    }
    else if(message === '!death'){
      ++total
      percentagecalc();
      previouscommand = 'death'
      reply = `${streamer} has survived ${percentage}% of their survivor game this stream.`
      additionalreply();
    }
    else if(message === '!opps'){
      if(previouscommand === 'win'){
        --wins
        --total
        percentagecalc();
        reply = `${streamer} has survived ${percentage}% of their survivor game this stream.`
        additionalreply();
      }
      else if(previouscommand === 'death'){
        --total
        percentagecalc();
        reply = `${streamer} has survived ${percentage}% of their survivor game this stream.`
        additionalreply();
      }
    }
  }
});

const percentagecalc = () => {
  percentage = wins/total * 100
  percentage = Math.round((percentage + Number.EPSILON) * 100) / 100
}

const additionalreply= () => {
  if(percentage === 0 && total === 1){
    reply = reply + ` ` +  `Not a great start but we've got plenty of time`
  }else if(percentage === 0 && total !== 1){
    reply = reply + ` ` +  `Oh... oh no...`
  }
  else if(percentage <6){
    reply = reply + ` ` +  `It's a really hard game...`
  }
  else if(percentage <10){
    reply = reply + ` ` +  `It's not been the best night`
  }
  else if(percentage <20){
    reply = reply + ` ` +  `${streamer} could use your support at this time. Keep cheering them on`
  }
  else if(percentage <30){
    reply = reply + ` ` +  `We're getting there bit by bit`
  }
  else if(percentage === 33.33){
    reply = reply + ` ` +  `Third of all games so far. Not bad.`
  }
  else if(percentage <40){
    reply = reply + ` ` +  `Keep going ${streamer}! You got this.`
  }
  else if(percentage <50){
    reply = reply + ` ` +  `Not bad. Not bad at all`
  }
  else if(percentage <60){
    reply = reply + ` ` +  `They're doing great! Go ${streamer}!`
  }
  else if(percentage === 66.67){
    reply = reply + ` ` +  `Like meatloaf said, 'Two out of three ain't bad'`
  }
  else if(percentage <70){
    reply = reply + ` ` +  `Making it clear they're a Boss!`
  }
  else if(percentage <80){
    reply = reply + ` ` +  `Showing they're 1337 survivor skillz.`
  }
  else if(percentage <90){
    reply = reply + ` ` +  `Making they're opponents regret the day they clicked on killer!`
  }
  else if(percentage <100){
    reply = reply + ` ` +  `They're absolutely killing it! How ironic...`
  }
  else if(percentage === 100 && total !== 1){
    reply = reply + ` ` + `They're the best there is at what they do!`
  }
  else if(percentage === 100 && total === 1){
    reply = reply + ` ` + `They're off to a great start!`
  };
}
