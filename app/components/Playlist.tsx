// Matches the profile page's existing `.section` + <h2> convention exactly, so the
// embed reads as a native section rather than a pasted-in third-party widget.
export default function Playlist() {
  return (
    <section className="section">
      <h2>On Repeat</h2>
      <iframe
        src="https://open.spotify.com/embed/playlist/3D0Jgry0DAcrcYlwWsMVLx?utm_source=generator&theme=0"
        width="100%"
        height={152}
        frameBorder={0}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Playlist"
        style={{ borderRadius: 12, colorScheme: "normal" }}
      />
    </section>
  );
}
