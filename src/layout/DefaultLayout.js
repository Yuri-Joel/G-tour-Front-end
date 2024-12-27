import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import UseAuth from '../hooks/hooks'
import Login from '../views/pages/login/Login'

const DefaultLayout = () => {

  const {user} = UseAuth()

  return (
   <>
          {
            user.status ? 
            <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
              <AppHeader />
              <div className="body flex-grow-1">
            <AppContent />
            </div>
            <AppFooter />
          </div>
        </div>
            : 
        <Login />

          }
     </>    
      
  )
}

export default DefaultLayout
