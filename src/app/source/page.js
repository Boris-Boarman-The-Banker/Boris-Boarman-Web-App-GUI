import React from 'react'
import styles from './source.module.css'
export default function page() {
  return (
    <>
      <div className='d-flex flex-column align-items-center mt-5'>
        <h1 className={styles.sourceHeader}>Are you going to develop an open source project ?</h1>
        <div className="form-check form-switch m-5 d-flex justify-content-center">
          <p className={`form-check-label ${styles.closedSource}`} for="flexSwitchCheckChecked">Closed Source</p>
          <input className={`form-check-input ms-3 me-3 ${styles.switch}`} type="checkbox" id="flexSwitchCheckChecked" />
          <p className={`form-check-label ${styles.openSource}`} for="flexSwitchCheckChecked">Open Source</p>
        </div>
      </div>
    </>
  )
}
