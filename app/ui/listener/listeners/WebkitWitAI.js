/* global webkitSpeechRecognition b:true */
/* eslint new-cap: ["error", {"newIsCapExceptions": ["webkitSpeechRecognition"]}] */

import ListenerBase from './ListenerBase';
import Command from '../../../command/Command';

const request = require('request');
const WIT_AI_TOKEN = '2IQP6L6HNSIZT7HJ4GVWG3NC5WN5KDTZ';

export default
class WebkitWixIO extends ListenerBase {
  constructor() {
    super();
    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.onstart = () => console.log('Recognition started');
    this.recognition.onresult = (event) => this.onRecognitionResult(event);
    this.recognition.onerror = (event) => console.log('Recognition error', event);
    this.recognition.onend = () => this.emit('end');
    this.recognition.onspeechstart = () => this.emit('speech_start');
    this.recognition.onspeechend = () => this.emit('speech_end');
    this.recognition.onsoundstart = () => this.emit('sound_start');
    this.recognition.onsoundend = () => this.emit('sound_end');
  }
  start() {
    this.recognition.start();
  }
  stop() {
    this.recognition.stop();
  }
  onRecognitionResult(event) {
    console.log('Recognition result', event.results);
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log(text);
    if (!event.results[event.results.length - 1].isFinal) {
      console.log(text);
    } else {
      console.log('Final', text);
      this.recognition.stop();
      this.emit('working');
      request({
        method: 'GET',
        uri: `https://api.wit.ai/message?v=20160317&q=${encodeURIComponent(text)}`,
        headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` },
        gzip: true
      }, (error, response, body) => {
        const responseObj = JSON.parse(body);
        console.log(responseObj);

        let intentThreshold = 0.5;
        if (responseObj._text.indexOf('marvin') > -1) {
          intentThreshold -= 0.3;
        }
        for (let i = 0; i < responseObj.outcomes.length; i++) {
          const outcome = responseObj.outcomes[i];
          if (outcome.confidence > intentThreshold) {
            console.log('Work for ', outcome.intent);
            this.emit('workdone', new Command(outcome.intent, outcome._text, outcome.entities));
          }
        }
      });
    }
  }
}
