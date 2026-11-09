import { MyCoursesView } from "@/components/learning/MyCoursesView";

export default function LearningPage() {
  return (
    <section className="px-4 pb-16 pt-[78px] sm:px-6 sm:pb-20 md:px-8">
      <div className="mx-auto max-w-[1400px] pt-8 sm:pt-10">
        <h1 className="font-sans text-[26px] font-bold tracking-[-0.02em] text-[#111111] sm:text-[32px]">
          My learning
        </h1>
        <p className="mt-2 max-w-xl font-sans text-[14px] text-[#6B7280]">
          Pick up where you left off. Your purchased courses live here.
        </p>
        <div className="mt-8">
          <MyCoursesView />
        </div>
      </div>
    </section>
  );
}
