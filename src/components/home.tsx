import React, { KeyboardEvent, ReactNode, MouseEvent } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Switch, FormControlLabel, Typography } from '@material-ui/core';

import Email from './email';
import Info from './info';
import Links from './links';
import LinkTree from './visualizer';
import isValidUrl from '../lib/isValidUrl';
import isValidDepth from '../lib/isValidDepth';

import './home.css';

const StyledTextField = withStyles({
  root: {
    'background-color': 'white',
    'margin-bottom': 5,
    'padding': 5,
    'border-radius': 6
  }
})(TextField);

const StyledSelect = withStyles({
  root: {
    'background-color': 'white',
    'margin-bottom': 5,
    'padding': 5,
    'border-radius': 6
  }
})(Select);

const LINKS = 'GET_LINKS';
const INFO = 'GET_INFORMATION';
const EMAILS = 'GET_EMAILS';
const VISUALIZE = 'VIEW_TREE';

type HomeProps = {};

type HomeState = {
  option: string
  url: string
  info: Map<string, string>
  submit: boolean
  useTor: boolean
  depth: number
};

export default class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.state = {option: LINKS, url: '', info: new Map(), submit: false, useTor: true, depth: 1};
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleDepthChange = this.handleDepthChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  handleSubmit(event:  MouseEvent) {
    event.preventDefault();
    if (!isValidUrl(this.state.url)) {
      alert('Invalid URL');
      return;
    }
    if (!isValidDepth(this.state.depth)) {
      alert('Invalid Depth');
      return;
    }
    this.setState({'submit': true});
  }

  handleUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({url: event.target.value});
  }

  handleDepthChange(event: React.ChangeEvent<HTMLInputElement>) {
    const depth = Number(event.target.value);
    if (isValidDepth(depth)) this.setState({ depth });
  }

  handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>, child: ReactNode) {
    this.setState({option: event.target.value});
  }

  toggleSwitch(event: object, switched: boolean) {
    this.setState({useTor: switched});
  }

  keyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSubmit(event as unknown as MouseEvent);
    }
  }

  render() {
    if (!this.state.submit) {
      return (
        <form>
          <StyledTextField label="URL" onKeyDown={this.keyPress} onChange={this.handleUrlChange} fullWidth={true}/>
          {this.state.option === VISUALIZE ? <StyledTextField label="Depth" onKeyDown={this.keyPress} onChange={this.handleDepthChange}/> : null}
          <br/>
          <StyledSelect value={this.state.option} onChange={this.handleSelectChange}>
            <MenuItem value={LINKS}>Get Links</MenuItem>
            <MenuItem value={INFO}>Get Information</MenuItem>
            <MenuItem value={EMAILS}>Get Emails</MenuItem>
            <MenuItem value={VISUALIZE}>View Tree</MenuItem>
          </StyledSelect>
          <br/>
          <Button onClick={this.handleSubmit} variant="contained" color="primary">
              Submit
          </Button>
          <br/>
          <FormControlLabel
              value="torLabel"
              control={<Switch
                          color="primary"
                          value="useTor"
                          checked={this.state.useTor}
                          onChange={this.toggleSwitch}
                        />}
              label={<Typography variant='button' color='primary'>Use Tor</Typography>}
              labelPlacement="start"
            />
        </form>
      );
    }
    switch (this.state.option) {
      case INFO:
        return <Info url={this.state.url} tor={this.state.useTor}/>;
      case LINKS:
        return <Links url={this.state.url} tor={this.state.useTor}/>;
      case EMAILS:
        return <Email url={this.state.url} tor={this.state.useTor}/>;
      case VISUALIZE:
        return <LinkTree url={this.state.url} tor={this.state.useTor} depth={this.state.depth}/>;
      default:
        console.log('Invalid option.');
    }
  }
}
