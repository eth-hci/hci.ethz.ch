export default function HeroSection() {
    return (
        <section className="hero">
            <div className="hero-text">
                <p className="eyebrow">ETH Zurich · Human–Computer Interaction</p>
                <h1 style={{ fontSize: "2.5rem" }}>The HCI Community at ETH Zurich</h1>

                <p className="lead">
                    We connect students and researchers across ETH Zurich who design, build, and study interactive technologies. Our community spans computer science, cognitive science, education, architecture, and the social sciences, with research ranging from interfaces and AR/VR to human-AI collaboration, learning technologies, visualization, and security & privacy.
                </p>
                <div className="hero-actions">
                    <a href="#labs" className="button primary">
                        Explore labs
                    </a>
                    <a href="#courses" className="button ghost">
                        See courses
                    </a>
                </div>
            </div>
            <div className="hero-media">
                <img src="/hci2026.jpg" alt="HCI group photo" className="hero-image" />
            </div>
        </section>
    );
}
