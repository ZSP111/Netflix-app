import './Spinner.css'

const Spinner = ({ full = false }) => (
  <div className={full ? 'spinner-page' : 'spinner-wrap'} role="status" aria-label="Loading">
    <div className="spinner" />
  </div>
)

export default Spinner
