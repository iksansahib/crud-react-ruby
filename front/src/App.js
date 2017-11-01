import React, { Component } from 'react';
import { Container, Segment, Button, Divider } from 'semantic-ui-react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import { Header, Modal, Form, Confirm } from 'semantic-ui-react';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {user_data : [], id : '', name : '', email_address : '', phone : '', modalAddUserOpen : false}
  }

  componentDidMount(){
    axios.get('http://localhost:3001/user').then(response => {
      this.setState({user_data : response.data});
    }).catch(err => {
      console.log(err);
    });
  }

  addUser = (e) => {
    if(this.state.id === '')
    {
      axios.post('http://localhost:3001/user', {user : {name : this.state.name, email_address : this.state.email_address, phone : this.state.phone}}).then(response => {
        this.setState({user_data: response.data, modalAddUserOpen:false});
      }).catch(err => {
        console.log(err);
      });      
    }else{
      axios.put('http://localhost:3001/user/' + this.state.id, {user : {name : this.state.name, email_address : this.state.email_address, phone : this.state.phone}}).then(response => {
        this.setState({user_data: response.data, modalAddUserOpen:false});

      }).catch(err => {
        console.log(err);
      });      

    }
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      [name] : value
    });
  }

  handleOpenModal = (user) => {
    if(user.id === undefined){
      this.setState({
        id : '',
        name : '',
        email_address : '',
        phone : '',
        modalAddUserOpen: !this.state.modalAddUserOpen
      })       
    }else{
      axios.get('http://localhost:3001/user/' + user.id).then(response => {
        this.setState({id : response.data.id,
                       name : response.data.name,
                       email_address : response.data.email_address,
                       phone : response.data.phone,
                       modalAddUserOpen : true
                      });
      }).catch(err => {
        console.log(err);
      });
    }
  }

  deleteUser = (user) => {
    if(user.id !== undefined)
    {
      axios.delete('http://localhost:3001/user/' + user.id).then(response => {
        this.setState({id : '',
                       name : '',
                       email_address : '',
                       phone : '',
                       user_data : response.data
                      });

      }).catch(err => {
        console.log(err);
      });    
    }
  }

  render() {
    
    return (
      <Container>
        <Segment>
          <Modal trigger={<Button onClick={this.handleOpenModal} primary>Add</Button>} open = {this.state.modalAddUserOpen}>
            <Header content='Update User' />
            <Modal.Content>
              <Form>
                <Form.Input label = 'Name' name = 'name' placeholder = 'Name' value = {this.state.name} onChange = {this.handleChange} />
                <Form.Input label = 'Email Address' name = 'email_address' placeholder = 'Email Address' value = {this.state.email_address} onChange = {this.handleChange} />
                <Form.Input label = 'Phone No.' name = 'phone' placeholder = 'Phone No.' value = {this.state.phone} onChange = {this.handleChange} />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick = {this.addUser}>
                Save
              </Button>
              <Button color='red' onClick = {this.handleOpenModal}>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
          <Divider />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email Address</Table.HeaderCell>
                <Table.HeaderCell>Phone No.</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <RowUser data = {this.state.user_data} edited = {this.handleOpenModal} deleted = {this.deleteUser} />
          </Table>
        </Segment>
      </Container>
    );
  }
}

class RowUser extends Component{
  constructor(props){
    super(props);
    this.state = ({ openConfirmDelete : false});
  }

  openConfirm = (e) => {
    this.setState({ openConfirmDelete : !this.state.openConfirmDelete });
  }

  deleteUser = (user) => {
    this.props.deleted(user);
    this.openConfirm();
  }

  render(){
    return(
      <Table.Body>
        {this.props.data.map((user) => {
          return (
            <Table.Row key = {user.id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email_address}</Table.Cell>
              <Table.Cell>{user.phone}</Table.Cell>
              <Table.Cell>
                <Button.Group>
                  <Button positive icon = 'edit' onClick = {() => this.props.edited(user)} />
                  <Button negative icon = 'delete' onClick = {this.openConfirm} />
                  <Confirm
                    open={this.state.openConfirmDelete}
                    onCancel={this.openConfirm}
                    onConfirm={(e) => this.deleteUser(user)}
                  />
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          )

        })}
      </Table.Body>
    )
  }
}

export default App;