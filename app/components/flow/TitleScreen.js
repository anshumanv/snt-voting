import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography'

const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

class TitleScreen extends Component {

  state = {
    time: {},
    seconds: -1,
    initTimer: false
  }

  timer = 0

  secondsToTime(secs){
    let days = Math.floor(secs / 86400);
    let divisor_for_hours = secs % 86400;
    let hours = Math.floor(divisor_for_hours / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let obj = {
      "d": days,
      "h": hours,
      "m": minutes
    };

    return obj;
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(() => this.countDown(), 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  componentDidMount(){
    if(this.props.polls && this.props.polls.length){
      this.initTimer();
    }
  }

  componentDidUpdate(prevProps){
    if (this.props.polls !== prevProps.polls && this.props.polls && this.props.polls.length) {
      this.initTimer();
    }
  }

  initTimer(){
    if(this.state.initTimer) return;

    this.setState({initTimer: true});
    
    const idPoll = this.props.polls[this.props.polls.length - 1].idPoll;
    const seconds = this.props.polls[idPoll]._endTime - (new Date()).getTime() / 1000
    if(seconds > 0){
      let timeLeftVar = this.secondsToTime(seconds);
      this.setState({ time: timeLeftVar, seconds });
      this.startTimer();
    } else {
      this.setState({seconds});
    }
  }

  render(){
    const {time, seconds} = this.state;
    const {polls} = this.props;

    if(!polls || !polls.length) return null;

    const  idPoll = polls[polls.length - 1].idPoll;
    const title = polls[idPoll].content.title;
    const description = polls[idPoll].content.description;
    const canceled = polls[idPoll]._canceled;
    
    return (!canceled ? <div>
      <div className="section">
        <img src="images/status-logo.svg" width="36" />
        <Typography variant="headline">{title}</Typography>
        <Typography variant="body1" component="div" dangerouslySetInnerHTML={{__html: description}}></Typography>
      </div>
      <hr />
      { seconds > 0 && <div className="votingTimer">
        <Typography variant="body1">Voting ends in</Typography>
        <ul>
          <li>
            <Typography variant="headline">{pad(time.d, 2)}</Typography>
            <Typography variant="body1" className="timeUnit">Days</Typography>
          </li>
          <li>
            <Typography variant="headline">{pad(time.h, 2)}</Typography>
            <Typography variant="body1" className="timeUnit">Hours</Typography>
          </li>
          <li>
            <Typography variant="headline">{pad(time.m, 2)}</Typography>
            <Typography variant="body1" className="timeUnit">Mins</Typography>
          </li>
        </ul>
        <div className="action">
          <Link to={"/learn/" + idPoll}><Button variant="contained" color="primary">Get started</Button></Link>
        </div>
      </div>}
      { seconds < 0 && <div className="pollClosed">
        <Typography variant="headline">Poll closed</Typography>
        <Typography variant="body1">The vote was finished {parseInt(Math.abs(seconds) / 86400, 10)} day(s) ago</Typography>
        <div className="action">
          <Link to={"/results/" + idPoll}><Button variant="contained" color="primary">View results</Button></Link>
        </div>
      </div> }
    </div> : null);
  }
}

export default TitleScreen;