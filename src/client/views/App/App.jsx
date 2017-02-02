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
          Built with <span title="rage!" className="rage"></span> by Variola from &lt;<a target="_blank" href="http://forum.theorycraft.fi/topic/185/we-are-currently-looking-for-the-following-classes" className="theorycraft">Theorycraft</a>&gt;
        </div>
      </footer>
    </div>
  )
}
