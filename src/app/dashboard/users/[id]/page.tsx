"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/src/lib/utils/axios";
import { useUserReviews } from "@/src/hooks/useReviews";
import { PageSpinner } from "@/src/components/ui/Spinner";
import Avatar from "@/src/components/ui/Avatar";
import EmptyState from "@/src/components/ui/EmptyState";
import { formatDistanceToNow } from "@/src/lib/utils/date";
import { Star, Mail, Briefcase, ArrowLeft } from "lucide-react";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: async () => {
      const { data } = await api.get("/api/auth/me");
      return data.user as IUser & { _id: string };
    },
    enabled: !!id,
  });

  const { data: reviews } = useUserReviews(id);

  if (isLoading) return <PageSpinner />;
  if (!userData) return (
    <EmptyState icon="👤" title="User not found"
      action={<button onClick={() => router.back()} className="btn btn-secondary">Go back</button>} />
  );

  const name = userData.role === "COMPANY"
    ? userData.companyName || "Company"
    : `${userData.firstName} ${userData.lastName}`.trim();

  const avg = reviews && reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Profile card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative flex-shrink-0">
            <Avatar name={name} size="xl" className="shadow-lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500 capitalize mt-0.5">{userData.role?.toLowerCase()}</p>
            {avg > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Stars rating={avg} />
                <span className="text-sm font-semibold text-gray-700">{avg.toFixed(1)}</span>
                <span className="text-sm text-gray-400">· {reviews?.length} reviews</span>
              </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-sm text-gray-500">
              {userData.email && (
                <span className="flex items-center gap-1.5"><Mail size={13} className="text-gray-400" />{userData.email}</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100">
          <div className="text-center"><p className="text-xl font-bold text-gray-900">{reviews?.length ?? 0}</p><p className="text-xs text-gray-400 mt-0.5">Reviews</p></div>
          <div className="text-center"><p className="text-xl font-bold text-gray-900">{avg > 0 ? avg.toFixed(1) : "—"}</p><p className="text-xs text-gray-400 mt-0.5">Avg Rating</p></div>
          <div className="text-center"><p className="text-xl font-bold text-gray-900">{userData.ratingCount ?? 0}</p><p className="text-xs text-gray-400 mt-0.5">Jobs Done</p></div>
        </div>
      </div>

      {/* Skills */}
      {userData.skills && userData.skills.length > 0 && (
        <div className="card p-6 space-y-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Briefcase size={16} className="text-purple-600" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {userData.skills.map(skill => (
              <span key={skill} className="px-3 py-1.5 bg-purple-50 border border-purple-100 rounded-xl text-sm text-purple-700 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-3">
        <h2 className="font-bold text-gray-900">Reviews</h2>
        {reviews && reviews.length > 0 ? reviews.map(review => {
          const from = review.fromUserId as unknown as { firstName?: string; name?: string };
          const fromName = typeof from === "object"
            ? from.firstName || from.name || "Anonymous"
            : "Anonymous";
          return (
            <div key={review._id} className="card p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={fromName} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{fromName}</p>
                    <p className="text-xs text-gray-400">{formatDistanceToNow(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stars rating={review.rating} />
                  <span className="text-sm font-bold text-gray-700">{review.rating}</span>
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 italic border-l-2 border-purple-200">
                  "{review.comment}"
                </p>
              )}
            </div>
          );
        }) : (
          <EmptyState icon="⭐" title="No reviews yet" description="This user hasn&apos;t received any reviews yet." />
        )}
      </div>
    </div>
  );
}
