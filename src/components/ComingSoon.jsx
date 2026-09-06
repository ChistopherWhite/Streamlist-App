import { ClapperIcon } from "./Icons.jsx";

/*
  Shared placeholder for pages that are out of scope for now.
  `week` renders "Arriving Week N" for still-upcoming milestones;
  pass `tag` directly instead for anything without a specific week
  (e.g. once the numbered weeks are behind the project).
*/
function ComingSoon({ title, week, tag, description, icon: Icon = ClapperIcon }) {
  const label = tag ?? (week ? `Arriving Week ${week}` : "On the roadmap");

  return (
    <section className="coming-soon">
      <span className="reel">
        <Icon />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="week-tag">{label}</span>
    </section>
  );
}

export default ComingSoon;
