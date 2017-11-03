import React, { Component } from 'react';
import { Container, Segment, Button, Divider } from 'semantic-ui-react';
import { Icon, Menu, Table } from 'semantic-ui-react';
import { Header, Modal, Form, Confirm } from 'semantic-ui-react';
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {user_data : [], 
                  id : '', 
                  name : '', 
                  email_address : '', 
                  phone : '', 
                  modalAddUserOpen : false,
                  total_data : 0,
                  current_page : 1
                }
  }

  componentDidMount(){
    axios.get('http://localhost:3001/user', {params : {page : this.state.current_page, row_per_page : 4}}).then(response => {
      this.setState({user_data : response.data.users, total_data : response.data.count});
    }).catch(err => {
      console.log(err);
    });
  }

  getUserWithPaging = (page) => {
    axios.get('http://localhost:3001/user', {params : {page : page, row_per_page : 4}}).then(response => {
      this.setState({user_data : response.data.users, total_data : response.data.count, current_page : this.state.current_page});
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
          <UserFrom clicked = {this.handleOpenModal} 
                    opened = {this.state.modalAddUserOpen} 
                    handleChange = {this.handleChange}
                    name = {this.state.name}
                    email_address = {this.state.email_address}
                    phone = {this.state.phone}
                    addUser = {this.addUser} />
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
            <Paging clicked = {this.getUserWithPaging} current_page = {this.state.current_page} total_data = {this.state.total_data} />
          </Table>
        </Segment>
      </Container>
    );
  }
}

class UserFrom extends Component{
  render(){
    return(
          <Modal trigger={<Button onClick={this.props.handleOpenModal} primary>Add</Button>} open = {this.props.modalAddUserOpen}>
            <Header content='Update User' />
            <Modal.Content>
              <Form>
                <Form.Input label = 'Name' name = 'name' placeholder = 'Name' value = {this.props.name} onChange = {this.props.handleChange} />
                <Form.Input label = 'Email Address' name = 'email_address' placeholder = 'Email Address' value = {this.props.email_address} onChange = {this.props.handleChange} />
                <Form.Input label = 'Phone No.' name = 'phone' placeholder = 'Phone No.' value = {this.props.phone} onChange = {this.props.handleChange} />
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color='green' onClick = {this.props.addUser}>
                Save
              </Button>
              <Button color='red' onClick = {this.props.handleOpenModal}>
                Cancel
              </Button>
            </Modal.Actions>
          </Modal>
    )
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

class Paging extends Component{

  render() {
    const total_data = this.props.total_data;
    const paging = Math.ceil(total_data/4);
    var  i = 1;
    const menus = [];
    for(i=1;i<=paging;i++){
      menus.push(i);
    }
    return (
            <Table.Footer>
            <Table.HeaderCell colSpan='4'>
              <Menu floated = 'right' pagination>
                <Menu.Item as='a' icon>
                  <Icon name='left chevron' />
                </Menu.Item>
                {menus.map((i) => {
                  return <Menu.Item as='a' key={i} onClick = {() => this.props.clicked(i)}>{i}</Menu.Item>;
                })}
                <Menu.Item as='a' icon>
                  <Icon name='right chevron' />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
            </Table.Footer>
    )
  }
}
export default App;