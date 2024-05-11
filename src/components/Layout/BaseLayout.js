import React from 'react'
import Header from '../header/Header'

export default function BaseLayout(props) {
    const { children } = props.children;
  return (
    <div className="wrapper">
      <main className="main-container" style={{ overflow: 'hidden' }}>
        <Header />
        {children}
      </main>
  </div>
  )
}

BaseLayout.defaultProps = {
    children: [],
    user: {},
  };
