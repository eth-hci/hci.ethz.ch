export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <div>© {new Date().getFullYear()} ETH Zurich · Human-Computer Interaction</div>
          <div>Connecting HCI students and researchers across ETH</div>
        </div>
        <a
          href="https://forms.gle/if5vx6BPzMqNummD6"
          target="_blank"
          rel="noreferrer"
          className="footer-feedback-link"
        >
          Share Feedback
        </a>
      </div>
    </footer>
  );
}
