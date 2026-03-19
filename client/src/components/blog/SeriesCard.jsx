import { useEffect, useState } from "react";
import { getPublishedBlogsApi } from "@/api/blog.api";

export default function SeriesCard() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getPublishedBlogsApi({ limit: 100 })
      .then((res) => {
        const posts = res?.data?.data || [];
        const groupedSeries = Object.values(
          posts.reduce((acc, post) => {
            const seriesMeta = post?.series;
            const seriesKey = seriesMeta?.seriesId || seriesMeta?.seriesTitle;

            if (!seriesKey || !seriesMeta?.seriesTitle) {
              return acc;
            }

            if (!acc[seriesKey]) {
              acc[seriesKey] = {
                title: seriesMeta.seriesTitle,
                completedParts: 0,
                totalParts: 0,
              };
            }

            acc[seriesKey].completedParts += 1;
            acc[seriesKey].totalParts = Math.max(
              acc[seriesKey].totalParts,
              seriesMeta.partNumber || acc[seriesKey].completedParts
            );

            return acc;
          }, {})
        );

        setSeries(groupedSeries);
      })
      .catch(() => setSeries([]));
  }, []);

  return (
    <div className="rounded-xl bg-card p-6 border shadow-sm">
      <h3 className="font-semibold mb-4">Blog Series</h3>
      <div className="space-y-4">
        {series.map((s, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <h4 className="text-sm font-medium">{s.title}</h4>
              <p className="text-xs text-muted-foreground">
                {s.completedParts}/{s.totalParts} parts &middot;{" "}
                {s.completedParts === s.totalParts ? "Complete" : "Ongoing"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
