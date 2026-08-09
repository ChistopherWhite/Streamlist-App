import { ClapperIcon } from "./Icons.jsx";

/*
  Shared placeholder for pages that are scoped for later weeks of the
  project (Movies, Cart -> Week 4, About -> Week 5). Deliberately holds
  no data yet, per the assignment brief.
*/
function ComingSoon({ title, week, description, icon: Icon = ClapperIcon }) {
  return (
    <section className="coming-soon">
      <span className="reel">
        <Icon />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="week-tag">Arriving Week {week}</span>
    </section>
  );
}

export default ComingSoon;
