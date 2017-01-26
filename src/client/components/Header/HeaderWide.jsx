import React from 'react'
import { SearchForm } from 'components'
import { Link } from 'react-router'

export default () => (
  <header className="header header-wide">
    <Link to="/"><h1 className="logo"></h1></Link>
    <SearchForm />
  </header>
)
