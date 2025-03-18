import QuizResults from "@/components/QuizResult";


export default function Results() {

    return (
        <>
            <div className="pl-4 flex gap-4 flex-col md:flex-row mr-3 lg:mr-0 md:mr-0">
                {/* LEFT */}
                <div className="w-full lg:2-2/3">
                    <QuizResults />

                </div>
                

            </div>
        </>
    )
}