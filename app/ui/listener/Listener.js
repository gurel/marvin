import React, { Component } from 'react';
import style from './Listener.css';
import { ipcRenderer } from 'electron';
import listeners from './listeners';
import classNames from 'classnames';

export default class Listener extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      online: window.navigator.onLine,
      active: true,
      working: false,
      speaking: false
    };
  }
  componentDidMount() {
    this.initRecognition();
    this.bindEvents();
    ipcRenderer.send(window.navigator.onLine ? 'listener-active' : 'listener-error');
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (!(nextState.online && !nextState.working) && !nextState.online) {
      ipcRenderer.send('listener-error');
      return true;
    }
    if (!nextState.active) {
      ipcRenderer.send('listener-deactive');
    } else if (nextState.working) {
      ipcRenderer.send('listener-working');
    } else {
      ipcRenderer.send('listener-active');
    }
    return true;
  }
  componentWillUnmount() {
    this.recognition.stop();
  }
  onRecognitionEnd() {
    console.log('Recognition end', this.state);
    if (this.state.online && !this.state.working) {
      this.recognition.start();
    }
  }
  onMarvinClicked() {
    this.setState({ active: !this.state.active });
  }
  bindEvents() {
    window.addEventListener('offline', () => {
      this.setState({ online: false }, () => {
        this.recognition.stop();
      });
    });
    window.addEventListener('online', () => {
      this.setState({ online: true }, () => {
        this.recognition.start();
      });
    });
  }
  initRecognition() {
    this.recognition = new listeners.SoxWitAI();
    this.recognition.on('end', () => this.onRecognitionEnd());
    this.recognition.on('speech_start', () => {
      console.log('speech_start');
      this.setState({ speaking: true });
    });
    this.recognition.on('speech_end', () => {
      console.log('speech_end');
      this.setState({ speaking: false });
    });
    this.recognition.on('working', () => {
      this.setState({ working: true }, () => {
        this.recognition.stop();
      });
    });
    this.recognition.on('workdone', (command) => {
      this.setState({ working: false }, () => {
        if (command.intent === 'listening_state') {
          console.log(command);
        }
        if (this.state.active) {
          ipcRenderer.send('listener-intent', command);
        }
        this.recognition.start();
      });
    });
    this.recognition.start();
  }
  render() {
    return (
			<div className={style.container} onClick={this.onMarvinClicked.bind(this)}>
        <div
          className={
            classNames(
              style.circle,
              { [style.red]: !this.state.online }
            )
          }
        >
        </div>
        <div
          className={
            classNames(
              style.circle,
              { [style.yellow]: this.state.online && this.state.working }
            )
          }
        >
        </div>
        <div
          className={
            classNames(
              style.circle,
              {
                [style.green]: this.state.online && this.state.active && !this.state.speaking,
                [style.blue]: this.state.online && this.state.speaking
              }
            )
          }
        >
        </div>
			</div>
    );
  }
}
