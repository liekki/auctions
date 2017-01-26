import React from 'react'

export default ({main, header}) => {
  return (
    <div className="container">
      <div className="header-container">
        {header}
      </div>
      <div className="content">
        {main}
      </div>
      <footer className="footer">
        <div className="footer-content">
          Built with <span title="rage!" className="rage"></span> by Variola from &lt;Theorycraft&gt;
        </div>
      </footer>
    </div>
  )
}
