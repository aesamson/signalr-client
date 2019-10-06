import React, { Component } from 'react';
import {getAuthToken, connectToServer} from '../tools/connectionHelper';
import Message from './Message.jsx';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nick: '',
      group: 'first',
      message: '',
      messages: [],
      hubConnection: null,
    };
  }

  componentDidMount = () => {
    var {server} = this.props;
    const nick = window.prompt('Your name:', 'John');

    getAuthToken(server, nick)
      .then(token => connectToServer(server, token))
      .then(connection => {        
        connection.on('message', (message) => {
          this.pushNewMessage(message.group, message.nick, message.message);
        });
        connection.on('joined', (message) => {
          this.pushNewMessage(message.group, message.nick, 'joined');
        });
        connection.on('lost', (message) => {
          this.pushNewMessage(message.group, message.nick, 'lost');
        });
        connection.onclose(() => {
          console.log('connection closed');
        });
        connection.on('mirror', (message) => {
          connection
            .invoke(message.method, message.payload)
            .catch(err => console.error(err));
        });    

        this.setState({ hubConnection: connection, nick }, () => {
          this.state.hubConnection
            .start()
            .then(() => console.log('Connection started!'))
            .catch((err) => console.error('Error while establishing connection'));
        });
      });
  };

  pushNewMessage = (group, user, message) => {
    const {messages} = this.state;

    this.setState({ 
      messages: messages.concat([{group, user, message}])
     });
  }

  onChangeMessage = (e) => {
    this.setState({ message: e.target.value })
  }

  onChangeGroup = (e) => {
    this.setState({ group: e.target.value })
  }

  postMessage = (e) => {
    const {message, group, nick} = this.state;

    if (!message)
      return;

    this.state.hubConnection
      .invoke('post', {message, group, nick})
      .catch(err => console.error(err));

      this.setState({message: ''});
  };

  joinGroup = () => {
    const {group, nick} = this.state;

    this.state.hubConnection
      .invoke('join', {group, nick})
      .catch(err => console.error(err));
  }

  leaveGroup = () => {
    const {group, nick} = this.state;

    this.state.hubConnection
      .invoke('leave', {group, nick})
      .catch(err => console.error(err));
  }

  renderMessages = (messages) => {
    return messages.map((message, index) => (
      <Message 
        key={`chat-message-${index}`}
        chat={message.group}
        user={message.user}
        message={message.message} />)
      );
  }

  render() {
    return (
      <div className='chat-container'>
        <div className='chat-group'>
          <div>Chat</div>
          <input value={this.state.group} onChange={this.onChangeGroup}/>
        </div>
        <div className='chat-message-body'>
          <div>Message</div>
          <input value={this.state.message} onChange={this.onChangeMessage}/>
        </div>
        <div className='chat-buttons'>
          <button onClick={this.postMessage}>Post</button>
          <button onClick={this.joinGroup}>Join</button>
          <button onClick={this.leaveGroup}>Leave</button>
        </div>
        <div className='chat-messages'>
          {this.renderMessages(this.state.messages)}
        </div>        
      </div>
    );
  }
}

export default Chat;
