
import './App.css';
import router from './router/index.js'


import { BrowserRouter,Route } from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
          {
            router.map((v,i)=>{
              return (<Route path={v.path} key={v.path} render={route=>{
                return <v.component {...route}></v.component> 
              }}></Route>)
            })
          }
      </BrowserRouter>
    </div>
  );
}

export default App;