import React, { Component } from 'react';
import { Container, Segment, Button, Divider } from 'semantic-ui-react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import { Header, Modal, Form } from 'semantic-ui-react';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {user_data : [], name : '', email_address : '', phone : '', modalAddUserOpen : false}
  }

  componentDidMount(){
    axios.get('http://localhost:3001/user').then(response => {
      this.setState({user_data : response.data});
    }).catch(err => {
      console.log(err);
    });
  }

  addUser = (e) => {
    axios.post('http://localhost:3001/user', {user : {name : this.state.name, email_address : this.state.email_address, phone : this.state.phone}}).then(response => {
      this.setState({user_data: response.data, modalAddUserOpen:false});

    }).catch(err => {
      console.log(err);
    });
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      [name] : value
    });
  }

  handleOpenModal = () => {
    this.setState({
      modalAddUserOpen: true
    }) 
  }

  render() {
    
    return (
      <Container>
        <Segment>
          <Modal trigger={<Button onClick={this.handleOpenModal} primary>Add</Button>} closeIcon open = {this.state.modalAddUserOpen}>
            <Header content='Add New User' />
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
              <Button color='red'>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>

          <Button primary>Edit</Button>
          <Button primary>Delete</Button>
          <Divider />
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email Address</Table.HeaderCell>
                <Table.HeaderCell>Phone No.</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <RowUser data = {this.state.user_data} />
          </Table>
        </Segment>
      </Container>
    );
  }
}

class RowUser extends Component{
  render(){
    return(
      <Table.Body>
        {this.props.data.map((user) => {
          return (
            <Table.Row>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email_address}</Table.Cell>
              <Table.Cell>{user.phone}</Table.Cell>
            </Table.Row>
          )

        })}
      </Table.Body>
    )
  }
}

export default App;