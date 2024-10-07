import routers from './router';  
import { RouterProvider } from 'react-router-dom'; 

function App() {
  return (  
    <RouterProvider router={routers} />  
  );  
}

export default App
