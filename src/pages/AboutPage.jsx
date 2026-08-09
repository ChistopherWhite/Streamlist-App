import ComingSoon from "../components/ComingSoon.jsx";
import { InfoIcon } from "../components/Icons.jsx";

function AboutPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / About</p>
        <h1 className="page-title">About EZTechMovie</h1>
        <p className="page-subtitle">
          The company story, mission, and team will be introduced here.
        </p>
      </div>
      <ComingSoon
        title="Our story is still being edited"
        week={5}
        description="This page intentionally ships without data in Week 1. Company background and mission content will be built out in Week 5."
        icon={InfoIcon}
      />
    </>
  );
}

export default AboutPage;
