"use client";
import { useState } from "react";
import { useAuthStore } from "@/src/store/authStore";
import { useUserReviews, useDeleteReview } from "@/src/hooks/useReviews";
import { SkeletonTable } from "@/src/components/ui/Skeleton";
import EmptyState from "@/src/components/ui/EmptyState";
import { ConfirmModal } from "@/src/components/ui/Modal";
import Avatar from "@/src/components/ui/Avatar";
import { formatDistanceToNow } from "@/src/lib/utils/date";
import { Star, Trash2, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

function Stars({ rating, size=14 }: { rating: number; size?: number }) {
  return <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} size={size} className={i<Math.round(rating)?"text-amber-400 fill-amber-400":"text-gray-200"}/>)}</div>;
}

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const { data: reviews, isLoading } = useUserReviews(user?.id||"");
  const deleteReview = useDeleteReview();
  const [deleteTarget, setDeleteTarget] = useState<string|null>(null);

  const total = reviews?.length??0;
  const avg   = total>0 ? reviews!.reduce((s,r)=>s+r.rating,0)/total : 0;

  const handleDelete = async () => {
    if(!deleteTarget) return;
    try { await deleteReview.mutateAsync(deleteTarget); toast.success("Review deleted"); setDeleteTarget(null); }
    catch { toast.error("Failed to delete review"); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">My Reviews</h1>
        <p className="page-subtitle">See what employers say about you</p>
      </div>

      {/* Summary */}
      {total>0 && (
        <div className="card p-6">
          <div className="flex items-start gap-6">
            <div className="text-center flex-shrink-0">
              <p className="text-5xl font-bold text-gray-900 leading-none">{avg.toFixed(1)}</p>
              <Stars rating={avg} size={16}/>
              <p className="text-xs text-gray-400 mt-1">{total} review{total!==1?"s":""}</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5,4,3,2,1].map(star=>{
                const count=reviews!.filter(r=>Math.round(r.rating)===star).length;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-gray-500 text-right">{star}</span>
                    <Star size={10} className="text-amber-400 fill-amber-400 flex-shrink-0"/>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{width:`${total>0?(count/total)*100:0}%`}}/>
                    </div>
                    <span className="w-5 text-gray-400 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {total>=3 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500"/>
              <p className="text-sm text-gray-600">
                <span className="font-bold text-emerald-600">{Math.round((reviews!.filter(r=>r.rating>=4).length/total)*100)}%</span> of reviewers gave you 4+ stars
              </p>
            </div>
          )}
        </div>
      )}

      {isLoading ? <SkeletonTable rows={4}/> : total>0 ? (
        <div className="space-y-3">
          {reviews!.map(review=>{
            const from = review.fromUserId as unknown as {firstName?:string;lastName?:string;name?:string};
            const fromName = typeof from==="object"
              ? `${from.firstName||""} ${from.lastName||""}`.trim()||from.name||"Anonymous"
              : "Anonymous";
            return (
              <div key={review._id} className="card p-5 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={fromName} size="sm"/>
                    <div><p className="text-sm font-semibold text-gray-800">{fromName}</p><p className="text-xs text-gray-400">{formatDistanceToNow(review.createdAt)}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5"><Stars rating={review.rating}/><span className="text-sm font-bold text-gray-700">{review.rating}.0</span></div>
                    {user?.role!=="COMPANY" && (
                      <button onClick={()=>setDeleteTarget(review._id)} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 size={14}/>
                      </button>
                    )}
                  </div>
                </div>
                {review.comment
                  ? <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 italic border-l-2 border-purple-200">"{review.comment}"</p>
                  : <p className="text-xs text-gray-300 italic">No written comment</p>}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="⭐" title="No reviews yet" description="Complete jobs to receive reviews from employers. Reviews build your reputation on InStaff."/>
      )}

      <ConfirmModal open={!!deleteTarget} onClose={()=>setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Review" description="Are you sure? This review will be permanently deleted."
        confirmLabel="Delete" loading={deleteReview.isPending}/>
    </div>
  );
}
