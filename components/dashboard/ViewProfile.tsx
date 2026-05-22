import Ellipse3 from '../../public/images/Ellipse3.png';
import Image from 'next/image';
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';

export const ViewProfile = () => {
    return(
        <>
        <div className='bg-[rgba(228,231,236,0.4)] cursor-pointer flex p-4 ml-4 mb-4 rounded-md'>
            <div>
            <Image src={Ellipse3} alt="" />
        </div>
        <div className='ml-2'>
            <h1 className='font-semibold text-lg'>John Doe</h1>
            <p>Admin</p>
        </div>
        <ArrowRightStartOnRectangleIcon className="w-6 h-6 ml-auto my-auto" />
        </div>
        </>
    )
}