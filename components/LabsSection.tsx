import type { Lab } from "../lib/types";

type Props = {
    labs: Lab[];
};

export default function LabsSection({ labs }: Props) {
    return (
        <section id="labs" className="section">
            <header className="section-header">
                <p className="eyebrow">Research</p>
                <h2>Labs</h2>
                <p>
                    Browse the labs in ETH Zurich’s HCI network and find opportunities for projects, theses, and collaboration. 
                </p>
            </header>
            <div className="lab-grid">
                {labs.map((lab) => (
                    <a
                        key={lab.name}
                        href={lab.link || "#"}
                        className="card lab-card"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <div className="lab-card-figure" aria-hidden="true">
                            {lab.teaser ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={lab.teaser} alt="" />
                            ) : (
                                <div className="lab-card-figure-placeholder" />
                            )}
                        </div>
                        <div className="lab-card-body">
                            <h3>{lab.name}</h3>
                            {lab.faculty && (
                                <p className="lab-card-faculty">{lab.faculty}</p>
                            )}
                            {lab.department && (
                                <p className="lab-card-dept">{lab.department}</p>
                            )}
                            {lab.focus && (
                                <p className="lab-card-focus">{lab.focus}</p>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
