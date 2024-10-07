import { createBrowserRouter, RouterProvider, Route, Navigate } from 'react-router-dom';  
import {Editor} from './pages/editor/index';  

const routers = [  
  { path: '/', element: <Navigate to="/editor" replace /> },  
  { path: '/editor', element: <Editor /> },  
];  

export default createBrowserRouter(routers);