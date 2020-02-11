import React from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView, StyleSheet, FlatList, StatusBar, Platform, Text, TouchableOpacity, Linking } from 'react-native';
// import { View } from 'native-base';
import Utils from '../utils';
import CONSTANTS from '../constants';
import COLORS from '../constants/Colors';
import Header from '../components/Header';
// import TodoModel from './../api/todos';
import AddTodo from '../components/AddTodo';
import AddTodoButton from '../components/AddTodoButton';
import TodoItem from '../components/TodoItem';
import {connect} from "react-redux";
import {compose} from "redux";
import {getTasksByDate, getAllTasks, addTodo, destroyTodo} from "../actions/todo.actions";

import { ListItem, Card, Button} from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    top: 0,
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'black',
    color: 'white'
  },
});

const propTypes = {
  screen: PropTypes.oneOf([CONSTANTS.ALL, CONSTANTS.ACTIVE, CONSTANTS.COMPLETED]).isRequired,
};

class TodosContainer extends React.Component {
  state = {
    addTodo: false,
    addingTodo: false,
  };

  componentDidMount() {
    this.getAllTask();
  }

  getTaskByDate = async(date) => {
    try {
      const response = await this.props.dispatch(getTasksByDate(date));
      if (!response.success) {
        throw response;
      }
      this.setState({tasks: response.responseBody});
    } catch (error) {
      let errorText;
      if (error.message) {
          errorText = error.message
      }
      errorText = error.responseBody;
      console.log(errorText);
    }
  }

  getAllTask = async () => {
    try {
        const response =  await this.props.dispatch(getAllTasks());
        if (!response.success) {
            throw response;
        }
        this.setState({tasks: response.responseBody});
    } catch (error) {
        let errorText;
        if (error.message) {
            errorText = error.message
        }
        errorText = error.responseBody;
        console.log(errorText);
    }
  }
  
  addTask = async (todo) => {
    try {
        const response =  await this.props.dispatch(addTodo(todo));
        if (!response.success) {
            throw response;
        }
        let addedTask = [response.responseBody]
        let tasks = this.state.tasks
        let updatedTasks = tasks.concat(addedTask)
        this.setState({tasks: updatedTasks});
    } catch (error) {
        let errorText;
        if (error.message) {
            errorText = error.message
        }
        errorText = error.responseBody;
        console.log(errorText);
    }
  }

  deleteTask = async (id) => {
    try {
        const response =  await this.props.dispatch(destroyTodo(id));
        let updatedTasks = this.state.tasks.filter((data) => data.id !== id);
        this.setState({tasks: updatedTasks});
    } catch (error) {
        let errorText;
        if (error.message) {
            errorText = error.message
        }
        errorText = error.responseBody;
        console.log(errorText);
    }
  }

  onAllData = (todos, streamData) => {
    // merge streaming todos data along with current todos
    const todosData = Utils.mergeTodos(todos, streamData);

    // filter data based on "screen": [All | Active | Completed]
    const filteredData = this.filterTodosData(todosData);

    return (
      <FlatList
        style={{ width: '100%', top: 15 }}
        data={filteredData}
        keyExtractor={item => item._id}
        renderItem={({ item: todo }) => (
          <TodoItem todo={todo} onUpdate={this.api.update} onDelete={this.api.destroy} />
        )}
      />
    );
  };

  filterTodosData = (todosData) => {
    const { screen } = this.props;

    switch (screen) {
      case CONSTANTS.ALL:
        return todosData;
      case CONSTANTS.ACTIVE:
        return todosData.filter(todo => !todo.completed);
      case CONSTANTS.COMPLETED:
        return todosData.filter(todo => todo.completed);
    }

    return todosData;
  };

  openFile = (item) => {
    if(item.file.url !== null) {
      var link = "http://192.168.0.102:3000" + item.file.url;
      Linking.openURL(link).catch(err => console.error("Couldn't load page", err))
    }
  }

  render() {
    const isAndroid = Platform.OS === 'android';
    const buttons = ['Yes', 'No']
    renderItem = ({ item }) => (
        <ListItem
          key={item.id.toString()}
          title={item.title}
          leftIcon={{ name: 'av-timer' }}
          bottomDivider
          hidechevron
          rightElement={
            <View>
              <Button
                icon={
                  <Icon
                    name="arrow-right"
                    size={15}
                    color="white"
                  />
                }
                title=""
                onPress={() => {this.openFile(item)}}
              />
            </View>
          }
          
          badge={{ value: (item.completed ? "Delivered" : "Not Delivered"), status: (item.completed ? "success" : "error"), textStyle: { color: 'white' } }}
          
        />
      
    );

    return (
      <View style={{ flex: 1 }}>
        <Header />
        {isAndroid ? (
          <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
        ) : (
          <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
        )}
        <Card
          title='WELCOME'
          image={require('../images/pic2.jpg')}>
          <Text style={{marginBottom: 10}}>
            Here are the list of things you are supposed to receive with their status
          </Text>
          
          <DatePicker
            style={{width: '100%'}}
            date={this.state.date} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="DD-MM-YYYY"
            minDate="01-01-2016"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }} 
            onDateChange={(date) => {this.getTaskByDate(date)}}
          />
        </Card>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={[styles.container, { paddingBottom: this.state.viewPadding }]}
          >
            <FlatList
              style={styles.list}
              data={this.state.tasks}
              renderItem={renderItem}
              
            />
          </View>
          
          {this.state.addingTodo ? (
            <View style={styles.row}>
              <AddTodo
                onAdd={(todo) => {
                  this.setState({ addingTodo: false });
                  this.addTask(todo);
                }}
                onCancelDelete={() => this.setState({ addingTodo: false })}
                onBlur={() => this.setState({ addingTodo: false })}
              />
            </View>
          ) : null}
        </SafeAreaView>
        {this.state.addTodo ? (
          <AddTodoButton onPress={() => this.setState({ addingTodo: true })} />
        ) : null}
      </View>
    );
  }
}

TodosContainer.propTypes = propTypes;

mapStateToProps = (state) => ({
  tasks: state.taskReducer.getAllTasks,
  addTask: state.taskReducer.addTask
})

mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TodosContainer);