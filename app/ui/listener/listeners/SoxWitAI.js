import electron from 'electron';
import ListenerBase from './ListenerBase';
import Command from '../../../command/Command';
import { SoxRecorder } from './util';
import fs from 'fs';

const request = require('request');

const WIT_AI_TOKEN = '2IQP6L6HNSIZT7HJ4GVWG3NC5WN5KDTZ';

export default
class SoxWitAI extends ListenerBase {
  constructor() {
    super();
    this.recorder = new SoxRecorder(electron.remote.app.getPath('userData'));
    this.recorder.on('recordstop', (filename) => {
      this.emit('speech_end');
      this.onRecognitionResult(filename);
    });
    this.recorder.on('recordstart', () => { this.emit('speech_start'); });
  }

  start() {
    this.recorder.start();
  }
  stop() {
    this.recorder.stop();
  }

  onRecognitionResult(filename) {
    console.log(`Final ${filename}`);
    this.recorder.stop();
    this.emit('working');
    fs.createReadStream(filename).pipe(request(
      {
        method: 'POST',
        uri: 'https://api.wit.ai/speech?v=20141022',
        headers: {
          Authorization: `Bearer ${WIT_AI_TOKEN}`
        },
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
        this.recorder.start();
      }
    ));
  }
}
