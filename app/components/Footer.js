import FilterLink from './FilterLink';

const Footer = () => (
  <p>
    Show:1
    {' '}
    <FilterLink filter="all">
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter="active"
    >
      Active
    </FilterLink>
    {', '}
    <FilterLink filter="completed">
      Completed
    </FilterLink>
  </p>
);

export default Footer;
