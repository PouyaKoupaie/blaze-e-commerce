import Image from "next/image";
import loader from "@/assets/loader.gif";

const Loading = () => {
    return ( <div className="flex items-center justify-center h-screen">
        <Image src={loader} height={100} width={100} alt="Loading..."/>
    </div> );
}
 
export default Loading;