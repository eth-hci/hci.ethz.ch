import type { Resource } from "../lib/types";

type Props = {
  resources: Resource[];
};

export default function ResourcesSection({ resources }: Props) {
  return (
    <section id="resources" className="section">
      <header className="section-header">
        <p className="eyebrow">Resources</p>
        <h2>For students & collaborators</h2>
        <p>
          Templates, design systems, and documentation to help you start
          working with the ETH HCI group.
        </p>
      </header>
      <div className="card-grid">
        {resources.map((resource) => (
          <article key={resource.title} className="card">
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
