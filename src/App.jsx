import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/auth/Login'
import AdminLayout from './Layout/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Quotes from './pages/admin/Quotes'
import QuoteDetailsWrapper from './pages/admin/QuoteDetails'
import QuoteForm from './pages/admin/QuoteForm'
import ProtectedRoute from './components/ProtectedRoute' // ✅ import it

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* ✅ Protected admin routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="quotes" element={<Quotes />} />
              <Route path="quotes/:id" element={<QuoteDetailsWrapper />} />
              <Route path="create-quote" element={<QuoteForm />} />
            </Route>
          </Route>

          {/* Optional: redirect unknown routes to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    )
  }
}
