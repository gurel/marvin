import electron from 'electron';
import ListenerBase from './ListenerBase';
import Command from '../../../command/Command';
import { SoxRecorder } from './util';

const request = require('request');

const WIT_AI_TOKEN = '2IQP6L6HNSIZT7HJ4GVWG3NC5WN5KDTZ';

export default
class SoxWitAI extends ListenerBase {
  constructor() {
    super();
    this.recorder = new SoxRecorder(electron.remote.app.getPath('userData'));
    this.recorder.on('recordstop', this.onRecognitionResult.bind(this));
  }

  start() {
    this.recorder.start();
  }
  stop() {
    this.recorder.stop();
  }

  onRecognitionResult(event) {
    console.log('Recognition result', event);
    const text = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
    console.log(text);
    if (!event.results[event.results.length - 1].isFinal) {
      console.log(text);
    } else {
      console.log('Final', text);
      this.recognition.stop();
      this.emit('working');
      request(
        {
          method: 'GET',
          uri: `https://api.wit.ai/message?v=20160317&q=${encodeURIComponent(text)}`,
          headers: { Authorization: `Bearer ${WIT_AI_TOKEN}` },
          gzip: true
        },
        (error, response, body) => {
          let intentThreshold = 0.5;
          const responseObj = JSON.parse(body);
          console.log(responseObj);

          if (responseObj._text.indexOf('marvin') > -1) {
            intentThreshold -= 0.3;
          }
          for (let i = 0; i < responseObj.outcomes.length; i++) {
            const outcome = responseObj.outcomes[i];
            if (outcome.confidence > intentThreshold) {
              console.log('Work for', outcome.intent);
              this.emit('workdone', new Command(outcome.intent, outcome._text, outcome.entities));
            }
          }
        }
      );
    }
  }
}
