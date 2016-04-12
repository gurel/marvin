import path from 'path';
import { spawn } from 'child_process';
import EventEmitter from 'events';


class SoxRecorder extends EventEmitter {
  constructor(filepath) {
    super();
    this.regex = new RegExp(/.*\[.*\]\s*Out:(.*)\s*\[(.*)\|(.*)\].*$/i);
    this.audiostarted = false;
    this.recordstarted = false;
    this.isRecording = false;
    this.filepath = filepath;
  }
  start() {
    if (this.isRecording) {
      return false;
    }
    this.isRecording = true;
    this.filename = path.join(this.filepath, `recording_${this._getTimeStamp()}.wav`);
    this.bat = spawn('./.bin/darwin/sox/rec', [
      this.filename,
      'rate', '16k',
      'vad', '-t', '7',
      'silence', '1', '1', '5%', '1', '2.1', '3%'
    ]);
    if (!this.bat.stderr) {
      throw new Error('stderr could not be found on spawned process!');
    }
    this.bat.stderr.setEncoding('utf8');
    this.bat.stderr.on('data', (data) => {
      const m = this.regex.exec(data);
      if (m !== null) {
        const hasAudio = (m[2].trim().length > 0 || m[3].trim().length > 0);

        if (!this.audiostarted && hasAudio) {
          this.audiostarted = true;
          this.emit('audiostart');
          console.log('audio Started');
        }
        if (!this.recordstarted && hasAudio) {
          console.log('Record Started');
          this.recordstarted = true;
          this.emit('recordstart');
        }
        if (this.audiostarted && !hasAudio) {
          this.audiostarted = false;
          this.emit('audiostop');
          console.log('audio stoped');
        }
      }
    });

    this.bat.on('exit', (code) => {
      console.log(`Child exited with code ${code}`);
      if (this.recordstarted) {
        this.emit('recordstop', this.filename);
        this.recordstarted = false;
      }
      this.isRecording = false;
      this.emit('exit');
    });
  }
  stop() {
    this.bat.stderr.removeEventListeners();
    if (this.recordstarted) {
      this.emit('exit');
    }
  }
  _getTimeStamp() {
    return Math.round(new Date().getTime() / 1000);
  }
}

module.exports = SoxRecorder;
