
import './App.css';
import Header from './components/Header';
import Todo_update from './components/Todo_update';
import Add_task from './components/Add_task';
import Table_list from './components/Table_list';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Header></Header>
        <Table_list></Table_list>
      </header>
    </div>
  );
}

export default App;
