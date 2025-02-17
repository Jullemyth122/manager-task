import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TaskLayout from './TaskLayout'
import Error from './error/Error'
import Dashboard from './components/Dashboard'
import './scss/navigation.scss'
import LoginManager from './components/LoginManager'
import RegisterManager from './components/RegisterManager'
import PublicRoute from './components/PublicRoute'
import PrivateRoute from './components/PrivateRoute'
import Maintenance from './components/Maintenance'



const router = createBrowserRouter([
  {
    path:'/',
    element:(
      <TaskLayout/>
    ),
    errorElement: <Error/>,
    children:[{
      path:'/dashboard',
      element:(
        <PrivateRoute>
          <Dashboard/>
        </PrivateRoute>
      ),
      errorElement:<Error/>  
    },{
      path:'/loginmanager',
      element:(
          <PublicRoute>
            <LoginManager/>
          </PublicRoute>
      ),
      errorElement: <Error/>
    }
    ,{
      path:'/registermanager',
      element:(
        <PublicRoute>
          <RegisterManager/>
        </PublicRoute>
      ),
      errorElement: <Error/>
    }
    ,{
      path:'/maintenance',
      element:(
        <PrivateRoute>
          <Maintenance/>
        </PrivateRoute>
      ),
      errorElement: <Error/>
    }
    ]
  }
])

function App() {

  // const { currentUser } = useAuth();


  return (<RouterProvider router={router}/> )
}

export default App
