import ComingSoon from "../components/ComingSoon.jsx";
import { ClapperIcon } from "../components/Icons.jsx";

function MoviesPage() {
  return (
    <>
      <div className="page-header">
        <p className="page-eyebrow">EZTechMovie / Movies</p>
        <h1 className="page-title">Browse Movies</h1>
        <p className="page-subtitle">
          The full EZTechMovie catalog will live here — search, filters, and cards for every title.
        </p>
      </div>
      <ComingSoon
        title="The catalog is still in the projector room"
        week={4}
        description="This page intentionally ships without data in Week 1. Movie listings, posters, and search will be built out in Week 4."
        icon={ClapperIcon}
      />
    </>
  );
}

export default MoviesPage;
