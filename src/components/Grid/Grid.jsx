import './Grid.css'
import Card from '../Card/Card'

const Grid = ({ items, type }) => (
  <div className="grid">
    {items.map((item) => (
      <Card key={`${item.media_type || type}-${item.id}`} item={item} type={type} />
    ))}
  </div>
)

export default Grid
