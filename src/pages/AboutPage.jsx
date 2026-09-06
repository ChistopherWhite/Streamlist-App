import {
  PiFilmSlateBold,
  PiSparkleFill,
  PiDeviceMobileBold,
  PiCloudCheckBold,
  PiGithubLogoBold,
} from "react-icons/pi";

const TEAM = [
  { name: "Jonas Wilke", role: "Project Lead / Frontend" },
  { name: "David Patty", role: "Backend / API Integration" },
  { name: "Christopher White", role: "QA / Documentation" },
];

const VALUES = [
  {
    icon: PiFilmSlateBold,
    title: "One list, every service",
    description:
      "StreamList doesn't care which platform a title lives on. Track what you're watching across Netflix, Prime Video, Disney+, and more, in one place.",
  },
  {
    icon: PiSparkleFill,
    title: "Built around real discovery",
    description:
      "Search is powered by The Movie Database, so finding something new doesn't mean retyping titles by hand or leaving the app.",
  },
  {
    icon: PiDeviceMobileBold,
    title: "Installable, not just a website",
    description:
      "StreamList is a Progressive Web App — install it to your desktop or phone's home screen and open it like any other app, no browser tab required.",
  },
  {
    icon: PiCloudCheckBold,
    title: "Never lose your list",
    description:
      "Everything you add is saved automatically. Refresh the page, close the tab, or reopen the app tomorrow — your list is exactly how you left it.",
  },
];

function AboutPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / About</p>
        <h1 className="page-title">About EZTechMovie</h1>
        <p className="page-subtitle">
          StreamList is EZTechMovie's answer to a simple problem: your watchlist shouldn't be
          scattered across five different apps.
        </p>
      </div>

      <section className="about-block">
        <h2 className="about-heading">Our story</h2>
        <p className="about-text">
          EZTechMovie started as a class capstone project with a straightforward goal: build a
          streaming companion app the way a real product team would, one milestone at a time.
          Over five weeks that meant standing up the app's navigation and core StreamList feature,
          layering in editing and persistence, connecting a real external API, running the codebase
          through an AI-assisted review pass, and finally packaging the result as an installable
          Progressive Web App. What you're using now is the sum of all five stages, not a rewrite —
          the same StreamList component from week one is still what renders your list today.
        </p>
      </section>

      <section className="about-block">
        <h2 className="about-heading">What we care about</h2>
        <div className="values-grid">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div className="value-card" key={title}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-block">
        <h2 className="about-heading">Meet the team</h2>
        <div className="team-grid">
          {TEAM.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="team-avatar">
                {member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>
              <p className="team-name">{member.name}</p>
              <p className="team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-block">
        <h2 className="about-heading">Built with</h2>
        <div className="tech-tags">
          <span className="tech-tag">React</span>
          <span className="tech-tag">React Router</span>
          <span className="tech-tag">Vite</span>
          <span className="tech-tag">TMDB API</span>
          <span className="tech-tag">localStorage</span>
          <span className="tech-tag">Service Workers</span>
          <span className="tech-tag">react-icons</span>
        </div>
        <p className="about-text" style={{ marginTop: 16 }}>
          <PiGithubLogoBold style={{ verticalAlign: "-2px", marginRight: 6 }} />
          Course project for INT499, built across Weeks 1–5.
        </p>
      </section>
    </>
  );
}

export default AboutPage;
