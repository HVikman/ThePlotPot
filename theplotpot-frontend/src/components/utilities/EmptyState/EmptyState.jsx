import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './EmptyState.css'

const EmptyState = ({ title, description, actionLabel, actionTo, secondaryAction }) => {
  return (
    <div className="empty-state">
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {(actionTo || secondaryAction) && (
        <div className="empty-state__actions">
          {actionTo && (
            <Link to={actionTo}>
              <Button variant="secondary">{actionLabel}</Button>
            </Link>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}

export default EmptyState