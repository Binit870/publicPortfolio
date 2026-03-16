export default function StatsBar() {
  return (
    <section className="py-10">
      <div className="flex justify-center gap-10">
        <div>
          <h2 className="text-3xl font-bold">500+</h2>
          <p>Attendees</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">20+</h2>
          <p>Speakers</p>
        </div>

        <div>
          <h2 className="text-3xl font-bold">10+</h2>
          <p>Sessions</p>
        </div>
      </div>
    </section>
  );
}