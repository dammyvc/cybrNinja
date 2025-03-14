import { CalendarView } from "@/components/CalendarView";
import ProfilePage from "@/components/Profile";

export default function Profile() {
    return (
        <>
                    <div className="pl-4 flex gap-4 flex-col md:flex-row mr-3 lg:mr-0 md:mr-0">
                        {/* LEFT */}
                        <div className="w-full lg:2-2/3">

                            <ProfilePage />
        
        
                        </div>
                        {/* RIGHT */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-8 mr-2">
                            <CalendarView />
                            
                        </div>
        
                    </div>
                </>
    );
}