import { series } from "@/data/blogData"

export default function SeriesCard() {
  return (
    <div className="rounded-xl bg-card p-6 border shadow-sm">

      <h3 className="font-semibold mb-4">
        Blog Series
      </h3>

      <div className="space-y-4">

        {series.map((s, i) => (
          <div key={i} className="flex items-start gap-3">

            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>

            <div>
              <h4 className="text-sm font-medium">
                {s.title}
              </h4>

              <p className="text-xs text-muted-foreground">
                {s.completedParts}/{s.totalParts} parts ·{" "}
                {s.completedParts === s.totalParts
                  ? "Complete"
                  : "Ongoing"}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}